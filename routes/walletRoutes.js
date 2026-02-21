const {
  deposit,
  createNewWallet,
  withdraw,
  updateWallet,
  deleteWallet,
  getHistory,
} = require("../controllers/walletController");

function walletRoutes(req, res) {
  if (req.method === "POST" && req.url.startsWith("/wallets/")) {
    const id = req.url.split("/")[2];
    return createNewWallet(req, res, id);
  }

  if (req.method === "PUT" && req.url.startsWith("/wallets/update/")) {
    const id = req.url.split("/")[3];
    return updateWallet(req, res, id);
  }

  if (req.method === "DELETE" && req.url.startsWith("/wallets/delete/")) {
    const id = req.url.split("/")[3];
    return deleteWallet(req, res, id);
  }

  if (req.method === "PUT" && req.url.startsWith("/wallets/deposit/")) {
    const id = req.url.split("/")[3];
    return deposit(req, res, id);
  }

  if (req.method === "PUT" && req.url.startsWith("/wallets/withdraw/")) {
    const id = req.url.split("/")[3];
    return withdraw(req, res, id);
  }

  if (req.method === "GET" && req.url.startsWith("/wallets/history/")) {
    const id = req.url.split("/")[3];
    return getHistory(req, res, id);
  }

  return null;
}

module.exports = walletRoutes;
