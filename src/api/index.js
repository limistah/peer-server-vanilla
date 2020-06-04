import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import publicContent from "../../app.json";
import { AuthMiddleware } from "./middleware/auth";
import CallsApi from "./v1/calls";
import PublicApi from "./v1/public";

export const Api = ({ config, realm, messageHandler }) => {
  const authMiddleware = new AuthMiddleware(config, realm);

  const app = express.Router();

  const jsonParser = bodyParser.json();

  app.use(cors());

  app.get("/", (_, res) => {
    res.send(publicContent);
  });

  app.get("/port", function (req, res, next) {
    return res.status(200).json({ PORT: config.port });
  });

  app.use("/:key", PublicApi({ config, realm }));
  app.use(
    "/:key/:id/:token",
    authMiddleware.handle,
    jsonParser,
    CallsApi({ realm, messageHandler })
  );

  return app;
};
