"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Realm = exports.IRealm = void 0;

var _uuid = require("uuid");

var _messageQueue = require("./messageQueue");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const IRealm = {
  getClientsIds() {},

  getClientById(clientId) {},

  getClientsIdsWithQueue() {},

  setClient(client, id) {},

  removeClientById(id) {},

  getMessageQueueById(id) {},

  addMessageToQueue(id, message) {},

  clearMessageQueue(id) {},

  generateClientId() {
    let generateClientId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : () => {};
  }

};
exports.IRealm = IRealm;

class Realm {
  constructor() {
    _defineProperty(this, "clients", new Map());

    _defineProperty(this, "messageQueues", new Map());
  }

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
      this.messageQueues.set(id, new _messageQueue.MessageQueue());
    }

    this.getMessageQueueById(id).addMessage(message);
  }

  clearMessageQueue(id) {
    this.messageQueues.delete(id);
  }

  generateClientId(generateClientId) {
    const generateId = generateClientId ? generateClientId : _uuid.v4;
    let clientId = generateId();

    while (this.getClientById(clientId)) {
      clientId = generateId();
    }

    return clientId;
  }

}

exports.Realm = Realm;