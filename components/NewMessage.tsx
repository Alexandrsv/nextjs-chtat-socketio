import React, { useCallback, useContext, useEffect, useRef } from "react";
import { SocketContext } from "../context/socket-context";
import { useUser } from "../hooks/use-user";
import { v1 as uuid } from "uuid";

const NewMessage = () => {
  const { socket, isConnected } = useContext(SocketContext);
  const { username } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onSend = useCallback(() => {
    if (isConnected && socket && inputRef.current?.value) {
      socket.emit("message", {
        id: uuid(),
        text: inputRef.current.value,
        username,
      });
      inputRef.current.value = "";
    }
  }, [isConnected, socket, username]);

  useEffect(() => {
    const currentInput = inputRef.current;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter" && inputRef.current?.value) {
        onSend();
        if (inputRef.current && !inputRef.current?.value) {
          inputRef.current.focus();
        }
      }
    };
    if (currentInput) {
      currentInput.addEventListener("keydown", listener);
      currentInput.focus();
    }
    return () => {
      if (currentInput) {
        currentInput.removeEventListener("keydown", listener);
      }
    };
  }, [isConnected, onSend]);

  // const onSendRandomMessage = () => {
  //   if (socket) {
  //     socket.emit("message", {
  //       id: uuid(),
  //       text: "Random " + Math.random().toString(36),
  //       username,
  //     });
  //   }
  // };

  return (
    <div className={"flex border border-1 m-3 mt-auto p-3 space-x-4"}>
      <input
        ref={inputRef}
        type="text"
        className={"border px-3 border-b-1 w-full outline-amber-300 h-8"}
      />
      <button
        className={
          "border border-b-1 px-3 bg-purple-600 text-white disabled:bg-gray-300 disabled:text-gray-500"
        }
        onClick={onSend}
        disabled={!isConnected}
      >
        Отправить
      </button>
    </div>
  );
};

export default NewMessage;
