"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (_ref) => {
  let {
    config,
    realm
  } = _ref;

  const app = _express.default.Router(); // Retrieve guaranteed random ID.


  app.get("/id", (_, res) => {
    res.contentType("html");
    res.send(realm.generateClientId(config.generateClientId));
  }); // Get a list of all peers for a key, enabled by the `allowDiscovery` flag.

  app.get("/peers", (_, res) => {
    if (config.allow_discovery) {
      const clientsIds = realm.getClientsIds();
      return res.send(clientsIds);
    }

    res.sendStatus(401);
  });
  return app;
};

exports.default = _default;