"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Api = void 0;

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _app = _interopRequireDefault(require("../../app.json"));

var _auth = require("./middleware/auth");

var _calls = _interopRequireDefault(require("./v1/calls"));

var _public = _interopRequireDefault(require("./v1/public"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Api = (_ref) => {
  let {
    config,
    realm,
    messageHandler
  } = _ref;
  const authMiddleware = new _auth.AuthMiddleware(config, realm);

  const app = _express.default.Router();

  const jsonParser = _bodyParser.default.json();

  app.use((0, _cors.default)());
  app.get("/", (_, res) => {
    res.send(_app.default);
  });
  app.get("/port", function (req, res, next) {
    return res.status(200).json({
      PORT: config.port
    });
  });
  app.use("/:key", (0, _public.default)({
    config,
    realm
  }));
  app.use("/:key/:id/:token", authMiddleware.handle, jsonParser, (0, _calls.default)({
    realm,
    messageHandler
  }));
  return app;
};

exports.Api = Api;