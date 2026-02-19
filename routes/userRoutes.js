const { getAllUsers, createUser } = require("../controllers/userController");

function userRoutes(req, res) {
  if (req.method === "GET" && req.url === "/users") {
    return getAllUsers(req, res);
  }

  if (req.method === "POST" && req.url === "/users") {
    return createUser(req, res);
  }

  // if nothing matched, return null to let server know
  return null;
}

module.exports = userRoutes;
