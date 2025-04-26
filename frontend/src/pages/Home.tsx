import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to AI Coding Assistant
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Your intelligent programming companion for learning, coding, and debugging.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Real-time Assistance</h2>
          <p className="text-gray-600">
            Get instant help and suggestions as you code
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">VS Code Experience</h2>
          <p className="text-gray-600">
            Familiar interface with syntax highlighting and auto-complete
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Secure Execution</h2>
          <p className="text-gray-600">
            Run your code safely in isolated environments
          </p>
        </div>
      </div>
      
      {user ? (
        <Link to="/editor" className="btn btn-primary text-lg px-8 py-3">
          Open Editor
        </Link>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
        </div>
      )}
    </div>
  )
} 