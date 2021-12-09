import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setIsInRoom: (inRoom: boolean) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setIsInRoom: () => {},
};

export default React.createContext(defaultState);
