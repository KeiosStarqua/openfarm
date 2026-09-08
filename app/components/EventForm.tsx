"use client"

import { useState } from "react"
import { EVENT_CATALOG, type EventKind } from "@/lib/ledger"

export function EventForm({
  disabled,
  onSubmit,
}: {
  disabled?: boolean
  onSubmit: (input: { kind: EventKind; note: string; mediaBlobId: string }) => void
}) {
  const [kind, setKind] = useState<EventKind>(0)
  const [note, setNote] = useState("")
  const [mediaBlobId, setMediaBlobId] = useState("")
  const choices = EVENT_CATALOG.filter((item) => item.kind !== 5)

  return (
    <form
      className="panel-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ kind, note, mediaBlobId })
        setNote("")
        setMediaBlobId("")
      }}
    >
      <label>
        Loại sự kiện
        <select
          value={kind}
          disabled={disabled}
          onChange={(event) => setKind(Number(event.target.value) as EventKind)}
        >
          {choices.map((item) => (
            <option key={item.id} value={item.kind}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ghi chú từ ruộng
        <textarea
          rows={3}
          disabled={disabled}
          value={note}
          placeholder={choices.find((item) => item.kind === kind)?.hint}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>
      <label>
        Walrus blob id (ảnh / video, không bắt buộc)
        <input
          disabled={disabled}
          value={mediaBlobId}
          placeholder="walrus://..."
          onChange={(event) => setMediaBlobId(event.target.value)}
        />
      </label>
      <button type="submit" className="btn clay" disabled={disabled}>
        Ghi vào mùa vụ
      </button>
    </form>
  )
}
