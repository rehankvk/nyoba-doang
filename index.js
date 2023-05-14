const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("user joined", (username) => {
    socket.username = username;
    users.push(username);
    io.emit("user list", users);
    socket.broadcast.emit("chat message", username + " joined the chat");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", socket.username + ": " + msg);
  });

  socket.on("disconnect", () => {
    console.log(socket.username + " disconnected");
    const index = users.indexOf(socket.username);
    if (index !== -1) {
      users.splice(index, 1);
    }
    io.emit("user list", users);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
