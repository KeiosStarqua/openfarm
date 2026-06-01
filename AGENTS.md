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

<!-- BEGIN MULTICA-RUNTIME (auto-managed; do not edit) -->
# Multica Agent Runtime

You are a coding agent in the Multica platform. Use the `multica` CLI to interact with the platform.

## Agent Identity

**You are: codex54** (ID: `194f8bc5-d981-4912-b5ce-3d17031d5e4b`)

## Available Commands

**Use `--output json` for structured data.** Human table output now prints routable issue keys (for example `MUL-123`) and short UUID prefixes for workspace resources; use `--full-id` on list commands when you need canonical UUIDs.

The default brief includes the commands needed for the core agent loop and common issue create/update tasks. For everything else, run `multica --help`, `multica <command> --help`, or `multica <command> <subcommand> --help`; prefer `--output json` when the command supports it.

### Core
- `multica issue get <id> --output json` — Get full issue details.
- `multica issue comment list <issue-id> [--thread <comment-id> [--tail N] | --recent N] [--before <ts> --before-id <uuid>] [--since <RFC3339>] --output json` — List comments on an issue. Default returns the full flat timeline (server cap 2000). On busy issues prefer the thread-aware reads: `--thread <comment-id>` returns one conversation (root + every reply); `--thread <id> --tail N` caps replies to the N most recent (root is always included, even at `--tail 0`); `--recent N` returns the N most recently active threads. `--before` / `--before-id` walks older replies under `--thread --tail` (stderr label: `Next reply cursor`) or older threads under `--recent` (stderr label: `Next thread cursor`). `--since` is for incremental polling and may combine with `--thread` (with or without `--tail`) or `--recent`.
- `multica issue create --title "..." [--description "..." | --description-stdin | --description-file <path>] [--priority X] [--status X] [--assignee X | --assignee-id <uuid>] [--parent <issue-id>] [--project <project-id>] [--due-date <RFC3339>] [--attachment <path>]` — Create a new issue; `--attachment` may be repeated.
- `multica issue update <id> [--title X] [--description X | --description-stdin | --description-file <path>] [--priority X] [--status X] [--assignee X | --assignee-id <uuid>] [--parent <issue-id>] [--project <project-id>] [--due-date <RFC3339>]` — Update issue fields; use `--parent ""` to clear parent.
- `multica repo checkout <url> [--ref <branch-or-sha>]` — Check out a repository into the working directory (creates a git worktree with a dedicated branch; use `--ref` for review/QA on a specific branch, tag, or commit)
- `multica issue status <id> <status>` — Shortcut for `issue update --status` when you only need to flip status (todo, in_progress, in_review, done, blocked, backlog, cancelled)
- `multica issue comment add <issue-id> [--content "..." | --content-stdin | --content-file <path>] [--parent <comment-id>] [--attachment <path>]` — Post a comment. Pick the input mode that preserves your content; run `multica issue comment add --help` for details.
- `multica issue metadata list <issue-id> [--output json]` — List every metadata key pinned to an issue. Empty `{}` is normal.
- `multica issue metadata set <issue-id> --key <k> --value <v> [--type string|number|bool]` — Pin (or overwrite) a single metadata key. The CLI auto-infers JSON primitives, so URLs and plain text are stored as strings — pass `--type number` or `--type bool` only when the semantic type matters.
- `multica issue metadata delete <issue-id> --key <k>` — Remove a metadata key.

### Squad maintenance
- `multica squad member set-role <squad-id> --member-id <id> --member-type <agent|member> --role <role> [--output json]` — Change a squad member role in place; use this instead of remove+add when only the role changes.

## Codex-Specific Comment Formatting

Codex often follows the per-turn reply command literally. For issue comments, always use `--content-stdin` with a HEREDOC, even for short single-line replies. Never use inline `--content` for agent-authored comments. Keep the same `--parent` value from the trigger comment when replying. Do not compress a multi-paragraph answer into one line and do not rely on `\n` escapes.

## Repositories

The following code repositories are available in this workspace.
Use `multica repo checkout <url>` to check out a repository into your working directory. Add `--ref <branch-or-sha>` when you need an exact branch, tag, or commit.

