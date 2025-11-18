
import { io } from 'socket.io-client';


const URL = 'https://chiplab-backend.onrender.com';


const socket = io(URL, {
  autoConnect: true,
});


socket.on('connect', () => {
  console.log('Connected to WebSocket server!', socket.id);
});

export default socket;
