    const KEY = "dc996f609fa04ff24b36fd4c031ade1c";
    const inputEl = document.querySelector("main header form.search input");
    const colorEL = document.getElementById("favcolor");
    const mapOpacityRangeEl = document.getElementById("mapOpacity");

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
                searchWeather(inputEl.value);
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

    function searchWeather(city) {
        const isPersianCharacter = checkPersianCharacters(city);
        const color = localStorage.getItem("color") || "#072322";
        document.querySelector("main form.color input").value = color; 
        document.querySelector("main .weather #map").innerHTML = "";
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

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${KEY}&units=metric`).then(result => {
        return result.json();
    }).then(result => {
        computeUI(result, city);
        }).catch(() => {
            alert('request fail');
        });
    }

    function computeUI(result, city) {
        const isPersianCharacter = checkPersianCharacters(city);
        localStorage.setItem("last_search", isPersianCharacter ? city : result.name);
        ymaps.ready(function () {
        new ymaps.Map('map', {
                center: [result.coord.lat, result.coord.lon],
                zoom: 10.5,
                controls: []
            }) 
        });
        document.querySelector("main .weather .map-overlay .content-wrapper h1 b").innerHTML = isPersianCharacter ? city : result.name;
        document.querySelector("main .weather .map-overlay .content-wrapper h1 span").style.backgroundImage = `url('./flags/${(result.sys.country).toLowerCase()}.svg')`;
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temperature").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp) : result.main.temp;
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .feels_like").innerHTML = isPersianCharacter ? `احساس دما: ${NumbersToPersian(result.main.feels_like)}` : `Feels Like: ${result.main.feels_like}`;
        // document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .humidity").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.humidity) : result.main.humidity;
        // document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .pressure").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.pressure) : result.main.pressure;
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temp_max").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_max) : result.main.temp_max;
        document.querySelector("main .weather .map-overlay .content-wrapper .weather-data .temp_min").innerHTML = isPersianCharacter ? NumbersToPersian(result.main.temp_min) : result.main.temp_min;
        document.querySelector("main header form.search input").focus();
    }

    window.addEventListener('DOMContentLoaded', () => {
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool");
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js');
          }
    });

    let fullScreenMode = false;
    function onFullScreenClick() {
        fullScreenMode = true;
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

    // document.onfullscreenchange = function ( event ) {
    //     console.log('asc', fullScreenMode)
    // };

    // document.addEventListener("keydown", function(event) {
    //     console.log('asc', event);
    //     if (fullScreenMode === true && (event.code === "Escape")) {
    //         document.querySelector('header').style.visibility = 'visible';
    //         document.querySelector('header').style.opacity = 1;
    //         document.querySelector("main .weather").style.marginTop = "10px";
    //         document.querySelector("main .weather").style.position = "relative";
    //         document.querySelector("main .weather").style.width = "80vh";
    //         document.querySelector("main .weather").style.height = "calc(80vh + 40px)";
    //         document.querySelector("main .weather").style.right = "unset";
    //         document.querySelector("main .weather").style.top = "unset";
    //         document.querySelector("main .weather").style.overflow = "visible";
    //         document.exitFullscreen();
    //     }
    // });


    document.querySelector("main header button.full-screen").addEventListener('click', onFullScreenClick)
