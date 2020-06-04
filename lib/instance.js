"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstance = exports.realm = void 0;

var _express = _interopRequireDefault(require("express"));

var _net = require("net");

var _path = _interopRequireDefault(require("path"));

var _realm = require("./models/realm");

var _checkBrokenConnections = require("./services/checkBrokenConnections");

var _messagesExpire = require("./services/messagesExpire");

var _webSocketServer = require("./services/webSocketServer");

var _messageHandler = require("./messageHandler");

var _api = require("./api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const realm = new _realm.Realm();
exports.realm = realm;

const createInstance = (_ref) => {
  let {
    app,
    server,
    options
  } = _ref;
  const config = options;
  const messageHandler = new _messageHandler.MessageHandler(realm);
  const api = (0, _api.Api)({
    config,
    realm,
    messageHandler
  });
  const messagesExpire = new _messagesExpire.MessagesExpire({
    realm,
    config,
    messageHandler
  });
  const checkBrokenConnections = new _checkBrokenConnections.CheckBrokenConnections({
    realm,
    config,
    onClose: client => {
      app.emit("disconnect", client);
    }
  });
  app.use(options.path, api);
  app.get("/port", function (req, res, next) {
    return res.status(200).json({
      PORT: options.port
    });
  }); //use mountpath for WS server

  const customConfig = _objectSpread(_objectSpread({}, config), {}, {
    path: _path.default.posix.join(app.path(), options.path, "/")
  });

  const wss = new _webSocketServer.WebSocketServer({
    server,
    realm,
    config: customConfig
  });
  wss.on("connection", client => {
    const messageQueue = realm.getMessageQueueById(client.getId());

    if (messageQueue) {
      let message;

      while (message = messageQueue.readMessage()) {
        messageHandler.handle(client, message);
      }

      realm.clearMessageQueue(client.getId());
    }

    app.emit("connection", client);
  });
  wss.on("message", (client, message) => {
    app.emit("message", client, message);
    messageHandler.handle(client, message);
  });
  wss.on("close", client => {
    app.emit("disconnect", client);
  });
  wss.on("error", error => {
    app.emit("error", error);
  });
  messagesExpire.startMessagesExpiration();
  checkBrokenConnections.start();
};

exports.createInstance = createInstance;