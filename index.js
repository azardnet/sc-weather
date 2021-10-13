    const KEY = "dc996f609fa04ff24b36fd4c031ade1c";
    const inputEl = document.querySelector("main header form.search input");
    const colorEL = document.getElementById("favcolor");
    const mapOpacityRangeEl = document.getElementById("mapOpacity");

    function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        var context = this, args = arguments;
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
            if (check(event.key)) {
                document.querySelector("main header form.search").classList.add("rtl");
                inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
            } else {
                document.querySelector("main header form.search").classList.remove("rtl");
                inputEl.placeholder = "type City and hit Enter";
            }
        }
        if (event.key === "Enter") {
            event.preventDefault();
            if (inputEl.value.length < 22) {
                searchWeather(inputEl.value);
            } else {
                alert('invalid city');
            }
        }
    });

    function check(string) {
    const p = /^[\u0600-\u06FF\s]+$/;
    if (p.test(string)) return true;
    return false;
    }

    function searchWeather(city) {
        const color = localStorage.getItem("color") || "#072322";
        document.querySelector("main form.color input").value = color; 
        document.querySelector("main .weather #map").innerHTML = "";
        changeColor(color);
        if (check(city)) {
            document.querySelector("main .weather .map-overlay .content-wrapper h1").classList.add("rtl");
            document.querySelector("main header form.search").classList.add("rtl");
            inputEl.placeholder = "اسم شهر را وارد کنید و Enter بزنید."
        } else {
            document.querySelector("main .weather .map-overlay .content-wrapper h1").classList.remove("rtl");
            document.querySelector("main header form.search").classList.remove("rtl");
            inputEl.placeholder = "type City and hit Enter";
        }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${KEY}&units=metric`).then(result => {
        return result.json();
    }).then(result => {
        localStorage.setItem("last_search", city);
        ymaps.ready(function () {
        new ymaps.Map('map', {
                center: [result.coord.lat, result.coord.lon],
                zoom: 10.5,
                controls: []
            }) 
        });
        document.querySelector("main .weather .map-overlay .content-wrapper h1 b").innerHTML = city;
        document.querySelector("main .weather .map-overlay .content-wrapper h1 span").style.backgroundImage = `url('./flags/${(result.sys.country).toLowerCase()}.svg')`;
        document.querySelector("main header form.search input").focus();
        }).catch(() => {
            alert('request fail');
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        searchWeather(localStorage.getItem("last_search") ||  "Liverpool");
    });