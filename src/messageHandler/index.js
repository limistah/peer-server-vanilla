import { MessageType } from "../enums";
import { HeartbeatHandler, TransmissionHandler } from "./handlers";
import { HandlersRegistry } from "./handlersRegistry";

export class MessageHandler {
  constructor(realm, handlersRegistry = new HandlersRegistry()) {
    this.handlersRegistry = handlersRegistry;
    const transmissionHandler = TransmissionHandler({ realm });
    const heartbeatHandler = HeartbeatHandler;

    const handleTransmission = (client, { type, src, dst, payload }) => {
      return transmissionHandler(client, {
        type,
        src,
        dst,
        payload,
      });
    };

    const handleHeartbeat = (client, message) =>
      heartbeatHandler(client, message);

    this.handlersRegistry.registerHandler(
      MessageType.HEARTBEAT,
      handleHeartbeat
    );
    this.handlersRegistry.registerHandler(
      MessageType.OFFER,
      handleTransmission
    );
    this.handlersRegistry.registerHandler(
      MessageType.ANSWER,
      handleTransmission
    );
    this.handlersRegistry.registerHandler(
      MessageType.CANDIDATE,
      handleTransmission
    );
    this.handlersRegistry.registerHandler(
      MessageType.LEAVE,
      handleTransmission
    );
    this.handlersRegistry.registerHandler(
      MessageType.EXPIRE,
      handleTransmission
    );
  }

  handle(client, message) {
    return this.handlersRegistry.handle(client, message);
  }
}
