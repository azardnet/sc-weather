import "./style.scss";
import {
  sl,
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
} from "./utils";
import { translate } from "./translate";
import {
  CITY_HAVE_IMAGE,
  CITY_HAVE_VIDEO,
  TO_FIXED,
  SPEED_DETECTION_DELAY,
  CREATE_MAP_DELAY,
  PORTAL_MODAL_DELAY,
  LOADING_TRANSITION_DELAY,
  LOADING_DELAY,
  REQUEST_INTERVAL,
  MAP_URL,
  OPEN_WEATHER_KEY,
  UNIT,
  els,
} from "./variables";

let cacheData = { lat: 53.4106, lon: -2.9779 };
let lastUpdate = new Date();

function activePortalModal(text) {
  document.body.classList.remove("loading");
  document.body.classList.add("loaded");
  document.body.classList.add("blur");
  els.pModal.classList.add("active");
  els.pModelTxt.innerHTML = text;
  els.pModelTxt.style.color = "#ffffff";
  setTimeout(() => {
    els.pModal.classList.remove("active");
    document.body.classList.remove("blur");
  }, PORTAL_MODAL_DELAY);
}

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

function changeMapOpacity(value) {
  els.mOverlayC.style.opacity = value / 100;
}
const handleChangeColor = debounce(function () {
  changeColor(els.fColor.value);
  localStorage.setItem("color", els.fColor.value);
}, 20);

const handleMapOpacityChange = debounce(function () {
  changeMapOpacity(mapOpacityRangeEl.value);
  localStorage.setItem("opacity", mapOpacityRangeEl.value);
}, 20);

const handleFullScreenImageChange = function (event) {
  localStorage.setItem("fsi", event.target.checked);
};

const handleMouseMoveOnInfo = () => {
  const isPersianCharacter = checkPersianCharacters(
    localStorage.getItem("last_search")
  );
  els.lUpdate.innerHTML = `${
    translate[`${isPersianCharacter ? "fa" : "en"}`].lastUpdate
  } ${timeAgo(lastUpdate, isPersianCharacter ? "fa" : "en")}`;
};

function onInputKeydown(event) {
  if (
    event.code !== "Backspace" &&
    event.key !== "Control" &&
    event.key !== "Alt" &&
    event.key !== "Shift" &&
    event.key !== "CapsLock" &&
    event.key !== "Tab" &&
    event.code !== "Space" &&
    event.key !== "Enter"
  ) {
    if (checkPersianCharacters(event.key)) {
      els.header.classList.add("right");
      els.header.classList.remove("left");
      inputEl.placeholder = translate.fa.TypeCity;
    } else {
      els.header.classList.remove("right");
      els.header.classList.add("left");
      inputEl.placeholder = translate.en.TypeCity;
    }
  }
  if (event.key === "Enter") {
    event.preventDefault();
    els.cList.classList.remove("active");
    inputEl.blur();
    if (!document.body.classList.contains("blur")) {
      if (inputEl.value.length < 22 && inputEl.value.length > 1) {
        loading();
        setTimeout(() => {
          searchWeather(inputEl.value, false);
        }, 120);
        setTimeout(() => {
          els.weather.style.opacity = 1;
        }, Math.max(0, LOADING_DELAY - LOADING_TRANSITION_DELAY));
      } else {
        activePortalModal("invalid city");
      }
    }
  }
}

