import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useRequest, setRequestStatus } from '../utils/approvals'

export default function LoginWaiting() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { finalizeLogin } = useAuth()
  const req = useRequest(id)

  useEffect(() => {
    if (req?.status === 'approved') {
      setRequestStatus(id, 'used') // one-time approval
      finalizeLogin(req.email)
      navigate('/dashboard', { replace: true })
    }
    // eslint-disable-next-line
  }, [req?.status])

  let title = 'Waiting for admin approval'
  let text = 'Your login request was sent to the admin. This page updates automatically as soon as it is approved.'
  if (!req) { title = 'Request not found'; text = 'This request has expired or does not exist.' }
  else if (req.status === 'rejected') { title = 'Login rejected'; text = 'The admin declined this login request.' }

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-card wait-card">
          {req?.status === 'pending' && <div className="wait-spinner" />}
          <h1>{title}</h1>
          <p className="lede">{text}</p>
          <Link to="/login" className="btn-secondary wait-back">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
