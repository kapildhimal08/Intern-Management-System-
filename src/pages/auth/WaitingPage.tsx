import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth, isAdmin, createLoginRequest, setRequestStatus, gateOk, clearGate, useRequest, destination } from '../../lib/auth'
import { GATE_REQ, GATE_OK, REQUIRE_LOGIN_APPROVAL } from '../../lib/constants'


export function WaitingPage() {
  const { user, ready, logout } = useAuth()
  const navigate = useNavigate()
  const [id, setId] = useState(() => sessionStorage.getItem(GATE_REQ))
  const req = useRequest(id)

  // Make sure there is a live request for this session (e.g. after a browser restart).
  useEffect(() => {
    if (!ready || !user) return
    if (isAdmin(user) || !REQUIRE_LOGIN_APPROVAL || gateOk(user.email)) { navigate(destination(isAdmin(user)), { replace: true }); return }
    if (!id || !req || req.status === 'used') {
      const r = createLoginRequest(user)
      sessionStorage.setItem(GATE_REQ, r.id)
      setId(r.id)
    }
    // eslint-disable-next-line
  }, [ready, user, id, req?.status])

  useEffect(() => {
    if (req?.status === 'approved' && user) {
      setRequestStatus(req.id, 'used') // one-time approval
      sessionStorage.setItem(GATE_OK, String(user.email).toLowerCase())
      navigate(destination(false), { replace: true })
    }
    // eslint-disable-next-line
  }, [req?.status])

  if (ready && !user) return <Navigate to="/login" replace />
  const rejected = req?.status === 'rejected'
  const back = () => { clearGate(); logout(); navigate('/login', { replace: true }) }

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-card wait-card">
          {!rejected && <div className="wait-spinner" />}
          <h1>{rejected ? 'Login rejected' : 'Waiting for admin approval'}</h1>
          <p className="lede">
            {rejected
              ? 'The admin declined this login request.'
              : 'Your login request was sent to the admin. This page updates automatically as soon as it is approved.'}
          </p>
          <button type="button" className="btn-secondary wait-back" onClick={back}>{rejected ? 'Back to login' : 'Cancel & sign out'}</button>
        </div>
      </div>
    </div>
  )
}
