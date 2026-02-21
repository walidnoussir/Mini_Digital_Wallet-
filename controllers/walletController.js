const { readData, writeData } = require("../data/store");

function createNewWallet(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const data = await readData();
    const { name } = JSON.parse(body);

    const user = data.users.find((user) => user.id == id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    if (!name) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Name is required" }));
      return;
    }

    const newWallet = {
      id: Date.now(),
      userId: id,
      name: name,
      userName: user.name,
      amount: 0,
    };

    data.wallets.push(newWallet);
    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ message: "Wallet created successfully", newWallet }),
    );
  });
}

function deposit(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const data = await readData();
    const { amount, walletId } = JSON.parse(body);

    const user = data.users.find((user) => user.id == id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    if (!amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Amount is required" }));
      return;
    }

    const wallet = data.wallets.find((wal) => wal.id === Number(walletId));
    if (!wallet) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Wallet not found" }));
      return;
    }

    wallet.amount += Number(amount);

    const historyRecord = {
      id: Date.now(),
      walletId: Number(walletId),
      userId: id,
      type: "deposit",
      amount: Number(amount),
      balanceAfter: wallet.amount,
      date: new Date().toISOString(),
    };

    data.history.push(historyRecord);
    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ wallet, transaction: historyRecord }));
  });
}

function withdraw(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const data = await readData();
    const { amount, walletId } = JSON.parse(body);

    const user = data.users.find((user) => user.id == id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    if (!amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Amount is required" }));
      return;
    }

    const wallet = data.wallets.find((wal) => wal.id === Number(walletId));
    if (!wallet) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Wallet not found" }));
      return;
    }

    if (amount > wallet.amount) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Cannot withdraw this amount" }));
      return;
    }

    wallet.amount -= Number(amount);

    const historyRecord = {
      id: Date.now(),
      walletId: Number(walletId),
      userId: id,
      type: "withdraw",
      amount: Number(amount),
      balanceAfter: wallet.amount,
      date: new Date().toISOString(),
    };

    data.history.push(historyRecord);
    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ wallet, transaction: historyRecord }));
  });
}

function updateWallet(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const data = await readData();
    const { walletId, name } = JSON.parse(body);

    const user = data.users.find((user) => user.id == id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const wallet = data.wallets.find((wal) => wal.id === Number(walletId));
    if (!wallet) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Wallet not found" }));
      return;
    }

    if (wallet.userId !== id) {
      res.writeHead(403, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized to update this wallet" }));
      return;
    }

    if (!name) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Name is required" }));
      return;
    }

    wallet.name = name;
    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Wallet updated successfully", wallet }));
  });
}

function deleteWallet(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const data = await readData();
    const { walletId } = JSON.parse(body);

    const user = data.users.find((user) => user.id == id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const wallet = data.wallets.find((wal) => wal.id === Number(walletId));
    if (!wallet) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Wallet not found" }));
      return;
    }

    if (wallet.userId !== id) {
      res.writeHead(403, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Unauthorized to delete this wallet" }));
      return;
    }

    data.wallets = data.wallets.filter((wal) => wal.id !== Number(walletId));
    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Wallet deleted successfully" }));
  });
}

async function getHistory(req, res, id) {
  const data = await readData();

  const user = data.users.find((user) => user.id == id);
  if (!user) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "User not found" }));
    return;
  }

  const userHistory = data.history.filter((record) => record.userId == id);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ history: userHistory }));
}

module.exports = {
  createNewWallet,
  deposit,
  withdraw,
  updateWallet,
  deleteWallet,
  getHistory,
};
