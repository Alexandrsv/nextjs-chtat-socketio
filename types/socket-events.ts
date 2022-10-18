export interface IMessage {
  id: string;
  text: string;
  username: string;
}

export type ServerToClientEvents = {
  message: IMessage;
};
export type ClientToServerEvents = IMessage;
