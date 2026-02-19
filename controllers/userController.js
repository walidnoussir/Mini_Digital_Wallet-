const { readData, writeData } = require("../data/store");

function getAllUsers(req, res) {
  const data = readData();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data.users));
}

function createUser(req, res) {
  let body = "";

  // collect the incoming data chunks
  req.on("data", (chunk) => {
    body += chunk;
  });

  // once all data has arrived
  req.on("end", () => {
    const { name } = JSON.parse(body);
    const data = readData();

    const newUser = {
      id: Date.now(), // simple unique id
      name,
    };

    data.users.push(newUser);
    writeData(data); // save to db.json

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newUser));
  });
}

module.exports = { getAllUsers, createUser };
