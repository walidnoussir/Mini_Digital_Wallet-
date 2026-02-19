const { readData } = require("../data/store");

function deposit(req, res, id) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const data = readData();
    const user = data.users.find((user) => user.id === id);
  });
}
