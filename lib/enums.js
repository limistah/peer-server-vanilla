"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageType = exports.Errors = void 0;
const Errors = {
  INVALID_KEY: "Invalid key provided",
  INVALID_TOKEN: "Invalid token provided",
  INVALID_WS_PARAMETERS: "No id, token, or key supplied to websocket server",
  CONNECTION_LIMIT_EXCEED: "Server has reached its concurrent user limit"
};
exports.Errors = Errors;
const MessageType = {
  OPEN: "OPEN",
  LEAVE: "LEAVE",
  CANDIDATE: "CANDIDATE",
  OFFER: "OFFER",
  ANSWER: "ANSWER",
  EXPIRE: "EXPIRE",
  HEARTBEAT: "HEARTBEAT",
  ID_TAKEN: "ID-TAKEN",
  ERROR: "ERROR"
};
exports.MessageType = MessageType;