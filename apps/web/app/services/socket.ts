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
    const tokenResponse = await fetch(BASE_URL + "/users/token", {
      credentials: "include",
    });
    const { token } = await tokenResponse.json();

    socket = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: false,
    });

    return new Promise<Socket>((resolve, reject) => {
      socket!.connect();

      socket!.on("connect", () => {
        console.log("🔌 Socket connected");
        resolve(socket!);
      });

      socket!.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });
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
