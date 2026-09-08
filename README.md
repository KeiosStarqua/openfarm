# OpenFarm

> Từ ruộng đến bàn ăn — đọc được cả mùa vụ.

OpenFarm dùng blockchain **Sui** để đưa người tiêu dùng đến gần nông dân.
Nông dân ghi nhật ký trồng trọt và sản xuất. Mỗi mùa vụ trở thành một
**Harvest Story** công khai. Người mua quét QR trên sản phẩm (hoặc mở liên
kết câu chuyện) và thấy người đã trồng, thửa ruộng, và từng bước của mùa vụ.

Đây không phải game canh tác ảo, cũng không phải sàn DeFi. OpenFarm là lớp
tin cậy nông nghiệp: dữ liệu quá trình sản xuất do nông dân thu thập, người
mua đọc được trước khi tin.

Ý tưởng ban đầu: **Henry Nguyen**. Phát triển: **Tạ Quang Khôi**. Tiền thân:
Hack the Farm.

---

## Người dùng làm gì

### Nông dân

1. Tạo **Farmer Passport** (tên, vùng, lời giới thiệu).
2. Đăng ký **nông trại**.
3. Mở **mùa vụ** (loại cây / vật nuôi).
4. Ghi sự kiện: gieo, tưới, bón, kiểm tra sâu bệnh, thời tiết, thu hoạch, đóng gói.
5. Chốt mùa — phát hành Harvest Story và lô sản phẩm (Product Batch).

### Người tiêu dùng

1. Mở chợ câu chuyện hoặc quét QR trên sản phẩm.
2. Đọc Passport của nông dân, thông tin ruộng, và dòng thời gian sản xuất.
3. Biết mình đang mua từ ai — không chỉ mua một nhãn.

---

## Tech stack

| Layer | Technology |
| ---------------- | ----------------------------------- |
| Blockchain | [Sui](https://sui.io/) |
| Smart contracts | [Move](https://docs.sui.io/concepts/sui-move-concepts) |
| Media / memory | [Walrus](https://www.walrus.xyz/) blob ids on production events |
| Records | Farmer Passport, Farm, Season, Harvest Story, Product Batch |
| Frontend | [Next.js](https://nextjs.org/) |

---

## Architecture

```
Nông dân ghi nhật ký ──► Season (Sui shared object)
        │                      │
        │                      ▼
        │              Harvest Story (công khai)
        │                      │
        │                      ├── Walrus: ảnh / video mùa vụ
        │                      └── Product Batch NFT ──► người mua
        ▼
Người tiêu dùng quét QR / mở /cau-chuyen/[id]
```

Chi tiết: [`docs/architecture.md`](./docs/architecture.md) và
[`docs/harvest-story.md`](./docs/harvest-story.md).

---

## Getting started

### Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) (1.45+)
- [Node.js](https://nodejs.org/) 18+ and [pnpm](https://pnpm.io/)
- A Sui wallet funded on **testnet** when you publish contracts

### Smart contracts (Move)

```bash
cd move
sui move build
sui move test
sui client publish --gas-budget 100000000
```

### Frontend (Next.js)

The app ships with a local ledger that mirrors the Move types so the farmer
journal and consumer story work before a package is published.

```bash
cd app
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Farmer journal:
`/nong-dan`. Consumer stories: `/cho` and `/cau-chuyen/ruong-nha-bay`.

```bash
pnpm test
pnpm lint
```

---

## Sui Overflow 2026

OpenFarm is being prepared for **[Sui Overflow 2026](https://overflow.sui.io/)**.
Each project must select exactly **one** track.

**Recommended track: Walrus** — farm photos and season memory are the consumer
artifact. See [`AGENTS.md`](./AGENTS.md) and [`STRATEGY.md`](./STRATEGY.md).

---

## Links

- Product page: [taquangkhoi.com/en/products/open-farm](https://taquangkhoi.com/en/products/open-farm)
- Devpost: [devpost.com/software/open-farm-sui](https://devpost.com/software/open-farm-sui)
- X / Twitter: [@OpenFarmSUI](https://x.com/OpenFarmSUI)
- Demo video: [youtube.com/watch?v=ROXPz9D5m_4](https://www.youtube.com/watch?v=ROXPz9D5m_4)

## Credits

- Original idea: **Henry Nguyen**
- Built by: **[Tạ Quang Khôi](https://taquangkhoi.com/)**

## License

See [LICENSE](./LICENSE).
