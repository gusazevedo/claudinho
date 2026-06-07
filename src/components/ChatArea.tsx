import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, MessageSquareDashed } from "lucide-react";
import { useStore } from "../store";
import { MessageBubble } from "./MessageBubble";

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
      <div className="w-12 h-12 rounded-xl bg-accent-dim border border-accent-border flex items-center justify-center">
        <MessageSquareDashed size={22} className="text-accent" />
      </div>
      <div>
        <h2 className="text-text-heading font-semibold text-lg">
          No chat selected
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Select a chat from the sidebar or create a new one.
        </p>
      </div>
      <button
        onClick={onNew}
        className="px-4 py-2 text-sm rounded-md bg-accent text-white hover:opacity-90 transition-opacity font-medium"
      >
        Start new chat
      </button>
    </div>
  );
}

export function ChatArea() {
  const { activeChat, activeChatId, addMessage, createChat } = useStore();
  const chat = activeChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  useEffect(() => {
    setInput("");
    textareaRef.current?.focus();
  }, [activeChatId]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const send = () => {
    const text = input.trim();
    if (!text || !activeChatId) return;
    addMessage(activeChatId, text, "user");
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!chat) {
    return (
      <main className="flex-1 flex flex-col h-full bg-bg-base">
        <EmptyState onNew={createChat} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-bg-base min-w-0">
      {/* Header */}
      <header className="px-6 py-3 border-b border-border shrink-0 flex items-center gap-3">
        <span className="text-text-heading font-medium text-sm truncate">
          {chat.title}
        </span>
        <span className="text-text-muted text-xs ml-auto shrink-0">
          {chat.messages.length}{" "}
          {chat.messages.length === 1 ? "message" : "messages"}
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {chat.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted text-sm">
              Send a message to start the conversation.
            </p>
          </div>
        )}
        {chat.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border shrink-0">
        <div className="flex items-center gap-3 bg-bg-input border border-border rounded-xl px-4 py-3 focus-within:border-accent-border transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={onKeyDown}
            placeholder="Message... (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="flex-1 bg-transparent text-text-base text-sm font-mono resize-none placeholder:text-text-muted leading-relaxed max-h-[200px] overflow-y-auto"
            style={{ height: "auto" }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-accent text-white disabled:opacity-25 hover:opacity-90 transition-all"
          >
            <ArrowUp size={15} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-text-muted text-[10px] mt-2 text-right">
          <kbd className="font-mono">Enter</kbd> send ·{" "}
          <kbd className="font-mono">Shift+Enter</kbd> newline
        </p>
      </div>
    </main>
  );
}
