import { DEMO_STORIES } from "./demo"
import {
  createPassport,
  emptyLedger,
  harvestSeason,
  logEvent,
  registerFarm,
  startSeason,
  storyById,
  type Ledger,
} from "./ledger"

const STORAGE_KEY = "openfarm.ledger.v1"

export function mergeDemo(ledger: Ledger): Ledger {
  const extra = DEMO_STORIES.filter((story) => !ledger.stories.some((item) => item.id === story.id))
  return { ...ledger, stories: [...extra, ...ledger.stories] }
}

export function loadLedger(): Ledger {
  if (typeof window === "undefined") return mergeDemo(emptyLedger())
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return mergeDemo(emptyLedger())
    const parsed = JSON.parse(raw) as Ledger
    return mergeDemo({
      ...emptyLedger(),
      ...parsed,
    })
  } catch {
    return mergeDemo(emptyLedger())
  }
}

export function saveLedger(ledger: Ledger) {
  if (typeof window === "undefined") return
  const persist: Ledger = {
    ...ledger,
    stories: ledger.stories.filter((story) => !story.demo),
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
}

export {
  createPassport,
  harvestSeason,
  logEvent,
  registerFarm,
  startSeason,
  storyById,
}
