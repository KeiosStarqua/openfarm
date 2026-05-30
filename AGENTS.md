# AGENT.md — OpenFarm SUI

Guidance for AI coding agents (and humans) working on this repository.

---

## 1. What this project is

**OpenFarm SUI** turns liquidity providing into an interactive farming game on the **Sui**
blockchain. Users tend virtual crops that represent their LP positions in **Cetus CLMM** pools.
Each crop is a **dynamic NFT** whose on-chain appearance evolves from real-time DeFi metrics:

- **Fee earnings** — more fees → healthier / more valuable crop.
- **Price-range health** — in-range vs. out-of-range affects whether the crop thrives or withers.
- **Time in position** — age changes the crop's growth stage.

It is, in one line: **a consumer-facing gamification + dynamic-NFT layer on top of existing Sui DeFi.**
It does **not** create a new financial primitive or payment rail — it *consumes* Cetus CLMM.

Original idea: Henry Nguyen. Built by Tạ Quang Khôi. Prior submission: "Hack the Farm".

---

## 2. Tech stack & conventions

| Area            | Choice |
| --------------- | ------ |
| Chain           | Sui |
| Contracts       | Move (Sui Move) |
| DeFi source     | Cetus CLMM (LP positions, fees, price ranges) |
| NFTs            | Sui dynamic NFTs — appearance state lives/evolves on-chain |
| Frontend        | Next.js |

Conventions for agents:

- **Move first.** Model the domain (farm, land slot, crop, evolution, rewards) as Move objects
  before writing UI. Keep evolution logic (metric → appearance state) on-chain so the NFT is
  verifiably dynamic, not just a frontend skin.
- **Read Cetus, don't reinvent it.** OpenFarm wraps Cetus positions; it must not fork or
  duplicate Cetus pool logic.
- **Testnet by default.** Publish and test on Sui testnet; never assume mainnet keys.
- **No secrets in the repo.** Keys, mnemonics, and `.env` files stay out of git.
- Prefer the project package managers and the Sui CLI; do not introduce a different chain or
  framework without an explicit decision recorded here.

Expected layout (create as the project grows):

```
move/   # Sui Move package: farm, crop, evolution, rewards modules
app/    # Next.js frontend
```

---

## 3. Sui Overflow 2026 — track selection

The user is entering **[Sui Overflow 2026](https://overflow.sui.io/)** (May–Aug 2026, $1M+ pool).
**Each project must pick exactly ONE track.** The user linked the **DeFi & Payments** core track,
but the goal of this section is an honest fit analysis — not just confirming that pick.

### Candidate tracks

| Track | Type | Prize | What judges reward |
| ----- | ---- | ----- | ------------------ |
| **Entertainment & Culture / ONE Championship** | Specialized | **$70K pool** | Consumer-facing apps in **gaming, NFTs**, sports, media |
| DeFi & Payments *(user's pick)* | Core | $30K / $15K / $10K / $7.5K | New **financial primitives or payment rails** — fast, seamless, real-world usable |
| DeepBook | Specialized | $70K pool | Trading / liquidity apps **powered by DeepBook's on-chain orderbook** |

### Fit assessment

**✅ Recommended: Entertainment & Culture / ONE Championship (Specialized).**

OpenFarm's core identity is a **gamified, dynamic-NFT, socially competitive consumer app**
(farm slots, evolving crop NFTs, leaderboards, farm sharing, achievements, educational
onboarding). That maps almost one-to-one onto "consumer-facing app in gaming, NFTs, …". The
specialized pool ($70K) is also larger than any single DeFi core placement, and OpenFarm
won't be judged head-to-head against pure financial protocols where it is structurally weaker.

**⚠️ The user's linked pick — DeFi & Payments — is a weaker fit.** That track explicitly rewards
*creating* financial primitives or payment rails. OpenFarm does not create one; it's a UX/engagement
layer over Cetus. Submitting here means competing against teams shipping novel primitives, where a
"DeFi visualizer game" is at a disadvantage on the track's own rubric. Choose this track only if the
project pivots to add a genuine primitive (e.g., a novel LP-incentive or auto-compounding mechanism)
and is positioned around that primitive rather than the farming game.

**❌ DeepBook — not a fit as built.** OpenFarm uses **Cetus CLMM**, not DeepBook's orderbook.
Eligible only if rearchitected to source liquidity/trading from DeepBook, which would change the
product. Not recommended unless the team deliberately wants that pivot.

### Decision

- **Primary recommendation: Entertainment & Culture / ONE Championship.** Best alignment with the
  product as it actually exists, and the largest prize pool of the realistic options.
- **Fallback if the team insists on a core/DeFi angle:** DeFi & Payments — but only after adding and
  foregrounding a real on-chain financial primitive, and leaning the pitch on that primitive.

> This is a recommendation, not a final decision. Confirm the track with the team before submitting;
> Overflow lets you register first and lock the track later.

---

## 4. Useful links

- Hackathon: https://overflow.sui.io/
- DeFi & Payments track (JS-gated Notion): https://mystenlabs.notion.site/defi-payments-problem-statement
- Product page: https://taquangkhoi.com/en/products/open-farm
- Devpost: https://devpost.com/software/open-farm-sui
- X: https://x.com/OpenFarmSUI
- Demo: https://www.youtube.com/watch?v=ROXPz9D5m_4
- Sui docs: https://docs.sui.io/ · Move intro: https://github.com/sui-foundation/sui-move-intro-course
- Cetus: https://www.cetus.zone/

---

## 5. Working agreements for agents

- Make atomic, logical commits (group related changes; don't dump everything in one commit).
- Don't commit secrets, build artifacts, or large generated files.
- When a decision changes the stack or track, update this `AGENT.md` so it stays the source of truth.
- Verify Move builds (`sui move build` / `sui move test`) before claiming contract work is done.
