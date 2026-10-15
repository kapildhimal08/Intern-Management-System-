import { APPS_KEY, INTERNS_KEY, EMAIL_RE } from './constants'
import { uid, readList, writeList } from './storage'
import type { ApplicationStatus, ApplicationForm, Application, InternRecord, FormErrors } from '../types/index'


// Accept / reject / reopen an application (accepting creates an intern record).
export function decideApplication(id: string, status: ApplicationStatus) {
  const apps = readList<Application>(APPS_KEY)
  const target = apps.find((a) => a.id === id)
  if (!target) return
  writeList(APPS_KEY, apps.map((a) => (a.id === id ? { ...a, status, decidedAt: Date.now() } : a)))
  const interns = readList<InternRecord>(INTERNS_KEY)
  const has = interns.some((i) => i.applicationId === id)
  if (status === 'Approved' && !has) {
    writeList(INTERNS_KEY, [{
      id: uid(), name: target.fullName, email: target.email, phone: target.phone,
      college: target.college, degree: target.degree, position: target.position,
      source: 'application', createdAt: Date.now(), applicationId: id,
    } as InternRecord, ...interns])
  }
  if (status !== 'Approved' && has) writeList(INTERNS_KEY, interns.filter((i) => i.applicationId !== id))
}


// Minimal CSV parser (handles quoted fields and escaped quotes).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let quoted = false
  const push = () => { row.push(cur); cur = ''; if (row.some((x) => x.trim() !== '')) rows.push(row); row = [] }
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++ } else quoted = false } else cur += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; push() }
    else cur += c
  }
  push()
  return rows
}


export const EMPTY_FORM: ApplicationForm = {
  fullName: '', dob: '', gender: '', phone: '', email: '', address: '', city: '', country: '',
  college: '', degree: '', faculty: '', semester: '', position: '',
  skills: '', coverLetter: '',
}


export function validateForm(f: ApplicationForm): FormErrors {
  const e: FormErrors = {}
  if (f.fullName.trim().length < 2) e.fullName = 'Please enter your full name.'
  const digits = f.phone.replace(/\D/g, '')
  if (!f.phone.trim()) e.phone = 'Phone number is required.'
  else if (!/^[+()\-\s\d]+$/.test(f.phone) || digits.length < 7 || digits.length > 15) e.phone = 'Enter a valid phone number.'
  if (!f.email.trim()) e.email = 'Email address is required.'
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (!f.college.trim()) e.college = 'College / University is required.'
  if (!f.degree.trim()) e.degree = 'Degree / Program is required.'
  if (!f.position) e.position = 'Please choose an internship position.'
  if (f.dob) {
    const d = new Date(f.dob)
    if (isNaN(d.getTime()) || d > new Date()) e.dob = 'Date of birth cannot be in the future.'
  }
  return e
}


export const STATUS_BADGE: Record<ApplicationStatus, string> = { Pending: 'pending', Approved: 'completed', Rejected: 'rejected' }
