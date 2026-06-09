import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatApi } from "../services/chat.api";
import {
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
} from "../states/chat.slice";

export function useChat() {
  const dispatch = useDispatch();
  const { chats, activeChatId, messages, isStreaming, streamStatus, isLoadingChats, isLoadingMessages } =
    useSelector((state) => state.chat);

  const loadChats = useCallback(async () => {
    dispatch(setLoadingChats(true));
    try {
      const data = await chatApi.getUserChats();
      if (data.success) dispatch(setChats(data.chats));
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      dispatch(setLoadingChats(false));
    }
  }, [dispatch]);

  const selectChat = useCallback(
    async (chatId) => {
      dispatch(setActiveChatId(chatId));
      dispatch(setLoadingMessages(true));
      try {
        const data = await chatApi.getChatMessages(chatId);
        if (data.success) {
          dispatch(
            setMessages(
              data.chats.map((msg) => ({
                id: msg._id,
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.content,
                file: msg.file,
              }))
            )
          );
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        dispatch(setLoadingMessages(false));
      }
    },
    [dispatch]
  );

  const newChat = useCallback(() => {
    dispatch(resetChat());
  }, [dispatch]);

  const sendMessage = useCallback(
    async (content, file = null) => {
      if (isStreaming) return;

      const userMsg = { 
        id: Date.now().toString(), 
        role: "user", 
        content,
        file: file ? { name: file.name, type: file.type, data: file.data } : null
      };
      dispatch(addMessage(userMsg));

      const apiMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content, file: file ? { name: file.name, type: file.type, data: file.data } : null },
      ];

      dispatch(setStreaming(true));

      const aiMsgId = (Date.now() + 1).toString();
      dispatch(addMessage({ id: aiMsgId, role: "assistant", content: "" }));

      try {
        const response = await chatApi.sendMessage(activeChatId, apiMessages, file);
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to send message");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed.startsWith("title:")) {
              try {
                const titleData = JSON.parse(trimmed.slice(6).trim());
                dispatch(setActiveChatId(titleData.chatId));
                dispatch(
                  addChatToTop({
                    _id: titleData.chatId,
                    title: titleData.title,
                    updatedAt: new Date().toISOString(),
                  })
                );
              } catch (e) {
                console.error("Title parse error:", e);
              }
            }

            if (trimmed.startsWith("data:")) {
              try {
                const chunk = JSON.parse(trimmed.slice(5).trim());
                if (chunk.text) dispatch(appendToLastMessage(chunk.text));
                if (chunk.status !== undefined) dispatch(setStreamStatus(chunk.status));
              } catch (e) {
                console.error("Data parse error:", e);
              }
            }
          }
        }
      } catch (err) {
        console.error("Streaming error:", err);
        alert(err.message || "An error occurred while sending the message.");
        dispatch(setMessages([...messages, userMsg]));
      } finally {
        dispatch(setStreaming(false));
        dispatch(setStreamStatus(""));
      }
    },
    [activeChatId, messages, isStreaming, dispatch]
  );

  const deleteChatById = useCallback(
    async (chatId) => {
      try {
        await chatApi.deleteChat(chatId);
        dispatch(removeChat(chatId));
        if (activeChatId === chatId) dispatch(resetChat());
      } catch (err) {
        console.error("Delete error:", err);
      }
    },
    [activeChatId, dispatch]
  );

  return {
    chats,
    activeChatId,
    messages,
    isStreaming,
    streamStatus,
    isLoadingChats,
    isLoadingMessages,
    loadChats,
    selectChat,
    newChat,
    sendMessage,
    deleteChatById,
  };
}
