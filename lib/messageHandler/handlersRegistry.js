"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HandlersRegistry = void 0;

var _enums = require("../enums");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HandlersRegistry {
  constructor() {
    _defineProperty(this, "handlers", new Map());
  }

  registerHandler(messageType, handler) {
    if (this.handlers.has(messageType)) return;
    this.handlers.set(messageType, handler);
  }

  handle(client, message) {
    const {
      type
    } = message;
    const handler = this.handlers.get(type);
    if (!handler) return false;
    return handler(client, message);
  }

}

exports.HandlersRegistry = HandlersRegistry;