import EventEmitter from "events";
import { IncomingMessage } from "http";
import url from "url";
import WebSocketLib from "ws";
import { IConfig } from "../../config";
import { Errors, MessageType } from "../../enums";
import { Client, IClient } from "../../models/client";
import { IRealm } from "../../models/realm";

const WS_PATH = "peerjs";

export class WebSocketServer extends EventEmitter {
  path = null;
  realm = null;
  config = null;
  socketServer = {};

  constructor({ server, realm, config }) {
    super();

    this.setMaxListeners(0);

    this.realm = realm;
    this.config = config;

    const path = this.config.path;
    this.path = `${path}${path.endsWith("/") ? "" : "/"}${WS_PATH}`;

    this.socketServer = new WebSocketLib.Server({ path: this.path, server });

    this.socketServer.on("connection", (socket, req) =>
      this._onSocketConnection(socket, req)
    );
    this.socketServer.on("error", (error) => this._onSocketError(error));
  }

  _onSocketConnection(socket, req) {
    const { query = {} } = url.parse(req.url, true);

    const { id, token, key } = query;

    if (!id || !token || !key) {
      return this._sendErrorAndClose(socket, Errors.INVALID_WS_PARAMETERS);
    }

    if (key !== this.config.key) {
      return this._sendErrorAndClose(socket, Errors.INVALID_KEY);
    }

    const client = this.realm.getClientById(id);

    if (client) {
      if (token !== client.getToken()) {
        // ID-taken, invalid token
        socket.send(
          JSON.stringify({
            type: MessageType.ID_TAKEN,
            payload: { msg: "ID is taken" },
          })
        );

        return socket.close();
      }

      return this._configureWS(socket, client);
    }

    this._registerClient({ socket, id, token });
  }

  _onSocketError(error) {
    // handle error
    this.emit("error", error);
  }

  _registerClient({ socket, id, token }) {
    // Check concurrent limit
    const clientsCount = this.realm.getClientsIds().length;

    if (clientsCount >= this.config.concurrent_limit) {
      return this._sendErrorAndClose(socket, Errors.CONNECTION_LIMIT_EXCEED);
    }

    const newClient = new Client({ id, token });
    this.realm.setClient(newClient, id);
    socket.send(JSON.stringify({ type: MessageType.OPEN }));

    this._configureWS(socket, newClient);
  }

  _configureWS(socket, client) {
    client.setSocket(socket);

    // Cleanup after a socket closes.
    socket.on("close", () => {
      if (client.getSocket() === socket) {
        this.realm.removeClientById(client.getId());
        this.emit("close", client);
      }
    });

    // Handle messages from peers.
    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data);

        message.src = client.getId();

        this.emit("message", client, message);
      } catch (e) {
        this.emit("error", e);
      }
    });

    this.emit("connection", client);
  }

  _sendErrorAndClose(socket, msg) {
    socket.send(
      JSON.stringify({
        type: MessageType.ERROR,
        payload: { msg },
      })
    );

    socket.close();
  }
}
