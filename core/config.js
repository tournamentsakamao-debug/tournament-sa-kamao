// core/config.js
// ⚠️ Is file me kuch delete mat karna. Sirf yahi core hai.

// ================== BASE CONFIG (AS-IT-IS) ==================
window.APP_CONFIG = {
  appName: "Tournament Sa Kamao",

  // app switches
  maintenance: false,
  allowJoin: true,
  allowCreate: true,
  allowPayment: true,
  allowWithdraw: true,

  // admin
  adminUsername: "admin",

  // audio
  musicEnabled: true,
  tapSoundEnabled: true
};

// ================== GLOBAL APP STATE ==================
window.APP_STATE = {
  user: {
    username: localStorage.getItem("username") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true",
    wallet: Number(localStorage.getItem("wallet") || 0)
  },

  tournament: {
    selectedId: null,
    joinFee: 0
  }
};

// ================== SAFE LOCAL STORAGE ==================
window.Storage = {
  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? def : JSON.parse(v);
    } catch {
      return def;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

// ================== AUDIO CONTROLLER ==================
window.AudioCore = {
  bgm: null,
  tap: null,

  init() {
    this.bgm = document.getElementById("bgm");
    this.tap = document.getElementById("tap");

    if (this.bgm && APP_CONFIG.musicEnabled) {
      this.bgm.volume = 0.35;
      this.bgm.play().catch(() => {});
    }

    document.addEventListener("touchstart", () => {
      if (!APP_CONFIG.tapSoundEnabled || !this.tap) return;
      this.tap.currentTime = 0;
      this.tap.play().catch(() => {});
    });
  }
};

// ================== PAGE GUARD ==================
window.PageGuard = {
  requireLogin() {
    if (!localStorage.getItem("username")) {
      location.href = "login.html";
    }
  },

  requireAdmin() {
    if (localStorage.getItem("isAdmin") !== "true") {
      alert("Admin access required");
      history.back();
    }
  },

  checkMaintenance() {
    if (APP_CONFIG.maintenance) {
      document.body.innerHTML = `
        <div style="
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#020617;
          color:white;
          font-size:18px;
          text-align:center;
        ">
          🚧 App is under maintenance<br><br>
          Please try again later
        </div>
      `;
    }
  }
};

// ================== WALLET CORE ==================
window.Wallet = {
  balance() {
    return Number(localStorage.getItem("wallet") || 0);
  },

  deduct(amount) {
    const bal = this.balance();
    if (bal < amount) return false;
    localStorage.setItem("wallet", bal - amount);
    return true;
  },

  add(amount) {
    const bal = this.balance();
    localStorage.setItem("wallet", bal + amount);
  }
};

// ================== NAVIGATION SAFE ROUTES ==================
window.Go = {
  home() { location.href = "index.html"; },
  wallet() { location.href = "wallet.html"; },
  profile() { location.href = "profile.html"; },
  payment() { location.href = "payment.html"; },
  back() { history.back(); }
};

// ================== TOURNAMENT LOGIC CORE ==================
window.TournamentCore = {
  canCreate(fee) {
    if (!APP_CONFIG.allowCreate) return "Create disabled";
    if (Wallet.balance() < fee) return "NO_MONEY";
    return "OK";
  },

  canJoin(fee) {
    if (!APP_CONFIG.allowJoin) return "Join disabled";
    if (Wallet.balance() < fee) return "NO_MONEY";
    return "OK";
  }
};

// ================== AUTO INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  PageGuard.checkMaintenance();
  AudioCore.init();
});
