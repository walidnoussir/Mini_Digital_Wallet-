const {
  deposit,
  createNewWallet,
  withdraw,
} = require("../controllers/walletController");

function walletRoutes(req, res) {
  if (req.method === "POST" && req.url.startsWith("/wallets/")) {
    const id = req.url.split("/")[2];
    return deposit(req, res, id);
  }

  if (req.method === "PUT" && req.url.startsWith("/wallets/")) {
    const id = req.url.split("/")[2];
    return withdraw(req, res, id);
  }

  if (req.method === "POST" && req.url.startsWith("/wallets/")) {
    const id = req.url.split("/")[2];
    return createNewWallet(req, res, id);
  }

  return null;
}

module.exports = walletRoutes;
