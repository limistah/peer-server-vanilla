import express from "express";
import { IConfig } from "../../config";
import { Errors } from "../../enums";

export class AuthMiddleware {
  constructor(config, realm) {}

  handle = (req, res, next) => {
    const { id, token, key } = req.params;

    if (key !== this.config.key) {
      return res.status(401).send(Errors.INVALID_KEY);
    }

    if (!id) {
      return res.sendStatus(401);
    }

    const client = this.realm.getClientById(id);

    if (!client) {
      return res.sendStatus(401);
    }

    if (client.getToken() && token !== client.getToken()) {
      return res.status(401).send(Errors.INVALID_TOKEN);
    }

    next();
  };
}
