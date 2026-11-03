<?php
// ------------------------------------------------------------------
// 0. CORS — allow any origin, any agent, any reference
// ------------------------------------------------------------------
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, HEAD');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Expose-Headers: *');

$requestedHeaders = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? '';
header('Access-Control-Allow-Headers: ' . ($requestedHeaders !== '' ? $requestedHeaders : '*'));

// Answer preflight immediately
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// ------------------------------------------------------------------
// 1. Input validation (city + lang)
// ------------------------------------------------------------------
$city = isset($_GET['city']) ? trim($_GET['city']) : '';
$lang = isset($_GET['lang']) ? strtolower(trim($_GET['lang'])) : 'en';

if (!in_array($lang, ['en', 'fa'], true)) {
    $lang = 'en';
}
if ($city === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameter: city', 'cod' => 400]);
    exit;
}

// ------------------------------------------------------------------
// 2. Geocode the city (language-aware)
// ------------------------------------------------------------------
$geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?' . http_build_query([
    'name'     => $city,
    'count'    => 1,
    'language' => $lang,
    'format'   => 'json',
]);

$geoJson = @file_get_contents($geoUrl);
if ($geoJson === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to contact geocoding service', 'cod' => 502]);
    exit;
}

$geoData = json_decode($geoJson, true);
if (empty($geoData['results'][0])) {
    http_response_code(404);
    echo json_encode(['error' => "City not found: {$city}", 'cod' => 404]);
    exit;
}

$location = $geoData['results'][0];
$lat      = $location['latitude'];
$lon      = $location['longitude'];
$cityName = $location['name'];
$country  = $location['country_code'] ?? '';
$timezone = $location['timezone'] ?? 'auto';
$cityId   = $location['id'] ?? 0;

// ------------------------------------------------------------------
// 3. Fetch weather data (now includes daily min/max)
// ------------------------------------------------------------------
$weatherUrl = 'https://api.open-meteo.com/v1/forecast?' . http_build_query([
    'latitude'  => $lat,
    'longitude' => $lon,
    'current'   => implode(',', [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'visibility',
        'dew_point_2m',
        'uv_index',
    ]),
    'daily'         => 'sunrise,sunset,temperature_2m_max,temperature_2m_min',
    'timezone'      => $timezone,
    'forecast_days' => 1,
]);

$weatherJson = @file_get_contents($weatherUrl);
if ($weatherJson === false) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to contact weather service', 'cod' => 502]);
    exit;
}

