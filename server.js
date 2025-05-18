const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const users = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("user_join", (username) => {
    users[socket.id] = username;
    console.log(`${username} joined the chat`);

    io.emit("user_joined", {
      user: username,
      message: `${username} joined the chat`,
      userId: socket.id,
      users: Object.values(users),
    });
  });

  socket.on("chat_message", (data) => {
    console.log(`Message from ${users[socket.id]}: ${data.message}`);

    io.emit("message", {
      user: users[socket.id],
      userId: socket.id,
      message: data.message,
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("typing", () => {
    socket.broadcast.emit("user_typing", {
      user: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      console.log(`${users[socket.id]} disconnected`);
      io.emit("user_left", {
        user: users[socket.id],
        message: `${users[socket.id]} left the chat`,
        users: Object.values(users).filter((user) => user !== users[socket.id]),
      });

      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
