import { certPath, keyPath } from "./resolve.js";
import fs from "fs";
import https from "https";

export const options: https.ServerOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  minVersion: "TLSv1.2",
};
