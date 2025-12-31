// core/db.js

window.DB = {
  get(key, def = null) {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  addWallet(amount) {
    let w = this.get("wallet", 0);
    w = Number(w) + Number(amount);
    this.set("wallet", w);
    return w;
  },

  deductWallet(amount) {
    let w = this.get("wallet", 0);
    if (w < amount) return false;
    w -= amount;
    this.set("wallet", w);
    return true;
  }
};
