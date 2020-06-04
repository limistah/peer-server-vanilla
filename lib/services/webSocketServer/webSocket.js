"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MyWebSocket = void 0;

var _events = _interopRequireDefault(require("events"));

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MyWebSocket = _ws.default & _events.default;
exports.MyWebSocket = MyWebSocket;