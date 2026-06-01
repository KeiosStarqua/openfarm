# Cetus CLMM Integration — OpenFarm Gamification Architecture

> This document describes how OpenFarm reads from Cetus CLMM (without forking) to drive the on-chain gamification layer.

---

## 1. Overview

OpenFarm is a **Sui gamified dynamic NFT layer on top of Cetus CLMM**. It consumes real-time data from Cetus (LP positions, fee accruals, price-range data) and maps those metrics to the lifecycle of farmer-facing NFTs (Farmer Passport, Crop NFTs).

**Core principle:** OpenFarm does NOT fork or duplicate Cetus pool logic. It only reads from Cetus positions and wraps them in game mechanics.

---

## 2. Gamification Mechanisms

### 2.1 Dynamic NFT Evolution (Farmer Passport / Crop NFT)

The health, productivity, and level states of Crop NFTs evolve based on the actual liquidity positions users (or agricultural support funds) provide to crop/carbon pools on Cetus.

| DeFi Signal | Game Effect |
| ----------- | ----------- |
| High fee earnings | Healthier / more valuable crop |
| In-range position | Crop thrives |
| Out-of-range position | Crop withers |
| Long time in position | Advances growth stage |

**Implementation:** The `evolution` Move module maps live DeFi metrics → on-chain appearance state. The NFT's metadata is stored/updated on-chain so the dynamic appearance is verifiable, not a frontend-only skin.

### 2.2 Yield-Backed Farming

Harvest proceeds or funding are added as liquidity (LP) on Cetus. Fee accruals are converted into in-game resources:

- **Irrigation water** — Fee earnings from LP positions
- **Fertilizer** — Bonus rewards / yield boost
- **Green Points** — Environmental reward token

This creates a closed loop between real DeFi yield and game progression incentives.

### 2.3 Climate / Market Risk Events (Price-Range Data)

Price volatility data for crop/stablecoin token pairs on Cetus CLMM is used to trigger in-game events:

| Price Event | Game Effect |
| ----------- | ----------- |
| Sharp volatility | Natural disaster event triggered |
| Stable accumulation | Market fluctuation event |
| Price range shift | Reward Multiplier adjustment in AI Farm Copilot |

The AI Farm Copilot observes on-chain price-range health from Cetus and adjusts its recommendations accordingly.

---

## 3. Reading from Cetus — Design Rules

1. **Read-only integration.** OpenFarm calls Cetus contracts (or reads shared object state) but never writes to them.
2. **No state duplication.** Position data is read live; OpenFarm does not maintain its own copy of Cetus pool state.
3. **Move first.** All evolution logic lives on-chain in Move modules — the NFT appearance is verifiably dynamic.
4. **Testnet validation.** All Cetus integrations are tested on Sui testnet before mainnet deployment.

---

## 4. Related Documentation

- [AGENTS.md](./AGENTS.md) — Full technical stack and conventions
- [README.md](./README.md) — Product overview and high-level architecture
- `move/` — Sui Move package (farm, crop, evolution, rewards modules)
- `app/` — Next.js frontend

---

## 5. OpenFarm SUI — Sui Overflow 2026

OpenFarm is being prepared for **[Sui Overflow 2026](https://overflow.sui.io/)** (May–August 2026, $1M+ pool).

- **Recommended track:** Walrus Track (AI Farm Copilot with persistent memory via Walrus)
- **Fallback track:** DeFi & Payments (programmable money flows via PTB escrow)

See [AGENTS.md](./AGENTS.md) for the full track analysis.
