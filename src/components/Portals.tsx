import type { ReactNode, RefObject } from "react";

import { CLOCK_THEME_LABELS, CLOCK_THEMES, type ClockTheme } from "../lib/clock-theme";
import type { SettingsLabels } from "../lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AzardLogo } from "@/components/ui/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  isSelectLayerTarget,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export function LoadingPortal() {
  return (
    <div className="loaded:hidden fixed inset-0 z-[1] m-auto flex h-full w-full items-center justify-center bg-black transition-opacity duration-[250ms]">
      <div className="relative flex size-[200px] items-center justify-center overflow-hidden rounded-full bg-white/10">
        <AzardLogo />
      </div>
    </div>
  );
}

interface PortalModalProps {
  active: boolean;
  text: string;
  onClose: () => void;
  container?: HTMLElement | null;
}

export function PortalModal({ active, text, onClose, container }: PortalModalProps) {
  return (
    <Dialog
      open={active}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md" container={container}>
        <DialogHeader>
          <DialogTitle>Notice</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

interface SettingsPortalProps {
  open: boolean;
  settingsRef: RefObject<HTMLDivElement | null>;
  color: string;
  mapOpacity: number;
  animationDuration: number;
  fullScreenImage: boolean;
  clockTheme: ClockTheme;
  clockSound: boolean;
  clock24Hour: boolean;
  labels: SettingsLabels;
  onColorChange: (value: string) => void;
  onOpacityChange: (value: string) => void;
  onAnimationChange: (value: string) => void;
  onFullScreenImageChange: (checked: boolean) => void;
  onClockThemeChange: (value: ClockTheme) => void;
  onClockSoundChange: (checked: boolean) => void;
  onClock24HourChange: (checked: boolean) => void;
  onReset: () => void;
  onSubmit: () => void;
  container?: HTMLElement | null;
}

function SettingRow({
  htmlFor,
  en,
  fa,
  children,
}: {
  htmlFor: string;
  en: string;
  fa: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor={htmlFor}>
        <span className="rtl:hidden">{en}</span>
        <span className="hidden rtl:inline">{fa}</span>
      </Label>
      {children}
    </div>
  );
}

export function SettingsPortal({
  open,
  settingsRef,
  color,
  mapOpacity,
  animationDuration,
  fullScreenImage,
  clockTheme,
  clockSound,
  clock24Hour,
  labels,
  onColorChange,
  onOpacityChange,
  onAnimationChange,
  onFullScreenImageChange,
  onClockThemeChange,
  onClockSoundChange,
  onClock24HourChange,
  onReset,
  onSubmit,
  container,
}: SettingsPortalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onSubmit();
      }}
    >
      <DialogContent
        ref={settingsRef}
        className="sm:max-w-[320px]"
        container={container}
        onPointerDownOutside={(event) => {
          if (isSelectLayerTarget(event.target)) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (isSelectLayerTarget(event.target)) {
            event.preventDefault();
          }
        }}
        onFocusOutside={(event) => {
          if (isSelectLayerTarget(event.target)) {
            event.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SettingRow htmlFor="clockTheme" en="Clock theme" fa="تم ساعت">
          <Select
            value={clockTheme}
            onValueChange={(value) => onClockThemeChange(value as ClockTheme)}
          >
            <SelectTrigger id="clockTheme" size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {CLOCK_THEMES.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  <span className="rtl:hidden">{CLOCK_THEME_LABELS[theme].en}</span>
                  <span className="hidden rtl:inline">{CLOCK_THEME_LABELS[theme].fa}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow htmlFor="clockSound" en="Clock sound" fa="صدای ساعت">
          <Switch id="clockSound" checked={clockSound} onCheckedChange={onClockSoundChange} />
        </SettingRow>
        <SettingRow htmlFor="clock24Hour" en="24-hour clock" fa="ساعت ۲۴ ساعته">
          <Switch id="clock24Hour" checked={clock24Hour} onCheckedChange={onClock24HourChange} />
        </SettingRow>
        <SettingRow htmlFor="favcolor" en="Color" fa="رنگ">
          <Input
            type="color"
            id="favcolor"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-9 w-14 cursor-pointer p-1"
          />
        </SettingRow>
        <SettingRow htmlFor="mapOpacity" en="Main opacity" fa="تاری رنگ اصلی">
          <Slider
            id="mapOpacity"
            min={0}
            max={100}
            value={[mapOpacity]}
            onValueChange={([value]) => onOpacityChange(String(value))}
            className="w-32"
          />
        </SettingRow>
        <SettingRow htmlFor="animationDuration" en="News animation duration" fa="سرعت اخبار">
          <Slider
            id="animationDuration"
            min={60}
            max={360}
            value={[animationDuration]}
            onValueChange={([value]) => onAnimationChange(String(value))}
            className="w-32"
          />
        </SettingRow>
        <SettingRow htmlFor="fullScreenImage" en="Full screen image" fa="عکس تمام صفحه">
          <Switch
            id="fullScreenImage"
            checked={fullScreenImage}
            onCheckedChange={onFullScreenImageChange}
          />
        </SettingRow>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onReset}>
            {labels.reset}
          </Button>
          <Button type="button" onClick={onSubmit}>
            {labels.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
