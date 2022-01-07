import React from "react";

export interface IUser {
  username: string;
  localCounter: number;
  flipped: number;
}

export interface IGameStateProps {
  isInRoom: boolean;
  counter: number;
  localCounter: number;
  username: string;
  users: IUser[];
  //TODO - get rid of any
  settings: any;
  currentTime: any;
  timestampBatch: any;
  timestampFive: any;
  previousUser?: IUser;
}

export const defaultState: IGameStateProps = {
  isInRoom: false,
  counter: 0,
  localCounter: 0,
  username: "",
  users: [],
  settings: {},
  currentTime: 0,
  timestampBatch: 0,
  timestampFive: 0,
};

export default React.createContext({
  state: defaultState,
  dispatch: (a: any) => {},
});
