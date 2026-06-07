import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: number
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

interface Store {
  chats: Chat[]
  activeChatId: string | null
  createChat: () => string
  setActiveChat: (id: string) => void
  deleteChat: (id: string) => void
  renameChat: (id: string, title: string) => void
  addMessage: (chatId: string, content: string, role: Role) => void
  activeChat: () => Chat | null
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,

      createChat: () => {
        const id = uuid()
        const now = Date.now()
        set((s) => ({
          chats: [{ id, title: 'New chat', messages: [], createdAt: now, updatedAt: now }, ...s.chats],
          activeChatId: id,
        }))
        return id
      },

      setActiveChat: (id) => set({ activeChatId: id }),

      deleteChat: (id) =>
        set((s) => {
          const chats = s.chats.filter((c) => c.id !== id)
          const activeChatId =
            s.activeChatId === id ? (chats[0]?.id ?? null) : s.activeChatId
          return { chats, activeChatId }
        }),

      renameChat: (id, title) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.id === id ? { ...c, title } : c)),
        })),

      addMessage: (chatId, content, role) => {
        const now = Date.now()
        set((s) => ({
          chats: s.chats.map((c) => {
            if (c.id !== chatId) return c
            const messages = [...c.messages, { id: uuid(), role, content, timestamp: now }]
            const title =
              c.messages.length === 0 && role === 'user'
                ? content.slice(0, 48) + (content.length > 48 ? '…' : '')
                : c.title
            return { ...c, messages, title, updatedAt: now }
          }),
        }))
      },

      activeChat: () => {
        const { chats, activeChatId } = get()
        return chats.find((c) => c.id === activeChatId) ?? null
      },
    }),
    { name: 'claudinho-store' }
  )
)
