"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessagesExpire = void 0;

var _enums = require("../enums");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MessagesExpire {
  constructor(_ref) {
    let {
      realm,
      config,
      messageHandler
    } = _ref;

    _defineProperty(this, "realm", null);

    _defineProperty(this, "config", null);

    _defineProperty(this, "messageHandler", null);

    _defineProperty(this, "timeoutId", null);

    this.realm = realm;
    this.config = config;
    this.messageHandler = messageHandler;
  }

  startMessagesExpiration() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    } // Clean up outstanding messages


    this.timeoutId = setTimeout(() => {
      this.pruneOutstanding();
      this.timeoutId = null;
      this.startMessagesExpiration();
    }, this.config.cleanup_out_msgs);
  }

  stopMessagesExpiration() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  pruneOutstanding() {
    const destinationClientsIds = this.realm.getClientsIdsWithQueue();
    const now = new Date().getTime();
    const maxDiff = this.config.expire_timeout;
    const seen = {};

    for (const destinationClientId of destinationClientsIds) {
      const messageQueue = this.realm.getMessageQueueById(destinationClientId);
      const lastReadDiff = now - messageQueue.getLastReadAt();
      if (lastReadDiff < maxDiff) continue;
      const messages = messageQueue.getMessages();

      for (const message of messages) {
        const seenKey = "".concat(message.src, "_").concat(message.dst);

        if (!seen[seenKey]) {
          this.messageHandler.handle(undefined, {
            type: _enums.MessageType.EXPIRE,
            src: message.dst,
            dst: message.src
          });
          seen[seenKey] = true;
        }
      }

      this.realm.clearMessageQueue(destinationClientId);
    }
  }

}

exports.MessagesExpire = MessagesExpire;