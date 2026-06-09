import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, clearError } from "../states/auth.slice";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSubmitting, error } = useSelector((state) => state.auth);

  const switchMode = (m) => {
    setMode(m);
    dispatch(clearError());
    setFullname("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (mode === "login") {
      result = await dispatch(loginUser({ email, password }));
    } else {
      result = await dispatch(registerUser({ fullname, email, password }));
    }
    if (!result.error) navigate("/chat");
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow auth-page__glow--green" />
      <div className="auth-page__glow auth-page__glow--purple" />

      <div className="auth-card">
        {/* Header */}
        <div className="auth-card__header">
          <div className="auth-card__logo">
            <img src="/favicon.svg" alt="Quill Ai Logo" className="auth-card__logo-img" />
          </div>
          <h1 className="auth-card__title">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="auth-card__subtitle">
            {mode === "login"
              ? "Sign in to continue to Quill Ai"
              : "Get started with Quill Ai for free"}
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            onClick={() => switchMode("login")}
            className={`auth-tabs__btn ${mode === "login" ? "auth-tabs__btn--active" : ""}`}
          >
            Sign in
          </button>
          <button
            onClick={() => switchMode("register")}
            className={`auth-tabs__btn ${mode === "register" ? "auth-tabs__btn--active" : ""}`}
          >
            Sign up
          </button>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <div className="auth-field">
              <label className="auth-field__label">Full Name</label>
              <div className="auth-field__input-box">
                <User size={16} className="auth-field__icon" />
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="John Doe"
                  className="auth-field__input"
                  required
                  minLength={4}
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label className="auth-field__label">Email</label>
            <div className="auth-field__input-box">
              <Mail size={16} className="auth-field__icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="auth-field__input"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-field__label">Password</label>
            <div className="auth-field__input-box">
              <Lock size={16} className="auth-field__icon" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Min 6 characters" : "Enter password"}
                className="auth-field__input"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="auth-field__toggle"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="auth-submit">
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="auth-submit__spinner" />
                <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{mode === "login" ? "Sign in" : "Create account"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
