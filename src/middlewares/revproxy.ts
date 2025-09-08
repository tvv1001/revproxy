import type { RequestHandler } from "express";

import child_process from "child_process";
import fs from "fs";
// import http from "http";
// import https from "https";
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

const ApiProxy =
  typeof env.ASPNETCORE_HTTPS_PORT === "string" && env.ASPNETCORE_HTTPS_PORT !== ""
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : typeof env.ASPNETCORE_URLS === "string" && env.ASPNETCORE_URLS !== ""
      ? env.ASPNETCORE_URLS.split(";")[0]
      : "https://localhost:7194";

console.log("ApiProxy");
console.log(ApiProxy);
console.log(certFilePath);
console.log(keyFilePath);
// Path to your SSL/TLS certificate and key
// const sslOptions = {
//   cert: fs.readFileSync(certFilePath),
//   key: fs.readFileSync(keyFilePath),
// };
// const serverOne = "http://localhost:4000";
// const serverTwo = "http://localhost:4001";

// // Proxy server routing to the target Server 1
// app.all("/ninja-app1", (req, res) => {
//   console.log("Hey Ninja! Redirecting to Server1");
//   res.redirect(serverOne);
// });

// // Proxy server routing to the target Server 1
// app.all("/ninja-app2/", (req, res) => {
//   console.log("Hey Ninja! Redirecting to Server2");
//   res.redirect(serverTwo);
// });

export const middleware: RequestHandler = (req, res) => {
  console.log("req");
  console.log(req.path);
  console.log(req.hostname);
  console.log(req.ip);
  console.log("res");
  console.log(res.headersSent);
  console.log(res.statusCode);
  // req.url is a string property, not a function
  // If you want to log or use the URL, access it directly:
  console.log(req.url);

  if (req.path === "/test") {
    res.send(ApiProxy);
  } else {
    res.send(`Hello from the middleware! You requested: ${req.path}`);
  }
};
