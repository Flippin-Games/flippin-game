// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "../../helpers/types";

// TODO any
const initialState: any = {
  isPlaying: false,
  users: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
  },
});

export const { setIsPlaying } = adminSlice.actions;
export default adminSlice.reducer;
