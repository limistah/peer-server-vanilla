import { v4 as uuidv4 } from "uuid";
import { MessageQueue } from "./messageQueue";

export const IRealm = {
  getClientsIds() {},

  getClientById(clientId) {},

  getClientsIdsWithQueue() {},

  setClient(client, id) {},

  removeClientById(id) {},

  getMessageQueueById(id) {},

  addMessageToQueue(id, message) {},

  clearMessageQueue(id) {},

  generateClientId(generateClientId = () => {}) {},
};

export class Realm {
  clients = new Map();
  messageQueues = new Map();

  getClientsIds() {
    return [...this.clients.keys()];
  }

  getClientById(clientId) {
    return this.clients.get(clientId);
  }

  getClientsIdsWithQueue() {
    return [...this.messageQueues.keys()];
  }

  setClient(client, id) {
    this.clients.set(id, client);
  }

  removeClientById(id) {
    const client = this.getClientById(id);

    if (!client) return false;

    this.clients.delete(id);

    return true;
  }

  getMessageQueueById(id) {
    return this.messageQueues.get(id);
  }

  addMessageToQueue(id, message) {
    if (!this.getMessageQueueById(id)) {
      this.messageQueues.set(id, new MessageQueue());
    }

    this.getMessageQueueById(id).addMessage(message);
  }

  clearMessageQueue(id) {
    this.messageQueues.delete(id);
  }

  generateClientId(generateClientId) {
    const generateId = generateClientId ? generateClientId : uuidv4;

    let clientId = generateId();

    while (this.getClientById(clientId)) {
      clientId = generateId();
    }

    return clientId;
  }
}
