import {
  EVENT_KIND_FERTILIZE,
  EVENT_KIND_HARVEST,
  EVENT_KIND_IRRIGATE,
  EVENT_KIND_PACKING,
  EVENT_KIND_PEST,
  EVENT_KIND_SEED,
  EVENT_KIND_WEATHER,
  type HarvestStory,
} from "./ledger"

const day = 24 * 60 * 60 * 1000
const start = Date.parse("2026-05-12T00:00:00+07:00")

export const DEMO_STORY: HarvestStory = {
  id: "ruong-nha-bay",
  seasonId: "season_bay_2026a",
  farmId: "farm_bay",
  farmerName: "Bảy Nguyễn",
  farmName: "Ruộng nhà Bảy",
  region: "Chợ Mới, An Giang",
  cropName: "Lúa ST25",
  harvestedAt: start + 92 * day,
  productName: "Gạo ST25",
  quantity: 1280,
  unit: "kg",
  demo: true,
  events: [
    {
      kind: EVENT_KIND_SEED,
      recordedAt: start,
      note: "Cấy giống ST25, mật độ 18 khóm/m². Mạ 18 ngày, lấy từ thửa giống nhà.",
      mediaBlobId: "",
    },
    {
      kind: EVENT_KIND_IRRIGATE,
      recordedAt: start + 8 * day,
      note: "Giữ mực nước 4–5 cm. Nước từ kênh nội đồng, không bơm nước kênh chính.",
      mediaBlobId: "walrus://bay-2026a-nuoc",
    },
    {
      kind: EVENT_KIND_FERTILIZE,
      recordedAt: start + 22 * day,
      note: "Bón thúc lần 1: phân hữu cơ hoai + kali. Không dùng thuốc trừ cỏ.",
      mediaBlobId: "",
    },
    {
      kind: EVENT_KIND_PEST,
      recordedAt: start + 41 * day,
      note: "Thấy rầy nâu rải rác. Thả vịt đồng, không phun thuốc.",
      mediaBlobId: "walrus://bay-2026a-ray",
    },
    {
      kind: EVENT_KIND_WEATHER,
      recordedAt: start + 63 * day,
      note: "Mưa lớn hai ngày. Tháo nước tránh ngập đòng.",
      mediaBlobId: "",
    },
    {
      kind: EVENT_KIND_HARVEST,
      recordedAt: start + 92 * day,
      note: "Gạo ST25",
      mediaBlobId: "",
    },
    {
      kind: EVENT_KIND_PACKING,
      recordedAt: start + 93 * day,
      note: "Phơi 2 nắng, đóng bao 10 kg. Lô AG-ST25-2608.",
      mediaBlobId: "",
    },
  ],
}

export const DEMO_STORIES: HarvestStory[] = [DEMO_STORY]
