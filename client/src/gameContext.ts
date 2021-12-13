import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setIsInRoom: (inRoom: boolean) => void;
  counter: number;
  setCounter: (counter: number) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setIsInRoom: () => {},
  counter: 0,
  setCounter: () => {},
};

export default React.createContext(defaultState);
