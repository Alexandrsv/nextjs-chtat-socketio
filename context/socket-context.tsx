import { io, Socket } from "socket.io-client";
import { createContext, FC, ReactNode, useEffect, useState } from "react";

export const SocketContext = createContext({
  socket: null as Socket | null,
  isConnected: false,
});

export const SocketContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    setSocket(
      io(process.env.BASE_URL || "/", {
        path: "/api/socketio",
      })
    );
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
      });
      socket.on("disconnect", () => {
        setIsConnected(false);
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
