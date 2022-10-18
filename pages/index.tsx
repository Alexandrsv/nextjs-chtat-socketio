import type { NextPage } from "next";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  IMessage,
  ServerToClientEvents,
} from "../types/socket-events";
import { v1 as uuid } from "uuid";

let socket: Socket<any, any>;

const Home: NextPage = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  console.log("messages", { messages });

  useEffect(() => {
    // scroll to bottom
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect((): any => {
    socket = io(process.env.BASE_URL || "/", {
      path: "/api/socketio",
    });

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

    if (socket) return () => socket.disconnect();
  }, []);

  const onSendRandomMessage = () => {
    socket.emit("message", {
      id: uuid(),
      text: "Random " + Math.random().toString(36),
    });
  };

  return (
    <div className={"h-screen overflow-hidden bg-blue-50"}>
      <div
        className={"border border-1 shadow shadow-purple-600 m-5 bg-white"}
        style={{ height: "calc(100vh - 40px)" }}
      >
        <div className={"flex flex-col border border-1 shadow h-full"}>
          <div
            ref={messagesContainerRef}
            className={"h-[100%] overflow-y-auto border border-b-1"}
          >
            {messages.map((message, index) => (
              <div key={message.id} className={"m-3 p-3 border border-1"}>
                {message.text}
              </div>
            ))}
          </div>
          <div className={"pt-9"}>
            <div className={"flex border border-1 m-3 mt-auto p-3 space-x-4"}>
              <input
                type="text"
                className={"border border-b-1 w-full outline-amber-300 h-8"}
              />
              <button
                className={"border border-b-1 px-3 bg-purple-600 text-white"}
              >
                Отправить
              </button>
              <button
                className={"border border-b-1 px-3 bg-purple-600 text-white"}
                onClick={onSendRandomMessage}
              >
                Рандом
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
