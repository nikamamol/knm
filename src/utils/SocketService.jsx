// src/services/socketService.js

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000"; // Update with your server URL

class SocketService {
  socket;

  connect() {
    this.socket = io(SOCKET_URL);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }
}

const socketService = new SocketService();
export default socketService;
