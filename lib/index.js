"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressPeerServer = ExpressPeerServer;
exports.PeerServer = PeerServer;
Object.defineProperty(exports, "realm", {
  enumerable: true,
  get: function get() {
    return _instance.realm;
  }
});

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _https = _interopRequireDefault(require("https"));

var _net = require("net");

var _config = _interopRequireWildcard(require("./config"));

var _instance = require("./instance");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ExpressPeerServer(server, options) {
  const app = (0, _express.default)();

  const newOptions = _objectSpread(_objectSpread({}, _config.default), options);

  if (newOptions.proxied) {
    app.set("trust proxy", newOptions.proxied === "false" ? false : !!newOptions.proxied);
  }

  app.on("mount", () => {
    if (!server) {
      throw new Error("Server is not passed to constructor - " + "can't start PeerServer");
    }

    (0, _instance.createInstance)({
      app,
      server,
      options: newOptions
    });
  });
  return app;
}

function PeerServer() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : server => {};
  const app = (0, _express.default)();

  const newOptions = _objectSpread(_objectSpread({}, _config.default), options);

  const port = newOptions.port;
  let server;

  if (newOptions.ssl && newOptions.ssl.key && newOptions.ssl.cert) {
    server = _https.default.createServer(options.ssl, app);
    delete newOptions.ssl;
  } else {
    server = _http.default.createServer(app);
  }

  const peerjs = ExpressPeerServer(server, newOptions);
  app.use(peerjs);
  server.listen(port, () => callback === null || callback === void 0 ? void 0 : callback(server));
  return peerjs;
}