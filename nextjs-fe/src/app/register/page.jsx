'use client'

import { useState } from 'react'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/register',
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirm
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )

      alert('Registration successful! Please login.')
      window.location.href = '/login'
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError(err.message || 'Registration failed')
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
            <h1 className='text-3xl font-bold'>Join Us 🚀</h1>
          </div>

          <div className='py-12 px-10 flex flex-col justify-center'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>Create Account</h2>

            <form onSubmit={handleRegister} className='space-y-4'>
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text font-medium'>Full Name</span>
                </label>
                <input
                  type='text'
                  className='input input-bordered w-full'
                  placeholder='John Doe'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className='form-control w-full relative'>
                <label className='label'>
                  <span className='label-text font-medium'>Confirm Password</span>
                </label>

                <div className='relative'>
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    className='input input-bordered w-full pr-10'
                    placeholder='******'
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    required
                  />
                  <button
                    type='button'
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary'
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className='text-error text-sm'>{error}</p>}

              <button type='submit' className={`btn btn-primary w-full${loading ? ' loading' : ''}`} disabled={loading}>
                Register
              </button>

              <div className='text-center mt-4 text-sm'>
                Already have an account?{' '}
                <span
                  onClick={() => (window.location.href = '/login')}
                  className='text-primary hover:underline cursor-pointer'
                >
                  Sign in here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
