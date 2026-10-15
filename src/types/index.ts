/* ---------------------------------------------------------------------
   TYPES  (your AuthContext is plain JS, so we describe what we use of it)
   --------------------------------------------------------------------- */
export type Role = 'user' | 'admin'

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'used'


export interface AppUser {
  name?: string
  email?: string
  role?: string
}

export interface AuthShape {
  user: AppUser | null
  ready: boolean
  login: (email: string, password: string, remember?: boolean) => unknown
  logout: () => void
  enterAsUser: (name: string, email: string) => void
  enterAsAdmin: (passcode: string) => boolean
}

export interface LoginRequest {
  id: string
  name: string
  email: string
  status: RequestStatus
  createdAt: number
  decidedAt?: number
}

export type LoginResult = { ok: true } | { ok: false; error: string }


export interface NavLeaf { label: string; to: string; d: string; end?: boolean }

export interface NavGroup { label: string; d: string; children: { label: string; to: string }[] }

export interface Position {
  id: string; name: string; company?: string; location?: string; duration?: string; deadline?: string
  requirements?: string; responsibilities?: string; desc: string; icon: string; open: boolean
}

export interface UserAccount {
  email: string; name: string; hash: string
  phone?: string; education?: string; college?: string; skills?: string; experience?: string
  createdAt?: number
}

export type LoginCheck = { ok: true; name: string } | { ok: false; error: string }


export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected'

export interface ApplicationForm {
  fullName: string; dob: string; gender: string; phone: string; email: string
  address: string; city: string; country: string
  college: string; degree: string; faculty: string; semester: string
  position: string
}

export interface Application extends ApplicationForm {
  id: string
  userEmail: string
  status: ApplicationStatus
  createdAt: number
  decidedAt?: number
}

export interface InternRecord {
  id: string; name: string; email: string; phone: string
  college: string; degree: string; position: string
  source: 'manual' | 'csv' | 'application'
  createdAt: number
  applicationId?: string
}

export type FormErrors = Partial<Record<keyof ApplicationForm, string>>


/* ---------------------------------------------------------------------
   TASKS
   --------------------------------------------------------------------- */
export type TaskStatus = 'Todo' | 'In progress' | 'Done'

export interface TaskForm {
  title: string
  description: string
  project: string
  points: number
  status: TaskStatus
  labels: string
  startDate: string
  deadline: string
}

export interface Task extends TaskForm {
  id: string
  assignedTo: string   // user email, lowercase (same idea as Application.userEmail)
  createdAt: number
  updatedAt?: number
}

export type TaskFormErrors = Partial<Record<keyof TaskForm, string>>