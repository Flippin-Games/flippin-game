// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Time } from "../../helpers/types";

const initialState: Time = {
  currentTime: 0,
  timestampBatch: 0,
  timestampFive: 0,
};

const counterSlice = createSlice({
  name: "time",
  initialState,
  reducers: {
    setCurrentTime(state, action: PayloadAction<string>) {
      // it's okay to do this because immer makes it immutable
      // under the hood, see https://www.youtube.com/watch?v=9zySeP5vH9c
      state.currentTime = action.payload;
    },
    setTimestampBatch(state, action: PayloadAction<string>) {
      state.timestampBatch = action.payload;
    },
    setTimestampFive(state, action: PayloadAction<string>) {
      state.timestampFive = action.payload;
    },
  },
});

export const { setCurrentTime, setTimestampBatch, setTimestampFive } =
  counterSlice.actions;
export default counterSlice.reducer;
