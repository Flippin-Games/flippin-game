// DUCKS pattern
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../helpers/types";

const initialState: any = {
  users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<any>) {
      // it's okay to do this because immer makes it immutable
      // under the hood, see https://www.youtube.com/watch?v=9zySeP5vH9c
      state.users = [...action.payload];
    },
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
