export type User = {
  username: string;
  localCounter: number;
  flipped: number;
};

export type Time = {};

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
