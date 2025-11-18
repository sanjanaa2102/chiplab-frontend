// src/socket.js
import { io } from 'socket.io-client';

// This is the address of your backend server
const URL = 'http://localhost:3001';

// Create the socket connection
const socket = io(URL, {
  autoConnect: true, // Automatically connect
});

// Log when we connect
socket.on('connect', () => {
  console.log('Connected to WebSocket server!', socket.id);
});

export default socket;