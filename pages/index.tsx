import type { NextPage } from "next";

import { useContext, useEffect, useRef, useState } from "react";
import { IMessage } from "../types/socket-events";
import { useUser } from "../hooks/use-user";
import NewMessage from "../components/NewMessage";
import { SocketContext } from "../context/socket-context";

const Home: NextPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { username } = useUser();
  const { socket } = useContext(SocketContext);
  console.log("messages", { messages, username });

  useEffect(() => {
    // scroll to bottom
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect((): any => {
    if (socket) {
      console.log("socket", socket);
      socket.on("connect", () => {
        console.log("SOCKET CONNECTED!", socket.id);
      });

      socket.on("message", (message: IMessage) => {
        console.log("message", message);
        if (message?.id) {
          setMessages((messages) => [...messages, message]);
        }
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
        "h-screen overflow-hidden bg-blue-50 flex p-5 pt-10 justify-stretch"
      }
    >
      <div
        className={
          "grow mx-auto max-w-3xl max-h-[900px] border border-1 shadow shadow-purple-600 bg-white"
        }
        style={{ height: "calc(100vh - 40px)" }}
      >
        <div className={"flex flex-col border border-1 shadow h-full"}>
          <div
            ref={messagesContainerRef}
            className={"h-[100%] overflow-y-auto border border-b-1"}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={"mx-3 my-5 px-3 pt-5 pb-2  border border-1 relative"}
              >
                {message.text}
                <div
                  className={
                    "absolute bg-white -top-3 px-2 left-3 border border-1 shadow"
                  }
                >
                  {username}
                </div>
              </div>
            ))}
          </div>
          <div className={"pt-9"}>
            <NewMessage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
