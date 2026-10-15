import type { ReactNode } from 'react'


export function Field({ id, label, req, error, children }: { id: string; label: string; req?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className={'field' + (error ? ' has-error' : '')}>
      <label htmlFor={id}>{label}{req && <span className="req"> *</span>}</label>
      {children}
      {error && <div className="field-error" role="alert">{error}</div>}
    </div>
  )
}
