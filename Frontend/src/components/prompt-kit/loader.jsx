export function Loader({ variant = "dots" }) {
  if (variant === "dots") {
    return (
      <div className="loader-dots">
        <span /><span /><span />
      </div>
    );
  }
  return (
    <div className="loader-spinner">
      <div className="loader-spinner__circle" />
      <span>Thinking...</span>
    </div>
  );
}
