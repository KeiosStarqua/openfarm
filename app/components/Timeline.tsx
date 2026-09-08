import { kindMeta, type ProductionEvent } from "@/lib/ledger"
import { formatDate } from "@/lib/format"

export function Timeline({ events }: { events: ProductionEvent[] }) {
  return (
    <ol className="timeline">
      {events.map((event, index) => {
        const meta = kindMeta(event.kind)
        return (
          <li key={`${event.kind}-${event.recordedAt}-${index}`}>
            <span className="when">{formatDate(event.recordedAt)}</span>
            <strong>{meta?.label ?? "Sự kiện"}</strong>
            <p>{event.note}</p>
            {event.mediaBlobId ? (
              <code className="blob">Walrus · {event.mediaBlobId}</code>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
