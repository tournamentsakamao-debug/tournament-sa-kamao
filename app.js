/*************************************************
 * Tournament Sa Kamao – app.js (FINAL & STABLE)
 * One JS for ALL 24 pages
 * UI untouched | No blink bug | Secure
 *************************************************/

/* ================= CONFIG ================= */
const API_URL =
  "https://script.google.com/macros/s/AKfycbyV0tflAz3KL_bczgQF6JaHi-Ptc_-DmBIN7ptPZQtwTAhpKehThsvppOQ9zKQRLxwM/exec";

const ADMIN_USERNAME = "TSK_ADMIN";

/* ================= STORAGE KEYS ================= */
const USER_KEY = "APP_USER";            // full user object
const USERNAME_KEY = "username";        // quick access
const ADMIN_TOGGLE_KEY = "ADMIN_MODE";  // on / off

/* ================= USER HELPERS ================= */
function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return !!getUser();
}

function isAdmin() {
  const u = getUser();
  return u && u.role === "admin" && u.adminVerified === true;
}

function isAdminModeOn() {
  return localStorage.getItem(ADMIN_TOGGLE_KEY) === "on";
}

/* ================= GLOBAL GUARD (NO BLINK) ================= */
document.addEventListener("DOMContentLoaded", () => {
  const page = location.pathname.split("/").pop();

  const publicPages = ["login.html"];

  /* ---- LOGIN REQUIRED ---- */
  if (!isLoggedIn() && !publicPages.includes(page)) {
    location.replace("login.html");
    return;
  }

  /* ---- ADMIN PAGE PROTECTION ---- */
  if (page.startsWith("admin") || page === "admin-home.html") {
    if (!isAdmin() || !isAdminModeOn()) {
      location.replace("index.html");
      return;
    }
  }

  /* ---- ADMIN MODE DEFAULT ---- */
  if (isAdmin() && localStorage.getItem(ADMIN_TOGGLE_KEY) === null) {
    localStorage.setItem(ADMIN_TOGGLE_KEY, "off");
  }
});

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ADMIN_TOGGLE_KEY);
  location.replace("login.html");
}

/* ================= ADMIN TOGGLE ================= */
function enableAdminMode() {
  if (!isAdmin()) return false;
  localStorage.setItem(ADMIN_TOGGLE_KEY, "on");
  location.href = "admin-home.html";
  return true;
}

function disableAdminMode() {
  localStorage.setItem(ADMIN_TOGGLE_KEY, "off");
  location.href = "index.html";
}

/* ================= API HELPER ================= */
function api(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);

  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null) {
      url.searchParams.set(k, params[k]);
    }
  });

  return fetch(url.toString())
    .then(r => r.json())
    .catch(() => ({ error: "network_error" }));
}

/* ================= COMMON API FUNCTIONS ================= */

/* Wallet */
function getWallet(username) {
  return api("getWallet", { username });
}

/* Games */
function getGames() {
  return api("getGames");
}

/* Tournament */
function createTournament(data) {
  return api("createTournament", data);
}

function joinTournament(data) {
  return api("joinTournament", data);
}

/* Payments */
function addMoney(data) {
  return api("addMoney", data);
}

function withdrawMoney(data) {
  return api("withdraw", data);
}

/* Chat */
function sendChat(data) {
  return api("chatSend", data);
}

function readChat(data) {
  return api("chatRead", data);
}

/* Admin */
function getAdminSettings() {
  return api("adminSettings");
}

/* ================= AUDIO (SAFE) ================= */
document.addEventListener("touchstart", () => {
  const tap = document.getElementById("tap");
  if (tap && localStorage.getItem("tapSound") !== "off") {
    tap.currentTime = 0;
    tap.play().catch(() => {});
  }
});
