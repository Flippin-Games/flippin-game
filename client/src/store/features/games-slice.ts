// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type gamesPlayedType = {
  timeAllCompleted: number;
  timeBatchCompleted: number;
}[];
const initialState: any = {
  gamesPlayed: [],
};

const gamesPlayed = createSlice({
  name: "time",
  initialState,
  reducers: {
    setGamesPlayed(state, action: PayloadAction<[]>) {
      // it's okay to do this because immer makes it immutable
      // under the hood, see https://www.youtube.com/watch?v=9zySeP5vH9c
      state.gamesPlayed = action.payload;
    },
  },
});

export const { setGamesPlayed } = gamesPlayed.actions;
export default gamesPlayed.reducer;
