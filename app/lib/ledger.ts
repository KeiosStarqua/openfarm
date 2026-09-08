export const EVENT_KIND_SEED = 0
export const EVENT_KIND_IRRIGATE = 1
export const EVENT_KIND_FERTILIZE = 2
export const EVENT_KIND_PEST = 3
export const EVENT_KIND_WEATHER = 4
export const EVENT_KIND_HARVEST = 5
export const EVENT_KIND_PACKING = 6

export type EventKind =
  | typeof EVENT_KIND_SEED
  | typeof EVENT_KIND_IRRIGATE
  | typeof EVENT_KIND_FERTILIZE
  | typeof EVENT_KIND_PEST
  | typeof EVENT_KIND_WEATHER
  | typeof EVENT_KIND_HARVEST
  | typeof EVENT_KIND_PACKING

export const EVENT_CATALOG: {
  kind: EventKind
  id: string
  label: string
  hint: string
  farmerOnly?: boolean
}[] = [
  { kind: EVENT_KIND_SEED, id: "seed", label: "Gieo giống", hint: "Giống, mật độ, ngày xuống giống" },
  { kind: EVENT_KIND_IRRIGATE, id: "irrigate", label: "Tưới / điều nước", hint: "Mực nước, nguồn nước" },
  { kind: EVENT_KIND_FERTILIZE, id: "fertilize", label: "Bón phân", hint: "Loại phân, liều lượng" },
  { kind: EVENT_KIND_PEST, id: "pest", label: "Kiểm tra sâu bệnh", hint: "Hiện tượng và cách xử lý" },
  { kind: EVENT_KIND_WEATHER, id: "weather", label: "Thời tiết / rủi ro", hint: "Hạn, lũ, mặn, nắng" },
  { kind: EVENT_KIND_PACKING, id: "packing", label: "Đóng gói / sơ chế", hint: "Lô, ngày đóng" },
  {
    kind: EVENT_KIND_HARVEST,
    id: "harvest",
    label: "Thu hoạch",
    hint: "Được ghi khi chốt mùa",
    farmerOnly: true,
  },
]

export function kindMeta(kind: EventKind) {
  return EVENT_CATALOG.find((item) => item.kind === kind)
}

export type FarmerPassport = {
  id: string
  name: string
  region: string
  bio: string
  trustScore: number
  seasonsCompleted: number
  createdAt: number
}

export type Farm = {
  id: string
  farmerName: string
  name: string
  region: string
  cropFocus: string
  establishedYear: number
  createdAt: number
}

export type ProductionEvent = {
  kind: EventKind
  recordedAt: number
  note: string
  mediaBlobId: string
}

export type Season = {
  id: string
  farmId: string
  farmerName: string
  farmName: string
  region: string
  cropName: string
  startedAt: number
  harvestedAt: number | null
  events: ProductionEvent[]
  status: "growing" | "harvested"
}

export type HarvestStory = {
  id: string
  seasonId: string
  farmId: string
  farmerName: string
  farmName: string
  region: string
  cropName: string
  events: ProductionEvent[]
  harvestedAt: number
  productName: string
  quantity: number
  unit: string
  demo?: boolean
}

export type ProductBatch = {
  id: string
  storyId: string
  productName: string
  quantity: number
  unit: string
  harvestedAt: number
}

export type Ledger = {
  passport: FarmerPassport | null
  farms: Farm[]
  seasons: Season[]
  stories: HarvestStory[]
  batches: ProductBatch[]
}

export const emptyLedger = (): Ledger => ({
  passport: null,
  farms: [],
  seasons: [],
  stories: [],
  batches: [],
})

export class LedgerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LedgerError"
  }
}

