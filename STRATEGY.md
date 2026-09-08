---
name: OpenFarm
last_updated: 2026-09-08
---

# OpenFarm Strategy

## Target problem

Người tiêu dùng mua nông sản mà không biết ai trồng, trồng ở đâu, và mùa vụ đó đã trải qua những gì. Công sức của nông dân biến mất sau khi sản phẩm rời ruộng — lòng tin bị thay bằng nhãn hiệu và lời kể của trung gian.

## Our approach

Nông dân ghi lại quá trình trồng trọt và sản xuất trên Sui. Mỗi mùa vụ trở thành một Harvest Story công khai, có thể kiểm chứng. Người mua đọc được nông dân, ruộng, và nhật ký sản xuất — rồi mới quyết định tin và mua.

## Who it's for

**Primary:** Nông dân — họ dùng OpenFarm để ghi nhận việc mình trồng và chứng minh mùa vụ với người mua, không phải để chơi game DeFi.

**Secondary:** Người tiêu dùng — họ dùng OpenFarm để gặp nông dân đứng sau sản phẩm, đọc nhật ký trồng trọt trước khi tin lời bao bì.

## Key metrics

- **Mùa vụ có nhật ký đầy đủ** — số season on-chain có ít nhất gieo → chăm sóc → thu hoạch
- **Lượt đọc Harvest Story** — số lần người mua mở câu chuyện từ QR / liên kết sản phẩm
- **Nông dân có Passport + Story** — số hộ đã phát hành ít nhất một câu chuyện thu hoạch
- **Sản phẩm gắn story** — số Product Batch NFT trỏ tới một Harvest Story

## Tracks

### Nhật ký sản xuất on-chain

Nông dân ghi sự kiện trồng trọt (gieo, tưới, bón, kiểm tra sâu bệnh, thời tiết, thu hoạch, đóng gói) thành dữ liệu không sửa được sau khi chốt mùa.

_Why it serves the approach:_ Không có nhật ký thì người mua không có gì để tin ngoài lời kể.

### Câu chuyện đến tay người mua

Harvest Story + Farmer Passport + QR trên lô hàng đưa người tiêu dùng thẳng tới nông dân và ruộng.

_Why it serves the approach:_ Dữ liệu chỉ có ích khi người mua đọc được nó ngay lúc đứng trước sản phẩm.

### Bộ nhớ mùa vụ (Walrus)

Ảnh, video, và nhật ký dài hạn của ruộng lưu trên Walrus, neo bằng blob id trong sự kiện on-chain.

_Why it serves the approach:_ Người mua cần thấy ruộng, không chỉ đọc số; nông dân cần nhớ mùa trước để kể đúng.

## Milestones

- **2026-08** — Sui Overflow 2026: nộp OpenFarm như lớp tin cậy nông nghiệp (Walrus Track).

## Not working on

- Game canh tác ảo hóa vị thế LP Cetus như sản phẩm cốt lõi
- Fork hay sao chép logic pool Cetus / DeepBook
- Marketplace đầy đủ hay escrow thanh toán trước khi nhật ký mùa vụ đọc được

## Marketing

**One-liner:** Từ ruộng đến bàn ăn — đọc được cả mùa vụ.

**Key message:** OpenFarm không tạo nông sản. Nó làm cho quá trình trồng trọt của nông dân trở thành hồ sơ công khai, để người mua gặp được người đã trồng ra thứ họ cầm trên tay.
