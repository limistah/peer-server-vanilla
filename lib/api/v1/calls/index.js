"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (_ref) => {
  let {
    realm,
    messageHandler
  } = _ref;

  const app = _express.default.Router();

  const handle = (req, res, next) => {
    const {
      id
    } = req.params;
    if (!id) return next();
    const client = realm.getClientById(id);

    if (!client) {
      throw new Error("client not found:".concat(id));
    }

    const {
      type,
      dst,
      payload
    } = req.body;
    const message = {
      type,
      src: id,
      dst,
      payload
    };
    messageHandler.handle(client, message);
    res.sendStatus(200);
  };

  app.post("/offer", handle);
  app.post("/candidate", handle);
  app.post("/answer", handle);
  app.post("/leave", handle);
  return app;
};

exports.default = _default;