function requireText(value: string, message: string) {
  if (!value.trim()) throw new LedgerError(message)
  return value.trim()
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

export function createPassport(
  ledger: Ledger,
  input: { name: string; region: string; bio: string },
  now = Date.now(),
): Ledger {
  if (ledger.passport) throw new LedgerError("Bạn đã có Farmer Passport.")
  return {
    ...ledger,
    passport: {
      id: newId("pass"),
      name: requireText(input.name, "Cần tên nông dân."),
      region: requireText(input.region, "Cần vùng canh tác."),
      bio: input.bio.trim(),
      trustScore: 0,
      seasonsCompleted: 0,
      createdAt: now,
    },
  }
}

export function registerFarm(
  ledger: Ledger,
  input: { name: string; region: string; cropFocus: string; establishedYear: number },
  now = Date.now(),
): Ledger {
  if (!ledger.passport) throw new LedgerError("Hãy tạo Farmer Passport trước.")
  const farm: Farm = {
    id: newId("farm"),
    farmerName: ledger.passport.name,
    name: requireText(input.name, "Cần tên nông trại."),
    region: requireText(input.region, "Cần vùng."),
    cropFocus: requireText(input.cropFocus, "Cần cây trồng chính."),
    establishedYear: input.establishedYear,
    createdAt: now,
  }
  return { ...ledger, farms: [...ledger.farms, farm] }
}

export function startSeason(
  ledger: Ledger,
  input: { farmId: string; cropName: string },
  now = Date.now(),
): Ledger {
  if (!ledger.passport) throw new LedgerError("Hãy tạo Farmer Passport trước.")
  const farm = ledger.farms.find((item) => item.id === input.farmId)
  if (!farm) throw new LedgerError("Không tìm thấy nông trại.")
  const season: Season = {
    id: newId("season"),
    farmId: farm.id,
    farmerName: ledger.passport.name,
    farmName: farm.name,
    region: farm.region,
    cropName: requireText(input.cropName, "Cần tên cây / vụ."),
    startedAt: now,
    harvestedAt: null,
    events: [],
    status: "growing",
  }
  return { ...ledger, seasons: [...ledger.seasons, season] }
}

export function logEvent(
  ledger: Ledger,
  input: { seasonId: string; kind: EventKind; note: string; mediaBlobId?: string },
  now = Date.now(),
): Ledger {
  const season = ledger.seasons.find((item) => item.id === input.seasonId)
  if (!season) throw new LedgerError("Không tìm thấy mùa vụ.")
  if (season.status !== "growing") throw new LedgerError("Mùa vụ đã chốt, không ghi thêm được.")
  if (input.kind === EVENT_KIND_HARVEST) {
    throw new LedgerError("Thu hoạch được ghi khi bạn chốt mùa.")
  }
  if (input.kind > EVENT_KIND_PACKING) throw new LedgerError("Loại sự kiện không hợp lệ.")
  return {
    ...ledger,
    seasons: ledger.seasons.map((item) =>
      item.id === season.id
        ? {
            ...item,
            events: [
              ...item.events,
              {
                kind: input.kind,
                recordedAt: now,
                note: requireText(input.note, "Hãy viết ghi chú cho sự kiện."),
                mediaBlobId: input.mediaBlobId?.trim() ?? "",
              },
            ],
          }
        : item,
    ),
  }
}

export function harvestSeason(
  ledger: Ledger,
  input: { seasonId: string; productName: string; quantity: number; unit: string; storyId?: string },
  now = Date.now(),
): Ledger {
  if (!ledger.passport) throw new LedgerError("Hãy tạo Farmer Passport trước.")
  const season = ledger.seasons.find((item) => item.id === input.seasonId)
  if (!season) throw new LedgerError("Không tìm thấy mùa vụ.")
  if (season.status !== "growing") throw new LedgerError("Mùa vụ đã chốt.")
  if (!season.events.some((event) => event.kind === EVENT_KIND_SEED)) {
    throw new LedgerError("Cần ít nhất một sự kiện gieo giống trước khi thu hoạch.")
  }
  const productName = requireText(input.productName, "Cần tên sản phẩm.")
  if (!(input.quantity > 0)) throw new LedgerError("Sản lượng phải lớn hơn 0.")
  const events = [
    ...season.events,
    {
      kind: EVENT_KIND_HARVEST as EventKind,
      recordedAt: now,
      note: productName,
      mediaBlobId: "",
    },
  ]
  const story: HarvestStory = {
    id: input.storyId ?? slugStory(season.farmName, now),
    seasonId: season.id,
    farmId: season.farmId,
    farmerName: season.farmerName,
    farmName: season.farmName,
    region: season.region,
    cropName: season.cropName,
    events,
    harvestedAt: now,
    productName,
    quantity: input.quantity,
    unit: requireText(input.unit, "Cần đơn vị."),
  }
  const batch: ProductBatch = {
    id: newId("batch"),
    storyId: story.id,
    productName,
    quantity: input.quantity,
    unit: story.unit,
    harvestedAt: now,
  }
  return {
    ...ledger,
    passport: {
      ...ledger.passport,
      seasonsCompleted: ledger.passport.seasonsCompleted + 1,
      trustScore: ledger.passport.trustScore + 10,
    },
    seasons: ledger.seasons.map((item) =>
      item.id === season.id ? { ...item, events, harvestedAt: now, status: "harvested" } : item,
    ),
    stories: [...ledger.stories, story],
    batches: [...ledger.batches, batch],
  }
}

export function slugStory(farmName: string, now: number) {
  const slug = farmName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${slug || "mua-vu"}-${now.toString(36)}`
}

export function growingSeason(ledger: Ledger) {
  return ledger.seasons.find((season) => season.status === "growing") ?? null
}

export function storyById(ledger: Ledger, id: string) {
  return ledger.stories.find((story) => story.id === id) ?? null
}
