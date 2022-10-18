import type { NextPage } from "next";

import { useContext, useEffect } from "react";
import NewMessage from "../components/NewMessage";
import { SocketContext } from "../context/socket-context";
import Messages from "../components/Messages";

const Home: NextPage = () => {
  const { socket } = useContext(SocketContext);

  useEffect((): any => {
    if (socket) {
      console.log("socket", socket);
      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!", socket.id);
      });

      socket.emit("message", { text: "Hello from client" });

      socket.onAny((event, ...args) => {
        console.log(`got ${event} with args`, args);
      });
    }
    if (socket) return () => socket.disconnect();
  }, [socket]);

  return (
    <div
      className={
        "h-screen overflow-hidden bg-blue-50 flex px-5 pt-10 justify-stretch"
      }
    >
      <div
        className={
          "grow mx-auto max-w-3xl max-h-[900px] border border-1 shadow shadow-purple-600 bg-white"
        }
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className={"flex flex-col border border-1 shadow h-full"}>
          <Messages />
          <div className={"pt-9 "}>
            <NewMessage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
