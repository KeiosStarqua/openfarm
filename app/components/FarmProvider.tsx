"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"
import { DEMO_STORIES } from "@/lib/demo"
import {
  createPassport,
  emptyLedger,
  harvestSeason,
  logEvent,
  registerFarm,
  startSeason,
  type EventKind,
  type Ledger,
} from "@/lib/ledger"
import { loadLedger, saveLedger } from "@/lib/store"

const listeners = new Set<() => void>()
const serverSnapshot = withDemo(emptyLedger())
let memory: Ledger = serverSnapshot

function withDemo(ledger: Ledger): Ledger {
  const extra = DEMO_STORIES.filter((story) => !ledger.stories.some((item) => item.id === story.id))
  return { ...ledger, stories: [...extra, ...ledger.stories] }
}

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => listeners.delete(onStoreChange)
}

function getSnapshot() {
  return memory
}

function getServerSnapshot() {
  return serverSnapshot
}

if (typeof window !== "undefined") {
  queueMicrotask(() => {
    memory = loadLedger()
    emit()
  })
}

function write(next: Ledger) {
  memory = next
  saveLedger(next)
  emit()
}

type FarmContextValue = {
  ledger: Ledger
  ready: boolean
  error: string | null
  clearError: () => void
  makePassport: (input: { name: string; region: string; bio: string }) => void
  makeFarm: (input: {
    name: string
    region: string
    cropFocus: string
    establishedYear: number
  }) => void
  makeSeason: (input: { farmId: string; cropName: string }) => void
  addEvent: (input: { seasonId: string; kind: EventKind; note: string; mediaBlobId?: string }) => void
  closeSeason: (input: {
    seasonId: string
    productName: string
    quantity: number
    unit: string
  }) => string | null
}

const FarmContext = createContext<FarmContextValue | null>(null)

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const ledger = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback((fn: (current: Ledger) => Ledger) => {
    try {
      setError(null)
      write(fn(memory))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thực hiện được.")
    }
  }, [])

  const value = useMemo<FarmContextValue>(
    () => ({
      ledger,
      ready: true,
      error,
      clearError: () => setError(null),
      makePassport: (input) => run((current) => createPassport(current, input)),
      makeFarm: (input) => run((current) => registerFarm(current, input)),
      makeSeason: (input) => run((current) => startSeason(current, input)),
      addEvent: (input) => run((current) => logEvent(current, input)),
      closeSeason: (input) => {
        try {
          setError(null)
          const next = harvestSeason(memory, input)
          const storyId = next.stories[next.stories.length - 1]?.id ?? null
          write(next)
          return storyId
        } catch (err) {
          setError(err instanceof Error ? err.message : "Không chốt mùa được.")
          return null
        }
      },
    }),
    [error, ledger, run],
  )

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>
}

export function useFarm() {
  const value = useContext(FarmContext)
  if (!value) throw new Error("useFarm must be used inside FarmProvider")
  return value
}
