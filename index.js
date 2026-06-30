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
  els.mOverlayC.style.opacity = (value / 100) * 1;
}
function changeAnimationDuration(value) {
  els.NewsC.style["animation-duration"] = `${value}s`;
  els.TgjuC.style["animation-duration"] = `${value}s`;
}
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

const handleMouseMoveOnInfo = () => {
  const isPersianCharacter = checkPersianCharacters(
    localStorage.getItem("last_search"),
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
      els.input.placeholder = translate.fa.TypeCity;
    } else {
      els.header.classList.remove("right");
      els.header.classList.add("left");
      els.input.placeholder = translate.en.TypeCity;
    }
  }
  if (event.key === "Enter") {
    event.preventDefault();
    els.cList.classList.remove("active");
    els.input.blur();
    if (!document.body.classList.contains("blur")) {
      if (els.input.value.length < 22 && els.input.value.length > 1) {
        loading();
        setTimeout(() => {
          searchWeather(els.input.value, false);
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
    const animationDuration =
      localStorage.getItem("animation-duration") || "120";
    changeColor(color);
    changeMapOpacity(opacity);
    changeAnimationDuration(animationDuration);
    // els.animationD.value = animationDuration * 1;
    if (isPersianCharacter) {
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
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lang=${
      isPersianCharacter ? "fa" : "en"
    }&q=${cityNameParam}&APPID=${OPEN_WEATHER_KEY}&units=metric`,
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
    }, LOADING_DELAY);
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
          localStorage.getItem("last_search") || DEFAILT_CITY,
        )
          ? translate.fa.ErrorLoadMap
          : translate.en.ErrorLoadMap,
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
    const randomNumber =
      randomIntFromInterval(0, cityVideoData.videos?.length) || 1;
    const lastVideoIndexKey = `last_video_index_${result.id}`;
    let currentVideoIndex = parseInt(
      localStorage.getItem(lastVideoIndexKey) || "0",
      10,
    );
    currentVideoIndex = (currentVideoIndex + 1) % videoCount;
    localStorage.setItem(lastVideoIndexKey, currentVideoIndex.toString());
    const source = document.createElement("source");
    let videoSrc;
    videoSrc = require(`./static/videos/${result.id}-${randomNumber}.mp4`);
    source.setAttribute("src", videoSrc);
    source.setAttribute("type", "video/mp4");
    els.videoV.appendChild(source);
    els.videoV.load();
    els.videoV.play().catch(() => {});
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
  const isPersianCharacter = checkPersianCharacters(city);
  if (!interval) {
    if (result && city && !result.message) {
      els.mOverlayTitle.innerHTML = isPersianCharacter ? city : result.name;
      if (result.coord && result.coord.lat) {
        const hasVideo = CITY_HAVE_VIDEO.find((item) => item.id === result.id);
        if (hasVideo) {
          deleteMap();
          els.mOverlayB.style.display = "none";
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
          const image = require(
            `./static/image/${
              cityData.id[0] || cityData.id
            }-${randomNumber + 1}.jpg`,
          );
          els.weather.style.backgroundImage = `url(${image})`;
          els.mOverlayB.style.display = "flex";
          loaded();
        }
      }
      if (result.sys && result.sys.country) {
        const flagImage = require(
          `./static/flags/${result.sys.country.toLowerCase()}.svg`,
        );
        const weatherIcon = require(
          `./static/icons/openweathermap/${result.weather[0].icon}.svg`,
        );
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
          els.input.value = event.target.innerHTML || DEFAILT_CITY;
          searchWeather(event.target.innerHTML || DEFAILT_CITY, false);
        });
      }
    } else if (result && result.message && city) {
      loaded();
      activePortalModal(
        checkPersianCharacters(city)
          ? translate.fa.CityNotFound
          : translate.en.CityNotFound,
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
    els.wWindT.innerHTML =
      translate[isPersianCharacter ? "fa" : "en"].WindSpeed;
    els.wWindV.innerHTML = isPersianCharacter
      ? `${NumbersToPersian(result.wind.speed.toFixed(TO_FIXED))} <span>${
          translate.fa.WindSpeedUnit
        }</span>`
      : `${result.wind.speed.toFixed(TO_FIXED)} ${translate.en.WindSpeedUnit}`;
    els.wCurrentI.innerHTML = result.weather[0].description;
    els.wMaxV.innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.temp_max.toFixed(TO_FIXED))
      : result.main.temp_max.toFixed(TO_FIXED);
    els.wMaxU.innerHTML = UNIT;
    els.wMinV.innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.temp_min.toFixed(TO_FIXED))
      : result.main.temp_min.toFixed(TO_FIXED);
    els.wMinU.innerHTML = UNIT;
    els.wHumidityV.innerHTML = isPersianCharacter
      ? NumbersToPersian(result.main.humidity)
      : result.main.humidity;
    setTimeout(() => {
      els.mOverlay.classList.add("interval");
    }, 250);
  }
}

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
  els.mOpacity.value = localStorage.getItem("opacity") * 1 || 90;
  els.animationD.value = localStorage.getItem("animation-duration") * 1 || 160;
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
    if (
      !CITY_HAVE_IMAGE.find(
        (item) => item.id === localStorage.getItem("last_search_id") * 1,
      )
    ) {
      createMap();
    }
  }
}

setInterval(() => {
  searchWeather(localStorage.getItem("last_search") || DEFAILT_CITY, true);
}, REQUEST_INTERVAL);

setInterval(() => {
  MeasureConnectionSpeed();
}, SPEED_DETECTION_DELAY);

function currentTime() {
  const city = localStorage.getItem("last_search") || DEFAILT_CITY;
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
  els.dClockH.innerHTML = `${
    isPersianCharacter ? NumbersToPersian(hour) : hour
  }:${isPersianCharacter ? NumbersToPersian(min) : min}`;
  els.dClockS.innerHTML = `:${
    isPersianCharacter ? NumbersToPersian(sec) : sec
  }`;
  els.dClockM.innerHTML = `${midday}`;
  els.dateW.innerHTML = ` ${date.toLocaleDateString('fa-ir', {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'  })} `
}

async function fetchNews() {
  try {
    const response = await fetch("https://azard.net/get/");
    const data = await response.json();

    if (data && data.data) {
      const newsText = data?.data
        ?.map((item) => {
          return `${item.source}: ${item.title}`;
        })
        .join("  \u0020   |    \u0020  ");
      els.NewsC.innerHTML = newsText;
      const newsLength = newsText.length * 3.41;
      els.NewsC.style.transform = `translate3d(-${newsLength}px, 0px, 0px)`;
      dynamicTranslateKeyframe(
        "news",
        `-${newsLength}px, 0px, 0px`,
        `${newsLength}px, 0px, 0px`,
      );
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

async function fetchMarketPrices() {
  const isFa = checkPersianCharacters(localStorage.getItem("last_search"));
  try {
    const response = await fetch(
      "https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt,btc&dstCurrency=rls,usdt",
    );
    const data = await response.json();

    if (data && data.stats && data.stats["usdt-rls"]) {
      const usdtPrice = data.stats["usdt-rls"].latest;
      const btcPrice = data.stats["btc-usdt"].latest;
      updatePriceWidget(usdtPrice, btcPrice);
    }
  } catch (error) {
    console.error("Error fetching market prices:", error);
    els.usdt.innerHTML = isFa ? "خطا" : "error";
  }
}

async function fetchGoldPrices() {
  const isFa = checkPersianCharacters(localStorage.getItem("last_search"));
  try {
    const response = await fetch("https://azard.net/gold/");
    const data = await response.json();
    // console.log("nwesss", data);

    if (data && data.average) {
      els.gold.innerHTML = formatNumber(data.average);
    } else {
      els.gold.innerHTML = isFa ? "خطا" : "error";
    }

    // if (data && data.tgju && data.tgju.current && data.tgju.current.nim) {
    //   const priceText = `نیم‌سکه: ${NumbersToPersian(formatNumber((data.tgju.current.nim.h.split(",").join("") * 1) / 10))} | تمام سکه: ${NumbersToPersian(formatNumber((data.tgju.current.sekee_real.h.split(",").join("") * 1) / 10))}`;
    //   const PriceLength = priceText.length * 3.41;
    //   els.TgjuC.style.transform = `translate3d(-${PriceLength}px, 0px, 0px)`;
    //   dynamicTranslateKeyframe(
    //     "price",
    //     `-${PriceLength}px, 0px, 0px`,
    //     `${PriceLength}px, 0px, 0px`,
    //   );
    //   els.TgjuC.innerHTML = priceText;
    // }
  } catch (error) {
    try {
      const response = await fetch(
        "https://api.wallgold.ir/api/v1/price?symbol=GLD_18C_750TMN&side=buy",
      );
      const data = await response.json();

      if (data && data.result && data.result.price) {
        els.gold.innerHTML = formatNumber(data.result.price);
      } else {
        els.gold.innerHTML = isFa ? "خطا" : "error";
      }
    } catch (error) {
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

  const formattedUsdtPrice = formatNumber(Math.round(usdtPrice / 10));
  const formattedBtctPrice = formatNumber(btcPrice);
  els.usdt.innerHTML = formattedUsdtPrice;
  els.btct.innerHTML = formattedBtctPrice;
}

function onPortalModalClose() {
  document.body.classList.remove("blur");
  els.pModal.classList.remove("active");
}

function onContentLoaded() {
  els.ISpeed.classList.add("error");
  setTimeout(() => {
    InitiateSpeedDetection();
  }, 400);
  searchWeather(localStorage.getItem("last_search") || DEFAILT_CITY, false);

  fetchMarketPrices();

  fetchGoldPrices();
  fetchNews();

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
  fetchNews();
}, 500000);

window.addEventListener("click", onWindowClick);
els.input.addEventListener("keydown", onInputKeydown);
els.input.addEventListener("focus", () => {
  els.cList.classList.add("active");
});
els.input.addEventListener("blur", () => {
  setTimeout(() => {
    els.cList.classList.remove("active");
  }, 100);
});
els.fColor.addEventListener("input", handleChangeColor, false);
els.mOpacity.addEventListener("input", handleMapOpacityChange, false);
els.animationD.addEventListener("input", handleAnimationDurationChange, false);
els.pModalC.addEventListener("click", onPortalModalClose);
els.FScreen.addEventListener("click", onFullScreenClick);
els.sButton.addEventListener("click", onSettingButtonClick);
els.Sreset.addEventListener("click", onSettingResetButtonClick);
els.SSubmit.addEventListener("click", onSettingSubmitButtonClick);
els.fScreen.addEventListener("input", handleFullScreenImageChange, false);
els.Winfo.addEventListener("mousemove", handleMouseMoveOnInfo, false);
document.addEventListener("fullscreenchange", onFullScreenChange);
window.addEventListener("DOMContentLoaded", onContentLoaded);
setInterval(currentTime, 1000);
