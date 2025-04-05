import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  const token = localStorage.getItem('token');
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
};