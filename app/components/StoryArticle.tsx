"use client"

import { useMemo, useState } from "react"
import { Timeline } from "@/components/Timeline"
import { useFarm } from "@/components/FarmProvider"
import { daysBetween, formatDate } from "@/lib/format"

export function StoryArticle({ id }: { id: string }) {
  const { ledger, ready } = useFarm()
  const story = useMemo(() => ledger.stories.find((item) => item.id === id), [id, ledger.stories])
  const [copied, setCopied] = useState(false)
  const origin = typeof window === "undefined" ? "" : window.location.origin
  const shareUrl = `${origin}/cau-chuyen/${id}`

  if (!ready) return <p className="hint">Đang mở nhật ký...</p>
  if (!story) {
    return (
      <div className="desk">
        <h1>Không tìm thấy mùa vụ này</h1>
        <p>Liên kết có thể sai, hoặc nông dân chưa chốt mùa.</p>
      </div>
    )
  }

  const first = story.events[0]?.recordedAt ?? story.harvestedAt
  const length = daysBetween(first, story.harvestedAt)

  return (
    <article className="story">
      <p className="kicker">Câu chuyện mùa vụ · {story.region}</p>
      <h1>{story.farmName}</h1>
      <p className="lede">
        {story.cropName} do <strong>{story.farmerName}</strong> trồng. Người mua
        đang đọc nhật ký sản xuất, không phải lời quảng cáo.
      </p>
      <dl className="facts">
        <div>
          <dt>Nông dân</dt>
          <dd>{story.farmerName}</dd>
        </div>
        <div>
          <dt>Ruộng</dt>
          <dd>{story.farmName}</dd>
        </div>
        <div>
          <dt>Sản phẩm</dt>
          <dd>
            {story.productName} · {story.quantity} {story.unit}
          </dd>
        </div>
        <div>
          <dt>Mùa vụ</dt>
          <dd>
            {formatDate(first)} — {formatDate(story.harvestedAt)} ({length} ngày)
          </dd>
        </div>
      </dl>
      <section>
        <h2>Nhật ký trồng trọt</h2>
        <Timeline events={story.events} />
      </section>
      <aside className="share-card">
        <h2>Đưa câu chuyện lên bao bì</h2>
        <p>In QR hoặc dán liên kết này lên lô hàng. Người mua mở là gặp ruộng.</p>
        <code>{shareUrl}</code>
        <button
          type="button"
          className="btn moss"
          onClick={async () => {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
          }}
        >
          {copied ? "Đã chép liên kết" : "Chép liên kết câu chuyện"}
        </button>
      </aside>
    </article>
  )
}
