import { describe, expect, it } from "vitest"
import {
  EVENT_KIND_IRRIGATE,
  EVENT_KIND_SEED,
  createPassport,
  emptyLedger,
  harvestSeason,
  logEvent,
  registerFarm,
  startSeason,
} from "./ledger"

function farmerReady() {
  let ledger = createPassport(emptyLedger(), {
    name: "Bảy Nguyễn",
    region: "An Giang",
    bio: "Ruộng lúa",
  })
  ledger = registerFarm(ledger, {
    name: "Ruộng nhà Bảy",
    region: "An Giang",
    cropFocus: "Lúa ST25",
    establishedYear: 1998,
  })
  return startSeason(ledger, {
    farmId: ledger.farms[0].id,
    cropName: "Lúa ST25",
  })
}

describe("production ledger", () => {
  it("lets a farmer collect planting data and publish a consumer story", () => {
    let ledger = farmerReady()
    const seasonId = ledger.seasons[0].id
    ledger = logEvent(ledger, {
      seasonId,
      kind: EVENT_KIND_SEED,
      note: "Cấy ST25",
    })
    ledger = logEvent(ledger, {
      seasonId,
      kind: EVENT_KIND_IRRIGATE,
      note: "Giữ nước 5cm",
      mediaBlobId: "walrus://nuoc",
    })
    ledger = harvestSeason(ledger, {
      seasonId,
      productName: "Gạo ST25",
      quantity: 1280,
      unit: "kg",
      storyId: "ruong-test",
    })

    expect(ledger.passport?.seasonsCompleted).toBe(1)
    expect(ledger.passport?.trustScore).toBe(10)
    expect(ledger.stories[0].id).toBe("ruong-test")
    expect(ledger.stories[0].events.map((event) => event.kind)).toEqual([
      EVENT_KIND_SEED,
      EVENT_KIND_IRRIGATE,
      5,
    ])
    expect(ledger.batches[0].quantity).toBe(1280)
    expect(ledger.seasons[0].status).toBe("harvested")
  })

  it("refuses harvest without a seed event", () => {
    const ledger = farmerReady()
    expect(() =>
      harvestSeason(ledger, {
        seasonId: ledger.seasons[0].id,
        productName: "Gạo",
        quantity: 1,
        unit: "kg",
      }),
    ).toThrow(/gieo giống/)
  })

  it("seals the journal after harvest", () => {
    let ledger = farmerReady()
    const seasonId = ledger.seasons[0].id
    ledger = logEvent(ledger, { seasonId, kind: EVENT_KIND_SEED, note: "Cấy" })
    ledger = harvestSeason(ledger, {
      seasonId,
      productName: "Gạo",
      quantity: 10,
      unit: "kg",
    })
    expect(() =>
      logEvent(ledger, { seasonId, kind: EVENT_KIND_IRRIGATE, note: "Muộn" }),
    ).toThrow(/đã chốt/)
  })
})