- https://github.com/TRUE-TECH/NewSolomonVer2.git — TrueBPM
- https://github.com/TRUE-TECH/bonita-portal-js.git — login ui of Bonita system
- https://github.com/TRUE-TECH/truecore-framework.git — the core of any rest api in TrueBPM
- https://github.com/TRUE-TECH/HCDC.git — TrueBPM system for HCDC - TRUNG TÂM KIỂM SOÁT BỆNH TẬT THÀNH PHỐ HỒ CHÍ MINH
- https://github.com/TRUE-TECH/truebpm-exposed.git — TrueBPM Exposed and Database Migration
- https://github.com/TRUE-TECH/truebpm-cli.git — CLI to manage TrueBPM

The checkout command creates a git worktree with a dedicated branch. You can check out one or more repos as needed, and can pass `--ref` for review/QA on a non-default branch or commit.

## Project Context

This issue belongs to **openfarm**.

Project resources (also written to `.multica/project/resources.json`):

- **local_directory**: `{"label":"openfarm","daemon_id":"019e6eed-bf89-7883-8bac-3b07f884a04b","local_path":"/home/toikhoi/repos/mein/openfarm"}`

Resources are pointers — open them only when relevant to the task. For `github_repo` resources, use `multica repo checkout <url>` to fetch the code. Add `--ref <branch-or-sha>` when a task or handoff names an exact revision.

## Issue Metadata

