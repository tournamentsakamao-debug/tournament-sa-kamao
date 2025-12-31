// core/session.js

(function () {
  const username = localStorage.getItem("username");

  // block access without login
  const page = location.pathname.split("/").pop();
  const publicPages = ["login.html"];

  if (!username && !publicPages.includes(page)) {
    location.href = "login.html";
    return;
  }

  // admin check
  window.IS_ADMIN = false;
  if (username === window.APP_CONFIG.adminUsername) {
    window.IS_ADMIN = true;
  }

})();
