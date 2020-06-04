import express from "express";
import http from "http";
import https from "https";
import { Server } from "net";

import defaultConfig, { IConfig } from "./config";
import { createInstance, realm } from "./instance";

function ExpressPeerServer(server, options) {
  const app = express();

  const newOptions = {
    ...defaultConfig,
    ...options,
  };

  if (newOptions.proxied) {
    app.set(
      "trust proxy",
      newOptions.proxied === "false" ? false : !!newOptions.proxied
    );
  }

  app.on("mount", () => {
    if (!server) {
      throw new Error(
        "Server is not passed to constructor - " + "can't start PeerServer"
      );
    }

    createInstance({ app, server, options: newOptions });
  });

  return app;
}

function PeerServer(options = {}, callback = (server) => {}) {
  const app = express();

  const newOptions = {
    ...defaultConfig,
    ...options,
  };

  const port = newOptions.port;

  let server;

  if (newOptions.ssl && newOptions.ssl.key && newOptions.ssl.cert) {
    server = https.createServer(options.ssl, app);
    delete newOptions.ssl;
  } else {
    server = http.createServer(app);
  }

  const peerjs = ExpressPeerServer(server, newOptions);
  app.use(peerjs);

  server.listen(port, () => callback?.(server));

  return peerjs;
}

export { ExpressPeerServer, PeerServer, realm };
