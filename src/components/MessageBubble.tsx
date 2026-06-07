import type { Message } from "../store";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-center animate-slide-up ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mr-3">
          <span className="text-[11px] font-bold text-white">C</span>
        </div>
      )}

      <div className={`max-w-[72%] ${isUser ? "" : "flex-1"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-accent-dim border border-accent-border text-text-heading rounded-br-sm"
              : "bg-bg-elevated border border-border text-text-base rounded-bl-sm"
          }`}
        >
          <p className="whitespace-pre-wrap break-words font-mono text-[13px]">
            {message.content}
          </p>
        </div>
        <p className="text-text-muted text-[10px] mt-1 px-1">
          {formatTime(message.timestamp)}
        </p>
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border flex items-center justify-center shrink-0 ml-3">
          <span className="text-[11px] text-text-muted">U</span>
        </div>
      )}
    </div>
  );
}
