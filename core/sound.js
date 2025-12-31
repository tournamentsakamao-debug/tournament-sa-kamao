// core/sound.js

(function () {
  if (!window.APP_CONFIG.musicEnabled) return;

  // background music
  let bgm = document.getElementById("bgm");
  if (bgm) {
    bgm.volume = 0.35;
    bgm.loop = true;
    bgm.play().catch(() => {});
  }

  // tap sound
  if (window.APP_CONFIG.tapSoundEnabled) {
    document.addEventListener("touchstart", () => {
      const tap = document.getElementById("tap");
      if (tap) {
        tap.currentTime = 0;
        tap.play().catch(() => {});
      }
    });
  }
})();
