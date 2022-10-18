import { useContext } from "react";
import { UserContext } from "../context/user-context";

export const useUser = () => {
  const { username } = useContext(UserContext);

  return { username };
};
