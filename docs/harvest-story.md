# Harvest Story — production journal for consumers

A Harvest Story is the public, sealed copy of one growing season. It is how a
consumer meets the farmer.

## Why a story, not a certificate

A static "organic" badge is a claim. A story is a sequence: seed went in on
this day, water and fertilizer followed, a pest check passed, harvest closed
the season. The farmer collected those facts while working. The chain keeps
the order.

## Event kinds

| Kind | Meaning | Typical note |
| ---- | ------- | ------------ |
| `seed` | Gieo / cấy / thả giống | Giống, mật độ, ngày xuống giống |
| `irrigate` | Tưới / điều tiết nước | Mực nước, nguồn nước |
| `fertilize` | Bón phân | Loại phân, liều, lý do |
| `pest` | Kiểm tra sâu bệnh | Hiện tượng, xử lý hoặc không xử lý |
| `weather` | Thời tiết / rủi ro | Hạn, lũ, mặn, nắng |
| `harvest` | Thu hoạch (ghi lúc chốt mùa) | Sản lượng, độ ẩm |
| `packing` | Đóng gói / sơ chế | Lô, ngày đóng |

Photos and longer notes are stored on **Walrus**. The event keeps `media_blob_id`.

## Consumer surface

The story page shows:

1. Farmer Passport (name, region, how many seasons completed)
2. Farm (name, crop focus, region)
3. Timeline of production events, oldest first
4. Product batch that this story backs
5. A share / QR target so the same URL can sit on a bag of rice

## Rules

- A season cannot be harvested without a `seed` event — there is no crop to tell.
- After harvest, new events are rejected.
- Trust score on the passport increases when a season is completed.

## Walrus

Walrus is the memory layer: last year's drought photos, pest images, harvest
video. The AI copilot (later) reads those blobs; the consumer already can.
Keep blob ids on the event, never embed large files on Sui.
