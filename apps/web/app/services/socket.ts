import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let connectionPromise: Promise<Socket> | null = null;

export const getSocket = async (): Promise<Socket> => {
  if (socket && socket.connected) {
    return socket;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";

    socket = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });

    return new Promise<Socket>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Connection timeout"));
      }, 10000);

      socket!.on("connect", () => {
        clearTimeout(timeout);
        resolve(socket!);
      });

      socket!.on("connect_error", (error) => {
        clearTimeout(timeout);
        console.error("❌ Socket connection error:", error.message);
        reject(error);
      });

      socket!.connect();
    });
  })();

  try {
    const result = await connectionPromise;
    return result;
  } finally {
    connectionPromise = null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  connectionPromise = null;
};
