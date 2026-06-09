import { User } from "lucide-react";

export function Message({ role, children }) {
  const isUser = role === "user";

  return (
    <div className={`msg ${isUser ? "msg--user" : "msg--ai"}`}>
      {!isUser && (
        <div className="msg__avatar msg__avatar--ai">
          <img src="/favicon.svg" alt="AI Avatar" className="msg__avatar-img" />
        </div>
      )}
      <div className={`msg__bubble ${isUser ? "msg__bubble--user" : "msg__bubble--ai"}`}>
        {children}
      </div>
      {isUser && (
        <div className="msg__avatar msg__avatar--user">
          <User size={16} />
        </div>
      )}
    </div>
  );
}
