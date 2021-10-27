    import './style.scss';
    const KEY = process.env.KEY;
    const UNIT = "°C";
    const inputEl = sl("main header form.search input");
    const colorEL = document.getElementById("favcolor");
    const mapOpacityRangeEl = document.getElementById("mapOpacity");
    const REQUEST_INTERVAL = 45 * (60 * 1000); // 45 minutes
    const LOADING_DELAY = 800; // ms
    const TO_FIXED = 2;
    let cacheData = {lat: 53.4106, lon: -2.9779};
    const translate = {
        fa: {
            Clear: "صاف",
            Clouds: "ابری",
            Rain: "بارانی",
            Thunderstorm: "رعد و برق",
            Snow: "برفی",
            FeelsLike: "دمایی که احساس می‌شود",
        }
    }

    function sl(selector) {
        return document.querySelector(selector);
    }

    const NumbersToPersian = (text) => {
        const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
        if (text === 0) {
            return "۰"
        } else {
            return text && text.toString()
                .replace(/\d/g, (char) => farsiDigits[char]);
        }
    };
    
    function debounce(func, wait, immediate) {
    let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }

    function changeColor(color) {
        document.body.style.backgroundColor = color;
        sl(".map-overlay .bottom").style.backgroundColor = color;
        sl(".map-overlay .cover").style.backgroundColor = color;
    }

    function changeMapOpacity(value) {
        sl(".map-overlay .cover").style.opacity = value/100;
    }
    const handleChangeColor = debounce(function() {
        changeColor(colorEL.value);
        localStorage.setItem("color", colorEL.value);
    }, 20);

    const handleMapOpacityChange = debounce(function() {
        changeMapOpacity(mapOpacityRangeEl.value)
    }, 20);


    colorEL.addEventListener("input", handleChangeColor, false);

    mapOpacityRangeEl.addEventListener("input", handleMapOpacityChange, false);

    inputEl.addEventListener('keydown', (event) => {
        if (event.code !== "Backspace" && event.key !== "Control" && event.key !== "Alt" && event.key !== "Shift" &&
        event.key !== "CapsLock" && event.key !== "Tab" && event.code !== "Space") {
            if (checkPersianCharacters(event.key)) {
                sl("main header").classList.add("rtl");
                inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
            } else {
                sl("main header").classList.remove("rtl");
                inputEl.placeholder = "type City and hit Enter";
            }
        }
        if (event.key === "Enter") {
            event.preventDefault();
            if (inputEl.value.length < 22 && inputEl.value.length > 1) {
                loading();
                searchWeather(inputEl.value, false);
                setTimeout(() => {
                    sl(".weather").style.opacity = 1;
                }, LOADING_DELAY);
            } else {
                alert('invalid city');
            }
        }
    });

    function checkPersianCharacters(string) {
        const PersianCharactersRange = /^[\u0600-\u06FF\s]+$/;
        if (PersianCharactersRange.test(string)) return true;
        return false;
    }
    
    function searchWeather(city, interval) {
        if (!interval) {
            const isPersianCharacter = checkPersianCharacters(city);
            const color = localStorage.getItem("color") || "#072322";
            sl("main form.color input").value = color;
            changeColor(color);
            if (isPersianCharacter) {
                sl("main .weather .map-overlay .content-wrapper").classList.add("rtl");
                sl("main header").classList.add("rtl");
                inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
            } else {
                sl("main .weather .map-overlay .content-wrapper").classList.remove("rtl");
                sl("main header").classList.remove("rtl");
                inputEl.placeholder = "type City and hit Enter";
            }
        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${KEY}&units=metric`).then(result => {
            return result.json();
        }).then(result => {
            computeUI(result, city, interval);
        }).catch(() => {
            alert('request fail');
            sl(".weather").style.opacity = 0;
            loaded(false);
        });
    }

    function loaded(delay = true) {
        if (delay) {
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, LOADING_DELAY);
        } else {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }
    }

    function loading() {
        document.body.classList.remove('loaded');
        document.body.classList.add('loading');
    }

    function createMap(lat, lon) {
        sl("main .weather #map").innerHTML = "";
        try {
            ymaps.ready(function () {
                new ymaps.Map('map', {
                        center: (lat && lon) ? [lat, lon] : [cacheData.lat, cacheData.lon],
                        zoom: 10.5,
                        controls: []
                });
                    loaded();
                });
        } catch (error) {
            
        }
    }

    function computeUI(result, city, interval) {
        const isPersianCharacter = checkPersianCharacters(city);
        if (!interval) {
            if (result && result.cod === 200 && city) {
                cacheData.lat = result.coord.lat;
                cacheData.lon = result.coord.lon;
                createMap(result.coord.lat, result.coord.lon);
                sl("main .weather .map-overlay .content-wrapper h1 b").innerHTML = isPersianCharacter ? city : result.name;
                sl("main header form.search input").focus();
                const flagImage = require(`./static/flags/${(result.sys.country).toLowerCase()}.svg`);
                sl("main .weather .map-overlay .content-wrapper h1 span").style.backgroundImage = `url('${flagImage}')`;
                localStorage.setItem("last_search", isPersianCharacter ? city : result.name);
            }
        }
        sl("main .weather .map-overlay .content-wrapper .weather-data .temperature .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp.toFixed(TO_FIXED)) : result.main.temp.toFixed(TO_FIXED);
        sl("main .weather .map-overlay .content-wrapper .weather-data .temperature .unit").innerHTML = UNIT;
        sl("main .weather .map-overlay .content-wrapper .weather-data .feels_like .text").innerHTML = isPersianCharacter ? `${translate.fa.FeelsLike}:` : "Feels Like:";
        sl("main .weather .map-overlay .content-wrapper .weather-data .feels_like .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.feels_like.toFixed(TO_FIXED)) : result.main.feels_like.toFixed(TO_FIXED);
        sl("main .weather .map-overlay .content-wrapper .weather-data .feels_like .unit").innerHTML = UNIT;
        // sl("main .weather .map-overlay .content-wrapper .weather-data .humidity").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.humidity) : result.main.humidity;
        // sl("main .weather .map-overlay .content-wrapper .weather-data .pressure").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.pressure) : result.main.pressure;
        sl("main .weather .map-overlay .content-wrapper .weather-data .temp_max .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_max.toFixed(TO_FIXED)) : result.main.temp_max.toFixed(TO_FIXED);
        sl("main .weather .map-overlay .content-wrapper .weather-data .temp_max .unit").innerHTML = UNIT;
        sl("main .weather .map-overlay .content-wrapper .weather-data .temp_min .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_min.toFixed(TO_FIXED)) : result.main.temp_min.toFixed(TO_FIXED);
        sl("main .weather .map-overlay .content-wrapper .weather-data .temp_min .unit").innerHTML = UNIT;
    }

    window.addEventListener('DOMContentLoaded', () => {
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool", false);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js');
          };
    });

    function onFullScreenClick() {
        document.querySelector('header').style.visibility = 'hidden';
        document.querySelector('header').style.opacity = 0;
        sl("main .weather").style.marginTop = "-30px";
        sl("main .weather").style.width = "calc(100vw - 160px)";
        sl("main .weather").style.height = "calc(100vh - 110px)";
        document.documentElement.requestFullscreen();
    }

    function onFullScreenChange() {
            document.querySelector('header').style.visibility = 'visible';
            document.querySelector('header').style.opacity = 1;
            sl("main .weather").style.marginTop = "10px";
            sl("main .weather").style.width = "80vh";
            sl("main .weather").style.height = "calc(80vh + 40px)";
            createMap();
    }

    document.addEventListener('fullscreenchange', (event) => {
        if (!document.fullscreenElement) {
            onFullScreenChange();
        }
      });

    sl("main header button.full-screen").addEventListener('click', onFullScreenClick);

    setInterval(() => {
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool", true);
    }, REQUEST_INTERVAL);

    function currentTime() {
        const date = new Date();
        const day = date.getDay();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let month = date.getMonth();
        let curr_date = date.getDate();
        const year = date.getFullYear();
        const month_name = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        const showDay = document.querySelectorAll(".day__wrapper span");
        let midday = "AM";
        midday = hour >= 12 ? "PM" : "AM";
        hour = hour == 0 ? 12 : hour > 12 ? hour - 12 : hour;
        hour = updateTime(hour);
        min = updateTime(min);
        sec = updateTime(sec);
        curr_date = updateTime(curr_date);
        sl(".digital-clock .time-wrapper .hour").innerHTML = `${hour}:${min}`;
        sl(".digital-clock .time-wrapper .second").innerHTML = `:${sec}`;
        sl(".digital-clock .time-wrapper .minutes").innerHTML = `${midday}`;
        document.querySelector(
          "#full__date"
        ).innerHTML = `${month_name[month]} ${curr_date} ${year}`;
        showDay[day].style.opacity = "1";
      }
      function updateTime(k) {
        if (k < 10) {
          return "0" + k;
        } else {
          return k;
        }
      }
      setInterval(currentTime, 1000);
      