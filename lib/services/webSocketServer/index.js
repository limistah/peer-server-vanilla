"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketServer = void 0;

var _events = _interopRequireDefault(require("events"));

var _http = require("http");

var _url = _interopRequireDefault(require("url"));

var _ws = _interopRequireDefault(require("ws"));

var _config = require("../../config");

var _enums = require("../../enums");

var _client = require("../../models/client");

var _realm = require("../../models/realm");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const WS_PATH = "peerjs";

class WebSocketServer extends _events.default {
  constructor(_ref) {
    let {
      server,
      realm,
      config
    } = _ref;
    super();

    _defineProperty(this, "path", null);

    _defineProperty(this, "realm", null);

    _defineProperty(this, "config", null);

    _defineProperty(this, "socketServer", {});

    this.setMaxListeners(0);
    this.realm = realm;
    this.config = config;
    const path = this.config.path;
    this.path = "".concat(path).concat(path.endsWith("/") ? "" : "/").concat(WS_PATH);
    this.socketServer = new _ws.default.Server({
      path: this.path,
      server
    });
    this.socketServer.on("connection", (socket, req) => this._onSocketConnection(socket, req));
    this.socketServer.on("error", error => this._onSocketError(error));
  }

  _onSocketConnection(socket, req) {
    const {
      query = {}
    } = _url.default.parse(req.url, true);

    const {
      id,
      token,
      key
    } = query;
    console.log(query);

    if (!id || !token || !key) {
      return this._sendErrorAndClose(socket, _enums.Errors.INVALID_WS_PARAMETERS);
    }

    if (key !== this.config.key) {
      return this._sendErrorAndClose(socket, _enums.Errors.INVALID_KEY);
    }

    const client = this.realm.getClientById(id);

    if (client) {
      if (token !== client.getToken()) {
        // ID-taken, invalid token
        socket.send(JSON.stringify({
          type: _enums.MessageType.ID_TAKEN,
          payload: {
            msg: "ID is taken"
          }
        }));
        return socket.close();
      }

      return this._configureWS(socket, client);
    }

    this._registerClient({
      socket,
      id,
      token
    });
  }

  _onSocketError(error) {
    // handle error
    this.emit("error", error);
  }

  _registerClient(_ref2) {
    let {
      socket,
      id,
      token
    } = _ref2;
    // Check concurrent limit
    const clientsCount = this.realm.getClientsIds().length;

    if (clientsCount >= this.config.concurrent_limit) {
      return this._sendErrorAndClose(socket, _enums.Errors.CONNECTION_LIMIT_EXCEED);
    }

    const newClient = new _client.Client({
      id,
      token
    });
    this.realm.setClient(newClient, id);
    socket.send(JSON.stringify({
      type: _enums.MessageType.OPEN
    }));

    this._configureWS(socket, newClient);
  }

  _configureWS(socket, client) {
    client.setSocket(socket); // Cleanup after a socket closes.

    socket.on("close", () => {
      if (client.getSocket() === socket) {
        this.realm.removeClientById(client.getId());
        this.emit("close", client);
      }
    }); // Handle messages from peers.

    socket.on("message", data => {
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
    socket.send(JSON.stringify({
      type: _enums.MessageType.ERROR,
      payload: {
        msg
      }
    }));
    socket.close();
  }

}

exports.WebSocketServer = WebSocketServer;