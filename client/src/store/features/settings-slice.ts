// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Settings } from "../../helpers/types";

// TODO: any
const initialState: any = {
  settings: {
    autoMoveCoins: false,
    amountOfBatches: 1,
    batchSize: 20,
    startAmount: 20,
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<any>) {
      // it's okay to do this because immer makes it immutable
      // under the hood, see https://www.youtube.com/watch?v=9zySeP5vH9c
      state.settings = action.payload;
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
