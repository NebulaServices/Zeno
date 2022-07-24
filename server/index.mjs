import BareServer from "@tomphttp/bare-server-node";
import { createServer as HTTPServer } from "http";
import { Server as StaticServer } from "node-static";
import fs from "fs";

const httpServer = HTTPServer();
const staticServer = new StaticServer("dist");
const bareServer = BareServer("/bare/");

const blacklist = [
  "accounts.google.com",
  "netflix.com",
  "www.netflix.com"
];

fs.readFile("dist/index.html", function (err, html) {
  if (err) {
    throw err; 
  }
  httpServer.on("request", (req, res) => {
    if (/^\/api/.test(req.url)) {
      return handleAPI(req, res);
    }
    for (let i in blacklist) {
      if (req.headers["x-bare-host"] === blacklist[i]) {
        res.writeHead(500);
        return res.end();
      }
    }
    if (bareServer.shouldRoute(req)) {
      bareServer.routeRequest(req, res);
    } else {
      if (req.url.includes(".")) staticServer.serve(req, res);
      else {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
      }
    }
  });
});

httpServer.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

httpServer.listen({
  port: 3001
});