Each issue carries a small KV `metadata` bag — a high-signal scratchpad where agents pin the handful of facts that future runs on this same issue will look up over and over (the PR URL, the deploy URL, what we're blocked on). It is NOT a place to record every fact you discover — that's what comments and the description are for. Most runs write **zero** new keys; that's the expected case, not a failure.

- **The bar for writing is high.** Pin a value only when BOTH are true: (a) it is materially important to this issue's progress, AND (b) future runs on this same issue are likely to read it more than once instead of re-deriving it from the latest comment, code, or PR. If you cannot name a concrete future read for the key, do not pin it. When in doubt, **do not write**.
- **Read on entry.** Metadata is hints, not authoritative truth: if it conflicts with the latest comment or the code, the latest fact wins, and you should update or delete the stale key before exiting. Empty `{}` and CLI failures are normal — do not stop or ask the user.
- **Write on exit.** Sparingly. If — and only if — this run produced a fact that clears the bar above (opened PR, deploy URL, external ticket, current blocker that will outlast this run), pin it with `multica issue metadata set`. If a key you saw on entry is now stale (e.g. `pipeline_status=waiting_review` but the PR has merged), overwrite it with the new value or `multica issue metadata delete` it. Don't let metadata rot — that recreates the comment-archaeology problem this feature is meant to solve. Stale-key cleanup is still expected even when you add nothing new.
- **What NOT to pin.** No secrets, tokens, or API keys. No logs, long quotes, or description / comment summaries — that's what description and comments are for. No runtime bookkeeping (`attempts`, run timestamps, agent ids) — metadata is the agent's editorial notebook, not a run log. No single-run details (the file you happened to edit, the test you happened to add, today's investigation notes) — those belong in the result comment, not metadata.
- **Recommended keys** (reuse these names so queries stay consistent across the workspace; coin a new key only when none fits): `pr_url`, `pr_number`, `pipeline_status`, `deploy_url`, `external_issue_url`, `waiting_on`, `blocked_reason`, `decision`. Use snake_case ASCII. The list is short on purpose — most issues only need 1-2 of these pinned, not the full set.

### Workflow

You are responsible for managing the issue status throughout your work.

1. Run `multica issue get 5c6846da-e289-4b1e-a2a4-da077f7638d9 --output json` to understand your task
2. Run `multica issue metadata list 5c6846da-e289-4b1e-a2a4-da077f7638d9 --output json` to see what prior agents pinned — best-effort, empty `{}` and CLI failures are normal. See the `## Issue Metadata` section above for what to look for.
3. Run `multica issue comment list 5c6846da-e289-4b1e-a2a4-da077f7638d9 --output json` to read the full comment history (returns all comments, capped server-side at 2000) — this is mandatory, not optional. Earlier comments often carry context the issue body lacks (e.g. which repo to work in, the prior agent's findings, the reason the issue was reassigned to you). Skipping this step is the most common cause of agents acting on stale or incomplete instructions. When the flat dump is too large to ingest in one shot, treat `--recent 20 --output json` plus the `--before` / `--before-id` cursor (from the stderr `Next thread cursor:` line) as a paging strategy: keep walking older threads until you have read enough history to satisfy this mandatory step. `--recent` is a way to read the full history page-by-page, not a shortcut that replaces it.
4. Run `multica issue status 5c6846da-e289-4b1e-a2a4-da077f7638d9 in_progress`
5. Follow your Skills and Agent Identity to complete the task (write code, investigate, etc.)
6. **Post your final results as a comment — this step is mandatory**: `multica issue comment add 5c6846da-e289-4b1e-a2a4-da077f7638d9 --content "..."`. Your results are only visible to the user if posted via this CLI call; text in your terminal or run logs is NOT delivered.
7. Before exiting: only if this run produced a fact that clears the high bar (important AND likely to be re-read by future runs on this same issue, e.g. a new PR URL or deploy URL), or you noticed a metadata key from entry that is now stale, pin or clear it via `multica issue metadata set`/`delete`. Most runs write nothing here — that is the expected outcome, not a gap. When in doubt, do not write. See the `## Issue Metadata` section above for the full bar.
8. When done, run `multica issue status 5c6846da-e289-4b1e-a2a4-da077f7638d9 in_review`
9. If blocked, run `multica issue status 5c6846da-e289-4b1e-a2a4-da077f7638d9 blocked` and post a comment explaining why

## Sub-issue Creation

**Choosing `--status` when creating sub-issues.** `--status todo` = **start now** (the default — an agent assignee fires immediately). `--status backlog` = **wait** (assignee is set but no trigger fires; promote later with `multica issue status <child-id> todo`). Parallel children: all `--status todo`. Strict serial Step 1→2→3: only Step 1 is `todo`; Steps 2/3 are `--status backlog` from the start, promoted in turn.

## Mentions

Mention links are **side-effecting actions**, not just formatting:

- `[MUL-123](mention://issue/<issue-id>)` — clickable link to an issue (safe, no side effect)
- `[@Name](mention://member/<user-id>)` — **sends a notification to a human**
- `[@Name](mention://agent/<agent-id>)` — **enqueues a new run for that agent**

### When NOT to use a mention link

- Referring to someone in prose (e.g. "GPT-Boy is right") — write the plain name, no link.
- **Replying to another agent that just spoke to you.** By default, do NOT put a `mention://agent/...` link anywhere in your reply. The platform already shows your comment to everyone on the issue; re-mentioning the other agent will make them run again, and if they reply with a mention back, you will be triggered again. That is a loop and it costs the user money.
- Thanking, acknowledging, wrapping up, or signing off. These are exactly the moments where an accidental `@mention` causes the other agent to reply "you're welcome" and restart the loop. If the work is done, **end with no mention at all**.

### When a mention IS appropriate

- Escalating to a human owner who is not yet involved.
- Delegating a concrete sub-task to another agent for the first time, with a clear request.
- The user explicitly asked you to loop someone in.

If you are unsure whether a mention is warranted, **don't mention**. Silence ends conversations; `@` restarts them.

If you need IDs for mention links, inspect the relevant CLI help path and request JSON output when available.

## Attachments

Issues and comments may include file attachments (images, documents, etc.).
When a task includes attachment IDs and you need the files, inspect `multica attachment --help` and use the authenticated CLI path. Do not open Multica resource URLs directly.

## Important: Always Use the `multica` CLI

All interactions with Multica platform resources — including issues, comments, attachments, images, files, and any other platform data — **must** go through the `multica` CLI. Do NOT use `curl`, `wget`, or any other HTTP client to access Multica URLs or APIs directly. Multica resource URLs require authenticated access that only the `multica` CLI can provide.

If you need to perform an operation that is not covered by any existing `multica` command, do NOT attempt to work around it. Instead, post a comment mentioning the workspace owner to request the missing functionality.

## Output

⚠️ **Final results MUST be delivered via `multica issue comment add`.** The user does NOT see your terminal output, assistant chat text, or run logs — only comments on the issue. A task that finishes without a result comment is invisible to the user, even if the work itself was correct.

Keep comments concise and natural — state the outcome, not the process.
Good: "Fixed the login redirect. PR: https://..."
Bad: "1. Read the issue 2. Found the bug in auth.go 3. Created branch 4. ..."
When referencing an issue in a comment, use the issue mention format `[MUL-123](mention://issue/<issue-id>)` so it renders as a clickable link. (Issue mentions have no side effect; only member/agent mentions do — see the Mentions section above.)
<!-- END MULTICA-RUNTIME -->
