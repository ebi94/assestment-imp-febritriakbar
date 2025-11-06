'use client'

import { useEffect, useState } from 'react'
import { StickyNote, Pencil, Trash } from 'lucide-react'
import axios from 'axios'

export default function PostsPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [saveError, setSaveError] = useState('')
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

  const handleSave = async e => {
    e.preventDefault()
    setSaveError('')

    try {
      if (editingPostId) {
        await axios.put(
          `http://localhost:8000/api/posts/${editingPostId}`,
          { title, content },
          { withCredentials: true }
        )
        alert('Post updated successfully!')
      } else {
        await axios.post('http://localhost:8000/api/posts', { title, content }, { withCredentials: true })
        alert('Post added successfully!')
      }

      setTitle('')
      setContent('')
      setEditingPostId(null)
      document.getElementById('add-post-modal').close()

      fetchPosts(currentPage)
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save post')
    }
  }

  const handleEdit = post => {
    setEditingPostId(post.id)
    setTitle(post.title)
    setContent(post.content)
    document.getElementById('add-post-modal').showModal()
  }

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await axios.delete(`http://localhost:8000/api/posts/${id}`, {
        withCredentials: true
      })
      alert('Post deleted successfully!')
      fetchPosts(currentPage)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to delete post')
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      localStorage.removeItem('token')

      alert('Logged out successfully!')
      window.location.href = '/login'
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to logout')
    }
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
                <li onClick={handleLogout}>
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
                    <th>Actions</th>
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
                        <td className='flex gap-2'>
                          <button className='btn btn-sm btn-warning' onClick={() => handleEdit(post)}>
                            <Pencil />
                          </button>
                          <button className='btn btn-sm btn-error' onClick={() => handleDelete(post.id)}>
                            <Trash />
                          </button>
                        </td>
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
        <button className='btn btn-primary mt-6' onClick={() => document.getElementById('add-post-modal').showModal()}>
          Add New Post
        </button>
      </main>

      <dialog id='add-post-modal' className='modal'>
        <form method='dialog' className='modal-box' onSubmit={handleSave}>
          <h3 className='font-bold text-lg'>{editingPostId ? 'Edit Post' : 'Add New Post'}</h3>

          <div className='flex flex-col gap-4 pt-4'>
            <input
              type='text'
              placeholder='Post Title'
              className='input input-bordered w-full'
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              placeholder='Post Content'
              className='textarea textarea-bordered w-full'
              required
              value={content}
              onChange={e => setContent(e.target.value)}
            ></textarea>
            {saveError && <p className='text-red-500'>{saveError}</p>}
          </div>

          <div className='modal-action'>
            <button
              className='w-30 btn btn-secondary'
              onClick={() => document.getElementById('add-post-modal').close()}
            >
              Cancel
            </button>
            <button type='submit' className='w-30 btn btn-primary'>
              Save
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
