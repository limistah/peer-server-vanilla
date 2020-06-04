export class Client {
  id = null;
  token = null;
  socket = null;
  lastPing = new Date().getTime();

  constructor({ id, token }) {
    this.id = id;
    this.token = token;
  }

  getId() {
    return this.id;
  }

  getToken() {
    return this.token;
  }

  getSocket() {
    return this.socket;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  getLastPing() {
    return this.lastPing;
  }

  setLastPing(lastPing) {
    this.lastPing = lastPing;
  }

  send(data) {
    this.socket?.send(JSON.stringify(data));
  }
}
