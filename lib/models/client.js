"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Client = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Client {
  constructor(_ref) {
    let {
      id,
      token
    } = _ref;

    _defineProperty(this, "id", null);

    _defineProperty(this, "token", null);

    _defineProperty(this, "socket", null);

    _defineProperty(this, "lastPing", new Date().getTime());

    this.id = id;
    this.token = token;
  }

  getId() {
    return this.id;
  }

  getToken() {
    return this.token;
  }

  getSocket() {
    return this.socket;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  getLastPing() {
    return this.lastPing;
  }

  setLastPing(lastPing) {
    this.lastPing = lastPing;
  }

  send(data) {
    var _this$socket;

    (_this$socket = this.socket) === null || _this$socket === void 0 ? void 0 : _this$socket.send(JSON.stringify(data));
  }

}

exports.Client = Client;