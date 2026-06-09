import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/states/auth.slice";
import chatReducer from "../features/chats/states/chat.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;
