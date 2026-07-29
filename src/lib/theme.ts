import { isLight } from "./utils";

export function applyTheme(color: string): void {
  document.body.style.backgroundColor = color;
  document.documentElement.classList.remove(isLight(color) ? "dark" : "light");
  document.documentElement.classList.add(isLight(color) ? "light" : "dark");
}

export function setBodyLoading(): void {
  document.body.classList.remove("loaded");
  document.body.classList.add("loading", "blur");
}

export function setBodyLoaded(): void {
  document.body.classList.remove("loading", "blur");
  document.body.classList.add("loaded");
}

export function setBodyBlurred(): void {
  document.body.classList.remove("loading");
  document.body.classList.add("loaded", "blur");
}

export function clearBodyBlur(): void {
  document.body.classList.remove("blur");
}

export function setBodyRtl(enabled: boolean): void {
  document.body.classList.toggle("rtl", enabled);
}
