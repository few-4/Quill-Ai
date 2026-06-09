import { useNavigate } from "react-router-dom";
import { MessageSquare, Code, Lightbulb, Zap, ArrowRight } from "lucide-react";

const suggestions = [
  { icon: <Code size={18} />, title: "Write code", desc: "Generate a merge sort in Python", color: "#60a5fa" },
  { icon: <Lightbulb size={18} />, title: "Brainstorm", desc: "Creative app ideas for students", color: "#fbbf24" },
  { icon: <MessageSquare size={18} />, title: "Explain", desc: "How does a neural network work?", color: "#34d399" },
  { icon: <Zap size={18} />, title: "Debug", desc: "Fix infinite re-render in React", color: "#a78bfa" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleStart = (prompt) => {
    navigate("/chat", { state: { initialPrompt: prompt } });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__hero">
        <div className="dashboard__logo">
          <img src="/favicon.svg" alt="Quill Ai Logo" className="dashboard__logo-img" />
        </div>
        <h1 className="dashboard__title">How can I help you today?</h1>
        <p className="dashboard__subtitle">
          I can write, brainstorm, analyze, code, and much more.
        </p>
      </div>

      <div className="dashboard__grid">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => handleStart(s.desc)} className="dashboard__card">
            <span className="dashboard__card-icon" style={{ color: s.color }}>{s.icon}</span>
            <div className="dashboard__card-text">
              <p className="dashboard__card-title">{s.title}</p>
              <p className="dashboard__card-desc">{s.desc}</p>
            </div>
            <ArrowRight size={14} className="dashboard__card-arrow" />
          </button>
        ))}
      </div>

      <button onClick={() => navigate("/chat")} className="dashboard__cta">
        <MessageSquare size={16} />
        Start a new chat
      </button>
    </div>
  );
}
