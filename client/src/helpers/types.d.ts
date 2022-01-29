export type User = {
  username: string;
  localCounter: number;
  flipped: number;
};

export type Time = {
  currentTime: number | string;
  timestampBatch: number | string;
  timestampFive: number | string;
};

export type Settings = {
  autoMoveCoins: boolean;
  amountOfBatches: number;
  batchSize: number;
  startAmount: number;
};

export type GameStateProps = {
  isInRoom: boolean;
  counter: number;
  localCounter: number;
  username: string;
  users: User[];
  settings: Settings;
  currentTime: number;
  timestampBatch: number;
  timestampFive: number;
  previousUser?: User;
};

export type BackendState = {
  isInRoom: boolean;
  counter: number;
  localCounter: number;
  username: string;
  users: User[];
  settings: Settings;
  time: Time;
};
