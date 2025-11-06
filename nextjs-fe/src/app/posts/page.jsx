'use client'

import { useEffect, useState } from 'react'
import { StickyNote } from 'lucide-react'

export default function PostsPage() {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchPosts = async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/posts?page=${page}`)
      const data = await res.json()
      setPosts(data.data || [])
      setTotalPages(data.last_page || 1)
      setCurrentPage(data.current_page || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className='flex h-screen bg-base-200'>
      {/* Sidebar */}
      <aside className='w-64 bg-base-100 shadow-md p-4 flex flex-col justify-between'>
        <div>
          <h2 className='text-xl font-bold mb-4'>Dashboard</h2>
          <ul className='menu w-full bg-base-100 rounded-box'>
            <li className='w-full'>
              <a className='font-semibold  bg-base-200 ' href='/app/leads' aria-current='page'>
                <StickyNote />
                Posts
                <span
                  className='absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary '
                  aria-hidden='true'
                ></span>
              </a>
            </li>
          </ul>
        </div>
        <button className='btn btn-error text-white mt-4' onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className='flex-1 p-6 overflow-auto'>
        {/* Topbar */}
        <div className='navbar bg-base-100 shadow-sm'>
          <div className='flex-1'>
            <a className='btn btn-ghost text-xl'>Logo</a>
          </div>
          <div className='flex gap-2'>
            <div className='dropdown dropdown-end'>
              <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
                <div className='w-10 rounded-full'>
                  <img
                    alt='Tailwind CSS Navbar component'
                    src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                  />
                </div>
              </div>
              <ul
                tabindex='0'
                className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
              >
                <li className='justify-between'>
                  <a href='#'>
                    Profile<span className='badge'>New</span>
                  </a>
                </li>
                <div className='divider mt-0 mb-0'></div>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto bg-base-100 shadow-lg rounded-xl p-4'>
          {loading ? (
            <div className='flex justify-center p-8'>
              <span className='loading loading-spinner loading-lg'></span>
            </div>
          ) : (
            <>
              <table className='table w-full'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length > 0 ? (
                    posts.map((post, i) => (
                      <tr key={post.id}>
                        <td>{(currentPage - 1) * 10 + i + 1}</td>
                        <td>{post.title}</td>
                        <td>{post.content}</td>
                        <td>{new Date(post.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='4' className='text-center'>
                        No posts available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className='join flex justify-center mt-6'>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
