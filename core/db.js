// core/db.js
// ⚠️ Is file ko kabhi direct UI me edit mat karna
// Ye pura app ka BRAIN hai

window.DB = {

  /* ================= BASIC STORAGE ================= */

  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      return def;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  /* ================= USER ================= */

  getUser() {
    return this.get("user", null);
  },

  setUser(user) {
    this.set("user", user);
  },

  logout() {
    localStorage.clear();
    location.href = "login.html";
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.username === APP_CONFIG.adminUsername;
  },

  /* ================= WALLET ================= */

  addWallet(amount) {
    let w = this.get("wallet", 0);
    w = Number(w) + Number(amount);
    this.set("wallet", w);

    this.addWalletHistory({
      type: "credit",
      amount,
      time: Date.now()
    });

    return w;
  },

  deductWallet(amount) {
    let w = this.get("wallet", 0);
    if (w < amount) return false;

    w -= amount;
    this.set("wallet", w);

    this.addWalletHistory({
      type: "debit",
      amount,
      time: Date.now()
    });

    return true;
  },

  getWallet() {
    return this.get("wallet", 0);
  },

  /* ================= WALLET HISTORY ================= */

  getWalletHistory() {
    return this.get("wallet_history", []);
  },

  addWalletHistory(item) {
    let h = this.getWalletHistory();
    h.unshift(item);
    this.set("wallet_history", h);
  },

  /* ================= TOURNAMENT ================= */

  getTournaments() {
    return this.get("tournaments", []);
  },

  saveTournament(t) {
    let list = this.getTournaments();
    t.id = "T_" + Date.now();
    t.createdAt = Date.now();
    t.players = [];
    list.unshift(t);
    this.set("tournaments", list);
    return t;
  },

  getTournamentById(id) {
    return this.getTournaments().find(t => t.id === id);
  },

  joinTournament(tid, player) {
    let list = this.getTournaments();
    let t = list.find(x => x.id === tid);
    if (!t) return false;

    if (t.players.length >= t.maxPlayers) return false;

    player.slot = t.players.length + 1;
    player.joinedAt = Date.now();
    t.players.push(player);

    this.set("tournaments", list);
    return player.slot;
  },

  /* ================= WINNER ================= */

  setWinners(tid, winners) {
    let list = this.getTournaments();
    let t = list.find(x => x.id === tid);
    if (!t) return false;

    t.winners = winners;
    t.finished = true;
    t.finishedAt = Date.now();

    this.set("tournaments", list);
    return true;
  },

  /* ================= PROOF ================= */

  submitProof(tid, proof) {
    let proofs = this.get("proofs", []);
    proof.tournamentId = tid;
    proof.time = Date.now();
    proof.status = "pending";
    proofs.unshift(proof);
    this.set("proofs", proofs);
  },

  getProofs() {
    return this.get("proofs", []);
  },

  approveProof(index) {
    let proofs = this.getProofs();
    proofs[index].status = "approved";
    this.set("proofs", proofs);
  },

  rejectProof(index) {
    let proofs = this.getProofs();
    proofs[index].status = "rejected";
    this.set("proofs", proofs);
  },

  /* ================= WITHDRAW ================= */

  requestWithdraw(req) {
    let list = this.get("withdraw_requests", []);
    req.status = "pending";
    req.time = Date.now();
    list.unshift(req);
    this.set("withdraw_requests", list);
  },

  getWithdrawRequests() {
    return this.get("withdraw_requests", []);
  },

  approveWithdraw(index) {
    let list = this.getWithdrawRequests();
    list[index].status = "approved";
    this.set("withdraw_requests", list);
  },

  rejectWithdraw(index) {
    let list = this.getWithdrawRequests();
    list[index].status = "rejected";
    this.set("withdraw_requests", list);
  }

};
