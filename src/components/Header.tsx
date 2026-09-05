import type { ChangeEventHandler, KeyboardEventHandler, RefObject } from "react";

import { Button } from "@/components/ui/button";
import { RiFullscreenLine, RiSettings3Line } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  visible: boolean;
  direction: string;
  placeholder: string;
  inputValue: string;
  inputRef: RefObject<HTMLInputElement | null>;
  history: string[];
  cityListActive: boolean;
  settingsBtnRef: RefObject<HTMLButtonElement | null>;
  onInputChange: ChangeEventHandler<HTMLInputElement>;
  onInputKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onFocus: () => void;
  onBlur: () => void;
  onHistorySelect: (item: string) => void;
  onOpenSettings: () => void;
  onFullscreen: () => void;
}

export default function Header({
  visible,
  direction,
  placeholder,
  inputValue,
  inputRef,
  history,
  cityListActive,
  settingsBtnRef,
  onInputChange,
  onInputKeyDown,
  onFocus,
  onBlur,
  onHistorySelect,
  onOpenSettings,
  onFullscreen,
}: HeaderProps) {
  return (
    <header
      dir={direction === "right" ? "rtl" : "ltr"}
      className={cn(
        "relative z-20 mt-[1.9em] flex w-[80vw] shrink-0 justify-between max-[750px]:w-[calc(90vw-2em)] max-[750px]:text-xs max-[450px]:w-[calc(95vw-1em)] max-[450px]:text-[10px]",
        visible ? "flex" : "hidden",
      )}
    >
      <form className="relative w-1/2" onSubmit={(e) => e.preventDefault()}>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <ul
          className={cn(
            "absolute top-full z-50 mt-1 flex w-full list-none flex-col rounded-md border bg-popover p-1 text-popover-foreground shadow-md will-change-transform transition-[visibility,transform,opacity] duration-200",
            cityListActive
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0",
          )}
        >
          {history.map((item) => (
            <li key={item}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => onHistorySelect(item)}
              >
                {item}
              </Button>
            </li>
          ))}
        </ul>
      </form>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          ref={settingsBtnRef}
          onClick={onOpenSettings}
        >
          <RiSettings3Line />
          <span className="sr-only">Settings</span>
        </Button>
        <Button type="button" variant="secondary" size="icon" onClick={onFullscreen}>
          <RiFullscreenLine />
          <span className="sr-only">Fullscreen</span>
        </Button>
      </div>
    </header>
  );
}
