"use client"

import Link from "next/link"
import { useFarm } from "@/components/FarmProvider"
import { formatDate } from "@/lib/format"

export function StoryMarket() {
  const { ledger, ready } = useFarm()
  if (!ready) return <p className="hint">Đang mở chợ câu chuyện...</p>

  return (
    <div className="desk">
      <p className="kicker">Người tiêu dùng</p>
      <h1>Chợ câu chuyện</h1>
      <p className="lede">
        Mỗi thẻ là một mùa vụ đã chốt. Mở ra để đọc nông dân nào trồng, và họ
        đã làm gì trên ruộng.
      </p>
      <ul className="market">
        {ledger.stories.map((story) => (
          <li key={story.id}>
            <Link href={`/cau-chuyen/${story.id}`}>
              <span className="place">{story.region}</span>
              <strong>{story.farmName}</strong>
              <em>
                {story.cropName} · {story.farmerName}
              </em>
              <small>
                {story.productName} · thu hoạch {formatDate(story.harvestedAt)}
              </small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
