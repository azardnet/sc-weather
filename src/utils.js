export function NumbersToPersian(text) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  if (text === 0) {
    return "۰";
  }
  return text && text.toString().replace(/\d/g, (char) => farsiDigits[char]);
}

export function dynamicTranslateKeyframe(
  name,
  startTranformValue,
  endTranformValue,
) {
  const style = document.createElement("style");
  style.innerHTML = `
@keyframes ${name} {
    0% {
      transform: translate3d(${startTranformValue});
    }
    100% {
        transform: translate3d(${endTranformValue});
    }
}`;
  document.getElementsByTagName("head")[0].appendChild(style);
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function (...args) {
    const context = this;
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
  return PersianCharactersRange.test(string || "");
}

export function createJsFile(url) {
  const script = document.createElement("script");
  script.src = url;
  script.type = "text/javascript";
  document.body.appendChild(script);
}

export function checkExistJsFile(filename) {
  return Array.from(document.querySelectorAll("script")).some((s) =>
    s.src.includes(filename),
  );
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const imageLink = [
  "https://azardnet.github.io/sc-weather/img/128747-1.3052c8c7fd93c649d6e8937b06bb6f2f.jpg",
  "http://azard.net/upload/f.jpg",
  "https://se3.ir/up/f.jpg",
];
const downloadSize = 1471649;
let lastNumber = 0;

export function startNumberAnimation(el, start, end, unit, time, speed) {
  increaseNumber(start, end, el, unit, time, speed);
}

function increaseNumber(start, end, el, unit, time, speed) {
  if (!el) return;
  if (start <= end) {
    el.innerHTML = `${start.toFixed(2)} ${unit}`;
    setTimeout(() => {
      increaseNumber(start + 1, end, el, unit, time, speed);
    }, speed);
    setTimeout(() => {
      if (start > end) {
        el.innerHTML = `${end.toFixed(2)} ${unit}`;
      }
    }, time);
  } else {
    el.innerHTML = `${end.toFixed(2)} ${unit}`;
  }
}

export function MeasureConnectionSpeed(el) {
  if (!el) return;
  let startTime;
  let endTime;
  const download = new Image();
  download.onload = () => {
    el.className = "";
    endTime = new Date().getTime();
    showResults();
  };

  download.onerror = () => {
    el.className = "internet-speed error";
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
    el.className = "internet-speed loaded";
    const result = speedKbps / 1024 > 1.24 ? speedMbps : speedKbps;
    startNumberAnimation(
      el,
      lastNumber,
      result,
      speedKbps / 1024 > 1.24 ? "Mb/s" : "Kb/s",
      1000,
      speedKbps / 1024 > 1.24 ? 100 : 50,
    );
    setTimeout(() => {
      el.innerHTML = `${result} ${speedKbps / 1024 > 1.24 ? "Mb/s" : "Kb/s"}`;
      setTimeout(() => {
        el.classList.remove(lastNumber > result * 1 ? "top" : "down");
        el.classList.add(lastNumber > result * 1 ? "down" : "top");
        lastNumber = result - 1;
      }, 250);
    }, 150);
  }
}

export function InitiateSpeedDetection(el) {
  if (!el) return;
  el.className = "internet-speed loading";
  setTimeout(() => MeasureConnectionSpeed(el), 100);
}

export function getStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return localStorage.getItem(key);
  }
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
  if (minutes < 10) minutes = `0${minutes}`;
  return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}

export function timeAgo(dateParam, lang) {
  if (!dateParam) return null;

  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);

  if (seconds < 5) {
    return lang === "fa" ? "الان" : "now";
  }
  if (seconds < 60) {
    return lang === "fa"
      ? `${NumbersToPersian(seconds)} ثانیه پیش`
      : `${seconds} seconds ago`;
  }
  if (seconds < 90) {
    return lang === "fa" ? "حدودا یک دقیقه پیش" : "about a minute ago";
  }
  if (minutes < 60) {
    return lang === "fa"
      ? `${NumbersToPersian(minutes)} دقیقه پیش`
      : `${minutes} minutes ago`;
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
  const c_r = parseInt(hex.substring(0, 2), 16);
  const c_g = parseInt(hex.substring(2, 4), 16);
  const c_b = parseInt(hex.substring(4, 6), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 155;
}

export function updateTime(k) {
  return k < 10 ? "0" + k : k;
}

export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function assetUrl(path) {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}
