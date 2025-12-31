// core/navigation.js

window.go = function (page) {
  location.href = page;
};

window.goBack = function () {
  history.back();
};
