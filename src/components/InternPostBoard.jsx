import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const POSTS_KEY = 'ims_intern_posts'

function loadPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  } catch {
    /* ignore */
  }
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export default function InternPostBoard() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    setPosts(loadPosts())
  }, [])

  function handleCreate(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Both a title and content are required.')
      return
    }
    setError('')
    const newPost = {
      id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      author: user?.name || 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: null,
    }
    const next = [newPost, ...posts]
    setPosts(next)
    savePosts(next)
    setTitle('')
    setContent('')
  }

  function startEdit(post) {
    setEditingId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  function saveEdit(id) {
    if (!editTitle.trim() || !editContent.trim()) return
    const next = posts.map((p) =>
      p.id === id
        ? { ...p, title: editTitle.trim(), content: editContent.trim(), updatedAt: new Date().toISOString() }
        : p
    )
    setPosts(next)
    savePosts(next)
    cancelEdit()
  }

  function deletePost(id) {
    const next = posts.filter((p) => p.id !== id)
    setPosts(next)
    savePosts(next)
  }

  return (
    <div className="post-board">
      <div className="panel post-composer">
        <div className="panel-head">
          <h3>New intern post</h3>
        </div>
        {error && <div className="banner error">{error}</div>}
        <form onSubmit={handleCreate}>
          <div className="field">
            <label htmlFor="postTitle">Title</label>
            <input
              id="postTitle"
              type="text"
              placeholder="e.g. Welcome our new Design interns"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="postContent">Content</label>
            <textarea
              id="postContent"
              rows={4}
              placeholder="Write an update, announcement, or note about your interns..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '11px 22px' }}>
            Post
          </button>
        </form>
      </div>

      <div className="post-list">
        {posts.length === 0 && (
          <div className="panel">
            <div className="dropdown-empty" style={{ padding: '36px 16px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M17 21v-8M12 21V7M7 21v-4" />
                <circle cx="17" cy="8" r="3" />
              </svg>
              <p>No intern posts yet. Create your first one above.</p>
            </div>
          </div>
        )}

        {posts.map((post) => (
          <div className="panel post-card" key={post.id}>
            {editingId === post.id ? (
              <>
                <div className="field">
                  <label htmlFor={`edit-title-${post.id}`}>Title</label>
                  <input
                    id={`edit-title-${post.id}`}
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="field" style={{ marginBottom: 14 }}>
                  <label htmlFor={`edit-content-${post.id}`}>Content</label>
                  <textarea
                    id={`edit-content-${post.id}`}
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="btn-primary"
                    style={{ width: 'auto', padding: '9px 18px' }}
                    onClick={() => saveEdit(post.id)}
                  >
                    Save
                  </button>
                  <button className="btn-secondary" style={{ flex: 'none', padding: '9px 18px' }} onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="post-card-head">
                  <div>
                    <h4>{post.title}</h4>
                    <span className="post-meta">
                      {post.author} · {formatDate(post.createdAt)}
                      {post.updatedAt ? ' · edited' : ''}
                    </span>
                  </div>
                  <div className="post-card-actions">
                    <button className="icon-btn" aria-label="Edit post" onClick={() => startEdit(post)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />
                      </svg>
                    </button>
                    <button className="icon-btn" aria-label="Delete post" onClick={() => deletePost(post.id)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="post-content">{post.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
