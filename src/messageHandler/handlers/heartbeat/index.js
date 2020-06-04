export const HeartbeatHandler = (client) => {
  if (client) {
    const nowTime = new Date().getTime();
    client.setLastPing(nowTime);
  }

  return true;
};
