import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import type { KeyboardReactInterface } from "react-simple-keyboard";
import englishLayout from "simple-keyboard-layouts/build/layouts/english";
import farsiLayout from "simple-keyboard-layouts/build/layouts/farsi";
import "react-simple-keyboard/build/css/index.css";

import { Button } from "@/components/ui/button";
import { RiCloseLine } from "@/components/ui/icon";
import { checkPersianCharacters, cn } from "@/lib/utils";

import "./virtual-keyboard.css";

type LangId = "english" | "farsi" | "numeric";
type TextField = HTMLInputElement | HTMLTextAreaElement;

const STORAGE_KEY = "virtual_keyboard_lang";
const TEXT_INPUT_TYPES = new Set(["", "text", "search", "url", "email", "password", "tel", "number"]);

const NUMERIC_LAYOUT = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ ۰ {enter}",
    "- / : ; ( ) @ * + =",
    ". , ؟ ! ' \" {space}",
  ],
};

const DISPLAY = {
  "{bksp}": "⌫",
  "{enter}": "Enter",
  "{shift}": "⇧",
  "{lock}": "⇪",
  "{tab}": "⇥",
  "{space}": " ",
};

function tvLayout(layout: Record<string, string[]>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(layout).map(([name, rows]) => {
      const body = rows
        .slice(0, -1)
        .map((row) => row.replaceAll("{tab} ", "").replaceAll("{lock} ", ""));
      return [name, [...body, "{space}"]];
    }),
  );
}

function isTextField(el: EventTarget | null): el is TextField {
  if (el instanceof HTMLTextAreaElement) {
    return el.dataset.noVirtualKeyboard == null;
  }
  if (!(el instanceof HTMLInputElement)) return false;
  if (el.dataset.noVirtualKeyboard != null) return false;
  return TEXT_INPUT_TYPES.has((el.type || "text").toLowerCase());
}

function setNativeValue(el: TextField, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function readStoredLang(): LangId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "english" || saved === "farsi" || saved === "numeric") return saved;
  } catch {
    /* ignore */
  }
  return "english";
}

export default function VirtualKeyboard() {
  const panelRef = useRef<HTMLElement | null>(null);
  const keyboardRef = useRef<KeyboardReactInterface | null>(null);
  const targetRef = useRef<TextField | null>(null);
  const [target, setTarget] = useState<TextField | null>(null);
  const [preview, setPreview] = useState("");
  const [langId, setLangId] = useState<LangId>(readStoredLang);
  const [layoutName, setLayoutName] = useState("default");

  targetRef.current = target;

  const layouts = useMemo(
    () => ({
      english: tvLayout(englishLayout.layout),
      farsi: tvLayout(farsiLayout.layout),
      numeric: NUMERIC_LAYOUT,
    }),
    [],
  );

  const syncKeyboard = useCallback((el: TextField) => {
    setPreview(el.value);
    keyboardRef.current?.setInput(el.value);
  }, []);

  const close = useCallback(() => {
    targetRef.current?.blur();
    setTarget(null);
  }, []);

  const submit = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    el.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        bubbles: true,
        cancelable: true,
      }),
    );
    el.blur();
    setTarget(null);
  }, []);

  const changeLang = useCallback((next: LangId) => {
    setLangId(next);
    setLayoutName("default");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function onFocusIn(event: FocusEvent) {
      if (!isTextField(event.target)) return;
      if (event.target.closest("[data-virtual-keyboard]")) return;
      setTarget(event.target);
      setPreview(event.target.value);
      if (checkPersianCharacters(event.target.value.trim())) {
        setLangId("farsi");
        setLayoutName("default");
      }
    }

    function onFocusOut() {
      window.setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof Node && panelRef.current?.contains(active)) return;
        if (isTextField(active)) {
          setTarget(active);
          setPreview(active.value);
          return;
        }
        setTarget(null);
      }, 0);
    }

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    if (!target) return;
    const previous = target.getAttribute("inputmode");
    target.setAttribute("inputmode", "none");
    syncKeyboard(target);

    const onInput = () => syncKeyboard(target);
    target.addEventListener("input", onInput);

    return () => {
      target.removeEventListener("input", onInput);
      if (previous == null) target.removeAttribute("inputmode");
      else target.setAttribute("inputmode", previous);
    };
  }, [syncKeyboard, target]);

  const onChange = (value: string) => {
    const el = targetRef.current;
    if (!el) return;
    const next = el instanceof HTMLInputElement ? value.replaceAll("\n", "") : value;
    setNativeValue(el, next);
    setPreview(next);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName((current) => (current === "default" ? "shift" : "default"));
      return;
    }
    if (layoutName === "shift" && button !== "{bksp}") {
      setLayoutName("default");
    }
    if (button === "{enter}") submit();
  };

  if (!target) return null;

  const rtlPreview = checkPersianCharacters(preview) || langId === "farsi";

  return (
    <aside
      ref={panelRef}
      data-virtual-keyboard
      aria-label="On-screen keyboard"
      className="virtual-keyboard-panel"
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
        <div className="flex items-center gap-2">
          <div
            dir={rtlPreview ? "rtl" : "ltr"}
            className="min-h-11 min-w-0 flex-1 truncate rounded-md border bg-background px-3 py-2 text-lg text-foreground"
          >
            {preview || <span className="text-muted-foreground">{target.placeholder || "…"}</span>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {(
              [
                ["english", "EN"],
                ["farsi", "فارسی"],
                ["numeric", "۱۲۳"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={langId === id ? "default" : "secondary"}
                className="min-w-14"
                onClick={() => changeLang(id)}
              >
                {label}
              </Button>
            ))}
            <Button type="button" size="icon" variant="secondary" onClick={close} aria-label="Close keyboard">
              <RiCloseLine />
            </Button>
          </div>
        </div>
        <Keyboard
          key={langId}
          layoutName={layoutName}
          layout={layouts[langId]}
          display={DISPLAY}
          theme="hg-theme-default tv-keyboard"
          preventMouseDownDefault
          stopMouseDownPropagation
          useMouseEvents
          clickOnMouseDown
          disableButtonHold
          onChange={onChange}
          onKeyPress={onKeyPress}
          onInit={(instance) => {
            keyboardRef.current = instance as KeyboardReactInterface;
            if (targetRef.current) instance.setInput(targetRef.current.value);
          }}
          keyboardRef={(instance) => {
            keyboardRef.current = instance;
          }}
        />
        <div className={cn("flex", langId === "farsi" ? "justify-start" : "justify-end")}>
          <Button type="button" onClick={submit}>
            {langId === "farsi" ? "ورود" : "Enter"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
