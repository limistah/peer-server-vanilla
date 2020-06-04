"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthMiddleware = void 0;

var _express = _interopRequireDefault(require("express"));

var _config = require("../../config");

var _enums = require("../../enums");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class AuthMiddleware {
  constructor(config, realm) {
    _defineProperty(this, "handle", (req, res, next) => {
      const {
        id,
        token,
        key
      } = req.params;

      if (key !== this.config.key) {
        return res.status(401).send(_enums.Errors.INVALID_KEY);
      }

      if (!id) {
        return res.sendStatus(401);
      }

      const client = this.realm.getClientById(id);

      if (!client) {
        return res.sendStatus(401);
      }

      if (client.getToken() && token !== client.getToken()) {
        return res.status(401).send(_enums.Errors.INVALID_TOKEN);
      }

      next();
    });
  }

}

exports.AuthMiddleware = AuthMiddleware;