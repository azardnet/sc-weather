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

export { sl, NumbersToPersian, debounce, checkPersianCharacters }