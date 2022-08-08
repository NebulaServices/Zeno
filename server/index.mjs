import BareServer from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import path from "node:path";

const config = {
  port: process.env.PORT || 3001,
  bare: "/bare/"
}
const __dirname = path.resolve();
const app = express();
const server = createServer(app);
const bareServer = BareServer(config.bare);

const blacklist = [
  "accounts.google.com",
  "netflix.com",
  "www.netflix.com"
];

app.use((req, res, next) => {
  if (bareServer.shouldRoute(req)) {
    for (let i in blacklist) if (req.headers["x-bare-host"] === blacklist[i]) return res.send();
    bareServer.routeRequest(req, res);
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen({
  port: config.port
});

console.log(`Server listening on port ${config.port}`);
