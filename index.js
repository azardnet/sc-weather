import "./style.scss";
import {
  NumbersToPersian,
  debounce,
  checkPersianCharacters,
  createJsFile,
  checkExistJsFile,
  deleteMap,
  randomIntFromInterval,
  InitiateSpeedDetection,
  MeasureConnectionSpeed,
  timeAgo,
  arrayMove,
  getStorage,
  isLight,
  dynamicTranslateKeyframe,
  updateTime,
  formatNumber,
} from "./utils";
import { translate } from "./translate";
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
  els,
  DEFAILT_CITY,
} from "./variables";

// ------------------------------------------------------------------
// Module-scoped state
// ------------------------------------------------------------------
let cacheData = { lat: 53.4106, lon: -2.9779 };
let lastUpdate = new Date();

// ------------------------------------------------------------------
// DOM & UI Helpers
// ------------------------------------------------------------------

/** Show a portal modal with given text, auto‑hide after delay */
function activePortalModal(text) {
  document.body.classList.remove("loading");
  document.body.classList.add("loaded", "blur");
  els.pModal.classList.add("active");
  els.pModelTxt.innerHTML = text;
  els.pModelTxt.style.color = "#ffffff";
  setTimeout(() => {
    els.pModal.classList.remove("active");
    document.body.classList.remove("blur");
  }, PORTAL_MODAL_DELAY);
}

/** Change the main colour and update related elements */
function changeColor(color) {
  document.body.style.backgroundColor = color;
  els.mOverlayB.style.backgroundColor = color;
  els.mOverlayC.style.backgroundColor = color;
  els.fColor.value = color;
  els.lSvgP.style.fill = color;
  els.lSvgP.style.stroke = color;
  document.documentElement.classList.remove(isLight(color) ? "dark" : "light");
  document.documentElement.classList.add(isLight(color) ? "light" : "dark");
}

/** Change the opacity of the map overlay */
function changeMapOpacity(value) {
  els.mOverlayC.style.opacity = (value / 100) * 1;
}

/** Change the animation duration of the news ticker */
function changeAnimationDuration(value) {
  els.NewsC.style.animationDuration = `${value}s`;
}

// ------------------------------------------------------------------
// Debounced event handlers for settings
// ------------------------------------------------------------------
const handleChangeColor = debounce(function () {
  changeColor(els.fColor.value);
  localStorage.setItem("color", els.fColor.value);
}, 40);

const handleMapOpacityChange = debounce(function () {
  changeMapOpacity(els.mOpacity.value);
  localStorage.setItem("opacity", els.mOpacity.value);
}, 40);

const handleAnimationDurationChange = debounce(function () {
  changeAnimationDuration(els.animationD.value);
  localStorage.setItem("animation-duration", els.animationD.value);
}, 40);

const handleFullScreenImageChange = function (event) {
  localStorage.setItem("fsi", event.target.checked);
};

// ------------------------------------------------------------------
// Misc UI updates
// ------------------------------------------------------------------

/** Update the "last update" label on mouse move over info area */
const handleMouseMoveOnInfo = () => {
  const lastSearch = localStorage.getItem("last_search");
  let history = [];
  try {
    history = JSON.parse(lastSearch) || [];
  } catch (_) {
    history = lastSearch ? [lastSearch] : [];
  }
  const isPersian = checkPersianCharacters(
    history.reverse()[0]
  );
  const lang = isPersian ? "fa" : "en";
  els.lUpdate.innerHTML = `${translate[lang].lastUpdate} ${timeAgo(
    lastUpdate,
    lang
  )}`;
};

// ------------------------------------------------------------------
// Input handling (search bar)
// ------------------------------------------------------------------

