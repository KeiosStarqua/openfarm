# AGENTS.md — OpenFarm SUI

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
| Mobile          | Flutter |

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

The user is entering **[Sui Overflow 2026](https://overflow.sui.io/)** (May-Aug 2026, $1M+ pool).
**Each project must pick exactly ONE track.** Current working assumption: the active Sui Overflow
2026 tracks are the four problem statements linked by the team.

### Current tracks

| Track | Problem statement |
| ----- | ----------------- |
| Agentic Web | https://mystenlabs.notion.site/agentic-web-problem-statement |
| DeFi & Payments | https://mystenlabs.notion.site/defi-payments-problem-statement |
| Walrus Track | https://mystenlabs.notion.site/walrus-track-problem-statement |
| DeepBook Predict | https://mystenlabs.notion.site/deepbook-predict-problem-statement |

> Do not use "Entertainment & Culture / ONE Championship" as a current track. That was an
> outdated/incorrect carryover from an older track analysis, not one of the four current choices.

### Fit assessment

**Recommended if the team accepts the AI/persistent-memory pivot: Walrus Track.**

- **Why Walrus Track fits Open Farm:**
  - Open Farm already uses Walrus for "farm memories and harvest media" (season logs, images/videos)
  - Walrus Track addresses "AI agents are fundamentally stateless — lose context across sessions"
  - AI Farm Copilot can become an **AI Agent with long-term memory** via Walrus persistence

- **How to pivot Open Farm for Walrus Track:**
  - **Artifact-driven workflows:** AI Copilot reads historical farm data (moisture, fertilizer history, pest images from prior seasons) stored permanently on Walrus (Harvest Story) to make current decisions
  - **Long-term memory:** AI remembers last year's drought conditions to issue early irrigation warnings this season — data is persistent and verifiable
  - **Cross-workflow context:** Farm data stored on Walrus also creates the "Farmer Passport" and QR Code for end consumers to scan

- **Proposed project name:** "Open Farm: AI-powered Agricultural Trust Layer with Persistent Walrus Memory"

**Fallback if the team wants the DeFi path: DeFi & Payments.**

If the team commits to the **DeFi & Payments** core track, here are two concrete niches
and PTB design patterns that align OpenFarm's consumer-facing farming game with the
track's focus on *programmable money*.

#### 1. Trust-Minimized Finance

OpenFarm solves a "trust gap in agriculture". This niche applies directly:

- **How to apply:** Integrate milestone-based escrow or conditional execution contracts.
- **Real example:** Buyer locks payment in a smart contract on Sui. Funds auto-disburse to the
  farmer when the "Harvest Story" (Season Log NFT) records key milestones: seeds planted →
  AI pest inspection passed → harvest completed.
- **Upside:** Minimizes risk for buyers, ensures transparent capital flow for farmers — aligned
  with "automated enforcement".

#### 2. Payments & Consumer Finance

OpenFarm's **Open Market** (direct market) feature maps to this niche:

- **How to apply:** Merchant payment system combined with anonymous smart wallets (via zkLogin).
- **Real example:** User scans a QR code to read a farm's story, taps buy — payment goes
  directly to the farmer's wallet with no intermediary.

#### PTB tips — atomic "Buy Farm Product" transaction

Design a **single atomic transaction** (Programmable Transaction Block) triggered when a user
clicks "Buy":

```
1. Deduct stablecoin/SUI from buyer's wallet.
2. Transfer funds to farmer's wallet.
3. Transfer ownership of the farm-product NFT to the buyer's wallet.
4. Auto-credit trust score to the "Farmer Passport".
5. Route 1% of transaction to the environmental protection fund (Green Points).
```

Turn static fund transfers into **programmable money flows** — exactly what the DeFi &
Payments track rewards: *"Build something that makes money move smarter."*

**Not recommended as currently scoped: DeepBook Predict.** OpenFarm uses **Cetus CLMM**, not
DeepBook, and does not currently center prediction markets. Choose this only after a deliberate
product pivot.

**Agentic Web is a possible but weaker fit unless the AI Copilot becomes the core product.**
If OpenFarm is pitched mainly as autonomous farm agents coordinating actions across wallets,
data, and marketplaces, revisit this track. As currently framed, Walrus or DeFi is cleaner.

---

## 4. Useful links

- Hackathon: https://overflow.sui.io/
- Agentic Web track: https://mystenlabs.notion.site/agentic-web-problem-statement
- DeFi & Payments track: https://mystenlabs.notion.site/defi-payments-problem-statement
- Walrus track: https://mystenlabs.notion.site/walrus-track-problem-statement
- DeepBook Predict track: https://mystenlabs.notion.site/deepbook-predict-problem-statement
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
- When a decision changes the stack or track, update this `AGENTS.md` so it stays the source of truth.
- Verify Move builds (`sui move build` / `sui move test`) before claiming contract work is done.

## ACLI (Atlassian CLI) — Jira Issue Management

**ACLI** (Bob Swift / Appfire Atlassian CLI) is a commercial CLI for managing Jira issues from the command line. Requires a paid license. Download from [Appfire Marketplace](https://appfire.atlassian.net/wiki/spaces/ACLI).

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

# CSV export
acli jira workitem search --jql "project = PROJ" --csv

# Fetch all results (paginate)
acli jira workitem search --jql "project = PROJ" --paginate

# Select specific fields
acli jira workitem search --jql "project = PROJ" --fields "key,summary,assignee,status"

# Count results
acli jira workitem search --jql "project = PROJ" --count

# Get single issue details
acli jira workitem get PROJ-123

# Create an issue
acli jira workitem create --project PROJ --type Task -s "Summary here" -d "Description"

# Transition issue status
acli jira workitem transition PROJ-123 --transition "In Progress"

# List projects
acli jira project list --limit 50

# List project keys (JSON + jq)
acli jira project list --limit 50 --json | jq '.[].key'
```

### Tips

- Use `--json` + `jq` for scripting pipelines
- Use `--csv` for spreadsheet/report exports
- Pipe through `jq '.[].key'` to extract issue/project keys