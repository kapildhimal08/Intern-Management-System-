import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { prepareFile, fmtSize, openStored } from '../../lib/files'
import type { StoredFile } from '../../types/index'

interface Props {
  id: string
  label: string
  value: StoredFile | null | undefined
  onChange: (f: StoredFile | null) => void
  kind?: 'file' | 'image'
  accept?: string
  extensions?: string[]
  maxMB?: number
  hint?: string
  req?: boolean
  error?: string
}

/* Upload box with drag & drop, validation, preview, replace and remove.
   Files are kept in the browser for this demo; see prepareFile() in lib/files.ts to plug in Uploadcare. */
export function FileUpload({ id, label, value, onChange, kind = 'file', accept, extensions, maxMB = 1, hint, req, error }: Props) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [over, setOver] = useState(false)

  const take = async (file?: File | null) => {
    if (!file) return
    setBusy(true)
    setMsg('')
    try {
      onChange(await prepareFile(file, { maxBytes: maxMB * 1024 * 1024, image: kind === 'image', extensions }))
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }
  const onPick = (e: ChangeEvent<HTMLInputElement>) => take(e.target.files?.[0])
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]) }
  const shown = msg || error

  return (
    <div className={'field' + (shown ? ' has-error' : '')}>
      <label htmlFor={id}>{label}{req && <span className="req"> *</span>}</label>
      <input ref={input} id={id} type="file" accept={accept} onChange={onPick} className="upload-input" />
      {value ? (
        <div className="upload-file">
          {kind === 'image'
            ? <img src={value.dataUrl} alt="" className="upload-thumb" />
            : <span className="upload-ico" aria-hidden="true">📄</span>}
          <div className="upload-meta"><b>{value.name}</b><span className="muted">{fmtSize(value.size)}</span></div>
          <div className="upload-actions">
            {kind === 'file' && <button type="button" className="btn-sm ghost" onClick={() => openStored(value)}>View</button>}
            <button type="button" className="btn-sm ghost" onClick={() => input.current?.click()}>Replace</button>
            <button type="button" className="btn-sm no" onClick={() => { onChange(null); setMsg('') }}>Remove</button>
          </div>
        </div>
      ) : (
        <div
          className={'upload-zone' + (over ? ' over' : '')}
          onDragOver={(e) => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <button type="button" className="btn-secondary inline-btn" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? 'Uploading…' : kind === 'image' ? 'Choose photo' : 'Choose file'}
          </button>
          <span className="muted">or drag and drop here{hint ? ` · ${hint}` : ''}</span>
        </div>
      )}
      {shown && <div className="field-error" role="alert">{shown}</div>}
    </div>
  )
}
