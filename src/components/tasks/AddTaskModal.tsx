import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Task, TaskForm, TaskFormErrors } from '../../types/index'

type Props = {
  assignedTo: string
  onSave: (task: Task) => void
  onClose: () => void
}

const EMPTY: TaskForm = {
  title: '', description: '', project: '', points: 1,
  status: 'Todo', labels: '', startDate: '', deadline: '',
}

const CSS = `
.tm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:flex-start;padding:50px 16px;z-index:99999;overflow-y:auto}
.tm-backdrop .tm-modal{background:#fff;width:100%;max-width:460px;border-radius:8px;box-shadow:0 20px 50px rgba(0,0,0,.3);display:flex;flex-direction:column;max-height:calc(100vh - 100px)}
.tm-backdrop .tm-head{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #eceef2}
.tm-backdrop .tm-head h3{margin:0;font-size:15px;font-weight:500;color:#374151}
.tm-backdrop button.tm-x{all:unset;cursor:pointer;font-size:14px;color:#6b7280;padding:2px 6px}
.tm-backdrop .tm-body{padding:8px 16px;overflow-y:auto;display:flex;flex-direction:column;gap:7px}
.tm-backdrop .tm-row{display:grid;grid-template-columns:78px 1fr;align-items:start}
.tm-backdrop .tm-row>label{display:block;font-size:12px;color:#374151;padding-top:7px;margin:0}
.tm-backdrop .tm-field{display:flex;flex-direction:column;gap:2px}
.tm-backdrop .tm-field input,.tm-backdrop .tm-field select,.tm-backdrop .tm-field textarea{display:block;width:100%;box-sizing:border-box;height:30px;padding:0 9px;font-size:12px;font-family:inherit;color:#1f2937;background:#f3f4f6;border:1px solid transparent;border-radius:4px;outline:none;margin:0}
.tm-backdrop .tm-field textarea{height:50px;padding:6px 9px;resize:vertical}
.tm-backdrop .tm-field input:focus,.tm-backdrop .tm-field select:focus,.tm-backdrop .tm-field textarea:focus{background:#fff;border-color:#4f8ff7}
.tm-backdrop .tm-field input:disabled{color:#6b7280;cursor:not-allowed}
.tm-backdrop .tm-error{margin:0;font-size:11px;color:#dc2626}
.tm-backdrop .tm-foot{display:flex;justify-content:flex-end;align-items:center;gap:6px;padding:8px 16px;border-top:1px solid #eceef2}
.tm-backdrop button.tm-btn{display:inline-flex;align-items:center;gap:4px;width:auto;height:auto;padding:5px 12px;font-size:12px;font-weight:400;border-radius:4px;cursor:pointer;border:1px solid #e5e7eb;background:#fff;color:#374151}
.tm-backdrop button.tm-btn-primary{background:#4f8ff7;border-color:#4f8ff7;color:#fff}
@media(max-width:520px){.tm-backdrop .tm-row{grid-template-columns:1fr}.tm-backdrop .tm-row>label{padding:0 0 3px}}
`
export function AddTaskModal({ assignedTo, onSave, onClose }: Props) {
  const [form, setForm] = useState<TaskForm>(EMPTY)
  const [errors, setErrors] = useState<TaskFormErrors>({})

  const set = <K extends keyof TaskForm>(k: K, v: TaskForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    const e: TaskFormErrors = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (form.startDate && form.deadline && form.deadline < form.startDate)
      e.deadline = 'Deadline cannot be before the start date'
    setErrors(e)
    if (Object.keys(e).length) return

    onSave({
      ...form,
      title: form.title.trim(),
      id: crypto.randomUUID(),
      assignedTo,
      createdAt: Date.now(),
    })
  }

  return createPortal(
    <div className="tm-backdrop" onClick={onClose}>
      <style>{CSS}</style>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tm-head">
          <h3>Add task</h3>
          <button className="tm-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="tm-body">
          <div className="tm-row">
            <label>Title</label>
            <div className="tm-field">
              <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Title" />
              {errors.title && <p className="tm-error">{errors.title}</p>}
            </div>
          </div>

          <div className="tm-row">
            <label>Description</label>
            <div className="tm-field">
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Description" />
            </div>
          </div>

          <div className="tm-row">
            <label>Project</label>
            <div className="tm-field">
              <input value={form.project} onChange={(e) => set('project', e.target.value)} placeholder="Project" />
            </div>
          </div>

          <div className="tm-row">
            <label>Points</label>
            <div className="tm-field">
              <select value={form.points} onChange={(e) => set('points', Number(e.target.value))}>
                {[1, 2, 3, 5, 8].map((p) => (
                  <option key={p} value={p}>{p} {p === 1 ? 'Point' : 'Points'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="tm-row">
            <label>Assign to</label>
            <div className="tm-field">
              <input value={assignedTo} disabled />
            </div>
          </div>

          <div className="tm-row">
            <label>Status</label>
            <div className="tm-field">
              <select value={form.status} onChange={(e) => set('status', e.target.value as TaskForm['status'])}>
                <option>Todo</option>
                <option>In progress</option>
                <option>Done</option>
              </select>
            </div>
          </div>

          <div className="tm-row">
            <label>Labels</label>
            <div className="tm-field">
              <input value={form.labels} onChange={(e) => set('labels', e.target.value)} placeholder="Labels" />
            </div>
          </div>

          <div className="tm-row">
            <label>Start date</label>
            <div className="tm-field">
              <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
            </div>
          </div>

          <div className="tm-row">
            <label>Deadline</label>
            <div className="tm-field">
              <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
              {errors.deadline && <p className="tm-error">{errors.deadline}</p>}
            </div>
          </div>
        </div>

        <div className="tm-foot">
          <button className="tm-btn" onClick={onClose}>✕ Close</button>
          <button className="tm-btn tm-btn-primary" onClick={submit}>✓ Save</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}