import { isLight } from "./utils";

export function applyTheme(color: string): void {
  document.body.style.backgroundColor = color;
  document.documentElement.classList.remove(isLight(color) ? "dark" : "light");
  document.documentElement.classList.add(isLight(color) ? "light" : "dark");
}

export function setBodyLoading(): void {
  document.body.classList.remove("loaded", "page-blurred");
  document.body.classList.add("loading");
}

export function setBodyLoaded(): void {
  document.body.classList.remove("loading", "page-blurred");
  document.body.classList.add("loaded");
}

export function setBodyBlurred(): void {
  document.body.classList.remove("loading");
  document.body.classList.add("loaded", "page-blurred");
}

export function clearBodyBlur(): void {
  document.body.classList.remove("page-blurred");
}

export function setBodyRtl(enabled: boolean): void {
  document.documentElement.setAttribute("dir", enabled ? "rtl" : "ltr");
  document.body.classList.toggle("rtl", enabled);
}
