import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { translate } from "./translate";
import {
  NumbersToPersian,
  debounce,
  checkPersianCharacters,
  createJsFile,
  checkExistJsFile,
  randomIntFromInterval,
  InitiateSpeedDetection,
  MeasureConnectionSpeed,
  timeAgo,
  arrayMove,
  isLight,
  dynamicTranslateKeyframe,
  updateTime,
  formatNumber,
  assetUrl,
} from "./utils";
import {
  CITY_HAVE_IMAGE,
  CITY_HAVE_VIDEO,
  TO_FIXED,
  SPEED_DETECTION_DELAY,
  CREATE_MAP_DELAY,
  PORTAL_MODAL_DELAY,
  LOADING_DELAY,
  REQUEST_INTERVAL,
  MAP_URL,
  OPEN_WEATHER_KEY,
  UNIT,
  DEFAILT_CITY,
} from "./variables";

function parseHistory(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return parsed ? [parsed] : [];
  } catch {
    return raw ? [raw] : [];
  }
}

function cityFromStorage(raw) {
  try {
    const list = JSON.parse(raw);
    return list[list.length - 1];
  } catch {
    return raw;
  }
}

function cityHasImage(id) {
  return CITY_HAVE_IMAGE.some((item) =>
    typeof item.id === "number" ? item.id === id : item.id.includes(id),
  );
}

