# OpenFarm architecture — farm to consumer

OpenFarm records how food is grown, then lets a consumer read that record.

## Objects

| Object | Owner model | Who writes | Who reads |
| ------ | ----------- | ---------- | --------- |
| Farmer Passport | owned by farmer | farmer | copied into the story at harvest |
| Farm | shared | farmer (create) | anyone |
| Season | shared | farmer (append events, harvest) | anyone |
| Harvest Story | shared | created at harvest | consumers |
| Product Batch | owned, transferable | minted to farmer | buyer after transfer |
| Farm Registry | shared | package | marketplace listing |

## Write path (farmer)

```
create_passport → register_farm → start_season
        → log_event*  (seed, irrigate, fertilize, pest, weather, packing)
        → harvest      (requires a seed event; seals the season)
```

`log_event` asserts `tx.sender() == season.farmer` and `status == GROWING`.
After harvest the journal is append-closed. Consumers can trust the sequence
they see is the sequence the farmer committed.

## Read path (consumer)

1. QR / URL carries the Harvest Story id (`/cau-chuyen/[id]`).
2. The client loads the shared story, then the farm and the event list.
3. Media fields are Walrus blob ids; the UI fetches bytes off-chain.

No indexer is required for the first marketplace: `FarmRegistry` holds farm
and story ids published by this package.

## Frontend ledger

`app/lib/ledger.ts` mirrors the Move rules so the Next.js demo works without a
published package. When contracts are live, replace the local store with Sui
client calls — do not invent a second domain model.

## What is not in v1

- Atomic pay-and-transfer PTB (DeFi & Payments follow-on)
- Cetus LP wrapping
- Flutter mobile client
