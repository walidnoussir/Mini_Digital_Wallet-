const http = require("http");
const userRoutes = require("./routes/userRoutes");

const server = http.createServer((req, res) => {
  // try user routes first
  if (userRoutes(req, res) !== null) return;

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(3000, () => console.log("Server running on port 3000"));