function searchWeather(city, interval) {
  let cityNameParam = "";
  try {
    const cityList = JSON.parse(city);
    cityNameParam = cityList[cityList.length - 1];
  } catch (error) {
    cityNameParam = city;
  }
  const isPersianCharacter = checkPersianCharacters(cityNameParam);
  if (!interval) {
    const color = localStorage.getItem("color") || "#072322";
    const opacity = localStorage.getItem("opacity") || "90";
    changeColor(color);
    changeMapOpacity(opacity);
    if (isPersianCharacter) {
      document.body.classList.add("rtl");
      inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید.";
      els.sActionB1.innerText = "تنظیم مجدد";
      els.sActionB2.innerText = "ذخیره";
    } else {
      document.body.classList.remove("rtl");
      inputEl.placeholder = "type City and hit Enter";
      els.sActionB1.innerText = "Reset";
      els.sActionB2.innerText = "Submit";
    }
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lang=${
      isPersianCharacter ? "fa" : "en"
    }&q=${cityNameParam}&APPID=${OPEN_WEATHER_KEY}&units=metric`
  )
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      computeUI(result, cityNameParam, interval);
    });
}

function loaded(delay = true) {
  els.main.style.display = "flex";
  if (delay) {
    setTimeout(() => {
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");
      document.body.classList.remove("blur");
    }, Math.max(0, LOADING_DELAY - LOADING_TRANSITION_DELAY));
  } else {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
    document.body.classList.remove("blur");
  }
}

function loading() {
  document.body.classList.remove("loaded");
  document.body.classList.add("blur");
  document.body.classList.add("loading");
}

function createMap(lat, lon) {
  deleteMap();
  if (!checkExistJsFile("yandex")) {
    createJsFile(MAP_URL);
  }
  setTimeout(() => {
    try {
      ymaps.ready(function () {
        new ymaps.Map("map", {
          center: lat && lon ? [lat, lon] : [cacheData.lat, cacheData.lon],
          zoom: 13,
          controls: [],
        });
        loaded();
      });
    } catch (error) {
      deleteMap();
      loaded();
      activePortalModal(
        checkPersianCharacters(
          localStorage.getItem("last_search") || "Liverpool"
        )
          ? translate.fa.ErrorLoadMap
          : translate.en.ErrorLoadMap
      );
    }
  }, CREATE_MAP_DELAY);
}

function computeUI(result, city, interval) {
  const cityVideoData = CITY_HAVE_VIDEO.find((item) => item.id === result.id);
  if (cityVideoData) {
    els.video.style.display = "block";
    els.videoV.pause();
    els.videoV.innerHTML = "";
    const videoCount = cityVideoData.videos?.length || 1;
    const lastVideoIndexKey = `last_video_index_${result.id}`;
    let currentVideoIndex = parseInt(
      localStorage.getItem(lastVideoIndexKey) || "0",
      10
    );
    currentVideoIndex = (currentVideoIndex + 1) % videoCount;
    localStorage.setItem(lastVideoIndexKey, currentVideoIndex.toString());
    const source = document.createElement("source");
    let videoSrc;
    if (currentVideoIndex === 0) {
      videoSrc = require(`./static/videos/${result.id}.mp4`);
    } else {
      videoSrc = require(`./static/videos/${result.id}-${
        currentVideoIndex + 1
      }.mp4`);
    }
    source.setAttribute("src", videoSrc);
    source.setAttribute("type", "video/mp4");
    els.videoV.appendChild(source);
    els.videoV.load();
    els.videoV.play().catch(() => {});
    deleteMap();
    els.mOverlayB.style.display = "none";
    els.mOverlayC.style.display = "none";
  } else {
    els.video.style.display = "none";
    els.videoV.pause();
    els.videoV.innerHTML = "";
    els.mOverlayB.style.display = "flex";
    els.mOverlayC.style.display = "block";
  }
  els.mOverlay.classList.remove("interval");
  els.copyright.style.display = "none";
  lastUpdate = new Date();
  const isPersianCharacter = checkPersianCharacters(city);
  if (!interval) {
    if (result && city && !result.message) {
      els.mOverlayTitle.innerHTML = isPersianCharacter ? city : result.name;
      if (result.coord && result.coord.lat) {
        const hasVideo = CITY_HAVE_VIDEO.find((item) => item.id === result.id);
        if (hasVideo) {
          deleteMap();
          els.mOverlayB.style.display = "none";
          els.mOverlayC.style.display = "none";
          loaded();
        } else if (
          !CITY_HAVE_IMAGE.find((item) => {
            if (typeof item.id === "number") {
              return item.id === result.id;
            } else {
              return item.id.includes(result.id);
            }
          })
        ) {
          cacheData.lat = result.coord.lat;
          cacheData.lon = result.coord.lon;
          els.mOverlayB.style.display = "flex";
          els.mOverlayC.style.display = "block";
          createMap(result.coord.lat, result.coord.lon);
        } else {
          deleteMap();
          const cityData = CITY_HAVE_IMAGE.find((item) => {
            if (typeof item.id === "number") {
              return item.id === result.id;
            } else {
              return item.id.includes(result.id);
            }
          });
          const randomNumber =
            randomIntFromInterval(0, cityData?.images?.length - 1) || 0;
          const image = require(`./static/image/${
            cityData.id[0] || cityData.id
          }-${randomNumber + 1}.jpg`);
          els.weather.style.backgroundImage = `url(${image})`;
          els.copyright.style.display = "block";
          els.copyright.innerHTML = cityData.images[randomNumber].photographer;
          els.copyright.href = cityData.images[randomNumber].link;
          els.mOverlayB.style.display = "flex";
          els.mOverlayC.style.display = "block";
          loaded();
        }
      }
      if (result.sys && result.sys.country) {
        const flagImage = require(`./static/flags/${result.sys.country.toLowerCase()}.svg`);
        const weatherIcon = require(`./static/icons/openweathermap/${result.weather[0].icon}.svg`);
        els.mOverlaySpan.style.backgroundImage = `url("${flagImage}")`;
        els.wSvgIcon.style.backgroundImage = `url("${weatherIcon}")`;
      }
      localStorage.setItem("last_search_id", result.id);
      const cityName = isPersianCharacter ? city : result.name;
      const lastSearch = localStorage.getItem("last_search");
      let lastSearchList = [];
      try {
        lastSearchList = JSON.parse(lastSearch) || [];
      } catch (error) {
        lastSearchList = [lastSearch] || [];
      }
      if (
        cityName &&
        Array.isArray(lastSearchList) &&
        !lastSearchList.includes(cityName)
      ) {
        if (lastSearchList.length > 5) {
          lastSearchList.shift();
        }
        lastSearchList.push(cityName);
      } else if (lastSearchList.length === 0) {
        lastSearchList = [cityName];
      } else if (lastSearchList.includes(cityName)) {
        const currentItemIndex = lastSearchList.indexOf(cityName);
        arrayMove(lastSearchList, currentItemIndex, lastSearchList.length - 1);
      }
      let lastSearchHtmlItems = ``;
      for (let i = 0; i < lastSearchList.length; i++) {
        lastSearchHtmlItems += `<li>${lastSearchList[i]}</li>`;
      }
      els.cList.innerHTML = lastSearchHtmlItems;
      localStorage.setItem("last_search", JSON.stringify(lastSearchList));
      const cityListItems = document.querySelectorAll(".city-list-wrapper li");
      for (let i = 0; i < cityListItems.length; i++) {
        cityListItems[i].addEventListener("click", (event) => {
          loading();
          els.input.value = event.target.innerHTML || "Liverpool";
          searchWeather(event.target.innerHTML || "Liverpool", false);
        });
      }
    } else if (result && result.message && city) {
      loaded();
      activePortalModal(
        checkPersianCharacters(city)
          ? translate.fa.CityNotFound
          : translate.en.CityNotFound
      );
      setTimeout(() => {
        searchWeather(getStorage("last_search"), false);
      }, 2500);
    }
  }
  if (result && result.main) {
    els.wTemperatureV.innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.temp.toFixed(TO_FIXED))
      : result.main.temp.toFixed(TO_FIXED);
    els.wTemperatureU.innerHTML = UNIT;
    els.wFeelsT.innerHTML =
      translate[isPersianCharacter ? "fa" : "en"].FeelsLike;
    els.wFeelsV.innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.feels_like.toFixed(TO_FIXED))
      : result.main.feels_like.toFixed(TO_FIXED);
    els.wFeelsU.innerHTML = UNIT;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .wind-speed .text"
    ).innerHTML = translate[isPersianCharacter ? "fa" : "en"].WindSpeed;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .wind-speed .value"
    ).innerHTML = isPersianCharacter
      ? `${NumbersToPersian(result.wind.speed.toFixed(TO_FIXED))} <span>${
          translate.fa.WindSpeedUnit
        }</span>`
      : `${result.wind.speed.toFixed(TO_FIXED)} ${translate.en.WindSpeedUnit}`;
    sl(
      ".map-overlay .content-wrapper .weather-data .current-weather-icon span"
    ).innerHTML = result.weather[0].description;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .temp_max .value"
    ).innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.temp_max.toFixed(TO_FIXED))
      : result.main.temp_max.toFixed(TO_FIXED);
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .temp_max .unit"
    ).innerHTML = UNIT;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .temp_min .value"
    ).innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.temp_min.toFixed(TO_FIXED))
      : result.main.temp_min.toFixed(TO_FIXED);
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .temp_min .unit"
    ).innerHTML = UNIT;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .humidity .value"
    ).innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.humidity)
      : result.main.humidity;
    setTimeout(() => {
      sl("main .weather .map-overlay").classList.add("interval");
    }, 250);
  }
}

function onFullScreenClick() {
  sl("header").style.display = "none";
  if (localStorage.getItem("fsi") === "true") {
    mOverlayB.style.display = "none";
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
  sl("#mapOpacity").value = localStorage.getItem("opacity") * 1;
}

function onSettingResetButtonClick() {
  changeColor("#072322");
  changeMapOpacity("90");
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
    if (
      !CITY_HAVE_IMAGE.find(
        (item) => item.id === localStorage.getItem("last_search_id") * 1
      )
    ) {
      createMap();
    }
  }
}

setInterval(() => {
  searchWeather(localStorage.getItem("last_search") || "Liverpool", true);
}, REQUEST_INTERVAL);

setInterval(() => {
  MeasureConnectionSpeed();
}, SPEED_DETECTION_DELAY);

function currentTime() {
  const city = localStorage.getItem("last_search") || "Liverpool";
  let cityNameParam = "";
  try {
    const cityList = JSON.parse(city);
    cityNameParam = cityList[cityList.length - 1];
  } catch (error) {
    cityNameParam = city;
  }
  const isPersianCharacter = checkPersianCharacters(cityNameParam);

  const date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let curr_date = date.getDate();
  let midday = "AM";
  midday = hour >= 12 ? "PM" : "AM";
  hour = hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
  hour = updateTime(hour);
  min = updateTime(min);
  sec = updateTime(sec);
  curr_date = updateTime(curr_date);
  sl(".digital-clock .time-wrapper .hour").innerHTML = `${
    isPersianCharacter ? NumbersToPersian(hour) : hour
  }:${isPersianCharacter ? NumbersToPersian(min) : min}`;
  sl(".digital-clock .time-wrapper .second").innerHTML = `:${
    isPersianCharacter ? NumbersToPersian(sec) : sec
  }`;
  sl(".digital-clock .time-wrapper .minutes").innerHTML = `${midday}`;
}
function updateTime(k) {
  if (k < 10) {
    return "0" + k;
  } else {
    return k;
  }
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function fetchMarketPrices() {
  const isFa = checkPersianCharacters(localStorage.getItem("last_search"));
  try {
    const response = await fetch(
      "https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt&dstCurrency=rls"
    );
    const data = await response.json();

    if (data && data.stats && data.stats["usdt-rls"]) {
      const usdtPrice = data.stats["usdt-rls"].latest;
      updatePriceWidget(usdtPrice);
    }
  } catch (error) {
    console.error("Error fetching market prices:", error);
    sl(".usdt-price").innerHTML = isFa ? "خطا" : "error";
  }
}

async function fetchGoldPrices() {
  const isFa = checkPersianCharacters(localStorage.getItem("last_search"));
  try {
    const response = await fetch(
      "https://api.wallgold.ir/api/v1/price?symbol=GLD_18C_750TMN&side=buy"
    );
    const data = await response.json();

    if (data && data.success && data.result && data.result.price) {
      sl(".gold-price").innerHTML = formatNumber(data.result.price);
    }
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    sl(".gold-price").innerHTML = isFa ? "خطا" : "error";
  }
}

function updatePriceWidget(usdtPrice) {
  if (!usdtPrice) {
    sl(".usdt-price").innerHTML = "N/A";
    return;
  }

  const formattedUsdtPrice = formatNumber(Math.round(usdtPrice / 10));
  sl(".usdt-price").innerHTML = formattedUsdtPrice;

  const stored = localStorage.getItem("usdt_price_24h");
  let storedData = null;

  if (stored) {
    try {
      storedData = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored price:", e);
    }
  }

  const now = new Date().getTime();
  const widget = sl(".usdt-price-widget");

  if (storedData && storedData.timestamp) {
    const hoursPassed = (now - storedData.timestamp) / (1000 * 60 * 60);

    if (hoursPassed >= 24) {
      const oldPrice = storedData.price;

      widget.classList.remove("price-up", "price-down");

      if (usdtPrice > oldPrice) {
        widget.classList.add("price-up");
      } else if (usdtPrice < oldPrice) {
        widget.classList.add("price-down");
      }

      localStorage.setItem(
        "usdt_price_24h",
        JSON.stringify({ price: usdtPrice, timestamp: now })
      );
    }
  } else {
    localStorage.setItem(
      "usdt_price_24h",
      JSON.stringify({ price: usdtPrice, timestamp: now })
    );
  }
}

function onPortalModalClose() {
  document.body.classList.remove("blur");
  sl(".portal-model").classList.remove("active");
}

function onContentLoaded() {
  sl("main .weather .bottom-overlay span.internet-speed").classList.add("error");
  setTimeout(() => {
    InitiateSpeedDetection();
  }, 400);
  searchWeather(localStorage.getItem("last_search") || "Liverpool", false);

  fetchMarketPrices();

  fetchGoldPrices();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js", { scope: "/sc-weather/" })
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  }
}

setInterval(() => {
  fetchMarketPrices();
  fetchGoldPrices();
}, 1800000); // half a hour

const inputEl = sl("main header form.search input");
const colorEL = document.getElementById("favcolor");
const mapOpacityRangeEl = document.getElementById("mapOpacity");
window.addEventListener("click", onWindowClick);
inputEl.addEventListener("keydown", onInputKeydown);
inputEl.addEventListener("focus", () => {
  sl("main header .city-list-wrapper").classList.add("active");
});
inputEl.addEventListener("blur", () => {
  setTimeout(() => {
    sl("main header .city-list-wrapper").classList.remove("active");
  }, 100);
});
colorEL.addEventListener("input", handleChangeColor, false);
mapOpacityRangeEl.addEventListener("input", handleMapOpacityChange, false);
sl(".portal-model .close").addEventListener("click", onPortalModalClose);
sl("main header button.full-screen").addEventListener(
  "click",
  onFullScreenClick
);
sl("main header button.setting-button").addEventListener(
  "click",
  onSettingButtonClick
);
sl(".portal-settings .reset").addEventListener(
  "click",
  onSettingResetButtonClick
);
sl(".portal-settings .submit").addEventListener(
  "click",
  onSettingSubmitButtonClick
);
els.fScreen.addEventListener("input", handleFullScreenImageChange, false);
sl(
  "main .weather .map-overlay .content-wrapper .weather-data .info"
).addEventListener("mousemove", handleMouseMoveOnInfo, false);
document.addEventListener("fullscreenchange", onFullScreenChange);
window.addEventListener("DOMContentLoaded", onContentLoaded);
setInterval(currentTime, 1000);
