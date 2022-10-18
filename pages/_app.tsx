import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SocketContextProvider } from "../context/socket-context";
import { UserContextProvider } from "../context/user-context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <SocketContextProvider>
        <Component {...pageProps} />
      </SocketContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