function onInputKeydown(event) {
  const key = event.key;
  const code = event.code;
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
      els.header.classList.add("right");
      els.header.classList.remove("left");
      els.input.placeholder = translate.fa.TypeCity;
    } else {
      els.header.classList.remove("right");
      els.header.classList.add("left");
      els.input.placeholder = translate.en.TypeCity;
    }
  }

  if (key === "Enter") {
    event.preventDefault();
    els.cList.classList.remove("active");
    els.input.blur();
    if (!document.body.classList.contains("blur")) {
      const city = els.input.value.trim();
      if (city.length > 1 && city.length < 22) {
        loading();
        setTimeout(() => {
          searchWeather(city, false);
        }, 120);
        setTimeout(() => {
          els.weather.style.opacity = 1;
        }, LOADING_DELAY);
      } else {
        activePortalModal("invalid city");
      }
    }
  }
}

// ------------------------------------------------------------------
// Loading states
// ------------------------------------------------------------------

function loaded(delay = true) {
  els.main.style.display = "flex";
  const removeLoading = () => {
    document.body.classList.remove("loading", "blur");
    document.body.classList.add("loaded");
  };
  if (delay) {
    setTimeout(removeLoading, LOADING_DELAY);
  } else {
    removeLoading();
  }
}

function loading() {
  document.body.classList.remove("loaded");
  document.body.classList.add("loading", "blur");
}

// ------------------------------------------------------------------
// Map creation
// ------------------------------------------------------------------

function createMap(lat, lon) {
  deleteMap();
  if (!checkExistJsFile("yandex")) {
    createJsFile(MAP_URL);
  }
  setTimeout(() => {
    try {
      ymaps.ready(() => {
        new ymaps.Map("map", {
          center: lat && lon ? [lat, lon] : [cacheData.lat, cacheData.lon],
          zoom: 13,
          controls: [],
        });
        loaded();
      });
    } catch (_) {
      deleteMap();
      loaded();
      const isPersian = checkPersianCharacters(
        localStorage.getItem("last_search") || DEFAILT_CITY
      );
      activePortalModal(
        isPersian ? translate.fa.ErrorLoadMap : translate.en.ErrorLoadMap
      );
    }
  }, CREATE_MAP_DELAY);
}

// ------------------------------------------------------------------
// Core weather data fetching
// ------------------------------------------------------------------

