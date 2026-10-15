
/* ---------------------------------------------------------------------
   1. LOGIN APPROVAL LOGIC (demo: localStorage / sessionStorage)
   Normal users sign in with your existing login, then are held on a
   "waiting" screen until the admin approves them from the notification bell.
   --------------------------------------------------------------------- */
export const REQ_KEY = 'ims_login_requests'

export const EVT = 'ims-approvals-changed'

export const ADMIN_EMAIL = 'admin@internsys.com'

export const GATE_REQ = 'ims_gate_request' // sessionStorage: this tab's request id

export const GATE_OK = 'ims_gate_ok' //       sessionStorage: email approved in this tab


/* ---------------------------------------------------------------------
   DATA: positions, applications, intern records (demo: localStorage)
   --------------------------------------------------------------------- */
// Set to false if normal users should NOT need admin approval to log in.
export const REQUIRE_LOGIN_APPROVAL = false


export const NEXT_KEY = 'ims_next' // sessionStorage: where to send a visitor after login

export const APPS_KEY = 'ims_applications'

export const INTERNS_KEY = 'ims_interns'


// Positions are added by the admin and stored (demo: localStorage). Nothing is hardcoded.
export const POSITIONS_KEY = 'ims_positions'

// User accounts: created on the Register page (demo: localStorage; passwords are stored hashed)
export const USERS_KEY = 'ims_users'

export const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const TASKS_KEY = 'tasks'