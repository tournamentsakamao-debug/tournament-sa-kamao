// core/navigation.js

/* ================= BASIC NAV (EXISTING) ================= */

window.go = function (page) {
  location.href = page;
};

window.goBack = function () {
  history.back();
};


/* ================= SAFE CORE NAVIGATION (ADDED) ================= */

/**
 * Safe navigation with config + sound + protection
 * usage: goSafe("index.html")
 */
window.goSafe = function (page, options = {}) {
  // maintenance check
  if (window.APP_CONFIG?.maintenance) {
    alert("⚠️ App is under maintenance. Please try later.");
    return;
  }

  // permission checks
  if (options.type === "join" && !window.APP_CONFIG.allowJoin) {
    alert("❌ Joining tournaments is disabled");
    return;
  }

  if (options.type === "create" && !window.APP_CONFIG.allowCreate) {
    alert("❌ Creating tournaments is disabled");
    return;
  }

  if (options.type === "payment" && !window.APP_CONFIG.allowPayment) {
    alert("❌ Payments are temporarily disabled");
    return;
  }

  if (options.type === "withdraw" && !window.APP_CONFIG.allowWithdraw) {
    alert("❌ Withdrawals are temporarily disabled");
    return;
  }

  playTap();
  pageTapEffect();

  setTimeout(() => {
    location.href = page;
  }, 120);
};


/* ================= TAP SOUND ================= */

function playTap() {
  if (!window.APP_CONFIG?.tapSoundEnabled) return;

  let tap = document.getElementById("tap");
  if (!tap) return;

  tap.currentTime = 0;
  tap.play().catch(() => {});
}


/* ================= TAP EFFECT ================= */

function pageTapEffect() {
  document.body.style.transition = "transform .12s ease";
  document.body.style.transform = "scale(0.98)";
  setTimeout(() => {
    document.body.style.transform = "scale(1)";
  }, 120);
}


/* ================= GLOBAL CLICK HOOK ================= */
/* Automatically apply tap sound + effect on buttons */

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button, .nav-item, .action, .btn");
  if (!btn) return;

  playTap();
  pageTapEffect();
});


/* ================= ADMIN CHECK HELPER ================= */

window.isAdmin = function () {
  const u = localStorage.getItem("username");
  return u && u === window.APP_CONFIG.adminUsername;
};
