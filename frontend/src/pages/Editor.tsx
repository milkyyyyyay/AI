import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useAuth } from '../hooks/useAuth'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function EditorPage() {
  const [code, setCode] = useState('// Start coding here...')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    const newSocket = io('/socket.io', {
      auth: {
        token: localStorage.getItem('token')
      }
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [user, navigate])

  const handleRunCode = async () => {
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code })
      })
      
      const result = await response.json()
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Output:\n${result.output}`,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error running code:', error)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !socket) return

    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    socket.emit('message', message)
    setInput('')
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Code Editor */}
      <div className="flex-1 h-full">
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 bg-white border-b">
            <h1 className="text-xl font-semibold">Code Editor</h1>
            <button
              onClick={handleRunCode}
              className="btn btn-primary"
            >
              Run Code
            </button>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-96 h-full flex flex-col bg-white border-l">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary-100 ml-12'
                  : 'bg-gray-100 mr-12'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 