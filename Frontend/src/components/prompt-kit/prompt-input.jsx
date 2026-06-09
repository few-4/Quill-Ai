import { useState, useRef, useEffect } from "react";
import { Send, Square, Paperclip, X } from "lucide-react";

export function PromptInput({ onSubmit, placeholder = "Message Quill Ai...", disabled = false, isStreaming = false }) {
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, [value]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          data: reader.result,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if ((!trimmed && !file) || disabled || isStreaming) return;
    onSubmit(trimmed, file);
    setValue("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = (value.trim().length > 0 || file) && !disabled && !isStreaming;

  return (
    <div className="prompt-input-wrapper">
      <div className="prompt-input-container">
        {file && (
          <div className="prompt-input__file-preview">
            <div className="prompt-input__file-info">
              <Paperclip size={12} />
              <span className="prompt-input__file-name">{file.name}</span>
            </div>
            <button onClick={removeFile} className="prompt-input__file-remove">
              <X size={12} />
            </button>
          </div>
        )}
        <div className="prompt-input">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            style={{ display: "none" }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="prompt-input__attach"
            disabled={disabled || isStreaming}
          >
            <Paperclip size={16} />
          </button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isStreaming}
            rows={1}
            className="prompt-input__textarea"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className={`prompt-input__send ${canSend ? "prompt-input__send--active" : ""}`}
          >
            {isStreaming ? <Square size={14} /> : <Send size={14} />}
          </button>
        </div>
      </div>
      <p className="prompt-input__disclaimer">
        Quill Ai can make mistakes. Consider checking important info.
      </p>
    </div>
  );
}