function searchWeather(city, interval) {
  // Extract city name if it's a JSON array string
  let cityNameParam;
  try {
    const cityList = JSON.parse(city);
    cityNameParam = cityList[cityList.length - 1];
  } catch (_) {
    cityNameParam = city;
  }

  const isPersian = checkPersianCharacters(cityNameParam);
  const lang = isPersian ? "fa" : "en";

  if (!interval) {
    // Restore settings from localStorage
    const color = localStorage.getItem("color") || "#072322";
    const opacity = localStorage.getItem("opacity") || "90";
    const animationDuration =
      localStorage.getItem("animation-duration") || "120";
    changeColor(color);
    changeMapOpacity(opacity);
    changeAnimationDuration(animationDuration);

    if (isPersian) {
      document.body.classList.add("rtl");
      els.input.placeholder = "اسم شهر را وارد کنید و Enter بزنید.";
      els.sActionB1.innerText = "تنظیم مجدد";
      els.sActionB2.innerText = "ذخیره";
    } else {
      document.body.classList.remove("rtl");
      els.input.placeholder = "type City and hit Enter";
      els.sActionB1.innerText = "Reset";
      els.sActionB2.innerText = "Submit";
    }
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lang=${lang}&q=${cityNameParam}&APPID=${OPEN_WEATHER_KEY}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((result) => {
      computeUI(result, cityNameParam, interval);
    });
}

// ------------------------------------------------------------------
// UI rendering after weather data arrives
// ------------------------------------------------------------------

function computeUI(result, city, interval) {
  const isPersian = checkPersianCharacters(city);
  const lang = isPersian ? "fa" : "en";

  // ----- Background: video or image or map -----
  const cityVideo = CITY_HAVE_VIDEO.find((item) => item.id === result.id);
  if (cityVideo) {
    setupVideoBackground(result.id, cityVideo);
    deleteMap();
    els.mOverlayB.style.display = "none";
  } else {
    els.video.style.display = "none";
    els.videoV.pause();
    els.videoV.innerHTML = "";
    els.mOverlayB.style.display = "flex";
  }

  els.mOverlay.classList.remove("interval");
  lastUpdate = new Date();

  // ----- Update main UI only on non‑interval calls -----
  if (!interval) {
    if (result && city && !result.message) {
      // City title
      els.mOverlayTitle.innerHTML = isPersian ? city : result.name;

      // Background handling (map or image)
      if (result.coord && result.coord.lat) {
        const hasVideo = CITY_HAVE_VIDEO.some((item) => item.id === result.id);
        if (hasVideo) {
          deleteMap();
          els.mOverlayB.style.display = "none";
          loaded();
        } else if (
          !CITY_HAVE_IMAGE.some((item) =>
            typeof item.id === "number"
              ? item.id === result.id
              : item.id.includes(result.id)
          )
        ) {
          cacheData.lat = result.coord.lat;
          cacheData.lon = result.coord.lon;
          els.mOverlayB.style.display = "flex";
          createMap(result.coord.lat, result.coord.lon);
        } else {
          const cityImageData = CITY_HAVE_IMAGE.find((item) =>
            typeof item.id === "number"
              ? item.id === result.id
              : item.id.includes(result.id)
          );
          const randomIndex =
            randomIntFromInterval(0, cityImageData?.images?.length - 1) || 0;
          const imageId = cityImageData.id[0] || cityImageData.id;
          const image = require(`./static/image/${imageId}-${randomIndex + 1}.jpg`);
          els.weather.style.backgroundImage = `url(${image})`;
          els.mOverlayB.style.display = "flex";
          loaded();
        }
      }

      // Flag & weather icon
      if (result.sys && result.sys.country) {
        const flagSrc = require(`./static/flags/${result.sys.country.toLowerCase()}.svg`);
        const iconSrc = require(`./static/icons/openweathermap/${result.weather[0].icon}.svg`);
        els.mOverlaySpan.style.backgroundImage = `url("${flagSrc}")`;
        els.wSvgIcon.style.backgroundImage = `url("${iconSrc}")`;
      }

      // Update search history
      updateSearchHistory(isPersian ? city : result.name);

      // Show weather data (always)
      updateWeatherDisplay(result, isPersian);

      // After a short delay, add the interval class
      setTimeout(() => {
        els.mOverlay.classList.add("interval");
      }, 250);
    } else if (result && result.message && city) {
      loaded();
      activePortalModal(
        isPersian ? translate.fa.CityNotFound : translate.en.CityNotFound
      );
      setTimeout(() => {
        searchWeather(getStorage("last_search"), false);
      }, 2500);
    }
  } else {
    // Interval call: only update weather numbers
    if (result && result.main) {
      updateWeatherDisplay(result, isPersian);
    }
  }
}

/** Update weather numerical values in the UI */
function updateWeatherDisplay(result, isPersian) {
  const lang = isPersian ? "fa" : "en";
  const main = result.main;
  const wind = result.wind;

  els.wTemperatureV.innerHTML = isPersian
    ? NumbersToPersian(main.temp.toFixed(TO_FIXED))
    : main.temp.toFixed(TO_FIXED);
  els.wTemperatureU.innerHTML = UNIT;

  els.wFeelsT.innerHTML = translate[lang].FeelsLike;
  els.wFeelsV.innerHTML = isPersian
    ? NumbersToPersian(main.feels_like.toFixed(TO_FIXED))
    : main.feels_like.toFixed(TO_FIXED);
  els.wFeelsU.innerHTML = UNIT;

  els.wWindT.innerHTML = translate[lang].WindSpeed;
  els.wWindV.innerHTML = isPersian
    ? `${NumbersToPersian(wind.speed.toFixed(TO_FIXED))} <span>${translate.fa.WindSpeedUnit
    }</span>`
    : `${wind.speed.toFixed(TO_FIXED)} ${translate.en.WindSpeedUnit}`;

  els.wCurrentI.innerHTML = result.weather[0].description;
  els.wMaxV.innerHTML = isPersian
    ? NumbersToPersian(main.temp_max.toFixed(TO_FIXED))
    : main.temp_max.toFixed(TO_FIXED);
  els.wMaxU.innerHTML = UNIT;
  els.wMinV.innerHTML = isPersian
    ? NumbersToPersian(main.temp_min.toFixed(TO_FIXED))
    : main.temp_min.toFixed(TO_FIXED);
  els.wMinU.innerHTML = UNIT;
  els.wHumidityV.innerHTML = isPersian
    ? NumbersToPersian(main.humidity)
    : main.humidity;
}

/** Set up video background for cities that have videos */
function setupVideoBackground(cityId, cityVideoData) {
  els.video.style.display = "block";
  els.videoV.pause();
  els.videoV.innerHTML = "";

  const videoCount = cityVideoData.videos?.length || 1;
  const randomNumber = randomIntFromInterval(0, cityVideoData.videos?.length) || 1;
  const lastVideoIndexKey = `last_video_index_${cityId}`;
  let currentVideoIndex =
    parseInt(localStorage.getItem(lastVideoIndexKey) || "0", 10);
  currentVideoIndex = (currentVideoIndex + 1) % videoCount;
  localStorage.setItem(lastVideoIndexKey, String(currentVideoIndex));

  const source = document.createElement("source");
  const videoSrc = require(`./static/videos/${cityId}-${randomNumber}.mp4`);
  source.setAttribute("src", videoSrc);
  source.setAttribute("type", "video/mp4");
  els.videoV.appendChild(source);
  els.videoV.load();
  els.videoV.play().catch(() => { });
}

/** Update the search history list in the dropdown */
function updateSearchHistory(cityName) {
  const lastSearch = localStorage.getItem("last_search");
  let history = [];
  try {
    history = JSON.parse(lastSearch) || [];
  } catch (_) {
    history = lastSearch ? [lastSearch] : [];
  }

  if (!Array.isArray(history)) {
    history = [history];
  }

  if (history.includes(cityName)) {
    const idx = history.indexOf(cityName);
    arrayMove(history, idx, history.length - 1);
  } else {
    if (history.length > 5) history.shift();
    history.push(cityName);
  }

  // Render history items
  const html = history.map((item) => `<li>${item}</li>`).join("");
  els.cList.innerHTML = html;
  localStorage.setItem("last_search", JSON.stringify(history));

  // Attach click listeners to each history item
  document.querySelectorAll(".city-list-wrapper li").forEach((li) => {
    li.addEventListener("click", (e) => {
      const city = e.target.innerHTML || DEFAILT_CITY;
      loading();
      els.input.value = city;
      searchWeather(city, false);
    });
  });
}

// ------------------------------------------------------------------
// Fullscreen & settings UI
// ------------------------------------------------------------------

function onFullScreenClick() {
  els.header.style.display = "none";
  if (localStorage.getItem("fsi") === "true") {
    els.mOverlayB.style.display = "none";
    els.weather.style.marginTop = "0px";
    els.weather.style.width = "100vw";
    els.weather.style.height = "100vh";
  } else {
    els.weather.style.width = "calc(100vw - 160px)";
    els.weather.style.height = "calc(100vh - 110px)";
  }
  document.documentElement.requestFullscreen();
}

function onSettingButtonClick() {
  els.pSettings.style.visibility = "visible";
  els.pSettings.style.opacity = 1;
  els.main.style.filter = "blur(20px)";
  els.fScreen.checked = localStorage.getItem("fsi") === "true";
  els.mOpacity.value = +(localStorage.getItem("opacity") || 90);
  els.animationD.value = +(localStorage.getItem("animation-duration") || 160);
}

function onSettingResetButtonClick() {
  changeColor("#072322");
  changeMapOpacity("90");
  changeAnimationDuration(160);
  els.main.style.filter = "blur(0px)";
  els.pSettings.style.visibility = "hidden";
  els.pSettings.style.opacity = 0;
  localStorage.setItem("color", "#072322");
  localStorage.setItem("opacity", "90");
  localStorage.setItem("fsi", "false");
  els.fScreen.checked = false;
  els.mOpacity.value = 90;
}

function onSettingSubmitButtonClick() {
  els.main.style.filter = "blur(0px)";
  els.pSettings.style.visibility = "hidden";
  els.pSettings.style.opacity = 0;
}

function onWindowClick(e) {
  if (!els.pSettings.contains(e.target) && !els.sButton.contains(e.target)) {
    els.main.style.filter = "blur(0px)";
    els.pSettings.style.visibility = "hidden";
    els.pSettings.style.opacity = 0;
  }
}

function onFullScreenChange() {
  if (!document.fullscreenElement) {
    els.header.style.display = "flex";
    els.mOverlayB.style.display = "flex";
    els.weather.style.marginTop = "10px";
    els.weather.style.width = "80vw";
    els.weather.style.height = "calc(80vh + 40px)";
    const lastId = +(localStorage.getItem("last_search_id") || 0);
    if (!CITY_HAVE_IMAGE.some((item) => item.id === lastId)) {
      createMap();
    }
  }
}

function onPortalModalClose() {
  document.body.classList.remove("blur");
  els.pModal.classList.remove("active");
}

// ------------------------------------------------------------------
// Clock update
// ------------------------------------------------------------------

function currentTime() {
  const city = localStorage.getItem("last_search") || DEFAILT_CITY;
  let cityNameParam;
  try {
    const list = JSON.parse(city);
    cityNameParam = list[list.length - 1];
  } catch (_) {
    cityNameParam = city;
  }
  const isPersian = checkPersianCharacters(cityNameParam);

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const day = now.getDate();

  let midday = hours >= 12 ? "PM" : "AM";
  let hour12 = hours % 12 || 12;
  hour12 = updateTime(hour12);
  const minStr = updateTime(minutes);
  const secStr = updateTime(seconds);
  const dayStr = updateTime(day);

  els.dClockH.innerHTML = `${isPersian ? NumbersToPersian(hour12) : hour12
    }:${isPersian ? NumbersToPersian(minStr) : minStr}`;
  els.dClockS.innerHTML = `:${isPersian ? NumbersToPersian(secStr) : secStr
    }`;
  els.dClockM.innerHTML = `${midday}`;
  els.dateW.innerHTML = ` ${now.toLocaleDateString("fa-ir", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })} `;
}

// ------------------------------------------------------------------
// News, market, and gold prices
// ------------------------------------------------------------------

async function fetchNews() {
  try {
    const res = await fetch("https://htmliha.ir/get/");
    const data = await res.json();
    if (data?.data) {
      const newsText = data.data
        .map((item) => `${item.source}: ${item.title}`)
        .join("  \u0020   |    \u0020  ");
      els.NewsC.innerHTML = newsText;
      const newsLength = newsText.length * 3.41;
      els.NewsC.style.transform = `translate3d(-${newsLength}px, 0px, 0px)`;
      dynamicTranslateKeyframe(
        "news",
        `-${newsLength}px, 0px, 0px`,
        `${newsLength}px, 0px, 0px`
      );
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

async function fetchMarketPrices() {
  const isFa = checkPersianCharacters(localStorage.getItem("last_search"));
  try {
    const res = await fetch(
      "https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt,btc&dstCurrency=rls,usdt"
    );
    const data = await res.json();
    if (data?.stats?.["usdt-rls"]) {
      const usdtPrice = data.stats["usdt-rls"].latest;
      const btcPrice = data.stats["btc-usdt"].latest;
      updatePriceWidget(usdtPrice, btcPrice);
    }
  } catch (_) {
    els.usdt.innerHTML = isFa ? "خطا" : "error";
  }
}

async function fetchGoldPrices() {
  const isFa = checkPersianCharacters(localStorage.getItem("last_search"));
  try {
    const res = await fetch("https://azard.net/gold/");
    const data = await res.json();
    if (data?.average) {
      els.gold.innerHTML = formatNumber(data.average);
    } else {
      els.gold.innerHTML = isFa ? "خطا" : "error";
    }
  } catch (_) {
    // fallback to wallgold
    try {
      const res2 = await fetch(
        "https://api.wallgold.ir/api/v1/price?symbol=GLD_18C_750TMN&side=buy"
      );
      const data2 = await res2.json();
      if (data2?.result?.price) {
        els.gold.innerHTML = formatNumber(data2.result.price);
      } else {
        els.gold.innerHTML = isFa ? "خطا" : "error";
      }
    } catch (_) {
      els.gold.innerHTML = isFa ? "خطا" : "error";
    }
  }
}

function updatePriceWidget(usdtPrice, btcPrice) {
  if (!usdtPrice || !btcPrice) {
    els.usdt.innerHTML = "N/A";
    els.btct.innerHTML = "N/A";
    return;
  }
  els.usdt.innerHTML = formatNumber(Math.round(usdtPrice / 10));
  els.btct.innerHTML = formatNumber(btcPrice);
}

// ------------------------------------------------------------------
// Initialisation
// ------------------------------------------------------------------

function onContentLoaded() {
  els.ISpeed.classList.add("error");
  setTimeout(InitiateSpeedDetection, 400);

  // Initial weather
  searchWeather(localStorage.getItem("last_search") || DEFAILT_CITY, false);

  // Initial data fetches
  fetchMarketPrices();
  fetchGoldPrices();
  fetchNews();

  // Service worker
  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker
  //     .register("service-worker.js", { scope: "/sc-weather/" })
  //     .then((reg) => console.log("SW registered: ", reg))
  //     .catch((err) => console.log("SW registration failed: ", err));
  // }
}

// ------------------------------------------------------------------
// Interval timers
// ------------------------------------------------------------------

setInterval(() => {
  searchWeather(localStorage.getItem("last_search") || DEFAILT_CITY, true);
}, REQUEST_INTERVAL);

setInterval(MeasureConnectionSpeed, SPEED_DETECTION_DELAY);

setInterval(() => {
  fetchMarketPrices();
  fetchGoldPrices();
  fetchNews();
}, 500000);

setInterval(currentTime, 1000);

// ------------------------------------------------------------------
// Event listeners
// ------------------------------------------------------------------

window.addEventListener("click", onWindowClick);
document.addEventListener("fullscreenchange", onFullScreenChange);
window.addEventListener("DOMContentLoaded", onContentLoaded);

els.input.addEventListener("keydown", onInputKeydown);
els.input.addEventListener("focus", () => els.cList.classList.add("active"));
els.input.addEventListener("blur", () => {
  setTimeout(() => els.cList.classList.remove("active"), 100);
});

els.fColor.addEventListener("input", handleChangeColor);
els.mOpacity.addEventListener("input", handleMapOpacityChange);
els.animationD.addEventListener("input", handleAnimationDurationChange);
els.pModalC.addEventListener("click", onPortalModalClose);
els.FScreen.addEventListener("click", onFullScreenClick);
els.sButton.addEventListener("click", onSettingButtonClick);
els.Sreset.addEventListener("click", onSettingResetButtonClick);
els.SSubmit.addEventListener("click", onSettingSubmitButtonClick);
els.fScreen.addEventListener("input", handleFullScreenImageChange);
els.Winfo.addEventListener("mousemove", handleMouseMoveOnInfo);