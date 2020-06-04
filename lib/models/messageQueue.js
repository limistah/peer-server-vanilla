"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageQueue = exports.IMessageQueue = void 0;

var _message = require("./message");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const IMessageQueue = {
  getLastReadAt() {},

  addMessage(message) {},

  readMessage() {},

  getMessages() {}

};
exports.IMessageQueue = IMessageQueue;

class MessageQueue {
  constructor() {
    _defineProperty(this, "lastReadAt", new Date().getTime());

    _defineProperty(this, "messages", []);
  }

  getLastReadAt() {
    return this.lastReadAt;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  readMessage() {
    if (this.messages.length > 0) {
      this.lastReadAt = new Date().getTime();
      return this.messages.shift();
    }

    return undefined;
  }

  getMessages() {
    return this.messages;
  }

}

exports.MessageQueue = MessageQueue;