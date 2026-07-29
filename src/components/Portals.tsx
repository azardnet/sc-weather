import type { RefObject } from "react";
import type { SettingsLabels } from "../lib/types";
import { AzardLogo } from "./Icons";

export function LoadingPortal() {
  return (
    <div className="portal-loading">
      <div className="logo">
        <AzardLogo />
      </div>
    </div>
  );
}

interface PortalModalProps {
  active: boolean;
  text: string;
  onClose: () => void;
}

export function PortalModal({ active, text, onClose }: PortalModalProps) {
  return (
    <div className={`portal-model${active ? " active" : ""}`}>
      <span className="close" onClick={onClose} />
      <span className="text" style={{ color: "#ffffff" }}>
        {text}
      </span>
    </div>
  );
}

interface SettingsPortalProps {
  open: boolean;
  settingsRef: RefObject<HTMLDivElement | null>;
  color: string;
  mapOpacity: number;
  animationDuration: number;
  fullScreenImage: boolean;
  simpleMode: boolean;
  clockSound: boolean;
  labels: SettingsLabels;
  onColorChange: (value: string) => void;
  onOpacityChange: (value: string) => void;
  onAnimationChange: (value: string) => void;
  onFullScreenImageChange: (checked: boolean) => void;
  onSimpleModeChange: (checked: boolean) => void;
  onClockSoundChange: (checked: boolean) => void;
  onReset: () => void;
  onSubmit: () => void;
}

export function SettingsPortal({
  open,
  settingsRef,
  color,
  mapOpacity,
  animationDuration,
  fullScreenImage,
  simpleMode,
  clockSound,
  labels,
  onColorChange,
  onOpacityChange,
  onAnimationChange,
  onFullScreenImageChange,
  onSimpleModeChange,
  onClockSoundChange,
  onReset,
  onSubmit,
}: SettingsPortalProps) {
  return (
    <div
      ref={settingsRef}
      className="portal-settings"
      style={{
        visibility: open ? "visible" : "hidden",
        opacity: open ? 1 : 0,
      }}
    >
      <div>
        <h6>Simple mode</h6>
        <input
          id="simpleMode"
          type="checkbox"
          checked={simpleMode}
          onChange={(e) => onSimpleModeChange(e.target.checked)}
        />
      </div>
      <div>
        <h6>Clock sound</h6>
        <input
          id="clockSound"
          type="checkbox"
          checked={clockSound}
          onChange={(e) => onClockSoundChange(e.target.checked)}
        />
      </div>
      <div>
        <h6>Color</h6>
        <input
          type="color"
          id="favcolor"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
      <div>
        <h6>Main opacity</h6>
        <input
          id="mapOpacity"
          type="range"
          min="0"
          max="100"
          value={mapOpacity}
          onChange={(e) => onOpacityChange(e.target.value)}
        />
      </div>
      <div>
        <h6>News animation duration</h6>
        <input
          id="animationDuration"
          type="range"
          min="60"
          max="360"
          value={animationDuration}
          onChange={(e) => onAnimationChange(e.target.value)}
        />
      </div>
      <div>
        <h6>Full screen image</h6>
        <input
          id="fullScreenImage"
          type="checkbox"
          checked={fullScreenImage}
          onChange={(e) => onFullScreenImageChange(e.target.checked)}
        />
      </div>
      <div className="action-wrapper">
        <button type="button" className="reset" onClick={onReset}>
          {labels.reset}
        </button>
        <button type="button" className="submit" onClick={onSubmit}>
          {labels.submit}
        </button>
      </div>
    </div>
  );
}
