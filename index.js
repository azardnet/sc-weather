    import "./style.scss";
    import { sl, NumbersToPersian, debounce, checkPersianCharacters, createJsFile, checkExistJsFile, deleteMap, randomIntFromInterval, InitiateSpeedDetection, MeasureConnectionSpeed } from "./utils"
    const YANDEX_MAP_KEY = process.env.YANDEX_MAP;
    const MAP_URL = `https://api-maps.yandex.ru/2.1/?lang=en&amp;apikey=${YANDEX_MAP_KEY}`;
    const OPEN_WEATHER_KEY = process.env.OPENWEATHER;
    const UNIT = "°C";
    const REQUEST_INTERVAL = 45 * (60 * 1000); // 45 minutes
    const LOADING_DELAY = 200; // ms
    const LOADING_TRANSITION_DELAY = 500; // ms
    const PORTAL_MODAL_DELAY = 2500; // 2.5s
    const CREATE_MAP_DELAY = 3000; // 3s
    const SPEED_DETECTION_DELAY = 15000 // 15s;
    const TO_FIXED = 2;
    let cacheData = {lat: 53.4106, lon: -2.9779};
    const CITY_HAVE_IMAGE = [{
        name: "liverpool",
        id: 2644210,
        images: [{
            photographer: "Neil Martin",
            link: "https://unsplash.com/@anagoge"
        }, {
            photographer: "Fleur",
            link: "https://unsplash.com/@yer_a_wizard",
        }, {
            photographer: "Phil Kiel",
            link: "https://unsplash.com/@pk_drone",
        }],
    }, {
        name: "ahvāz",
        id: 144448,
        images: [{
            photographer: "Ashkan Forouzani",
            link: "https://unsplash.com/@ashkfor121"
        }],
    },{
        name: "tehran",
        id: 112931,
        images: [{
            photographer: "Amirreza Kimiyaei",
            link: "https://unsplash.com/@amirrezakm"
        }, {
            photographer: "Amirreza Kimiyaei",
            link: "https://unsplash.com/@amirrezakm",
        }],
    },{
        name: "āmol",
        id: 143534,
        images: [{
            photographer: "dash masoud",
            link: "https://unsplash.com/@dashmasoud"
        }],
    },{
        name: "bābolsar",
        id: 142358,
        images: [{
            photographer: "Mehdi MeSSrro",
            link: "https://unsplash.com/@messrro"
        }],
    },{
        name: "rasht",
        id: 118743,
        images: [{
            photographer: "Mostafa Yekrangi",
            link: "https://unsplash.com/@mostafa"
        }, {
            photographer: "Ali Kokab",
            link: "https://unsplash.com/@_alikokab_"
        }],
    }, {
        name: "isfahan",
        id: 418863,
        images: [{
            photographer: "Yasin Abbasi",
            link: "https://unsplash.com/@yasinabbasi"
        }, {
            photographer: "mostafa meraji",
            link: "https://unsplash.com/@mostafa_meraji"
        }],
    }, {
        name: "yazd",
        id: 111822,
        images: [{
            photographer: "Hasan Almasi",
            link: "https://unsplash.com/@hasanalmasi"
        }],
    }, {
        name: "amsterdam",
        id: 2759794,
        images: [{
            photographer: "Azhar J",
            link: "https://unsplash.com/@azhrjl"
        }]
    }, {
        name: "tabriz",
        id: 113646,
        images: [{
            photographer: "Mohammad Mohammadpour",
            link: "https://unsplash.com/@m_mohammadpour"
        }]
    }, {
        name: "Karaj",
        id: 128747,
        images: [{
            photographer: "MHossein Hosseini",
            link: "https://unsplash.com/@hosseiin"
        }]
    }, {
        name: "Torin",
        id: 3165524,
        images: [{
            photographer: "cristiano caligaris",
            link: "https://unsplash.com/@cristianocaligaris"
        }]
    }];
    const CITY_HAVE_VIDEO = [{
        name: "liverpool",
        id: 2644210,
        videos: [{
            channel: "Expedia",
            link: "https://www.youtube.com/watch?v=ojrHLXj8GJA"
        }],
    }];
    const translate = {
        fa: {
            FeelsLike: "دمایی که احساس می‌شود : ",
            CityNotFound: "شهر مورد نظر یافت نشد.",
            TypeCity: "اسم شهر را وارد کنید و Enter بزنید",
            ErrorDownloading: "خطا در دریافت اطلاعات.",
            ErrorLoadMap: "نقشه در حال حاضر در دسترس نیست."
        },
        en: {
            FeelsLike: "Feels Like : ",
            CityNotFound: "City not found.",
            TypeCity: "type City and hit Enter",
            ErrorDownloading: "Error downloading.",
            ErrorLoadMap: "Map is not accessible right now."
        }
    }

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
    }

    function changeMapOpacity(value) {
        sl(".map-overlay .cover").style.opacity = value/100;
    }
    const handleChangeColor = debounce(function() {
        changeColor(sl("#favcolor").value);
        localStorage.setItem("color", sl("#favcolor").value);
    }, 20);

    const handleMapOpacityChange = debounce(function() {
        changeMapOpacity(mapOpacityRangeEl.value);
        localStorage.setItem("opacity", mapOpacityRangeEl.value);
    }, 20);

    const handlefullScreenImageChange = function(event) {
        localStorage.setItem("fsi", event.target.checked);
    };

    function onInputKeydown(event) {
        if (event.code !== "Backspace" && event.key !== "Control" && event.key !== "Alt" && event.key !== "Shift" &&
        event.key !== "CapsLock" && event.key !== "Tab" && event.code !== "Space" && event.key !== "Enter") {
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
        const isPersianCharacter = checkPersianCharacters(city);
        if (!interval) {
            const color = localStorage.getItem("color") || "#072322";
            const opacity = localStorage.getItem("opacity") || "90";
            changeColor(color);
            changeMapOpacity(opacity);
            if (isPersianCharacter) {
                document.body.classList.add("rtl");
                inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
            } else {
                document.body.classList.remove("rtl");
                inputEl.placeholder = "type City and hit Enter";
            }
        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?lang=${isPersianCharacter ? "fa" : "en"}&q=${city}&APPID=${OPEN_WEATHER_KEY}&units=metric`).then(result => {
            return result.json();
        }).then(result => {
            computeUI(result, city, interval);
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
                            center: (lat && lon) ? [lat, lon] : [cacheData.lat, cacheData.lon],
                            zoom: 13,
                            controls: []
                    });
                        loaded();
                    });
            } catch (error) {
                deleteMap();
                loaded();
                activePortalModal(checkPersianCharacters(localStorage.getItem("last_search") ||  "Liverpool") ? translate.fa.ErrorLoadMap : translate.en.ErrorLoadMap);
            }
        }, CREATE_MAP_DELAY);
    }

    function computeUI(result, city, interval) {
        sl("main .weather .map-overlay").classList.remove("interval");
        sl("main .weather .bottom-overlay .image-copyright").style.display = "none";
        const isPersianCharacter = checkPersianCharacters(city);
        if (!interval) {
            if (result && city && !result.message) {
                sl("main .weather .map-overlay .content-wrapper h1 b").innerHTML = isPersianCharacter ? city : result.name;
                if (result.coord && result.coord.lat) {
                    if (!(CITY_HAVE_IMAGE.find((item) => item.id === result.id))) {
                        cacheData.lat = result.coord.lat;
                        cacheData.lon = result.coord.lon;
                        createMap(result.coord.lat, result.coord.lon);
                    } else {
                        deleteMap();
                        const cityData = CITY_HAVE_IMAGE.find((item) => item.id === result.id);
                        const randomNumber = randomIntFromInterval(0,cityData.images.length-1);
                        const image = require(`./static/image/${result.id}-${randomNumber+1}.jpg`);
                        sl("main .weather").style.backgroundImage = `url(${image})`;
                        sl("main .weather .image-copyright").style.display = "block";
                        sl("main .weather .image-copyright").innerHTML = cityData.images[randomNumber].photographer;
                        sl("main .weather .image-copyright").href = cityData.images[randomNumber].link;
                        loaded();
                    }
                }
                if (result.sys && result.sys.country) {
                    const flagImage = require(`./static/flags/${(result.sys.country).toLowerCase()}.svg`);
                    sl("main .weather .map-overlay .content-wrapper h1 span").style.backgroundImage = `url("${flagImage}")`;
                }
                localStorage.setItem("last_search", isPersianCharacter ? city : result.name);
                localStorage.setItem("last_search_id", result.id);
            } else if (result && result.message && city) {
                loaded();
                activePortalModal(checkPersianCharacters(city) ? translate.fa.CityNotFound : translate.en.CityNotFound);
                setTimeout(() => {
                    searchWeather(getStorage("last_search"), false);
                }, 2500);
            }
        }
        if (result && result.main) {
            sl("main .weather .map-overlay .content-wrapper .weather-data .temperature .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp.toFixed(TO_FIXED)) : result.main.temp.toFixed(TO_FIXED);
            sl("main .weather .map-overlay .content-wrapper .weather-data .temperature .unit").innerHTML = UNIT;
            sl("main .weather .map-overlay .content-wrapper .weather-data .feels_like .text").innerHTML = translate[isPersianCharacter ? "fa" : "en"].FeelsLike;
            sl("main .weather .map-overlay .content-wrapper .weather-data .feels_like .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.feels_like.toFixed(TO_FIXED)) : result.main.feels_like.toFixed(TO_FIXED);
            sl("main .weather .map-overlay .content-wrapper .weather-data .feels_like .unit").innerHTML = UNIT;
            sl(".map-overlay .content-wrapper .weather-data .current-weather-icon span").innerHTML = result.weather[0].description;    
            sl("main .weather .map-overlay .content-wrapper .weather-data .temp_max .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_max.toFixed(TO_FIXED)) : result.main.temp_max.toFixed(TO_FIXED);
            sl("main .weather .map-overlay .content-wrapper .weather-data .temp_max .unit").innerHTML = UNIT;
            sl("main .weather .map-overlay .content-wrapper .weather-data .temp_min .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_min.toFixed(TO_FIXED)) : result.main.temp_min.toFixed(TO_FIXED);
            sl("main .weather .map-overlay .content-wrapper .weather-data .temp_min .unit").innerHTML = UNIT;
            sl("main .weather .map-overlay .content-wrapper .weather-data .humidity .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.humidity) : result.main.humidity;
            setTimeout(() => {
                sl("main .weather .map-overlay").classList.add("interval");
            }, 250);
        }
    }

    function onFullScreenClick() {
        sl("header").style.display = 'none';
        if (localStorage.getItem('fsi') === 'true') {
            sl(".map-overlay .bottom").style.display = 'none';
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
        sl("main").style.filter = 'blur(20px)';
        sl("#fullScreenImage").checked = localStorage.getItem('fsi') === 'true';
    }

    function onSettingResetButtonClick() {
        changeColor("#072322");
        changeMapOpacity("90");
        sl("main").style.filter = 'blur(0px)';
        sl(".portal-settings").style.visibility = "hidden";
        sl(".portal-settings").style.opacity = 0;
        localStorage.setItem("color", "#072322");
        localStorage.setItem("opacity", "90");
        sl("#mapOpacity").value = 90;
    }

    function onWindowClick(e) {
        if (!sl(".portal-settings").contains(e.target) && !sl(".setting-button").contains(e.target)) {
            sl("main").style.filter = 'blur(0px)';
            sl(".portal-settings").style.visibility = "hidden";
            sl(".portal-settings").style.opacity = 0;
        }
    }

    function onFullScreenChange() {
        if (!document.fullscreenElement) {
            sl("header").style.display = 'flex';
            sl(".map-overlay .bottom").style.display = 'flex';
            sl("main .weather").style.marginTop = "10px";
            sl("main .weather").style.width = "80vw";
            sl("main .weather").style.height = "calc(80vh + 40px)";
            if (!(CITY_HAVE_IMAGE.find((item) => item.id === localStorage.getItem("last_search_id") * 1))) {
                createMap();
            }
        }
    }

    setInterval(() => {
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool", true);
    }, REQUEST_INTERVAL);

    setInterval(() => {
        MeasureConnectionSpeed();
    }, SPEED_DETECTION_DELAY);

    function currentTime() {
        const city = localStorage.getItem("last_search") ||  "Liverpool";
        const isPersianCharacter = checkPersianCharacters(city);

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
        sl(".digital-clock .time-wrapper .hour").innerHTML = `${isPersianCharacter ? NumbersToPersian(hour) : hour }:${isPersianCharacter ? NumbersToPersian(min) : min}`;
        sl(".digital-clock .time-wrapper .second").innerHTML = `:${isPersianCharacter ? NumbersToPersian(sec) : sec}`;
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
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool", false);
        // if ("serviceWorker" in navigator) {
        //     navigator.serviceWorker.register("/service-worker.js");
        // };
    }

    const inputEl = sl("main header form.search input");
    const colorEL = document.getElementById("favcolor");
    const mapOpacityRangeEl = document.getElementById("mapOpacity");
    window.addEventListener("click", onWindowClick);
    inputEl.addEventListener("keydown", onInputKeydown);
    colorEL.addEventListener("input", handleChangeColor, false);
    mapOpacityRangeEl.addEventListener("input", handleMapOpacityChange, false);
    sl(".portal-model .close").addEventListener("click", onPortalModalClose)    
    sl("main header button.full-screen").addEventListener("click", onFullScreenClick);
    sl("main header button.setting-button").addEventListener("click", onSettingButtonClick);
    sl(".portal-settings button").addEventListener("click", onSettingResetButtonClick);
    sl("#fullScreenImage").addEventListener("input", handlefullScreenImageChange, false);
    document.addEventListener("fullscreenchange", onFullScreenChange);
    window.addEventListener("DOMContentLoaded", onContentLoaded);
    setInterval(currentTime, 1000);