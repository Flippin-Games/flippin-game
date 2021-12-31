import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setIsInRoom: (inRoom: boolean) => void;
  counter: number;
  setCounter: (counter: number) => void;
  localCounter: number;
  setLocalCounter: (localCounter: number) => void;
  username: string;
  setUsername: (username: string) => void;
  users: { username: string; localCounter: number; flipped: number }[];
  setUsers: (users: []) => void;
  settings: any;
  setSettings: (settings: any) => void;
  time: any;
  setTime: (time: any) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setIsInRoom: () => {},
  counter: 0,
  setCounter: () => {},
  localCounter: 0,
  setLocalCounter: () => {},
  username: "Sonny",
  setUsername: () => {},
  users: [],
  setUsers: () => {},
  settings: {},
  setSettings: () => {},
  time: 0,
  setTime: () => {},
};

export default React.createContext(defaultState);
