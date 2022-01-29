import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../helpers/types";

// TODO move to types
type Local = {
  counter: number;
  isInRoom: boolean;
  username: string;
  previousUser: User;
};

const initialState: Local = {
  counter: 0,
  isInRoom: false,
  username: "",
  previousUser: {
    username: "",
    flipped: 0,
    localCounter: 0,
  },
};

const local = createSlice({
  name: "local",
  initialState,
  reducers: {
    setCounter(state, action: PayloadAction<number>) {
      // it's okay to do this because immer makes it immutable
      // under the hood, see https://www.youtube.com/watch?v=9zySeP5vH9c
      state.counter = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setIsInRoom(state, action: PayloadAction<boolean>) {
      state.isInRoom = action.payload;
    },
    setPreviousUser(state, action: PayloadAction<User>) {
      state.previousUser = action.payload;
    },
  },
});

export const { setCounter, setIsInRoom, setUsername, setPreviousUser } =
  local.actions;
export default local.reducer;
