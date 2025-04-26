import { useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Fetch user data
      axios.get('/api/auth/me')
        .then(response => {
          setUser(response.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post('/api/auth/register', { name, email, password })
    const { token, user } = response.data
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
  }
} 