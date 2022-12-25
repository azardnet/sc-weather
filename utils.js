const imageLink = ["https://i.ibb.co/8zV6Wfp/liverpool-1.jpg", "https://iili.io/bIoluS.jpg"];
const downloadSize = 219894.53125; // bytes
const NUMBER_ANIMATION_SPEED = 8;
let lastNumber;

export function sl(selector) {
    return document.querySelector(selector);
}

export function NumbersToPersian(text) {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    if (text === 0) {
        return "۰"
    } else {
        return text && text.toString()
            .replace(/\d/g, (char) => farsiDigits[char]);
    }
};

export function debounce(func, wait, immediate) {
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

export function checkPersianCharacters(string) {
    const PersianCharactersRange = /^[\u0600-\u06FF\s]+$/;
    if (PersianCharactersRange.test(string)) return true;
    return false;
};

export function createJsFile(url) {
    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    document.body.appendChild(script);
}

export function checkExistJsFile(filename) {
    let result = false;
    const allScriptFile = document.querySelectorAll('script');
    for (let i = 0; i < allScriptFile.length; i++) {
        result = allScriptFile[i].src.includes(filename);
    }
    return result;
}

export function deleteMap() {
    sl("main .weather #map").innerHTML = "";
}

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function startNumberAnimation(selector, start, end, unit) {
    increaseNumber(start, end, sl(selector), unit);
}
  
export function increaseNumber(start, end, el, unit) {
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
            sl("main .weather .bottom-overlay span").innerHTML = `${result} ${(speedKbps/1024 > 1.24) ? "Mb/s" : "Kb/s"}`
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

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();
  
    if (minutes < 10) {
      minutes = `0${ minutes }`;
    }
  
    if (prefomattedDate) {
      return `${ prefomattedDate } at ${ hours }:${ minutes }`;
    }
  
    if (hideYear) {
      return `${ day }. ${ month } at ${ hours }:${ minutes }`;
    }
    return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
}
export function timeAgo(dateParam) {
    if (!dateParam) {
      return null;
    }
  
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();
  
  
    if (seconds < 5) {
      return 'now';
    } else if (seconds < 60) {
      return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
      return 'about a minute ago';
    } else if (minutes < 60) {
      return `${ minutes } minutes ago`;
    } else if (isToday) {
      return getFormattedDate(date, 'Today');
    } else if (isYesterday) {
      return getFormattedDate(date, 'Yesterday');
    } else if (isThisYear) {
      return getFormattedDate(date, false, true);
    }
  
    return getFormattedDate(date);
}
