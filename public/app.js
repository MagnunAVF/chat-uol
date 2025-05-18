document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const chatScreen = document.getElementById("chat-screen");
  const usernameInput = document.getElementById("username-input");
  const joinBtn = document.getElementById("join-btn");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesContainer = document.getElementById("messages-container");
  const typingIndicator = document.getElementById("typing-indicator");
  const onlineCount = document.getElementById("online-count");

  const socket = io();

  let username = "";
  let typingTimeout;

  joinBtn.addEventListener("click", joinChat);
  usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") joinChat();
  });

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
    else emitTyping();
  });

  function joinChat() {
    username = usernameInput.value.trim();

    if (username) {
      socket.emit("user_join", username);
      loginScreen.style.display = "none";
      chatScreen.style.display = "flex";
      messageInput.focus();
    } else {
      alert("Please enter a username");
    }
  }

  function sendMessage() {
    const message = messageInput.value.trim();

    if (message) {
      socket.emit("chat_message", { message });
      messageInput.value = "";
      messageInput.focus();
    }
  }

  function emitTyping() {
    clearTimeout(typingTimeout);
    socket.emit("typing");

    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000);
  }

  socket.on("user_joined", (data) => {
    displaySystemMessage(data.message);
    updateOnlineUsers(data.users);
  });

  socket.on("user_left", (data) => {
    displaySystemMessage(data.message);
    updateOnlineUsers(data.users);
  });

  socket.on("message", (data) => {
    displayMessage(data);
    typingIndicator.textContent = "";
  });

  socket.on("user_typing", (data) => {
    typingIndicator.textContent = `${data.user} is typing...`;
  });

  socket.on("stop_typing", () => {
    typingIndicator.textContent = "";
  });

  function displayMessage(data) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (data.userId === socket.id) {
      messageDiv.classList.add("sent");
    } else {
      messageDiv.classList.add("received");
    }

    messageDiv.innerHTML = `
            <div class="user">${data.user}</div>
            <div class="content">${data.message}</div>
            <div class="time">${data.time}</div>
        `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }

  function displaySystemMessage(message) {
    const systemDiv = document.createElement("div");
    systemDiv.classList.add("system-message");
    systemDiv.textContent = message;

    messagesContainer.appendChild(systemDiv);
    scrollToBottom();
  }

  function updateOnlineUsers(users) {
    onlineCount.textContent = users.length;
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
