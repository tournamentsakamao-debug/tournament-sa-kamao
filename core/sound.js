// core/sound.js

(function () {

  /* ===============================
     SAFE CONFIG CHECK
  =============================== */
  if (!window.APP_CONFIG) {
    console.warn("APP_CONFIG missing");
    return;
  }

  /* ===============================
     USER SOUND SETTINGS (persist)
  =============================== */
  if (localStorage.getItem("musicEnabled") === null) {
    localStorage.setItem("musicEnabled", window.APP_CONFIG.musicEnabled);
  }
  if (localStorage.getItem("tapSoundEnabled") === null) {
    localStorage.setItem("tapSoundEnabled", window.APP_CONFIG.tapSoundEnabled);
  }

  const MUSIC_ON = localStorage.getItem("musicEnabled") === "true";
  const TAP_ON   = localStorage.getItem("tapSoundEnabled") === "true";

  /* ===============================
     BACKGROUND MUSIC
  =============================== */
  if (MUSIC_ON) {
    let bgm = document.getElementById("bgm");
    if (bgm) {
      bgm.volume = 0.35;
      bgm.loop = true;

      // mobile autoplay fix
      document.addEventListener("click", () => {
        bgm.play().catch(() => {});
      }, { once: true });

      bgm.play().catch(() => {});
    }
  }

  /* ===============================
     TAP SOUND + VIBRATION
  =============================== */
  if (TAP_ON) {
    const playTap = () => {
      const tap = document.getElementById("tap");
      if (tap) {
        tap.currentTime = 0;
        tap.play().catch(() => {});
      }

      // vibration support
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    };

    document.addEventListener("touchstart", playTap);
    document.addEventListener("mousedown", playTap);
  }

  /* ===============================
     GLOBAL BUTTON PRESS EFFECT
  =============================== */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button,.btn,.action,.nav-item");
    if (!btn) return;

    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 120);
  });

  /* ===============================
     PUBLIC HELPERS (for settings)
  =============================== */
  window.toggleMusic = function (state) {
    localStorage.setItem("musicEnabled", state);
    location.reload();
  };

  window.toggleTapSound = function (state) {
    localStorage.setItem("tapSoundEnabled", state);
  };

})();
