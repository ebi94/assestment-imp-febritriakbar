'use client'

import { useState } from 'react'

import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(
        'http://localhost:8000/api/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )

      alert('Login successful!')
      window.location.href = '/posts'
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError(err.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center px-4'>
      <div className='card w-full max-w-3xl shadow-xl bg-base-100'>
        <div className='grid md:grid-cols-2 grid-cols-1 rounded-xl overflow-hidden'>
          <div className='hidden md:flex items-center justify-center bg-primary text-white'>
            <h1 className='text-3xl font-bold'>Welcome Back 👋</h1>
          </div>

          <div className='py-12 px-10 flex flex-col justify-center'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>Sign In</h2>

            <form onSubmit={handleLogin} className='space-y-4'>
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text font-medium'>Email Address</span>
                </label>
                <input
                  type='email'
                  className='input input-bordered w-full'
                  placeholder='email@example.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className='form-control w-full relative'>
                <label className='label'>
                  <span className='label-text font-medium'>Password</span>
                </label>

                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className='input input-bordered w-full pr-10'
                    placeholder='******'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className='text-error text-sm'>{error}</p>}

              <button type='submit' className={`btn btn-primary w-full${loading ? ' loading' : ''}`} disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <div className='text-center mt-4 text-sm'>
                Don&apos;t have an account?{' '}
                <span
                  onClick={() => (window.location.href = '/register')}
                  className='text-primary hover:underline cursor-pointer'
                >
                  Register here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
