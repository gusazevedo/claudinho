import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'

export default function App() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />
      <ChatArea />
    </div>
  )
}
