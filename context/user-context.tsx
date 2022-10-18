import { createContext, FC, ReactNode, useEffect, useState } from "react";

export const UserContext = createContext({
  username: "",
});

export const UserContextProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(
      emojis[Math.floor(Math.random() * emojis.length)] +
        Math.random().toString(36).substring(2, 5)
    );
  }, []);

  return (
    <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>
  );
};

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😂",
  "🙂",
  "🙃",
  "🫠",
  "😉",
  "😊",
  "😇",
];
