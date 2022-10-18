import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "../../types/next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    res.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on("message", (message) => {
        console.log("Message received", message);

        // Send message to all connected clients
        // io.emit("message", message);
        socket.emit("message", message);
      });
      socket.onAny((event, ...args) => {
        console.log(`got "${event}" with args`, args);
      });
      console.log("3214", socket.id);
    });
    io.on("message", (socket) => {
      console.log("message", socket);
    });
  }
  res.end();
};
