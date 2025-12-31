// core/session.js

(function () {
  /* =========================
     BASIC LOGIN CHECK
  ========================== */
  const username = localStorage.getItem("username");

  const page = location.pathname.split("/").pop();
  const publicPages = ["login.html"];

  if (!username && !publicPages.includes(page)) {
    location.href = "login.html";
    return;
  }

  /* =========================
     ADMIN CHECK
  ========================== */
  window.IS_ADMIN = false;
  if (username === window.APP_CONFIG.adminUsername) {
    window.IS_ADMIN = true;
  }

  /* =========================
     MAINTENANCE MODE
  ========================== */
  if (window.APP_CONFIG.maintenance === true && !window.IS_ADMIN) {
    document.body.innerHTML = `
      <div style="
        height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#020617;
        color:white;
        font-family:sans-serif;
        text-align:center;
        padding:20px">
        <div>
          <h2>🛠 App Under Maintenance</h2>
          <p>Please try again later</p>
        </div>
      </div>
    `;
    return;
  }

  /* =========================
     PAGE LEVEL BLOCKS
  ========================== */
  const blockedPages = [];

  if (!window.APP_CONFIG.allowJoin) blockedPages.push("join.html");
  if (!window.APP_CONFIG.allowCreate) blockedPages.push("create.html");
  if (!window.APP_CONFIG.allowPayment) blockedPages.push("payment.html");
  if (!window.APP_CONFIG.allowWithdraw) blockedPages.push("withdraw.html");

  if (blockedPages.includes(page) && !window.IS_ADMIN) {
    alert("This feature is temporarily disabled");
    history.back();
    return;
  }

  /* =========================
     GLOBAL TAP SOUND
  ========================== */
  if (window.APP_CONFIG.tapSoundEnabled) {
    document.addEventListener("touchstart", () => {
      const tap = document.getElementById("tap");
      if (tap) {
        tap.currentTime = 0;
        tap.play().catch(() => {});
      }
    });
  }

  /* =========================
     GLOBAL BACKGROUND MUSIC
  ========================== */
  if (window.APP_CONFIG.musicEnabled) {
    const bgm = document.getElementById("bgm");
    if (bgm) {
      bgm.volume = 0.35;
      bgm.play().catch(() => {});
    }
  }

  /* =========================
     SECURITY: BLOCK RIGHT CLICK
  ========================== */
  document.addEventListener("contextmenu", e => e.preventDefault());

  /* =========================
     SESSION HEARTBEAT
  ========================== */
  localStorage.setItem("app_last_active", Date.now());

})();
