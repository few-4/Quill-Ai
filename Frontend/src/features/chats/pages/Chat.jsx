import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { ChatContainer } from "../../../components/prompt-kit/chat-container";
import { Message } from "../../../components/prompt-kit/message";
import { PromptInput } from "../../../components/prompt-kit/prompt-input";
import { Markdown } from "../../../components/prompt-kit/markdown";
import { Loader } from "../../../components/prompt-kit/loader";
import {
  Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeft, Loader2,
} from "lucide-react";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredChat, setHoveredChat] = useState(null);
  const location = useLocation();

  const {
    chats, activeChatId, messages, isStreaming, streamStatus,
    isLoadingChats, isLoadingMessages,
    loadChats, selectChat, newChat, sendMessage, deleteChatById,
  } = useChat();

  useEffect(() => { loadChats(); }, [loadChats]);

  useEffect(() => {
    if (location.state?.initialPrompt) {
      sendMessage(location.state.initialPrompt);
      window.history.replaceState({}, "");
    }
  }, []);

  const groupChats = (list) => {
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const groups = { Today: [], Yesterday: [], "Previous 7 Days": [], Older: [] };
    list.forEach((c) => {
      const d = new Date(c.updatedAt);
      if (d.toDateString() === today) groups.Today.push(c);
      else if (d.toDateString() === yesterday.toDateString()) groups.Yesterday.push(c);
      else if (d > weekAgo) groups["Previous 7 Days"].push(c);
      else groups.Older.push(c);
    });
    return groups;
  };

  const grouped = groupChats(chats);

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar--collapsed"}`}>
        <div className="sidebar__top">
          <button onClick={newChat} className="sidebar__new-chat">
            <Plus size={14} /> New chat
          </button>
        </div>

        <nav className="sidebar__list">
          {isLoadingChats ? (
            <div className="sidebar__center"><Loader variant="spinner" /></div>
          ) : chats.length === 0 ? (
            <p className="sidebar__empty">No conversations yet</p>
          ) : (
            Object.entries(grouped).map(([label, items]) =>
              items.length > 0 && (
                <div key={label} className="sidebar__group">
                  <p className="sidebar__group-label">{label}</p>
                  {items.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => selectChat(chat._id)}
                      onMouseEnter={() => setHoveredChat(chat._id)}
                      onMouseLeave={() => setHoveredChat(null)}
                      className={`sidebar__item ${activeChatId === chat._id ? "sidebar__item--active" : ""}`}
                    >
                      <MessageSquare size={14} />
                      <span className="sidebar__item-title">{chat.title}</span>
                      {(hoveredChat === chat._id || activeChatId === chat._id) && (
                        <span
                          className="sidebar__item-delete"
                          onClick={(e) => { e.stopPropagation(); deleteChatById(chat._id); }}
                        >
                          <Trash2 size={12} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )
            )
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="chat-main">
        <div className="chat-main__topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="chat-main__toggle">
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
          </button>
        </div>

        {messages.length === 0 && !isLoadingMessages ? (
          <div className="chat-main__welcome">
            <div className="chat-main__welcome-logo">
              <img src="/favicon.svg" alt="Quill Ai Logo" className="chat-main__welcome-logo-img" />
            </div>
            <h2 className="chat-main__welcome-title">How can I help you today?</h2>
            <p className="chat-main__welcome-sub">Start a conversation below</p>
          </div>
        ) : (
          <ChatContainer>
            {isLoadingMessages ? (
              <div className="chat-main__loading">
                <Loader2 size={24} className="spin" />
              </div>
            ) : (
              <div className="chat-main__messages">
                {messages.map((msg) => (
                  <Message key={msg.id} role={msg.role}>
                    {msg.role === "assistant" ? (
                      msg.content ? <Markdown content={msg.content} /> : <Loader />
                    ) : (
                      <>
                        <p>{msg.content}</p>
                        {msg.file && (
                          <div className="msg__file">
                            {msg.file.type.startsWith("image/") ? (
                              <img src={msg.file.data} alt={msg.file.name} className="msg__image-preview" />
                            ) : (
                              <div className="msg__file-chip">
                                <Plus size={12} className="rotate-45" />
                                <span>{msg.file.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </Message>
                ))}
              </div>
            )}
          </ChatContainer>
        )}

        {streamStatus && (
          <div className="chat-main__status">
            <Loader2 size={14} className="spin" />
            <span>{streamStatus}</span>
          </div>
        )}
        <PromptInput onSubmit={sendMessage} isStreaming={isStreaming} disabled={isLoadingMessages} />
      </div>
    </div>
  );
}
