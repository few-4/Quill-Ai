import { useRef, useEffect } from "react";

export function ChatContainer({ children, autoScroll = true }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <div className="chat-container">
      {children}
      <div ref={bottomRef} />
    </div>
  );
}