export default function App() {
  const [bodyState, setBodyState] = useState({
    loading: true,
    loaded: false,
    blur: false,
    rtl: false,
  });
  const [mainVisible, setMainVisible] = useState(false);
  const [headerDir, setHeaderDir] = useState("left");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [cityListActive, setCityListActive] = useState(false);
  const [history, setHistory] = useState(() =>
    parseHistory(localStorage.getItem("last_search")),
  );
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState(translate.en.TypeCity);
  const [color, setColor] = useState(
    () => localStorage.getItem("color") || "#072322",
  );
  const [mapOpacity, setMapOpacity] = useState(
    () => +(localStorage.getItem("opacity") || 90),
  );
  const [animationDuration, setAnimationDuration] = useState(
    () => +(localStorage.getItem("animation-duration") || 120),
  );
  const [fullScreenImage, setFullScreenImage] = useState(
    () => localStorage.getItem("fsi") === "true",
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [portalModal, setPortalModal] = useState({ active: false, text: "" });
  const [mapOverlayInterval, setMapOverlayInterval] = useState(false);
  const [showMapOverlayBottom, setShowMapOverlayBottom] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [weatherBg, setWeatherBg] = useState(null);
  const [weatherOpacity, setWeatherOpacity] = useState(1);
  const [weatherStyle, setWeatherStyle] = useState({});
  const [cityTitle, setCityTitle] = useState("");
  const [flagSrc, setFlagSrc] = useState(null);
  const [iconSrc, setIconSrc] = useState(null);
  const [weather, setWeather] = useState(null);
  const [lastUpdateLabel, setLastUpdateLabel] = useState("");
  const [clock, setClock] = useState({ hour: "", second: "", midday: "", date: "" });
  const [news, setNews] = useState("");
  const [newsTransform, setNewsTransform] = useState("");
  const [prices, setPrices] = useState({ usdt: "-", btc: "-", gold: "-" });
  const [settingsLabels, setSettingsLabels] = useState({
    reset: "Reset",
    submit: "Submit",
  });
  const [mainBlur, setMainBlur] = useState(false);

  const lastUpdateRef = useRef(new Date());
  const cacheDataRef = useRef({ lat: 53.4106, lon: -2.9779 });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const videoRef = useRef(null);
  const speedRef = useRef(null);
  const settingsRef = useRef(null);
  const settingsBtnRef = useRef(null);
  const inputRef = useRef(null);
  const blurRef = useRef(false);

  useEffect(() => {
    blurRef.current = bodyState.blur;
  }, [bodyState.blur]);

  const applyTheme = useCallback((nextColor) => {
    document.body.style.backgroundColor = nextColor;
    document.documentElement.classList.remove(
      isLight(nextColor) ? "dark" : "light",
    );
    document.documentElement.classList.add(
      isLight(nextColor) ? "light" : "dark",
    );
  }, []);

  const setLoaded = useCallback((delay = true) => {
    setMainVisible(true);
    const finish = () => {
      setBodyState((s) => ({
        ...s,
        loading: false,
        blur: false,
        loaded: true,
      }));
      document.body.classList.remove("loading", "blur");
      document.body.classList.add("loaded");
    };
    if (delay) setTimeout(finish, LOADING_DELAY);
    else finish();
  }, []);

  const setLoading = useCallback(() => {
    setBodyState((s) => ({ ...s, loaded: false, loading: true, blur: true }));
    document.body.classList.remove("loaded");
    document.body.classList.add("loading", "blur");
  }, []);

  const showPortalModal = useCallback((text) => {
    setBodyState((s) => ({
      ...s,
      loading: false,
      loaded: true,
      blur: true,
    }));
    document.body.classList.remove("loading");
    document.body.classList.add("loaded", "blur");
    setPortalModal({ active: true, text });
    setTimeout(() => {
      setPortalModal({ active: false, text: "" });
      document.body.classList.remove("blur");
      setBodyState((s) => ({ ...s, blur: false }));
    }, PORTAL_MODAL_DELAY);
  }, []);

  const clearMap = useCallback(() => {
    if (mapRef.current) mapRef.current.innerHTML = "";
    mapInstanceRef.current = null;
  }, []);

  const createMap = useCallback(
    (lat, lon) => {
      clearMap();
      if (!checkExistJsFile("yandex")) {
        createJsFile(MAP_URL);
      }
      setTimeout(() => {
        try {
          window.ymaps.ready(() => {
            mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
              center:
                lat && lon
                  ? [lat, lon]
                  : [cacheDataRef.current.lat, cacheDataRef.current.lon],
              zoom: 13,
              controls: [],
            });
            setLoaded();
          });
        } catch {
          clearMap();
          setLoaded();
          const isPersian = checkPersianCharacters(
            cityFromStorage(
              localStorage.getItem("last_search") || DEFAILT_CITY,
            ),
          );
          showPortalModal(
            isPersian ? translate.fa.ErrorLoadMap : translate.en.ErrorLoadMap,
          );
        }
      }, CREATE_MAP_DELAY);
    },
    [clearMap, setLoaded, showPortalModal],
  );

  const updateWeatherDisplay = useCallback((result, isPersian) => {
    setWeather({
      temp: result.main.temp,
      feels: result.main.feels_like,
      wind: result.wind.speed,
      description: result.weather[0].description,
      max: result.main.temp_max,
      min: result.main.temp_min,
      humidity: result.main.humidity,
      isPersian,
    });
  }, []);

  const setupVideoBackground = useCallback((cityId, cityVideoData) => {
    setShowVideo(true);
    const videoCount = cityVideoData.videos?.length || 1;
    const randomNumber =
      randomIntFromInterval(0, cityVideoData.videos?.length) || 1;
    const lastVideoIndexKey = `last_video_index_${cityId}`;
    let currentVideoIndex = parseInt(
      localStorage.getItem(lastVideoIndexKey) || "0",
      10,
    );
    currentVideoIndex = (currentVideoIndex + 1) % videoCount;
    localStorage.setItem(lastVideoIndexKey, String(currentVideoIndex));
    setVideoSrc(assetUrl(`static/videos/${cityId}-${randomNumber}.mp4`));
  }, []);

  const updateSearchHistory = useCallback((cityName) => {
    setHistory((prev) => {
      let next = [...prev];
      if (next.includes(cityName)) {
        const idx = next.indexOf(cityName);
        arrayMove(next, idx, next.length - 1);
      } else {
        if (next.length > 5) next = next.slice(1);
        next = [...next, cityName];
      }
      localStorage.setItem("last_search", JSON.stringify(next));
      return next;
    });
  }, []);

  const computeUI = useCallback(
    (result, city, interval) => {
      const isPersian = checkPersianCharacters(city);
      const cityVideo = CITY_HAVE_VIDEO.find((item) => item.id === result.id);

      if (cityVideo) {
        setupVideoBackground(result.id, cityVideo);
        clearMap();
        setShowMapOverlayBottom(false);
      } else {
        setShowVideo(false);
        setVideoSrc(null);
        setShowMapOverlayBottom(true);
      }

      setMapOverlayInterval(false);
      lastUpdateRef.current = new Date();

      if (!interval) {
        if (result && city && !result.message) {
          setCityTitle(isPersian ? city : result.name);

          if (result.coord?.lat) {
            const hasVideo = CITY_HAVE_VIDEO.some(
              (item) => item.id === result.id,
            );
            if (hasVideo) {
              clearMap();
              setShowMapOverlayBottom(false);
              setLoaded();
            } else if (!cityHasImage(result.id)) {
              cacheDataRef.current = {
                lat: result.coord.lat,
                lon: result.coord.lon,
              };
              setShowMapOverlayBottom(true);
              setWeatherBg(null);
              createMap(result.coord.lat, result.coord.lon);
            } else {
              const cityImageData = CITY_HAVE_IMAGE.find((item) =>
                typeof item.id === "number"
                  ? item.id === result.id
                  : item.id.includes(result.id),
              );
              const randomIndex =
                randomIntFromInterval(0, cityImageData?.images?.length - 1) ||
                0;
              const imageId = cityImageData.id[0] || cityImageData.id;
              setWeatherBg(
                assetUrl(`static/image/${imageId}-${randomIndex + 1}.jpg`),
              );
              setShowMapOverlayBottom(true);
              clearMap();
              setLoaded();
            }
          }

          if (result.sys?.country) {
            setFlagSrc(
              assetUrl(
                `static/flags/${result.sys.country.toLowerCase()}.svg`,
              ),
            );
            setIconSrc(
              assetUrl(
                `static/icons/openweathermap/${result.weather[0].icon}.svg`,
              ),
            );
          }

          updateSearchHistory(isPersian ? city : result.name);
          updateWeatherDisplay(result, isPersian);
          localStorage.setItem("last_search_id", String(result.id));

          setTimeout(() => setMapOverlayInterval(true), 250);
        } else if (result?.message && city) {
          setLoaded();
          showPortalModal(
            isPersian ? translate.fa.CityNotFound : translate.en.CityNotFound,
          );
          setTimeout(() => {
            searchWeatherRef.current(
              localStorage.getItem("last_search") || DEFAILT_CITY,
              false,
            );
          }, 2500);
        }
      } else if (result?.main) {
        updateWeatherDisplay(result, isPersian);
      }
    },
    [
      clearMap,
      createMap,
      setLoaded,
      setupVideoBackground,
      showPortalModal,
      updateSearchHistory,
      updateWeatherDisplay,
    ],
  );

  const searchWeatherRef = useRef(() => {});

  const searchWeather = useCallback(
    (city, interval) => {
      let cityNameParam;
      try {
        const cityList = JSON.parse(city);
        cityNameParam = cityList[cityList.length - 1];
      } catch {
        cityNameParam = city;
      }

      const isPersian = checkPersianCharacters(cityNameParam);
      const lang = isPersian ? "fa" : "en";

      if (!interval) {
        const nextColor = localStorage.getItem("color") || "#072322";
        const opacity = localStorage.getItem("opacity") || "90";
        const anim = localStorage.getItem("animation-duration") || "120";
        setColor(nextColor);
        applyTheme(nextColor);
        setMapOpacity(+opacity);
        setAnimationDuration(+anim);

        if (isPersian) {
          setBodyState((s) => ({ ...s, rtl: true }));
          document.body.classList.add("rtl");
          setPlaceholder("اسم شهر را وارد کنید و Enter بزنید.");
          setSettingsLabels({ reset: "تنظیم مجدد", submit: "ذخیره" });
        } else {
          setBodyState((s) => ({ ...s, rtl: false }));
          document.body.classList.remove("rtl");
          setPlaceholder("type City and hit Enter");
          setSettingsLabels({ reset: "Reset", submit: "Submit" });
        }
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lang=${lang}&q=${cityNameParam}&APPID=${OPEN_WEATHER_KEY}&units=metric`;

      fetch(url)
        .then((res) => res.json())
        .then((result) => computeUI(result, cityNameParam, interval));
    },
    [applyTheme, computeUI],
  );

  useEffect(() => {
    searchWeatherRef.current = searchWeather;
  }, [searchWeather]);

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch("https://htmliha.ir/get/");
      const data = await res.json();
      if (data?.data) {
        const newsText = data.data
          .map((item) => `${item.source}: ${item.title}`)
          .join("  \u0020   |    \u0020  ");
        setNews(newsText);
        const newsLength = newsText.length * 3.41;
        setNewsTransform(`translate3d(-${newsLength}px, 0px, 0px)`);
        dynamicTranslateKeyframe(
          "news",
          `-${newsLength}px, 0px, 0px`,
          `${newsLength}px, 0px, 0px`,
        );
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }, []);

  const fetchMarketPrices = useCallback(async () => {
    const isFa = checkPersianCharacters(
      cityFromStorage(localStorage.getItem("last_search")),
    );
    try {
      const res = await fetch(
        "https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt,btc&dstCurrency=rls,usdt",
      );
      const data = await res.json();
      if (data?.stats?.["usdt-rls"]) {
        const usdtPrice = data.stats["usdt-rls"].latest;
        const btcPrice = data.stats["btc-usdt"].latest;
        setPrices((p) => ({
          ...p,
          usdt: formatNumber(Math.round(usdtPrice / 10)),
          btc: formatNumber(btcPrice),
        }));
      }
    } catch {
      setPrices((p) => ({ ...p, usdt: isFa ? "خطا" : "error" }));
    }
  }, []);

  const fetchGoldPrices = useCallback(async () => {
    const isFa = checkPersianCharacters(
      cityFromStorage(localStorage.getItem("last_search")),
    );
    try {
      const res = await fetch("https://azard.net/gold/");
      const data = await res.json();
      if (data?.average) {
        setPrices((p) => ({ ...p, gold: formatNumber(data.average) }));
      } else {
        setPrices((p) => ({ ...p, gold: isFa ? "خطا" : "error" }));
      }
    } catch {
      try {
        const res2 = await fetch(
          "https://api.wallgold.ir/api/v1/price?symbol=GLD_18C_750TMN&side=buy",
        );
        const data2 = await res2.json();
        if (data2?.result?.price) {
          setPrices((p) => ({
            ...p,
            gold: formatNumber(data2.result.price),
          }));
        } else {
          setPrices((p) => ({ ...p, gold: isFa ? "خطا" : "error" }));
        }
      } catch {
        setPrices((p) => ({ ...p, gold: isFa ? "خطا" : "error" }));
      }
    }
  }, []);

  useEffect(() => {
    applyTheme(color);
    setTimeout(() => InitiateSpeedDetection(speedRef.current), 400);
    searchWeather(
      localStorage.getItem("last_search") || DEFAILT_CITY,
      false,
    );
    fetchMarketPrices();
    fetchGoldPrices();
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const weatherTimer = setInterval(() => {
      searchWeatherRef.current(
        localStorage.getItem("last_search") || DEFAILT_CITY,
        true,
      );
    }, REQUEST_INTERVAL);

    const speedTimer = setInterval(() => {
      MeasureConnectionSpeed(speedRef.current);
    }, SPEED_DETECTION_DELAY);

    const pricesTimer = setInterval(() => {
      fetchMarketPrices();
      fetchGoldPrices();
      fetchNews();
    }, 500000);

    const clockTimer = setInterval(() => {
      const city =
        localStorage.getItem("last_search") || DEFAILT_CITY;
      const cityNameParam = cityFromStorage(city);
      const isPersian = checkPersianCharacters(cityNameParam);
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const midday = hours >= 12 ? "PM" : "AM";
      let hour12 = hours % 12 || 12;
      hour12 = updateTime(hour12);
      const minStr = updateTime(minutes);
      const secStr = updateTime(seconds);
      setClock({
        hour: `${isPersian ? NumbersToPersian(hour12) : hour12}:${
          isPersian ? NumbersToPersian(minStr) : minStr
        }`,
        second: `:${isPersian ? NumbersToPersian(secStr) : secStr}`,
        midday,
        date: ` ${now.toLocaleDateString("fa-ir", {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })} `,
      });
    }, 1000);

    return () => {
      clearInterval(weatherTimer);
      clearInterval(speedTimer);
      clearInterval(pricesTimer);
      clearInterval(clockTimer);
    };
  }, [fetchGoldPrices, fetchMarketPrices, fetchNews]);

  useEffect(() => {
    if (!videoRef.current || !videoSrc) return;
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
  }, [videoSrc]);

  const handleColorChange = useMemo(
    () =>
      debounce((value) => {
        setColor(value);
        applyTheme(value);
        localStorage.setItem("color", value);
      }, 40),
    [applyTheme],
  );

  const handleOpacityChange = useMemo(
    () =>
      debounce((value) => {
        setMapOpacity(value);
        localStorage.setItem("opacity", value);
      }, 40),
    [],
  );

  const handleAnimationChange = useMemo(
    () =>
      debounce((value) => {
        setAnimationDuration(value);
        localStorage.setItem("animation-duration", value);
      }, 40),
    [],
  );

  useEffect(() => {
    const onWindowClick = (e) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(e.target)
      ) {
        setMainBlur(false);
        setSettingsOpen(false);
      }
    };
    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setHeaderVisible(true);
        setShowMapOverlayBottom(true);
        setWeatherStyle({
          marginTop: "10px",
          width: "80vw",
          height: "calc(80vh + 40px)",
        });
        const lastId = +(localStorage.getItem("last_search_id") || 0);
        if (!cityHasImage(lastId)) {
          createMap();
        }
      }
    };
    window.addEventListener("click", onWindowClick);
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => {
      window.removeEventListener("click", onWindowClick);
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, [createMap]);

  const onInputKeydown = (event) => {
    const { key, code } = event;
    const ignoreKeys = [
      "Backspace",
      "Control",
      "Alt",
      "Shift",
      "CapsLock",
      "Tab",
      "Enter",
    ];
    if (!ignoreKeys.includes(key) && code !== "Space") {
      const isPersian = checkPersianCharacters(key);
      if (isPersian) {
        setHeaderDir("right");
        setPlaceholder(translate.fa.TypeCity);
      } else {
        setHeaderDir("left");
        setPlaceholder(translate.en.TypeCity);
      }
    }

    if (key === "Enter") {
      event.preventDefault();
      setCityListActive(false);
      inputRef.current?.blur();
      if (!blurRef.current) {
        const city = inputValue.trim();
        if (city.length > 1 && city.length < 22) {
          setLoading();
          setTimeout(() => searchWeather(city, false), 120);
          setTimeout(() => setWeatherOpacity(1), LOADING_DELAY);
        } else {
          showPortalModal("invalid city");
        }
      }
    }
  };

  const fmt = (value, isPersian) =>
    isPersian
      ? NumbersToPersian(Number(value).toFixed(TO_FIXED))
      : Number(value).toFixed(TO_FIXED);

  const lang = weather?.isPersian ? "fa" : "en";

  return (
    <>
      <main
        style={{
          display: mainVisible ? "flex" : "none",
          filter: mainBlur ? "blur(20px)" : "blur(0px)",
        }}
      >
        <header
          className={headerDir}
          style={{ display: headerVisible ? "flex" : "none" }}
        >
          <form className="search" onSubmit={(e) => e.preventDefault()}>
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onInputKeydown}
              onFocus={() => setCityListActive(true)}
              onBlur={() => setTimeout(() => setCityListActive(false), 100)}
            />
            <ul className={`city-list-wrapper${cityListActive ? " active" : ""}`}>
              {history.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    setLoading();
                    setInputValue(item);
                    searchWeather(item, false);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="location-icon">
              <svg
                width="700pt"
                height="700pt"
                version="1.1"
                viewBox="0 0 700 700"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  style={{ fill: color, stroke: color }}
                  d="m350 5.8945c-108.77 0-200.66 91.887-200.66 200.66 0 102.82 80.004 207.42 193.02 343.96 1.8828 2.2734 4.6797 3.5898 7.6328 3.5898s5.75-1.3164 7.6328-3.5898c113.02-136.55 193.02-241.15 193.02-343.96 0-108.77-91.887-200.66-200.66-200.66zm0 522.75c-106.31-128.82-180.84-228.13-180.84-322.09 0.625-47.766 19.883-93.402 53.66-127.18 33.781-33.777 79.414-53.031 127.18-53.66 47.77 0.62891 93.402 19.883 127.18 53.66 33.777 33.781 53.035 79.418 53.66 127.18 0 93.965-74.531 193.28-180.84 322.09zm0-418.76v0.003906c-25.641 0-50.23 10.184-68.359 28.312-18.129 18.133-28.312 42.723-28.312 68.359 0 25.641 10.184 50.23 28.312 68.359s42.719 28.316 68.359 28.316 50.23-10.188 68.359-28.316 28.312-42.719 28.312-68.359c-0.023437-25.633-10.215-50.207-28.34-68.332-18.125-18.121-42.699-28.316-68.332-28.34zm0 173.51v0.003906c-20.383 0-39.93-8.0977-54.34-22.512-14.414-14.41-22.512-33.957-22.512-54.34 0-20.383 8.0977-39.93 22.512-54.34 14.41-14.414 33.957-22.508 54.34-22.508s39.93 8.0938 54.34 22.508c14.414 14.41 22.512 33.957 22.512 54.34-0.023437 20.375-8.1289 39.91-22.535 54.316-14.41 14.406-33.941 22.512-54.316 22.535z"
                />
              </svg>
            </div>
          </form>
          <div className="button-wrapper">
            <button
              type="button"
              className="setting-button"
              ref={settingsBtnRef}
              onClick={() => {
                setSettingsOpen(true);
                setMainBlur(true);
                setFullScreenImage(localStorage.getItem("fsi") === "true");
                setMapOpacity(+(localStorage.getItem("opacity") || 90));
                setAnimationDuration(
                  +(localStorage.getItem("animation-duration") || 160),
                );
              }}
            >
              <svg viewBox="0 0 333 333" fillRule="evenodd" clipRule="evenodd">
                <path
                  className="fil0"
                  fillRule="nonzero"
                  d="M88 201c38,-37 23,-38 70,9 7,7 -11,20 -26,35 17,43 -16,78 -60,62 -14,-5 9,-22 18,-32l-6 -27 -26 -5c-9,10 -27,33 -32,18 -15,-47 22,-76 62,-60zm0 -69c-42,17 -77,-17 -61,-60 5,-14 22,9 31,18l27 -7 5 -25c-9,-10 -32,-27 -18,-32 47,-15 76,22 60,62l113 113c43,-16 78,17 62,60 -5,14 -22,-8 -32,-18l-25 5 -7 27c10,10 32,27 18,32 -43,16 -77,-19 -60,-62l-113 -113zm-25 -9c19,2 25,-10 32,-4 168,168 111,101 115,152 2,19 18,28 36,26 -22,-22 -20,-11 -8,-56 2,-7 21,-8 37,-12 7,-1 13,8 22,17 4,-32 -25,-44 -50,-31 -3,1 -6,1 -8,-1 -168,-168 -111,-100 -116,-151 -2,-20 -17,-29 -36,-27 25,25 18,11 10,54 -2,8 -22,9 -39,14 -6,2 -13,-8 -22,-17 -2,19 8,34 27,36zm151 -28l-24 24 24 24c47,-46 17,-17 57,-20 19,-2 28,-17 26,-36 -23,23 -10,20 -56,8 -7,-1 -14,-40 -10,-44l15 -15c-30,-4 -44,23 -31,51 1,3 1,6 -1,8zm-38 19l25 -26c-15,-40 13,-77 60,-62 15,5 -8,22 -18,32l6 25 26 7c10,-9 27,-32 32,-18 16,43 -19,77 -62,60 -38,37 -23,38 -69,-8 -3,-3 -3,-7 0,-10zm-57 76c-46,46 -17,17 -56,20 -19,2 -29,18 -27,36 25,-24 11,-18 54,-10 8,2 9,22 14,39 2,6 -8,13 -17,22 33,4 44,-27 31,-50 -4,-8 12,-19 26,-33l-25 -24z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="full-screen"
              onClick={() => {
                setHeaderVisible(false);
                if (localStorage.getItem("fsi") === "true") {
                  setShowMapOverlayBottom(false);
                  setWeatherStyle({
                    marginTop: "0px",
                    width: "100vw",
                    height: "100vh",
                  });
                } else {
                  setWeatherStyle({
                    width: "calc(100vw - 160px)",
                    height: "calc(100vh - 110px)",
                  });
                }
                document.documentElement.requestFullscreen();
              }}
            >
              <svg viewBox="0 0 100 100">
                <g>
                  <polygon points="18.8 16 34.5 16 34.5 12 12 12 12 34.5 16 34.5 16 18.8 41.6 44.4 44.4 41.6 18.8 16" />
                  <polygon points="88 12 65.5 12 65.5 16 81.2 16 55.6 41.6 58.4 44.4 84 18.8 84 34.5 88 34.5 88 12" />
                  <polygon points="88 65.5 84 65.5 84 81.2 58.4 55.6 55.6 58.4 81.2 84 65.5 84 65.5 88 88 88 88 65.5" />
                  <polygon points="41.6 55.6 16 81.2 16 65.5 12 65.5 12 88 34.5 88 34.5 84 18.8 84 44.4 58.4 41.6 55.6" />
                </g>
              </svg>
            </button>
          </div>
        </header>

        <section
          className="weather"
          style={{
            opacity: weatherOpacity,
            backgroundImage: weatherBg ? `url(${weatherBg})` : undefined,
            ...weatherStyle,
          }}
        >
          <div id="video" style={{ display: showVideo ? "block" : "none" }}>
            <video
              ref={videoRef}
              width="2000"
              height="2000"
              autoPlay
              muted
              loop
            >
              {videoSrc ? <source src={videoSrc} type="video/mp4" /> : null}
            </video>
          </div>
          <div id="map" ref={mapRef} />
          <div className="bottom-overlay">
            <span ref={speedRef} className="internet-speed error" />
            <div className="news-container">
              <span
                style={{
                  animationDuration: `${animationDuration}s`,
                  transform: newsTransform,
                }}
              >
                {news}
              </span>
            </div>
            <div className="price-container">
              <span className="usdt-price-widget">
                <div>
                  <span className="label">USDT: </span>
                  <span className="value usdt-price">{prices.usdt}</span>
                  <span className="unit">T</span>
                </div>
              </span>
              <span className="btc-price-widget">
                <div>
                  <span className="label">BTC: </span>
                  <span className="value btc-price">{prices.btc}</span>
                  <span className="unit">$</span>
                </div>
              </span>
              <span className="gold-price-widget">
                <div>
                  <span className="label">GOLD: </span>
                  <span className="value gold-price">{prices.gold}</span>
                  <span className="unit">T</span>
                </div>
              </span>
            </div>
          </div>
          <div className={`map-overlay${mapOverlayInterval ? " interval" : ""}`}>
            <span
              className="bottom"
              style={{
                backgroundColor: color,
                display: showMapOverlayBottom ? "flex" : "none",
              }}
            />
            <span
              className="cover"
              style={{
                backgroundColor: color,
                opacity: (mapOpacity / 100) * 1,
              }}
            />
            <div className="content-wrapper">
              <h1>
                <span
                  style={
                    flagSrc
                      ? { backgroundImage: `url("${flagSrc}")` }
                      : undefined
                  }
                />
                <b>{cityTitle}</b>
              </h1>
              <div className="weather-data">
                <div className="temp-feels-wrapper">
                  <span className="temperature">
                    <span className="value">
                      {weather ? fmt(weather.temp, weather.isPersian) : ""}
                    </span>
                    <span className="unit">{UNIT}</span>
                    <span
                      className="info"
                      onMouseMove={() => {
                        const lastSearch = localStorage.getItem("last_search");
                        const hist = parseHistory(lastSearch);
                        const isPersian = checkPersianCharacters(
                          [...hist].reverse()[0],
                        );
                        const l = isPersian ? "fa" : "en";
                        setLastUpdateLabel(
                          `${translate[l].lastUpdate} ${timeAgo(
                            lastUpdateRef.current,
                            l,
                          )}`,
                        );
                      }}
                    >
                      <span className="last-update">{lastUpdateLabel}</span>
                    </span>
                  </span>
                  <span className="feels_like">
                    <span className="text">
                      {weather ? translate[lang].FeelsLike : ""}
                    </span>
                    <span className="value-wrapper">
                      <span className="value">
                        {weather ? fmt(weather.feels, weather.isPersian) : ""}
                      </span>
                      <span className="unit">{UNIT}</span>
                      <span />
                    </span>
                  </span>
                  <span className="wind-speed">
                    <span className="text">
                      {weather ? translate[lang].WindSpeed : ""}
                    </span>
                    <span className="value">
                      {weather?.isPersian ? (
                        <>
                          {NumbersToPersian(weather.wind.toFixed(TO_FIXED))}{" "}
                          <span>{translate.fa.WindSpeedUnit}</span>
                        </>
                      ) : weather ? (
                        `${weather.wind.toFixed(TO_FIXED)} ${
                          translate.en.WindSpeedUnit
                        }`
                      ) : null}
                    </span>
                  </span>
                </div>
                <div className="current-weather-icon">
                  <div
                    className="svg-icon"
                    style={
                      iconSrc
                        ? { backgroundImage: `url("${iconSrc}")` }
                        : undefined
                    }
                  />
                  <span>{weather?.description || ""}</span>
                </div>
                <div className="weather-details-wrapper">
                  <div className="min-max-wrapper">
                    <span className="temp_max">
                      <div>
                        <span className="value">
                          {weather ? fmt(weather.max, weather.isPersian) : ""}
                        </span>
                        <span className="unit">{UNIT}</span>
                      </div>
                    </span>
                    <span className="temp_min">
                      <div>
                        <span className="value">
                          {weather ? fmt(weather.min, weather.isPersian) : ""}
                        </span>
                        <span className="unit">{UNIT}</span>
                      </div>
                    </span>
                  </div>
                  <span className="humidity">
                    <div>
                      <div className="humidity-icon">
                        <svg viewBox="0 0 30 42">
                          <path
                            fill="transparent"
                            d="m 13.552735,2.0426703 q 1.5,3.7999997 10,14.9999997 a 12.8,12.8 0 1 1 -20.0000007,0 Q 12.052736,5.84267 13.552735,2.0426703 Z"
                            style={{ stroke: "#ffffff", strokeWidth: 1.3 }}
                          />
                          <path
                            style={{
                              opacity: 1,
                              fillOpacity: 1,
                              stroke: "none",
                            }}
                            d="M 0,1.3127116e-4 V 38.582162 H 27.10547 V 1.3127116e-4 Z M 13.552735,2.0431 c 1,2.5333332 4.333334,7.5333335 10,15 a 12.8,12.8 0 1 1 -20.000001,0 c 5.6666682,-7.4666665 9.000002,-12.4666668 10.000001,-15 z"
                          />
                        </svg>
                        <div className="overlay-drop">
                          <div className="water" />
                        </div>
                      </div>
                      <span className="value">
                        {weather
                          ? weather.isPersian
                            ? NumbersToPersian(weather.humidity)
                            : weather.humidity
                          : ""}
                      </span>
                      <span className="unit">%</span>
                    </div>
                  </span>
                </div>
              </div>
              <div className="digital-clock">
                <div className="wrapper">
                  <div className="time-wrapper">
                    <div>
                      <span className="hour" id="time">
                        {clock.hour}
                      </span>
                      <span className="second" id="sec">
                        {clock.second}
                      </span>
                    </div>
                    <span className="minutes" id="med">
                      {clock.midday}
                    </span>
                  </div>
                  <div className="date-wrapper">{clock.date}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="portal-loading">
        <div className="logo">
          <svg
            className="azard"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1000 1000"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M185.8 746.3c2.7 57.6 37.8 91.6 37.8 91.6h-21.4c-26-46.3-17.2-92.1-17.2-92.1.2.1.5.3.8.5zm100.9 91.6c-75.8-78.6-63.9-177.1-63.9-177.1-25.1 104.5 27.7 177.1 27.7 177.1h36.2zm-41-227.1S231 728.4 302 838h38c-86.6-106.2-94.3-227.2-94.3-227.2zm102.2 227.1s26.5.7 41.6-12.7c0 0-98.7-128.8-103.9-304.2-.1 0-20.8 159.1 62.3 316.9zm51.4-25.8l17.8-44.6S334 654.6 323 489c0 .1-18.2 168.2 76.3 323.1zm30.5-76l10.7-26.5h15.2S369.6 588 351.9 419.2c.1 0-7.2 157.3 77.9 316.9zm-50.3-441s-18 210.4 87.4 411.3l-1.1 3.2H517S657.1 688 780 590.2c0 0-142.1 27.8-288.6 113.5l-1.2.7 14.7-42.1s138-9.6 253.3-114.5c0 0-119.8 25.2-244.2 89.8l10-26s138.1-25.5 236.8-137.1c0 0-77 28.3-139.3 63.4l2.5 6.5-14.2-.2s-43 23.8-78.3 48.2l20.6-48.2h-21.3l-14.3 32-.4-32h-22.4s7.7 35 13.7 53.7l-16.6 40.9s10.6-50.7-10.5-94.5h-17l10.3-26s-46.9-145.6-22.3-324c0 0-59.3 208.6 32.7 463.6l-15.3 43.2s6.6-51.1-17.4-93.6c-24-42.5-71.8-188.3-71.8-312.4zm128.7 136.7C479.9 299 489 206.4 489 206.4c-28 145.9-4.4 284.3-4.4 284.3l23.6-58.9zm25.3-262.1S510 265.7 519 404l24.7-61.1s-16.1-95-10.2-173.2zm53.6-7.6s-29 88.4-37.6 192.6l41.9 106.2 18.2-35.3s73.4 3.2 129.4-59.3c0 0-72 1.7-127.3 55.2l28.2-51.2s70.3 8.7 81.3-68.1c0 0-34 11.8-60 31.5 0 0 39.3-63.7 47.3-76.1 0 0-37.8 47.6-53.3 71.3 0 0-1.2-37.1 5.5-88.3 0 0-25.5 64.9-34.1 130.6l-23.5 38.2s27.2-105.8 19.5-240.1c0 0-38.2 125.1-32.7 262.1l-1.4 2.6c.1.1-30.2-76.3-1.4-271.9zm15.4 327c96.5-18.4 146.2-90.3 146.2-90.3C658 425.5 596.1 473 596.1 473l6.4 16.1zm6.9 17.3l8.9 22.5s80.5-26.1 152.4-101c-.1 0-63.5 45.9-161.3 78.5zM651 709.5l6.3 14.6C759 668.7 816.4 600.8 816.4 600.8c-126.1 77.8-249.7 108.8-249.7 108.8l84.3-.1zm164.5-62.7c-82.2 59.8-155.9 82.7-155.9 82.7l10.3 24c83.7-42.7 145.6-106.7 145.6-106.7zM675 766.5l8.7 19.6s45.4-24.1 110.7-85.6c0 0-63.1 45.6-119.4 66zm13.9 32s7.8 22.1 18.1 28.8c0 0 29.2-25.7 59.1-60.7.1-.1-37 18.8-77.2 31.9z"
            />
          </svg>
          <svg className="circle" viewBox="0 0 600 600">
            <path
              d="M200,300a100,100 0 1,0 200,0a100,100 0 1,0 -200,0"
              fill="transparent"
              stroke="rgba(255,255,255, 0.35)"
            />
          </svg>
        </div>
      </div>

      <div className={`portal-model${portalModal.active ? " active" : ""}`}>
        <span
          className="close"
          onClick={() => {
            document.body.classList.remove("blur");
            setPortalModal({ active: false, text: "" });
            setBodyState((s) => ({ ...s, blur: false }));
          }}
        />
        <span className="text" style={{ color: "#ffffff" }}>
          {portalModal.text}
        </span>
      </div>

      <div
        ref={settingsRef}
        className="portal-settings"
        style={{
          visibility: settingsOpen ? "visible" : "hidden",
          opacity: settingsOpen ? 1 : 0,
        }}
      >
        <div>
          <h6>Color</h6>
          <input
            type="color"
            id="favcolor"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
        <div>
          <h6>Main opacity</h6>
          <input
            id="mapOpacity"
            type="range"
            min="0"
            max="100"
            value={mapOpacity}
            onChange={(e) => handleOpacityChange(e.target.value)}
          />
        </div>
        <div>
          <h6>News animation duration</h6>
          <input
            id="animationDuration"
            type="range"
            min="60"
            max="360"
            value={animationDuration}
            onChange={(e) => handleAnimationChange(e.target.value)}
          />
        </div>
        <div>
          <h6>Full screen image</h6>
          <input
            id="fullScreenImage"
            type="checkbox"
            checked={fullScreenImage}
            onChange={(e) => {
              setFullScreenImage(e.target.checked);
              localStorage.setItem("fsi", String(e.target.checked));
            }}
          />
        </div>
        <div className="action-wrapper">
          <button
            type="button"
            className="reset"
            onClick={() => {
              setColor("#072322");
              applyTheme("#072322");
              setMapOpacity(90);
              setAnimationDuration(160);
              setMainBlur(false);
              setSettingsOpen(false);
              localStorage.setItem("color", "#072322");
              localStorage.setItem("opacity", "90");
              localStorage.setItem("fsi", "false");
              setFullScreenImage(false);
            }}
          >
            {settingsLabels.reset}
          </button>
          <button
            type="button"
            className="submit"
            onClick={() => {
              setMainBlur(false);
              setSettingsOpen(false);
            }}
          >
            {settingsLabels.submit}
          </button>
        </div>
      </div>
    </>
  );
}