$weatherData = json_decode($weatherJson, true);
if (!isset($weatherData['current'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected weather data format', 'cod' => 500]);
    exit;
}

$cur = $weatherData['current'];
$day = $weatherData['daily'] ?? [];
$now = time();

// ------------------------------------------------------------------
// 4. WMO code → OWM-style condition (bilingual)
// ------------------------------------------------------------------
function mapWmoToOwm(int $code, string $lang = 'en'): array
{
    $map = [
        0  => ['id' => 800, 'main' => 'Clear',        'en' => 'clear sky',                      'fa' => 'آسمان صاف',                    'icon' => '01d'],
        1  => ['id' => 801, 'main' => 'Clouds',       'en' => 'few clouds',                     'fa' => 'ابرهای کم',                    'icon' => '02d'],
        2  => ['id' => 802, 'main' => 'Clouds',       'en' => 'scattered clouds',               'fa' => 'ابرهای پراکنده',               'icon' => '03d'],
        3  => ['id' => 804, 'main' => 'Clouds',       'en' => 'overcast clouds',                'fa' => 'ابرهای پوشیده',                'icon' => '04d'],
        45 => ['id' => 741, 'main' => 'Fog',          'en' => 'fog',                            'fa' => 'مه',                           'icon' => '50d'],
        48 => ['id' => 741, 'main' => 'Fog',          'en' => 'depositing rime fog',            'fa' => 'مه یخ‌زده',                    'icon' => '50d'],
        51 => ['id' => 300, 'main' => 'Drizzle',      'en' => 'light intensity drizzle',        'fa' => 'نم‌نم باران سبک',              'icon' => '09d'],
        53 => ['id' => 301, 'main' => 'Drizzle',      'en' => 'drizzle',                        'fa' => 'نم‌نم باران',                  'icon' => '09d'],
        55 => ['id' => 302, 'main' => 'Drizzle',      'en' => 'heavy intensity drizzle',        'fa' => 'نم‌نم باران شدید',             'icon' => '09d'],
        56 => ['id' => 311, 'main' => 'Drizzle',      'en' => 'light freezing drizzle',         'fa' => 'نم‌نم باران یخ‌زده سبک',        'icon' => '09d'],
        57 => ['id' => 312, 'main' => 'Drizzle',      'en' => 'heavy freezing drizzle',         'fa' => 'نم‌نم باران یخ‌زده شدید',       'icon' => '09d'],
        61 => ['id' => 500, 'main' => 'Rain',         'en' => 'light rain',                     'fa' => 'باران سبک',                    'icon' => '10d'],
        63 => ['id' => 501, 'main' => 'Rain',         'en' => 'moderate rain',                  'fa' => 'باران متوسط',                  'icon' => '10d'],
        65 => ['id' => 502, 'main' => 'Rain',         'en' => 'heavy intensity rain',           'fa' => 'باران شدید',                   'icon' => '10d'],
        66 => ['id' => 511, 'main' => 'Rain',         'en' => 'freezing rain',                  'fa' => 'باران یخ‌زده سبک',             'icon' => '13d'],
        67 => ['id' => 511, 'main' => 'Rain',         'en' => 'heavy freezing rain',            'fa' => 'باران یخ‌زده شدید',            'icon' => '13d'],
        71 => ['id' => 600, 'main' => 'Snow',         'en' => 'light snow',                     'fa' => 'برف سبک',                      'icon' => '13d'],
        73 => ['id' => 601, 'main' => 'Snow',         'en' => 'snow',                           'fa' => 'برف',                          'icon' => '13d'],
        75 => ['id' => 602, 'main' => 'Snow',         'en' => 'heavy snow',                     'fa' => 'برف شدید',                     'icon' => '13d'],
        77 => ['id' => 600, 'main' => 'Snow',         'en' => 'snow grains',                    'fa' => 'دانه‌های برف',                 'icon' => '13d'],
        80 => ['id' => 520, 'main' => 'Rain',         'en' => 'light intensity shower rain',    'fa' => 'رگبار باران سبک',              'icon' => '09d'],
        81 => ['id' => 521, 'main' => 'Rain',         'en' => 'shower rain',                    'fa' => 'رگبار باران متوسط',            'icon' => '09d'],
        82 => ['id' => 522, 'main' => 'Rain',         'en' => 'heavy intensity shower rain',    'fa' => 'رگبار باران شدید',             'icon' => '09d'],
        85 => ['id' => 620, 'main' => 'Snow',         'en' => 'light shower snow',              'fa' => 'رگبار برف سبک',                'icon' => '13d'],
        86 => ['id' => 621, 'main' => 'Snow',         'en' => 'shower snow',                    'fa' => 'رگبار برف شدید',               'icon' => '13d'],
        95 => ['id' => 200, 'main' => 'Thunderstorm', 'en' => 'thunderstorm with light rain',   'fa' => 'رعد و برق با باران سبک',       'icon' => '11d'],
        96 => ['id' => 201, 'main' => 'Thunderstorm', 'en' => 'thunderstorm with rain',         'fa' => 'رعد و برق با باران',           'icon' => '11d'],
        99 => ['id' => 202, 'main' => 'Thunderstorm', 'en' => 'thunderstorm with heavy rain',   'fa' => 'رعد و برق با باران شدید',      'icon' => '11d'],
    ];

    $entry = $map[$code] ?? ['id' => 800, 'main' => 'Clear', 'en' => 'clear sky', 'fa' => 'آسمان صاف', 'icon' => '01d'];
    $desc  = $entry[$lang] ?? $entry['en'];

    return [
        'id'          => $entry['id'],
        'main'        => $entry['main'],
        'description' => $desc,
        'icon'        => $entry['icon'],
    ];
}

$wmoCode = (int) ($cur['weather_code'] ?? 0);
$owmCond = mapWmoToOwm($wmoCode, $lang);

// Night-time icon variant
if (isset($cur['is_day']) && (int) $cur['is_day'] === 0) {
    $owmCond['icon'] = str_replace('d', 'n', $owmCond['icon']);
}

// ------------------------------------------------------------------
// 5. Convert local-time strings (sunrise/sunset) to unix timestamps
// ------------------------------------------------------------------
function localToUnix(?string $localDatetime, string $timezoneName): ?int
{
    if (empty($localDatetime)) {
        return null;
    }
    try {
        $tz = new DateTimeZone($timezoneName ?: 'UTC');
        $dt = new DateTime($localDatetime, $tz);
        return $dt->getTimestamp();
    } catch (Exception $e) {
        return strtotime($localDatetime) ?: null;
    }
}

$resolvedTz = $weatherData['timezone'] ?? 'UTC';
$sunrise    = localToUnix($day['sunrise'][0] ?? null, $resolvedTz);
$sunset     = localToUnix($day['sunset'][0]  ?? null, $resolvedTz);

// Daily min/max (fallback to current temp if missing)
$tempMin = isset($day['temperature_2m_min'][0])
    ? (float) $day['temperature_2m_min'][0]
    : (float) ($cur['temperature_2m'] ?? 0);
$tempMax = isset($day['temperature_2m_max'][0])
    ? (float) $day['temperature_2m_max'][0]
    : (float) ($cur['temperature_2m'] ?? 0);

// ------------------------------------------------------------------
// 6. Build the response
// ------------------------------------------------------------------
$response = [
    'coord' => [
        'lon' => (float) $lon,
        'lat' => (float) $lat,
    ],
    'weather' => [$owmCond],
    'base'    => 'stations',
    'main'    => [
        'temp'       => (float) ($cur['temperature_2m'] ?? 0),
        'feels_like' => (float) ($cur['apparent_temperature'] ?? 0),
        'temp_min'   => $tempMin,   // ← now from daily temperature_2m_min
        'temp_max'   => $tempMax,   // ← now from daily temperature_2m_max
        'pressure'   => (int)   ($cur['pressure_msl'] ?? 0),
        'humidity'   => (int)   ($cur['relative_humidity_2m'] ?? 0),
        'sea_level'  => (int)   ($cur['pressure_msl'] ?? 0),
        'grnd_level' => (int)   ($cur['surface_pressure'] ?? 0),
        'dew_point'  => (float) ($cur['dew_point_2m'] ?? 0),   // extra
        'uv_index'   => (float) ($cur['uv_index'] ?? 0),       // extra
    ],
    'visibility' => (int) ($cur['visibility'] ?? 10000),
    'wind' => [
        'speed' => (float) ($cur['wind_speed_10m'] ?? 0),
        'deg'   => (int)   ($cur['wind_direction_10m'] ?? 0),
        'gust'  => (float) ($cur['wind_gusts_10m'] ?? 0),
    ],
    'clouds' => [
        'all' => (int) ($cur['cloud_cover'] ?? 0),
    ],
    'rain' => isset($cur['rain']) && $cur['rain'] > 0
        ? ['1h' => (float) $cur['rain']] : null,                // extra
    'snow' => isset($cur['snowfall']) && $cur['snowfall'] > 0
        ? ['1h' => (float) $cur['snowfall']] : null,            // extra
    'dt'  => $now,
    'sys' => [
        'country' => $country,
        'sunrise' => $sunrise,
        'sunset'  => $sunset,
    ],
    'timezone' => (int) ($weatherData['utc_offset_seconds'] ?? 0),
    'id'       => $cityId,
    'name'     => $cityName,
    'cod'      => 200,
    'lang'     => $lang,
    'open_meteo' => [
        'forecast'  => $weatherData,
        'geocoding' => $geoData,
    ],
];

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);