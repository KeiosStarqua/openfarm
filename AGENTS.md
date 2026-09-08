# AGENTS.md — OpenFarm

Guidance for AI coding agents (and humans) working on this repository.

---

## 1. What this project is

**OpenFarm** uses the **Sui** blockchain to bring consumers closer to farmers.
Farmers collect data about how they plant and produce food. Each growing
season becomes a public, verifiable **Harvest Story**. A consumer scans a product
QR (or opens a story link) and sees the farmer, the farm, and the production
journal — not a brand slogan.

In one line: **an agricultural trust layer that turns planting and production
records into a consumer-facing story of the farm.**

Original idea: Henry Nguyen. Built by Tạ Quang Khôi. Prior submission:
"Hack the Farm". This repo previously explored a Cetus LP farming-game pitch;
the product is now the farm-to-consumer record, not a DeFi visualizer.

---

## 2. Tech stack & conventions

| Area | Choice |
| --------------- | ------ |
| Chain | Sui |
| Contracts | Move (Sui Move) |
| Domain objects | Farmer Passport, Farm, Season journal, Harvest Story, Product Batch |
| Media / long memory | Walrus blob ids referenced from production events |
| NFTs | Harvest Story (public record) and Product Batch (transferable to the buyer) |
| Frontend | Next.js |
| Mobile | Flutter (later) |

Conventions for agents:

- **Move first.** Model passport, farm, season, story, and product as Move
  objects before adding UI chrome. The journal is the source of truth, not a
  frontend-only diary.
- **Farmers write, consumers read.** Only the farm owner may append production
  events or harvest a season. Stories are shared objects so anyone can read them.
- **Walrus for media, Sui for the record.** Photos and long notes live on Walrus;
  the on-chain event stores the blob id and the timestamp.
- **Testnet by default.** Publish and test on Sui testnet; never assume mainnet keys.
- **No secrets in the repo.** Keys, mnemonics, and `.env` files stay out of git.
- Prefer the project package managers and the Sui CLI; do not introduce a
  different chain or framework without an explicit decision recorded here.

Layout:

```
move/   # Sui Move package: passport, farm, season, story
app/    # Next.js frontend: farmer journal + consumer story
docs/   # Architecture and integration notes
```

---

## 3. Sui Overflow 2026 — track selection

The user is entering **[Sui Overflow 2026](https://overflow.sui.io/)** (May-Aug 2026, $1M+ pool).
**Each project must pick exactly ONE track.**

### Current tracks

| Track | Problem statement |
| ----- | ----------------- |
| Agentic Web | https://mystenlabs.notion.site/agentic-web-problem-statement |
| DeFi & Payments | https://mystenlabs.notion.site/defi-payments-problem-statement |
| Walrus Track | https://mystenlabs.notion.site/walrus-track-problem-statement |
| DeepBook Predict | https://mystenlabs.notion.site/deepbook-predict-problem-statement |

> Do not use "Entertainment & Culture / ONE Championship" as a current track.

### Fit assessment

**Recommended: Walrus Track.**

OpenFarm's consumer promise depends on durable farm memory: season logs,
field photos, pest images, and harvest media. Walrus holds that memory;
Sui stores the verifiable journal that points at it. A consumer scanning a
QR is reading a persistent artifact, not a session-only page.

**Fallback: DeFi & Payments** — only after Harvest Story is real and the team
adds a concrete PTB (e.g. pay the farmer and receive the Product Batch in one
atomic transaction). Do not pitch a payment rail before the production record
exists.

**Not recommended: DeepBook Predict.** This product is farm provenance, not a
prediction market.

**Agentic Web is a later fit** if an AI Farm Copilot that *reads* Walrus season
memory becomes the core, not a side feature.

---

## 4. Useful links

- Hackathon: https://overflow.sui.io/
- Walrus track: https://mystenlabs.notion.site/walrus-track-problem-statement
- DeFi & Payments track: https://mystenlabs.notion.site/defi-payments-problem-statement
- Product page: https://taquangkhoi.com/en/products/open-farm
- Devpost: https://devpost.com/software/open-farm-sui
- X: https://x.com/OpenFarmSUI
- Demo: https://www.youtube.com/watch?v=ROXPz9D5m_4
- Sui docs: https://docs.sui.io/ · Move intro: https://github.com/sui-foundation/sui-move-intro-course
- Walrus: https://www.walrus.xyz/

---

## 5. Working agreements for agents

- Make atomic, logical commits (group related changes; don't dump everything in one commit).
- Don't commit secrets, build artifacts, or large generated files.
- When a decision changes the stack or track, update this `AGENTS.md` so it stays the source of truth.
- Verify Move builds (`sui move build` / `sui move test`) before claiming contract work is done.
- The Next.js app may run a local ledger that mirrors Move types for demo; keep
  those types aligned with `move/sources`.

## ACLI (Atlassian CLI) — Jira Issue Management

**ACLI** (Bob Swift / Appfire Atlassian CLI) is a commercial CLI for managing Jira issues from the command line. Requires a paid license. Download from [Appfire Marketplace](https://appfire.atlassian.net/wiki/spaces/ACLI).

> **Scope rule — read first.** This project only touches **one** Jira site:
> `openfarm.atlassian.net`. **Always pass `--site openfarm.atlassian.net`** on every
> `acli` invocation. Do not run `acli` without an explicit site, and do not switch to
> or query any other site from this repo. Example: `acli --site openfarm.atlassian.net jira project list`.

### Authentication

Configure credentials via environment variables or `.acli` config file:
- `ATLASSIAN_CLI_USER` — Jira email
- `ATLASSIAN_CLI_TOKEN` — Jira API token
- `ATLASSIAN_CLI_SITE` — Jira instance URL (e.g. `your-domain.atlassian.net`)

Or run `acli init` for interactive setup.

### Common Commands

```sh
# Search issues with JQL
acli jira workitem search --jql "project = PROJ AND assignee = currentUser()" --limit 50

# JSON output for scripting
acli jira workitem search --jql "project = PROJ" --json

# Get single issue details
acli jira workitem get PROJ-123
```

### Tips

- Use `--json` + `jq` for scripting pipelines
- Pipe through `jq '.[].key'` to extract issue/project keys
