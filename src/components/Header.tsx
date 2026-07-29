import type {
  ChangeEventHandler,
  KeyboardEventHandler,
  RefObject,
} from "react";
import { LocationIcon, SettingsIcon, FullscreenIcon } from "./Icons";

export interface HeaderProps {
  visible: boolean;
  direction: string;
  color: string;
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
  color,
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
      className={direction}
      style={{ display: visible ? "flex" : "none" }}
    >
      <form className="search" onSubmit={(e) => e.preventDefault()}>
        <input
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
          className={`city-list-wrapper${cityListActive ? " active" : ""}`}
        >
          {history.map((item) => (
            <li key={item} onClick={() => onHistorySelect(item)}>
              {item}
            </li>
          ))}
        </ul>
        <div className="location-icon">
          <LocationIcon color={color} />
        </div>
      </form>
      <div className="button-wrapper">
        <button
          type="button"
          className="setting-button"
          ref={settingsBtnRef}
          onClick={onOpenSettings}
        >
          <SettingsIcon />
        </button>
        <button type="button" className="full-screen" onClick={onFullscreen}>
          <FullscreenIcon />
        </button>
      </div>
    </header>
  );
}
