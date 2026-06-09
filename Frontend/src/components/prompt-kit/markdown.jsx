import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

export function Markdown({ content }) {
  const rendered = useMemo(
    () => (
      <ReactMarkdown
        components={{
          code({ inline, className: codeClass, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || "");
            if (!inline) {
              return (
                <div className="md-code-block">
                  {match && (
                    <div className="md-code-block__header">{match[1]}</div>
                  )}
                  <pre>
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            }
            return (
              <code className="md-inline-code" {...props}>{children}</code>
            );
          },
          a({ children, ...props }) {
            return <a target="_blank" rel="noreferrer" {...props}>{children}</a>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    ),
    [content]
  );

  return <div className="md-content">{rendered}</div>;
}
