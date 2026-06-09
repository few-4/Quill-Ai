import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChatId: null,
    messages: [],
    isStreaming: false,
    isLoadingChats: false,
    isLoadingMessages: false,
    streamStatus: "",
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    setLoadingChats(state, action) {
      state.isLoadingChats = action.payload;
    },
    setActiveChatId(state, action) {
      state.activeChatId = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setLoadingMessages(state, action) {
      state.isLoadingMessages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    appendToLastMessage(state, action) {
      const last = state.messages[state.messages.length - 1];
      if (last) last.content += action.payload;
    },
    setStreaming(state, action) {
      state.isStreaming = action.payload;
    },
    addChatToTop(state, action) {
      state.chats.unshift(action.payload);
    },
    removeChat(state, action) {
      state.chats = state.chats.filter((c) => c._id !== action.payload);
    },
    resetChat(state) {
      state.activeChatId = null;
      state.messages = [];
      state.streamStatus = "";
    },
    setStreamStatus(state, action) {
      state.streamStatus = action.payload;
    },
  },
});

export const {
  setChats,
  setLoadingChats,
  setActiveChatId,
  setMessages,
  setLoadingMessages,
  addMessage,
  appendToLastMessage,
  setStreaming,
  addChatToTop,
  removeChat,
  resetChat,
  setStreamStatus,
} = chatSlice.actions;

export default chatSlice.reducer;
