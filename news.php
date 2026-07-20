<?php
/**
 * RSS to JSON Proxy – Combined BBC + VOA with alternating order
 * Source labels: 'بی‌بی‌سی' and 'صدای آمریکا'
 * Response: { data: [ { title, source }, ... ], total: N }
 */

// ------------------------------------------------------------------
// 1. Configuration
// ------------------------------------------------------------------
$feeds = [
    'bbc' => 'https://feeds.bbci.co.uk/persian/rss.xml',
    'voa' => 'https://ir.voanews.com/api/zuiypl-vomx-tpeggtm',
];
$source_labels = [
    'bbc' => 'بی‌بی‌سی',
    'voa' => 'صدای آمریکا',
];
$max_per_source = 60;

// ------------------------------------------------------------------
// 2. CORS Headers (unchanged)
// ------------------------------------------------------------------
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use GET.']);
    error_log("RSS Proxy: 405 Method Not Allowed");
    exit();
}

// ------------------------------------------------------------------
// 3. Helper: fetch and parse a single feed
//    Returns array of items, each with 'title' and 'source' (Persian label)
// ------------------------------------------------------------------
function fetch_feed($url, $source_key, $max_items, $source_label) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 5,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT      => 'RSS-Proxy/1.0',
    ]);
    $response = curl_exec($ch);
    $curl_err = curl_error($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    // curl_close($ch);  // removed as requested

    if ($response === false) {
        error_log("RSS Proxy [$source_key]: cURL error – $curl_err");
        return null;
    }
    if ($http_code !== 200) {
        error_log("RSS Proxy [$source_key]: HTTP $http_code from $url");
        return null;
    }

    $prev = libxml_use_internal_errors(true);
    $xml = simplexml_load_string($response);
    libxml_use_internal_errors($prev);

    if ($xml === false) {
        $errors = libxml_get_errors();
        $error_msg = '';
        foreach ($errors as $e) {
            $error_msg .= $e->message . ' ';
        }
        libxml_clear_errors();
        error_log("RSS Proxy [$source_key]: XML parsing error – $error_msg");
        return null;
    }

    $items = $xml->channel->item;
    if ($max_items > 0 && count($items) > $max_items) {
        $items = array_slice($items, 0, $max_items);
    }

    $data = [];
    foreach ($items as $item) {
        $data[] = [
            'title'  => (string)$item->title,
            'source' => $source_label,   // Persian label
        ];
    }
    return $data;
}

// ------------------------------------------------------------------
// 4. Fetch both feeds
// ------------------------------------------------------------------
$bbc_items = fetch_feed($feeds['bbc'], 'bbc', $max_per_source, $source_labels['bbc']);
$voa_items = fetch_feed($feeds['voa'], 'voa', $max_per_source, $source_labels['voa']);

if ($bbc_items === null && $voa_items === null) {
    http_response_code(500);
    echo json_encode(['error' => 'All feeds failed. Check error log.']);
    error_log("RSS Proxy: All feeds failed.");
    exit();
}

// ------------------------------------------------------------------
// 5. Interleave: BBC, VOA, BBC, VOA, ...
// ------------------------------------------------------------------
$interleaved = [];
$bbc_count = $bbc_items ? count($bbc_items) : 0;
$voa_count = $voa_items ? count($voa_items) : 0;
$max_len = max($bbc_count, $voa_count);

for ($i = 0; $i < $max_len; $i++) {
    if ($i < $bbc_count) {
        $interleaved[] = $bbc_items[$i];
    }
    if ($i < $voa_count) {
        $interleaved[] = $voa_items[$i];
    }
}

// ------------------------------------------------------------------
// 6. Output JSON
// ------------------------------------------------------------------
$output = [
    'data'  => $interleaved,
    'total' => count($interleaved),
];

echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

error_log("RSS Proxy: Interleaved total = " . count($interleaved) . " items.");