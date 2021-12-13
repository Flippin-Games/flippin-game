import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setIsInRoom: (inRoom: boolean) => void;
  counter: number;
  setCounter: (counter: number) => void;
  username: string;
  setUsername: (username: string) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setIsInRoom: () => {},
  counter: 0,
  setCounter: () => {},
  username: "Sonny",
  setUsername: () => {},
};

export default React.createContext(defaultState);
