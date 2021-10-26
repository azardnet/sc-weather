    import './style.scss';
    const KEY = process.env.KEY;
    const inputEl = document.querySelector("main header form.search input");
    const colorEL = document.getElementById("favcolor");
    const mapOpacityRangeEl = document.getElementById("mapOpacity");
    const REQUEST_INTERVAL = 45 * (60 * 1000); // 45 minutes
    const LOADING_DELAY = 800; // ms
    let cacheData = {lat: 53.4106, lon: -2.9779};
    const translate = {
        fa: {
            Clear: "صاف",
            Clouds: "ابری",
            Rain: "بارانی",
            Thunderstorm: "رعد و برق",
            Snow: "برفی",
        }
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
        document.querySelector(".map-overlay .bottom").style.backgroundColor = color;
        document.querySelector(".map-overlay .cover").style.backgroundColor = color;
    }

    function changeMapOpacity(value) {
        document.querySelector(".map-overlay .cover").style.opacity = value/100;
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
                document.querySelector("main header").classList.add("rtl");
                inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
            } else {
                document.querySelector("main header").classList.remove("rtl");
                inputEl.placeholder = "type City and hit Enter";
            }
        }
        if (event.key === "Enter") {
            event.preventDefault();
            if (inputEl.value.length < 22 && inputEl.value.length > 1) {
                loading();
                searchWeather(inputEl.value, false);
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
            document.querySelector("main form.color input").value = color;
            changeColor(color);
            if (isPersianCharacter) {
                document.querySelector("main .weather .map-overlay .content-wrapper").classList.add("rtl");
                document.querySelector("main header").classList.add("rtl");
                inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
            } else {
                document.querySelector("main .weather .map-overlay .content-wrapper").classList.remove("rtl");
                document.querySelector("main header").classList.remove("rtl");
                inputEl.placeholder = "type City and hit Enter";
            }
        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${KEY}&units=metric`).then(result => {
            return result.json();
        }).then(result => {
            computeUI(result, city, interval);
        }).catch(() => {
            alert('request fail');
        });
    }

    function loaded() {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, LOADING_DELAY);
    }

    function loading() {
        document.body.classList.remove('loaded');
        document.body.classList.add('loading');
    }

    function createMap(lat, lon) {
        document.querySelector("main .weather #map").innerHTML = "";
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
            localStorage.setItem("last_search", isPersianCharacter ? city : result.name);
            cacheData.lat = result.coord.lat;
            cacheData.lon = result.coord.lon;
            createMap(result.coord.lat, result.coord.lon);
            document.querySelector("main .weather .map-overlay .content-wrapper h1 b").innerHTML = isPersianCharacter ? city : result.name;
            document.querySelector("main header form.search input").focus();
            const flagImage = require(`./static/flags/${(result.sys.country).toLowerCase()}.svg`);
            // const flagImage = `~static/flags/${(result.sys.country).toLowerCase()}.svg`;
            document.querySelector("main .weather .map-overlay .content-wrapper h1 span").style.backgroundImage = `url('${flagImage}')`;
        }
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temperature .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp.toFixed(1)) : result.main.temp.toFixed(1);
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temperature .unit").innerHTML = "°C";
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .feels_like .text").innerHTML = isPersianCharacter ? "احساس واقعی:" : "Feels Like:";
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .feels_like .value").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.feels_like.toFixed(1)) : result.main.feels_like.toFixed(1);
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .feels_like .unit").innerHTML = "°C";
        // document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .humidity").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.humidity) : result.main.humidity;
        // document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .pressure").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.pressure) : result.main.pressure;
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temp_max").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_max.toFixed(1)) : result.main.temp_max.toFixed(1);
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temp_min").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_min.toFixed(1)) : result.main.temp_min.toFixed(1);
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
        document.querySelector("main .weather").style.marginTop = 0;
        document.querySelector("main .weather").style.position = "absolute";
        document.querySelector("main .weather").style.width = "100%";
        document.querySelector("main .weather").style.height = "calc(100% - 35px)";
        document.querySelector("main .weather").style.right = "0";
        document.querySelector("main .weather").style.top = "35px";
        document.querySelector("main .weather").style.overflow = "hidden";
        document.documentElement.requestFullscreen();
    }

    function onFullScreenChange() {
        if (!((screen.availHeight || screen.height-30) <= window.innerHeight)) {
            document.querySelector('header').style.visibility = 'visible';
            document.querySelector('header').style.opacity = 1;
            document.querySelector("main .weather").style.marginTop = "10px";
            document.querySelector("main .weather").style.position = "relative";
            document.querySelector("main .weather").style.width = "80vh";
            document.querySelector("main .weather").style.height = "calc(80vh + 40px)";
            document.querySelector("main .weather").style.right = "unset";
            document.querySelector("main .weather").style.top = "unset";
            document.querySelector("main .weather").style.overflow = "visible";
            createMap();
        }
    }

    document.querySelector("main header button.full-screen").addEventListener('click', onFullScreenClick);

    setInterval(() => {
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool", true);
    }, REQUEST_INTERVAL);
