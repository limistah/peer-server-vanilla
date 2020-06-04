import { IMessage } from "./message";

export const IMessageQueue = {
  getLastReadAt() {},

  addMessage(message) {},

  readMessage() {},

  getMessages() {},
};

export class MessageQueue {
  lastReadAt = new Date().getTime();
  messages = [];

  getLastReadAt() {
    return this.lastReadAt;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  readMessage() {
    if (this.messages.length > 0) {
      this.lastReadAt = new Date().getTime();
      return this.messages.shift();
    }

    return undefined;
  }

  getMessages() {
    return this.messages;
  }
}
