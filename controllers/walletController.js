const { readData, writeData } = require("../data/store");

function createNewWallet(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    const data = await readData();
    const { name } = JSON.parse(body);
    const user = data.users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    if (!name) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Name is required" }));
      return;
    }

    const newWallet = {
      id: crypto.randomUUID(),
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

    const user = data.users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    if (!amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "amount is required" }));
      return;
    }
    const wallet = data.wallets.find((wal) => wal.id === walletId);

    if (!wallet) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Wallet not found" }));
      return;
    }

    wallet.amount += Number(amount);

    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ wallet }));
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

    const user = data.users.find((user) => user.id === id);
    if (!user) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    if (!amount) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "amount is required" }));
      return;
    }
    const wallet = data.wallets.find((wal) => wal.id === walletId);

    if (!wallet) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Wallet not found" }));
      return;
    }

    if (amount > wallet.amount) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Cannot withdraw this amount" }));
    }

    wallet.amount -= Number(amount);

    writeData(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ wallet }));
  });
}

module.exports = { createNewWallet, deposit, withdraw };
