const imageLink = ["https://top.4896.top/l.jpg", "https://top.4896.top/l.jpg"];
const downloadSize = 219894.53125; // bytes
const NUMBER_ANIMATION_SPEED = 8;
let lastNumber;

function sl(selector) {
    return document.querySelector(selector);
}

function NumbersToPersian(text) {
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
};

function checkPersianCharacters(string) {
    const PersianCharactersRange = /^[\u0600-\u06FF\s]+$/;
    if (PersianCharactersRange.test(string)) return true;
    return false;
};

function createJsFile(url) {
    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    document.body.appendChild(script);
}

function checkExistJsFile(filename) {
    let result = false;
    const allScriptFile = document.querySelectorAll('script');
    for (let i = 0; i < allScriptFile.length; i++) {
        result = allScriptFile[i].src.includes(filename);
    }
    return result;
}

function deleteMap() {
    sl("main .weather #map").innerHTML = "";
}

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function startNumberAnimation(selector, start, end, unit) {
    increaseNumber(start, end, sl(selector), unit);
  }
  
  function increaseNumber(start, end, el, unit) {
    if (start <= end) {
      el.innerHTML = `${start.toFixed(2)} ${unit}`;
      setTimeout(() => {
        increaseNumber(start + 1, end, el, unit);
      }, NUMBER_ANIMATION_SPEED);
      setTimeout(() => {
            if (start > end) { 
                el.innerHTML = `${end.toFixed(2)} ${unit}`;
                return false;
            }
    }, 1000);
    } else {
        el.innerHTML = `${end.toFixed(2)} ${unit}`;
        return false;
    }
  };

export function MeasureConnectionSpeed() {
    let startTime, endTime;
    const download = new Image();
    download.onload = () => {
        sl("main .weather .bottom-overlay span").className = "";
        endTime = (new Date()).getTime();
        showResults();
    }
    
    download.onerror = () => {
        sl("main .weather .bottom-overlay span").className = "error";
    }
    
    startTime = (new Date()).getTime();
    const cacheBuster = `?d=${startTime}`;
    download.src = imageLink[randomIntFromInterval(0, (imageLink.length -1))] + cacheBuster;
    function showResults() {
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = downloadSize * 8;
        const speedBps = (bitsLoaded / duration).toFixed(2);
        const speedKbps = ((speedBps / 1024).toFixed(2)) * 1;
        const speedMbps = ((speedKbps / 1024).toFixed(2)) * 1;
        sl("main .weather .bottom-overlay span").className = "loaded";
        const result = speedKbps/1024 > 1.24 ? speedMbps : speedKbps;
        setTimeout(() => {
            startNumberAnimation("main .weather .bottom-overlay span", lastNumber, result, (speedKbps/1024 > 1.24) ? "Mb/s" : "Kb/s");
            setTimeout(() => {
                sl("main .weather .bottom-overlay span").classList.remove(lastNumber > result*1 ? "top" : "down");
                sl("main .weather .bottom-overlay span").classList.add(lastNumber > result*1 ? "down" : "top");
                lastNumber = result - 1;
            }, 250);
        }, 150);
    }
}

export function InitiateSpeedDetection() {
    sl("main .weather .bottom-overlay span").className = "loading";
    setTimeout(MeasureConnectionSpeed, 10);
};

export function setStorage(key, data) {
    return localStorage.setItem(key, JSON.stringify(data));
}

export function getStorage(key) {
    return JSON.parse(localStorage.setItem(key));
}



export { sl, NumbersToPersian, debounce, checkPersianCharacters, createJsFile, checkExistJsFile, deleteMap }