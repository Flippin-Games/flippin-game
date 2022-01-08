import React from "react";

import { GameStateProps } from "./helpers/types";

export const defaultState: GameStateProps = {
  isInRoom: false,
  counter: 0,
  localCounter: 0,
  username: "",
  users: [],
  settings: {
    autoMoveCoins: false,
    amountOfBatches: 4,
    batchSize: 5,
    startAmount: 20,
  },
  currentTime: 0,
  timestampBatch: 0,
  timestampFive: 0,
};

export default React.createContext({
  state: defaultState,
  dispatch: (a: any) => {},
});
