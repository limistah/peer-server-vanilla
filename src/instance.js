import express from "express";
import { Server } from "net";
import path from "path";
import { Realm } from "./models/realm";
import { CheckBrokenConnections } from "./services/checkBrokenConnections";
import { IMessagesExpire, MessagesExpire } from "./services/messagesExpire";
import { IWebSocketServer, WebSocketServer } from "./services/webSocketServer";
import { MessageHandler } from "./messageHandler";
import { Api } from "./api";

export const realm = new Realm();

export const createInstance = ({ app, server, options }) => {
  const config = options;
  const messageHandler = new MessageHandler(realm);

  const api = Api({ config, realm, messageHandler });
  const messagesExpire = new MessagesExpire({ realm, config, messageHandler });
  const checkBrokenConnections = new CheckBrokenConnections({
    realm,
    config,
    onClose: (client) => {
      app.emit("disconnect", client);
    },
  });

  app.use(options.path, api);

  app.get("/port", function (req, res, next) {
    return res.status(200).json({ PORT: options.port });
  });

  //use mountpath for WS server
  const customConfig = {
    ...config,
    path: path.posix.join(app.path(), options.path, "/"),
  };

  const wss = new WebSocketServer({
    server,
    realm,
    config: customConfig,
  });

  wss.on("connection", (client) => {
    const messageQueue = realm.getMessageQueueById(client.getId());

    if (messageQueue) {
      let message;

      while ((message = messageQueue.readMessage())) {
        messageHandler.handle(client, message);
      }
      realm.clearMessageQueue(client.getId());
    }

    app.emit("connection", client);
  });

  wss.on("message", (client, message) => {
    app.emit("message", client, message);
    messageHandler.handle(client, message);
  });

  wss.on("close", (client) => {
    app.emit("disconnect", client);
  });

  wss.on("error", (error) => {
    app.emit("error", error);
  });

  messagesExpire.startMessagesExpiration();
  checkBrokenConnections.start();
};
