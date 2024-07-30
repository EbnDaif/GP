const WebSocket = require("ws");
const executionLog = require("../models/executionLog");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
      const { id } = JSON.parse(message);
      const log = await executionLog.findById(id);

      if (log) {
        ws.send(JSON.stringify(log));
      } else {
        ws.send(JSON.stringify({ error: "Log not found" }));
      }
    });
  });
};
