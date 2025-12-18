import { io } from "socket.io-client";

const { VITE_API_URL: baseURL } = import.meta.env;

let socketInstance = null;

export const connectSocket = (token) => {
  // console.log("🔵 SOCKET CONNECT START");
  // console.log("BASE_URL =", baseURL);
  // console.log("SOCKET_TOKEN =", token);

  if (socketInstance) return socketInstance;

  if (!token) {
    console.warn("No token passed to connectSocket()");
    return null;
  }

  socketInstance = io(baseURL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 10000,
    autoConnect: true,
  });

  // ДОБАВИЛ ДЛЯ ДЕБАГА
  // socketInstance.on("connect", () =>
  //   console.log("🟢 CONNECTED:", socketInstance.id)
  // );

  // socketInstance.on("connect_error", (err) =>
  //   console.log("🔴 CONNECT ERROR:", err.message)
  // );

  // socketInstance.on("disconnect", (reason) =>
  //   console.log("⚪ DISCONNECTED:", reason)
  // );

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
