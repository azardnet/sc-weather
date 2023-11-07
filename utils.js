const imageLink = [
  "https://gcdnb.pbrd.co/images/9HvWcqF2QKZD.jpg",
  "https://90theme.ir/upload/bIoluS.jpg",
  "https://iili.io/bIoluS.jpg",
];
const downloadSize = 306160; // bytes
const NUMBER_ANIMATION_SPEED = 8;
let lastNumber;

export function sl(selector) {
  return document.querySelector(selector);
}

export function NumbersToPersian(text) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  if (text === 0) {
    return "۰";
  } else {
    return text && text.toString().replace(/\d/g, (char) => farsiDigits[char]);
  }
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

export function checkPersianCharacters(string) {
  const PersianCharactersRange = /^[\u0600-\u06FF\s]+$/;
  if (PersianCharactersRange.test(string)) return true;
  return false;
}

export function createJsFile(url) {
  const script = document.createElement("script");
  script.src = url;
  script.type = "text/javascript";
  document.body.appendChild(script);
}

export function checkExistJsFile(filename) {
  let result = false;
  const allScriptFile = document.querySelectorAll("script");
  for (let i = 0; i < allScriptFile.length; i++) {
    result = allScriptFile[i].src.includes(filename);
  }
  return result;
}

export function deleteMap() {
  sl("main .weather #map").innerHTML = "";
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
}

export function MeasureConnectionSpeed() {
  let startTime, endTime;
  const download = new Image();
  download.onload = () => {
    sl("main .weather .bottom-overlay span").className = "";
    endTime = new Date().getTime();
    showResults();
  };

  download.onerror = () => {
    sl("main .weather .bottom-overlay span").className = "error";
  };

  startTime = new Date().getTime();
  const cacheBuster = `?d=${startTime}`;
  download.src =
    imageLink[randomIntFromInterval(0, imageLink.length - 1)] + cacheBuster;
  function showResults() {
    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = downloadSize * 8;
    const speedBps = (bitsLoaded / duration).toFixed(2);
    const speedKbps = (speedBps / 1024).toFixed(2) * 1;
    const speedMbps = (speedKbps / 1024).toFixed(2) * 1;
    sl("main .weather .bottom-overlay span").className = "loaded";
    const result = speedKbps / 1024 > 1.24 ? speedMbps : speedKbps;
    setTimeout(() => {
      sl("main .weather .bottom-overlay span").innerHTML = `${result} ${
        speedKbps / 1024 > 1.24 ? "Mb/s" : "Kb/s"
      }`;
      setTimeout(() => {
        sl("main .weather .bottom-overlay span").classList.remove(
          lastNumber > result * 1 ? "top" : "down"
        );
        sl("main .weather .bottom-overlay span").classList.add(
          lastNumber > result * 1 ? "down" : "top"
        );
        lastNumber = result - 1;
      }, 250);
    }, 150);
  }
}

export function InitiateSpeedDetection() {
  sl("main .weather .bottom-overlay span").className = "loading";
  setTimeout(MeasureConnectionSpeed, 10);
}

export function setStorage(key, data) {
  return localStorage.setItem(key, JSON.stringify(data));
}

export function getStorage(key) {
  return JSON.parse(localStorage.setItem(key));
}

const MONTH_NAMES = [
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
  "December",
];

function getFormattedDate(date) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}
export function timeAgo(dateParam, lang) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);

  if (seconds < 5) {
    return `${lang === "fa" ? "الان" : "now"}`;
  } else if (seconds < 60) {
    return `${
      lang === "fa"
        ? `${NumbersToPersian(seconds)} ثانیه پیش`
        : `${seconds} seconds ago`
    }`;
  } else if (seconds < 90) {
    return `${lang === "fa" ? "حدودا یک دقیقه پیش" : "about a minute ago"}`;
  } else if (minutes < 60) {
    return `${
      lang === "fa"
        ? `${NumbersToPersian(minutes)} دقیقه پیش`
        : `${minutes} minutes ago`
    }`;
  }
  return getFormattedDate(date);
}

export function arrayMove(array, oldIndex, newIndex) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}

export function isLight(color) {
  const hex = color.replace("#", "");
  const c_r = parseInt(hex.substring(0, 0 + 2), 16);
  const c_g = parseInt(hex.substring(2, 2 + 2), 16);
  const c_b = parseInt(hex.substring(4, 4 + 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
}
