"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckBrokenConnections = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_CHECK_INTERVAL = 300;

class CheckBrokenConnections {
  constructor(_ref) {
    let {
      realm,
      config,
      checkInterval = DEFAULT_CHECK_INTERVAL,
      onClose
    } = _ref;

    _defineProperty(this, "checkInterval", NaN);

    _defineProperty(this, "timeoutId", null);

    _defineProperty(this, "realm", null);

    _defineProperty(this, "config", null);

    _defineProperty(this, "onClose", client => {});

    this.realm = realm;
    this.config = config;
    this.onClose = onClose;
    this.checkInterval = checkInterval;
  }

  start() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.checkConnections();
      this.timeoutId = null;
      this.start();
    }, this.checkInterval);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  checkConnections() {
    const clientsIds = this.realm.getClientsIds();
    const now = new Date().getTime();
    const {
      alive_timeout: aliveTimeout
    } = this.config;

    for (const clientId of clientsIds) {
      const client = this.realm.getClientById(clientId);
      const timeSinceLastPing = now - client.getLastPing();
      if (timeSinceLastPing < aliveTimeout) continue;

      try {
        var _client$getSocket;

        (_client$getSocket = client.getSocket()) === null || _client$getSocket === void 0 ? void 0 : _client$getSocket.close();
      } finally {
        var _this$onClose;

        this.realm.clearMessageQueue(clientId);
        this.realm.removeClientById(clientId);
        client.setSocket(null);
        (_this$onClose = this.onClose) === null || _this$onClose === void 0 ? void 0 : _this$onClose.call(this, client);
      }
    }
  }

}

exports.CheckBrokenConnections = CheckBrokenConnections;