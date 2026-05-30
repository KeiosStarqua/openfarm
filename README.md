# 🌾 OpenFarm SUI

> Turn liquidity providing into an interactive farming game on the Sui blockchain.

OpenFarm SUI makes DeFi liquidity provision feel like tending a farm. Each "crop" you
plant represents a real liquidity-provider (LP) position in a [Cetus](https://www.cetus.zone/)
CLMM pool. As your position earns fees, drifts in or out of its price range, and ages, the
crop is a **dynamic NFT** whose appearance evolves to reflect those real-time DeFi metrics.

Healthy, in-range, fee-earning positions grow into thriving crops. Out-of-range or idle
positions wither. The farm becomes a living, glanceable visualization of your DeFi portfolio
— and a game you actually want to come back to.

The idea was originally conceived by **Henry Nguyen**, and an earlier version was built and
submitted to the **Hack the Farm** hackathon.

---

## ✨ Features

- **🌱 Farm Slots & Land System** — Plant seeds that represent LP tokens from Cetus CLMM pools. Each land slot holds one position.
- **🪴 Dynamic NFT Crops** — A crop's appearance evolves based on **fee earnings**, **price-range health** (in/out of range), and **time in position**.
- **🏆 Social & Competitive Elements** — Leaderboards, farm sharing, and achievement systems to drive engagement.
- **📚 Educational Onboarding** — Farming metaphors abstract away DeFi complexity, making concentrated-liquidity concepts approachable for newcomers.
- **📜 Move Smart Contracts** — On-chain logic for farm management, crop lifecycle, NFT minting/evolution, and reward distribution.

### 🔭 What's next

- Multi-protocol support (beyond Cetus)
- DAO governance
- Mobile app
- Cross-chain expansion

---

## 🧱 Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Blockchain       | [Sui](https://sui.io/)              |
| Smart contracts  | [Move](https://docs.sui.io/concepts/sui-move-concepts) |
| Liquidity / CLMM | [Cetus CLMM](https://www.cetus.zone/) |
| NFTs             | Sui dynamic NFTs (on-chain evolving metadata) |
| Frontend         | [Next.js](https://nextjs.org/)      |

---

## 🏗️ Architecture (high level)

```
┌─────────────────────────────────────────────────────────┐
│                      Next.js Frontend                     │
│   Farm UI · crop rendering · leaderboards · onboarding    │
└───────────────┬───────────────────────┬──────────────────┘
                │ Sui TS SDK / dApp Kit  │
┌───────────────▼───────────────┐   ┌────▼─────────────────┐
│        Move Smart Contracts    │   │     Cetus CLMM       │
│  • farm        (land/slots)    │◄──┤  LP positions, fees, │
│  • crop        (lifecycle/NFT) │   │  price ranges        │
│  • evolution   (metric → art)  │   └──────────────────────┘
│  • rewards     (distribution)  │
└────────────────────────────────┘
```

The frontend reads on-chain Cetus position data, the Move contracts wrap those positions as
evolving crop NFTs, and an evolution module maps live DeFi metrics (fees, range health, age)
to the crop's on-chain appearance state.

---

## 🚀 Getting Started

> ⚠️ Project scaffolding is in progress. The steps below describe the intended layout; update
> them as the Move package and frontend are added.

### Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- [Node.js](https://nodejs.org/) 18+ and a package manager (pnpm/npm/bun)
- A Sui wallet (e.g. [Sui Wallet](https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil)) funded on testnet

### Smart contracts (Move)

```bash
cd move
sui move build
sui move test
sui client publish --gas-budget 100000000
```

### Frontend (Next.js)

```bash
cd app
pnpm install
pnpm dev
```

---

## 🏁 Sui Overflow 2026

OpenFarm is being prepared for **[Sui Overflow 2026](https://overflow.sui.io/)** (May–August 2026,
$1M+ in prizes & seed funding). Each project must select exactly **one** track.

**Selected track: 🎮 Entertainment & Culture / Specialized — ONE Championship.** See
[`AGENT.md`](./AGENT.md) for the full track analysis and rationale.

---

## 🔗 Links

- Product page: [taquangkhoi.com/en/products/open-farm](https://taquangkhoi.com/en/products/open-farm)
- Devpost: [devpost.com/software/open-farm-sui](https://devpost.com/software/open-farm-sui)
- X / Twitter: [@OpenFarmSUI](https://x.com/OpenFarmSUI)
- Demo video: [youtube.com/watch?v=ROXPz9D5m_4](https://www.youtube.com/watch?v=ROXPz9D5m_4)

## 🙏 Credits

- Original idea: **Henry Nguyen**
- Built by: **[Tạ Quang Khôi](https://taquangkhoi.com/)**

## 📄 License

See [LICENSE](./LICENSE).
