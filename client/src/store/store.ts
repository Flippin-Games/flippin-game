import { configureStore } from "@reduxjs/toolkit";
import timeReducer from "./features/time-slice";
import settingsReducer from "./features/settings-slice";
import localReducer from "./features/local-slice";
import usersReducer from "./features/users-slice";

export const store = configureStore({
  reducer: {
    time: timeReducer,
    settings: settingsReducer,
    local: localReducer,
    users: usersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
