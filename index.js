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
const YANDEX_MAP_KEY = process.env.YANDEX_MAP;
const MAP_URL = `https://api-maps.yandex.ru/2.1/?lang=en&amp;apikey=${YANDEX_MAP_KEY}`;
const OPEN_WEATHER_KEY = process.env.OPENWEATHER;
const UNIT = "°C";
const REQUEST_INTERVAL = 45 * (60 * 1000); // 45 minutes
const LOADING_DELAY = 200; // ms
const LOADING_TRANSITION_DELAY = 500; // ms
const PORTAL_MODAL_DELAY = 2500; // 2.5s
const CREATE_MAP_DELAY = 3000; // 3s
const SPEED_DETECTION_DELAY = 15000; // 15s;
const TO_FIXED = 2;
let cacheData = { lat: 53.4106, lon: -2.9779 };
let lastUpdate = new Date();
const CITY_HAVE_IMAGE = [
  {
    name: "liverpool",
    id: 2644210,
    images: [
      {
        photographer: "Neil Martin",
        link: "https://unsplash.com/@anagoge",
      },
      {
        photographer: "Fleur",
        link: "https://unsplash.com/@yer_a_wizard",
      },
      {
        photographer: "Phil Kiel",
        link: "https://unsplash.com/@pk_drone",
      },
    ],
  },
  {
    name: "ahvāz",
    id: 144448,
    images: [
      {
        photographer: "Ashkan Forouzani",
        link: "https://unsplash.com/@ashkfor121",
      },
      {
        photographer: "ariyan Dv",
        link: "https://unsplash.com/@ariyandv",
      },
    ],
  },
  {
    name: "tehran",
    id: 112931,
    images: [
      {
        photographer: "Amirreza Kimiyaei",
        link: "https://unsplash.com/@amirrezakm",
      },
      {
        photographer: "Amirreza Kimiyaei",
        link: "https://unsplash.com/@amirrezakm",
      },
      {
        photographer: "Amirreza Amouie",
        link: "https://unsplash.com/@amuuu",
      },
      {
        photographer: "Khashayar Kouchpeydeh",
        link: "https://unsplash.com/@kouchpeydeh",
      },
      {
        photographer: "fatemeh momtaz",
        link: "https://unsplash.com/@fatemehhmomtazz",
      },
      {
        photographer: "Omid Armin",
        link: "https://unsplash.com/@omidarmin",
      },
    ],
  },
  {
    name: "āmol",
    id: 143534,
    images: [
      {
        photographer: "dash masoud",
        link: "https://unsplash.com/@dashmasoud",
      },
    ],
  },
  {
    name: "bābolsar",
    id: 142358,
    images: [
      {
        photographer: "Mehdi MeSSrro",
        link: "https://unsplash.com/@messrro",
      },
    ],
  },
  {
    name: "rasht",
    id: 118743,
    images: [
      {
        photographer: "Mostafa Yekrangi",
        link: "https://unsplash.com/@mostafa",
      },
      {
        photographer: "Ali Kokab",
        link: "https://unsplash.com/@_alikokab_",
      },
    ],
  },
  {
    name: "isfahan",
    id: 418863,
    images: [
      {
        photographer: "Yasin Abbasi",
        link: "https://unsplash.com/@yasinabbasi",
      },
      {
        photographer: "mostafa meraji",
        link: "https://unsplash.com/@mostafa_meraji",
      },
    ],
  },
  {
    name: "yazd",
    id: 111822,
    images: [
      {
        photographer: "Hasan Almasi",
        link: "https://unsplash.com/@hasanalmasi",
      },
    ],
  },
  {
    name: "amsterdam",
    id: 2759794,
    images: [
      {
        photographer: "Azhar J",
        link: "https://unsplash.com/@azhrjl",
      },
    ],
  },
  {
    name: "tabriz",
    id: 113646,
    images: [
      {
        photographer: "Mohammad Mohammadpour",
        link: "https://unsplash.com/@m_mohammadpour",
      },
    ],
  },
  {
    name: "sari",
    id: 116996,
    images: [
      {
        photographer: "",
        link: "",
      },
      {
        photographer: "Danial soheyli",
        link: "https://unsplash.com/@es1992",
      },
    ],
  },
  {
    name: "Karaj",
    id: 128747,
    images: [
      {
        photographer: "MHossein Hosseini",
        link: "https://unsplash.com/@hosseiin",
      },
    ],
  },
  {
    name: "Torin",
    id: 3165524,
    images: [
      {
        photographer: "cristiano caligaris",
        link: "https://unsplash.com/@cristianocaligaris",
      },
    ],
  },
  {
    name: "London",
    id: 2643743,
    images: [
      {
        photographer: "Benjamin Davies",
        link: "https://unsplash.com/@bendavisual",
      },
    ],
  },
  {
    name: "Dubai",
    id: 292223,
    images: [
      {
        photographer: "ZQ Lee",
        link: "https://unsplash.com/@zqlee",
      },
    ],
  },
  {
    name: "Yerevan",
    id: 616052,
    images: [
      {
        photographer: "Venyamin Koretskiy",
        link: "https://unsplash.com/@bennjeck",
      },
      {
        photographer: "Davit Simonyan",
        link: "https://unsplash.com/@neodavit",
      },
    ],
  },
  {
    name: "Tbilisi",
    id: 611717,
    images: [
      {
        photographer: "Kent Tupas",
        link: "https://unsplash.com/@zplits",
      },
    ],
  },
  {
    name: "Batumi",
    id: 615532,
    images: [
      {
        photographer: "Andrei Miranchuk",
        link: "https://unsplash.com/@manuel_pirate",
      },
    ],
  },
  {
    name: "Seattle",
    id: 5809844,
    images: [
      {
        photographer: "Thom Milkovic",
        link: "https://unsplash.com/@thommilkovic",
      },
    ],
  },
  {
    name: "Abu Dhabi",
    id: 292968,
    images: [
      {
        photographer: "Kevin JD",
        link: "https://unsplash.com/@kevinjd123",
      },
    ],
  },
  {
    name: "Cairo",
    id: 360630,
    images: [
      {
        photographer: "Spencer Davis",
        link: "https://unsplash.com/@spencerdavis",
      },
    ],
  },
  {
    name: "Riyadh",
    id: 108410,
    images: [
      {
        photographer: "ekrem osmanoglu",
        link: "https://unsplash.com/@konevi",
      },
    ],
  },
  {
    name: "Saint Petersburg",
    id: 498817,
    images: [
      {
        photographer: "Hu Chen",
        link: "https://unsplash.com/@huchenme",
      },
    ],
  },
  {
    name: "New York",
    id: 5128581,
    images: [
      {
        photographer: "Thomas Habr",
        link: "https://unsplash.com/@thomashabr",
      },
    ],
  },
  {
    name: "Washington D.C.",
    id: 4140963,
    images: [
      {
        photographer: "Duane Lempke",
        link: "",
      },
    ],
  },
  {
    name: "Strasbourg",
    id: 2973783,
    images: [
      {
        photographer: "Patrick Robert Doyle",
        link: "https://unsplash.com/@teapowered",
      },
    ],
  },
  {
    name: "Santa Monica",
    id: 5393212,
    images: [
      {
        photographer: "Matthew LeJune",
        link: "https://unsplash.com/@matthewlejune",
      },
    ],
  },
  {
    name: "Tokyo",
    id: [1850144, 1850147],
    images: [
      {
        photographer: "Jezael Melgoza",
        link: "https://unsplash.com/@jezar",
      },
    ],
  }, {
    name: "Paris",
    id: [2988507],
    images: [
      {
        photographer: "Chris Karidis",
        link: "https://unsplash.com/@chriskaridis",
      },
    ],
  },
  {
    name: "Anzali Port",
    id: [141679],
    images: [
      {
        photographer: "MohammadReza Jelveh",
        link: "https://unsplash.com/@mrjelveh",
      },
      {
        photographer: "sara moezzi",
        link: "https://unsplash.com/@sara_macha",
      }
    ],
  },
];
const CITY_HAVE_VIDEO = [
  {
    name: "liverpool",
    id: 2644210,
    videos: [
      {
        channel: "Expedia",
        link: "https://www.youtube.com/watch?v=ojrHLXj8GJA",
      },
    ],
  },
];

