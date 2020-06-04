"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageHandler = void 0;

var _enums = require("../enums");

var _handlers = require("./handlers");

var _handlersRegistry = require("./handlersRegistry");

class MessageHandler {
  constructor(realm) {
    let handlersRegistry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _handlersRegistry.HandlersRegistry();
    this.handlersRegistry = handlersRegistry;
    const transmissionHandler = (0, _handlers.TransmissionHandler)({
      realm
    });
    const heartbeatHandler = _handlers.HeartbeatHandler;

    const handleTransmission = (client, _ref) => {
      let {
        type,
        src,
        dst,
        payload
      } = _ref;
      return transmissionHandler(client, {
        type,
        src,
        dst,
        payload
      });
    };

    const handleHeartbeat = (client, message) => heartbeatHandler(client, message);

    this.handlersRegistry.registerHandler(_enums.MessageType.HEARTBEAT, handleHeartbeat);
    this.handlersRegistry.registerHandler(_enums.MessageType.OFFER, handleTransmission);
    this.handlersRegistry.registerHandler(_enums.MessageType.ANSWER, handleTransmission);
    this.handlersRegistry.registerHandler(_enums.MessageType.CANDIDATE, handleTransmission);
    this.handlersRegistry.registerHandler(_enums.MessageType.LEAVE, handleTransmission);
    this.handlersRegistry.registerHandler(_enums.MessageType.EXPIRE, handleTransmission);
  }

  handle(client, message) {
    return this.handlersRegistry.handle(client, message);
  }

}

exports.MessageHandler = MessageHandler;