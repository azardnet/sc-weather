import { assetUrl } from "./utils";

let chimeAudio: HTMLAudioElement | null = null;

function getChimeAudio(): HTMLAudioElement {
  if (!chimeAudio) {
    chimeAudio = new Audio(assetUrl("static/sounds/casio-watch.mp3"));
    chimeAudio.preload = "auto";
  }
  return chimeAudio;
}

/** Play the hour chime once. Safe to call repeatedly; restarts from start. */
export function playHourChime(): void {
  try {
    const audio = getChimeAudio();
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Autoplay may be blocked until a user gesture; ignore.
    });
  } catch {
    // ignore missing audio / autoplay errors
  }
}
