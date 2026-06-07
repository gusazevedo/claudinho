import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Pencil, Check, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useStore, type Chat } from '../store'

function ChatItem({ chat, isActive }: { chat: Chat; isActive: boolean }) {
  const { setActiveChat, deleteChat, renameChat } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(chat.title)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitRename = () => {
    const trimmed = draft.trim()
    if (trimmed) renameChat(chat.id, trimmed)
    else setDraft(chat.title)
    setEditing(false)
  }

  const cancelRename = () => {
    setDraft(chat.title)
    setEditing(false)
  }

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none transition-colors ${
        isActive
          ? 'bg-accent-dim text-text-heading border border-accent-border'
          : 'text-text-muted hover:bg-bg-elevated hover:text-text-base border border-transparent'
      }`}
      onClick={() => !editing && setActiveChat(chat.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MessageSquare size={14} className="shrink-0 opacity-60" />

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitRename()
            if (e.key === 'Escape') cancelRename()
          }}
          onBlur={commitRename}
          className="flex-1 bg-transparent text-text-heading text-sm outline-none border-b border-accent"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate text-sm">{chat.title}</span>
      )}

      {(hovered || isActive) && !editing && (
        <div
          className="flex items-center gap-1 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { setDraft(chat.title); setEditing(true) }}
            className="p-0.5 rounded opacity-40 hover:opacity-100 hover:text-accent transition-opacity"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => deleteChat(chat.id)}
            className="p-0.5 rounded opacity-40 hover:opacity-100 hover:text-red-400 transition-opacity"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {editing && (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={commitRename} className="p-0.5 text-accent hover:opacity-80">
            <Check size={12} />
          </button>
          <button onClick={cancelRename} className="p-0.5 text-text-muted hover:opacity-80">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { chats, activeChatId, createChat } = useStore()
  const [collapsed, setCollapsed] = useState(false)

  const grouped = chats.reduce<{ today: Chat[]; older: Chat[] }>(
    (acc, chat) => {
      const oneDayAgo = Date.now() - 86_400_000
      if (chat.updatedAt > oneDayAgo) acc.today.push(chat)
      else acc.older.push(chat)
      return acc
    },
    { today: [], older: [] }
  )

  if (collapsed) {
    return (
      <aside className="w-12 shrink-0 flex flex-col items-center h-full bg-bg-sidebar border-r border-border py-4 transition-all duration-200">
        <button
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
          className="w-6 h-6 rounded bg-accent flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <span className="text-xs font-bold text-white">C</span>
        </button>
      </aside>
    )
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full bg-bg-sidebar border-r border-border transition-all duration-200">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">C</span>
            </div>
            <span className="text-text-heading font-semibold text-sm tracking-wide">claudinho</span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            className="text-text-muted hover:text-text-base transition-colors"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        <button
          onClick={createChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-accent-dim border border-accent-border text-accent text-sm font-medium hover:bg-accent hover:text-white transition-all duration-150"
        >
          <Plus size={15} />
          New chat
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {chats.length === 0 && (
          <p className="text-text-muted text-xs text-center mt-8 px-4 leading-relaxed">
            No chats yet.
            <br />
            Click <span className="text-accent">New chat</span> to start.
          </p>
        )}

        {grouped.today.length > 0 && (
          <section>
            <p className="text-text-muted text-[10px] uppercase tracking-widest px-3 mb-1">Today</p>
            <div className="space-y-0.5">
              {grouped.today.map((c) => (
                <ChatItem key={c.id} chat={c} isActive={c.id === activeChatId} />
              ))}
            </div>
          </section>
        )}

        {grouped.older.length > 0 && (
          <section>
            <p className="text-text-muted text-[10px] uppercase tracking-widest px-3 mb-1">Older</p>
            <div className="space-y-0.5">
              {grouped.older.map((c) => (
                <ChatItem key={c.id} chat={c} isActive={c.id === activeChatId} />
              ))}
            </div>
          </section>
        )}
      </nav>
    </aside>
  )
}
