const DEFAULT_CHECK_INTERVAL = 300;

export class CheckBrokenConnections {
  checkInterval = NaN;
  timeoutId = null;
  realm = null;
  config = null;
  onClose = (client) => {};

  constructor({
    realm,
    config,
    checkInterval = DEFAULT_CHECK_INTERVAL,
    onClose,
  }) {
    this.realm = realm;
    this.config = config;
    this.onClose = onClose;
    this.checkInterval = checkInterval;
  }

  start() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.checkConnections();

      this.timeoutId = null;

      this.start();
    }, this.checkInterval);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  checkConnections() {
    const clientsIds = this.realm.getClientsIds();

    const now = new Date().getTime();
    const { alive_timeout: aliveTimeout } = this.config;

    for (const clientId of clientsIds) {
      const client = this.realm.getClientById(clientId);
      const timeSinceLastPing = now - client.getLastPing();

      if (timeSinceLastPing < aliveTimeout) continue;

      try {
        client.getSocket()?.close();
      } finally {
        this.realm.clearMessageQueue(clientId);
        this.realm.removeClientById(clientId);

        client.setSocket(null);

        this.onClose?.(client);
      }
    }
  }
}
