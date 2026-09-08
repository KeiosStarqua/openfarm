"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { EventForm } from "@/components/EventForm"
import { Timeline } from "@/components/Timeline"
import { useFarm } from "@/components/FarmProvider"
import { growingSeason } from "@/lib/ledger"
import { formatDate } from "@/lib/format"

export function FarmerDesk() {
  const { ledger, error, makePassport, makeFarm, makeSeason, addEvent, closeSeason } = useFarm()
  const router = useRouter()
  const season = growingSeason(ledger)
  const farm = ledger.farms[ledger.farms.length - 1]
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState("100")
  const [unit, setUnit] = useState("kg")

  const step = useMemo(() => {
    if (!ledger.passport) return 1
    if (!farm) return 2
    if (!season && ledger.stories.filter((story) => !story.demo).length === 0) return 3
    if (season) return 4
    return 5
  }, [farm, ledger.passport, ledger.stories, season])

  return (
    <div className="desk">
      <p className="kicker">Dành cho nông dân</p>
      <h1>Ghi quá trình trồng trọt</h1>
      <p className="lede">
        Từng sự kiện bạn ghi hôm nay sẽ nằm trong câu chuyện người mua đọc được
        trên sản phẩm. Không sửa được sau khi chốt mùa.
      </p>
      {error ? <p className="banner error">{error}</p> : null}

      {!ledger.passport ? (
        <section className="panel">
          <h2>1. Farmer Passport</h2>
          <form
            className="panel-form"
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              makePassport({
                name: String(form.get("name") ?? ""),
                region: String(form.get("region") ?? ""),
                bio: String(form.get("bio") ?? ""),
              })
            }}
          >
            <label>
              Tên
              <input name="name" required placeholder="Bảy Nguyễn" />
            </label>
            <label>
              Vùng
              <input name="region" required placeholder="Chợ Mới, An Giang" />
            </label>
            <label>
              Vài lời về ruộng
              <textarea name="bio" rows={3} placeholder="Ba vụ lúa, nước nội đồng..." />
            </label>
            <button type="submit" className="btn moss">
              Tạo Passport
            </button>
          </form>
        </section>
      ) : (
        <section className="passport-card">
          <span>Farmer Passport</span>
          <strong>{ledger.passport.name}</strong>
          <p>{ledger.passport.region}</p>
          <p>{ledger.passport.bio}</p>
          <small>
            {ledger.passport.seasonsCompleted} mùa đã chốt · điểm tin cậy{" "}
            {ledger.passport.trustScore}
          </small>
        </section>
      )}

      {ledger.passport && !farm ? (
        <section className="panel">
          <h2>2. Đăng ký nông trại</h2>
          <form
            className="panel-form"
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              makeFarm({
                name: String(form.get("name") ?? ""),
                region: String(form.get("region") ?? ledger.passport?.region ?? ""),
                cropFocus: String(form.get("cropFocus") ?? ""),
                establishedYear: Number(form.get("year") ?? new Date().getFullYear()),
              })
            }}
          >
            <label>
              Tên ruộng / trang trại
              <input name="name" required placeholder="Ruộng nhà Bảy" />
            </label>
            <label>
              Vùng
              <input name="region" defaultValue={ledger.passport.region} />
            </label>
            <label>
              Cây trồng chính
              <input name="cropFocus" required placeholder="Lúa ST25" />
            </label>
            <label>
              Năm lập
              <input name="year" type="number" defaultValue={2010} />
            </label>
            <button type="submit" className="btn moss">
              Đăng ký ruộng
            </button>
          </form>
        </section>
      ) : null}

      {farm && !season ? (
        <section className="panel">
          <h2>3. Mở mùa vụ</h2>
          <p>
            Ruộng <strong>{farm.name}</strong> · {farm.cropFocus}
          </p>
          <form
            className="panel-form"
            onSubmit={(event) => {
              event.preventDefault()
              const form = new FormData(event.currentTarget)
              makeSeason({
                farmId: farm.id,
                cropName: String(form.get("crop") ?? ""),
              })
            }}
          >
            <label>
              Cây / vụ này
              <input name="crop" required defaultValue={farm.cropFocus} />
            </label>
            <button type="submit" className="btn moss">
              Bắt đầu mùa vụ
            </button>
          </form>
        </section>
      ) : null}

      {season ? (
        <section className="panel">
          <h2>4. Nhật ký mùa {season.cropName}</h2>
          <p>
            Bắt đầu {formatDate(season.startedAt)} · {season.events.length} sự kiện
          </p>
          <EventForm
            onSubmit={(input) =>
              addEvent({
                seasonId: season.id,
                kind: input.kind,
                note: input.note,
                mediaBlobId: input.mediaBlobId,
              })
            }
          />
          {season.events.length > 0 ? <Timeline events={season.events} /> : (
            <p className="hint">Chưa có sự kiện. Hãy ghi ngày gieo giống trước.</p>
          )}
          <div className="harvest-box">
            <h3>Chốt mùa — phát hành câu chuyện</h3>
            <p>
              Người mua sẽ đọc toàn bộ nhật ký này. Cần ít nhất một lần gieo
              giống.
            </p>
            <form
              className="panel-form inline"
              onSubmit={(event) => {
                event.preventDefault()
                const id = closeSeason({
                  seasonId: season.id,
                  productName,
                  quantity: Number(quantity),
                  unit,
                })
                if (id) router.push(`/cau-chuyen/${id}`)
              }}
            >
              <label>
                Tên sản phẩm
                <input
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="Gạo ST25"
                />
              </label>
              <label>
                Sản lượng
                <input
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  type="number"
                  min={1}
                />
              </label>
              <label>
                Đơn vị
                <input value={unit} onChange={(event) => setUnit(event.target.value)} />
              </label>
              <button type="submit" className="btn clay">
                Chốt mùa &amp; mở câu chuyện
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="panel">
          <h2>Mùa vụ đã vào tay người mua</h2>
          <p>QR và liên kết câu chuyện nằm trên từng lô sản phẩm.</p>
          <ul className="story-list">
            {ledger.stories
              .filter((story) => !story.demo)
              .map((story) => (
                <li key={story.id}>
                  <Link href={`/cau-chuyen/${story.id}`}>{story.farmName} · {story.cropName}</Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
