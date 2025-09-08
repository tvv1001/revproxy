import { middleware } from "#middlewares/revproxy.ts";
import child_process from "child_process";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import { env } from "node:process";
import path from "path";

const baseFolder =
  typeof env.APPDATA === "string" && env.APPDATA !== ""
    ? `${env.APPDATA}/ASP.NET/https`
    : typeof env.HOME === "string" && env.HOME !== ""
      ? `${env.HOME}/.aspnet/https`
      : (() => {
          throw new Error("Neither APPDATA nor HOME environment variables are set.");
        })();

const certificateName = "reactapp1.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (
    0 !==
    child_process.spawnSync("dotnet", ["dev-certs", "https", "--export-path", certFilePath, "--format", "Pem", "--no-password"], { stdio: "inherit" })
      .status
  ) {
    throw new Error("Could not create certificate.");
  }
}

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(";")[0]
    : "https://localhost:7194";

// Path to your SSL/TLS certificate and key
const sslOptions = {
  cert: fs.readFileSync(certFilePath),
  key: fs.readFileSync(keyFilePath),
};

const app = express();
app.get("/", middleware);
// Create the HTTPS server
// https.createServer(sslOptions, (req, res) => {
//   // Security headers
//   res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
//   res.setHeader("X-Content-Type-Options", "nosniff");
//   res.setHeader("X-Frame-Options", "SAMEORIGIN");
//   res.setHeader("X-XSS-Protection", "1; mode=block");
//   res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

//   // Handle different routes
//   if (req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
//     res.end("<h1>Welcome to the Secure Server</h1><p>Your connection is encrypted!</p>");
//   } else if (req.url === "/api/status") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
//   } else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("404 Not Found");
//   }
// });

// Initialize Express app (if needed for additional middleware)
const httpServer = http.createServer({}, app);

httpServer.listen(80, () => {
  console.log("hello world");
  console.log("HTTPS Server running on 80");
  console.log(target);
});

// Initialize Express app (if needed for additional middleware)
const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(443, () => {
  console.log("hello world");
  console.log("HTTPS Server running on 443");
  console.log(target);
});
