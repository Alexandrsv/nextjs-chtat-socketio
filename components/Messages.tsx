import React, { useContext, useEffect, useRef, useState } from "react";
import { IMessage } from "../types/socket-events";
import { SocketContext } from "../context/socket-context";
import { useAudio } from "../hooks/use-audio";

const Messages = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useContext(SocketContext);
  const { playOnNewMessage } = useAudio({});

  useEffect(() => {
    // scroll to bottom
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect((): any => {
    if (socket) {
      socket.on("message", (message: IMessage) => {
        console.log("message", message);
        if (message?.id) {
          setMessages((messages) => [...messages, message]);
          void playOnNewMessage();
        }
      });

      socket.emit("message", { text: "Hello from client" });

      socket.onAny((event, ...args) => {
        console.log(`got ${event} with args`, args);
      });
    }
    if (socket) return () => socket.disconnect();
  }, [playOnNewMessage, socket]);

  return (
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
            {message.username}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