function activePortalModal(text) {
  document.body.classList.remove("loading");
  document.body.classList.add("loaded");
  document.body.classList.add("blur");
  sl(".portal-model").classList.add("active");
  sl(".portal-model .text").innerHTML = text;
  sl(".portal-model .text").style.color = "#ffffff";
  setTimeout(() => {
    sl(".portal-model").classList.remove("active");
    document.body.classList.remove("blur");
  }, PORTAL_MODAL_DELAY);
}

function changeColor(color) {
  document.body.style.backgroundColor = color;
  sl(".map-overlay .bottom").style.backgroundColor = color;
  sl(".map-overlay .cover").style.backgroundColor = color;
  sl("#favcolor").value = color;
  sl("main header form.search .location-icon svg path").style.fill = color;
  sl("main header form.search .location-icon svg path").style.stroke = color;
  document.documentElement.classList.remove(isLight(color) ? "dark" : "light");
  document.documentElement.classList.add(isLight(color) ? "light" : "dark");
}

function changeMapOpacity(value) {
  sl(".map-overlay .cover").style.opacity = value / 100;
}
const handleChangeColor = debounce(function () {
  changeColor(sl("#favcolor").value);
  localStorage.setItem("color", sl("#favcolor").value);
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
  sl(
    "main .weather .map-overlay .content-wrapper .weather-data .info .last-update"
  ).innerHTML = `${translate[`${isPersianCharacter ? "fa" : "en"}`].lastUpdate
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
      sl("header").classList.add("right");
      sl("header").classList.remove("left");
      inputEl.placeholder = translate.fa.TypeCity;
    } else {
      sl("header").classList.remove("right");
      sl("header").classList.add("left");
      inputEl.placeholder = translate.en.TypeCity;
    }
  }
  if (event.key === "Enter") {
    event.preventDefault();
    sl("main header .city-list-wrapper").classList.remove("active");
    inputEl.blur();
    if (!document.body.classList.contains("blur")) {
      if (inputEl.value.length < 22 && inputEl.value.length > 1) {
        loading();
        setTimeout(() => {
          searchWeather(inputEl.value, false);
        }, 120);
        setTimeout(() => {
          sl(".weather").style.opacity = 1;
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
      sl(".portal-settings .action-wrapper button:nth-of-type(1)").innerText = "تنظیم مجدد";
      sl(".portal-settings .action-wrapper button:nth-of-type(2)").innerText = "ذخیره";
    } else {
      document.body.classList.remove("rtl");
      inputEl.placeholder = "type City and hit Enter";
      sl(".portal-settings .action-wrapper button:nth-of-type(1)").innerText = "Reset";
      sl(".portal-settings .action-wrapper button:nth-of-type(2)").innerText = "Submit";
    }
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lang=${isPersianCharacter ? "fa" : "en"
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
  sl("main").style.display = "flex";
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
  if (CITY_HAVE_VIDEO.find((item) => item.id === result.id)) {
    sl("#video").style.display = "block";
    const source = document.createElement("source");
    const videoSrc = require(`./static/videos/${result.id}.mp4`);
    source.setAttribute("src", videoSrc);
    source.setAttribute("type", "video/mp4");
    sl("#video video").appendChild(source);
    deleteMap();
  } else {
    sl("#video").style.display = "none";
  }
  sl("main .weather .map-overlay").classList.remove("interval");
  sl("main .weather .bottom-overlay .image-copyright").style.display = "none";
  lastUpdate = new Date();
  const isPersianCharacter = checkPersianCharacters(city);
  if (!interval) {
    if (result && city && !result.message) {
      sl("main .weather .map-overlay .content-wrapper h1 b").innerHTML =
        isPersianCharacter ? city : result.name;
      if (result.coord && result.coord.lat) {
        if (!CITY_HAVE_IMAGE.find((item) => {
          if (typeof item.id === "number") {
            return item.id === result.id
          } else {
            return item.id.includes(result.id)
          }
        })) {
          cacheData.lat = result.coord.lat;
          cacheData.lon = result.coord.lon;
          createMap(result.coord.lat, result.coord.lon);
        } else {
          deleteMap();
          const cityData = CITY_HAVE_IMAGE.find((item) => {
            if (typeof item.id === "number") {
              return item.id === result.id
            } else {
              return item.id.includes(result.id)
            }
          });
          const randomNumber = randomIntFromInterval(
            0,
            cityData?.images?.length - 1
          ) || 0;
          const image = require(`./static/image/${cityData.id[0] || cityData.id}-${randomNumber + 1
            }.jpg`);
          if (!CITY_HAVE_VIDEO.find((item) => item.id === result.id)) {
            sl("main .weather").style.backgroundImage = `url(${image})`;
            sl("main .weather .image-copyright").style.display = "block";
            sl("main .weather .image-copyright").innerHTML =
              cityData.images[randomNumber].photographer;
            sl("main .weather .image-copyright").href =
              cityData.images[randomNumber].link;
          } else {
            sl("main .weather .image-copyright").style.display = "none";
            sl(".map-overlay .bottom").style.display = "none";
          }
          loaded();
        }
      }
      if (result.sys && result.sys.country) {
        const flagImage = require(`./static/flags/${result.sys.country.toLowerCase()}.svg`);
        const weatherIcon = require(`./static/icons/openweathermap/${result.weather[0].icon}.svg`);
        sl(
          "main .weather .map-overlay .content-wrapper h1 span"
        ).style.backgroundImage = `url("${flagImage}")`;
        sl(
          "main .weather .map-overlay .content-wrapper .weather-data .current-weather-icon div.svg-icon"
        ).style.backgroundImage = `url("${weatherIcon}")`;
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
      sl(".city-list-wrapper").innerHTML = lastSearchHtmlItems;
      localStorage.setItem("last_search", JSON.stringify(lastSearchList));
      const cityListItems = document.querySelectorAll(".city-list-wrapper li");
      for (let i = 0; i < cityListItems.length; i++) {
        cityListItems[i].addEventListener("click", (event) => {
          loading();
          sl("main header form.search input").value =
            event.target.innerHTML || "Liverpool";
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
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .temperature .value"
    ).innerHTML = isPersianCharacter
        ? NumbersToPersian(result.main.temp.toFixed(TO_FIXED))
        : result.main.temp.toFixed(TO_FIXED);
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .temperature .unit"
    ).innerHTML = UNIT;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .feels_like .text"
    ).innerHTML = translate[isPersianCharacter ? "fa" : "en"].FeelsLike;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .feels_like .value"
    ).innerHTML = isPersianCharacter
        ? NumbersToPersian(result.main.feels_like.toFixed(TO_FIXED))
        : result.main.feels_like.toFixed(TO_FIXED);
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .feels_like .unit"
    ).innerHTML = UNIT;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .wind-speed .text"
    ).innerHTML = translate[isPersianCharacter ? "fa" : "en"].WindSpeed;
    sl(
      "main .weather .map-overlay .content-wrapper .weather-data .wind-speed .value"
    ).innerHTML = isPersianCharacter
        ? `${NumbersToPersian(result.wind.speed.toFixed(TO_FIXED))} <span>${translate.fa.WindSpeedUnit
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
    sl(".map-overlay .bottom").style.display = "none";
    sl("main .weather").style.marginTop = "0px";
    sl("main .weather").style.width = "100vw";
    sl("main .weather").style.height = "100vh";
  } else {
    sl("main .weather").style.width = "calc(100vw - 160px)";
    sl("main .weather").style.height = "calc(100vh - 110px)";
  }
  document.documentElement.requestFullscreen();
}

function onSettingButtonClick() {
  sl(".portal-settings").style.visibility = "visible";
  sl(".portal-settings").style.opacity = 1;
  sl("main").style.filter = "blur(20px)";
  sl("#fullScreenImage").checked = localStorage.getItem("fsi") === "true";
  sl("#mapOpacity").value = localStorage.getItem("opacity") * 1;
}

function onSettingResetButtonClick() {
  changeColor("#072322");
  changeMapOpacity("90");
  sl("main").style.filter = "blur(0px)";
  sl(".portal-settings").style.visibility = "hidden";
  sl(".portal-settings").style.opacity = 0;
  localStorage.setItem("color", "#072322");
  localStorage.setItem("opacity", "90");
  localStorage.setItem("fsi", "false");
  sl("#fullScreenImage").checked = false;
  sl("#mapOpacity").value = 90;
}

function onSettingSubmitButtonClick() {
  sl("main").style.filter = "blur(0px)";
  sl(".portal-settings").style.visibility = "hidden";
  sl(".portal-settings").style.opacity = 0;
}

function onWindowClick(e) {
  if (
    !sl(".portal-settings").contains(e.target) &&
    !sl(".setting-button").contains(e.target)
  ) {
    sl("main").style.filter = "blur(0px)";
    sl(".portal-settings").style.visibility = "hidden";
    sl(".portal-settings").style.opacity = 0;
  }
}

function onFullScreenChange() {
  if (!document.fullscreenElement) {
    sl("header").style.display = "flex";
    sl(".map-overlay .bottom").style.display = "flex";
    sl("main .weather").style.marginTop = "10px";
    sl("main .weather").style.width = "80vw";
    sl("main .weather").style.height = "calc(80vh + 40px)";
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
  sl(".digital-clock .time-wrapper .hour").innerHTML = `${isPersianCharacter ? NumbersToPersian(hour) : hour
    }:${isPersianCharacter ? NumbersToPersian(min) : min}`;
  sl(".digital-clock .time-wrapper .second").innerHTML = `:${isPersianCharacter ? NumbersToPersian(sec) : sec
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

function onPortalModalClose() {
  document.body.classList.remove("blur");
  sl(".portal-model").classList.remove("active");
}

function onContentLoaded() {
  sl("main .weather .bottom-overlay span").classList.add("error");
  setTimeout(() => {
    InitiateSpeedDetection();
  }, 400);
  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log("test geo location", position);
  //   });
  // }
  // sl("#video video").addEventListener("loadeddata", (e) => {
  //   console.log("readyState", sl("#video video").readyState);
  // });
  searchWeather(localStorage.getItem("last_search") || "Liverpool", false);
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
sl("#fullScreenImage").addEventListener(
  "input",
  handleFullScreenImageChange,
  false
);
sl(
  "main .weather .map-overlay .content-wrapper .weather-data .info"
).addEventListener("mousemove", handleMouseMoveOnInfo, false);
// sl("main header form.search .location-icon").addEventListener("click", () => {
//   alert("Not yet :(");
// });
document.addEventListener("fullscreenchange", onFullScreenChange);
window.addEventListener("DOMContentLoaded", onContentLoaded);
setInterval(currentTime, 1000);
