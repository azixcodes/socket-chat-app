import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import url from "url";

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

const broadcast = (message) => {
  console.log("message in broadcase is ", message);
  const stringifiedMessage = JSON.stringify(message); // Stringify the message here
  Object.keys(connections).forEach((id) => {
    connections[id].send(stringifiedMessage); // Send the stringified message
  });
};

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString());

  users[uuid].status = message.text;
  broadcast(message);
};

const handleClose = (uuid) => {
  console.log(`${users[uuid].username} disconnected.`);
  delete connections[uuid];

  delete users[uuid];
  broadcast();
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  const uniqueId = uuidv4();
  console.log(`username is ${username} and ID is ${uniqueId}`);

  connections[uniqueId] = connection;
  users[uniqueId] = {
    username,
    status: {},
  };

  connection.on("message", (message) => handleMessage(message, uniqueId));
  connection.on("close", () => handleClose(uniqueId));
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
