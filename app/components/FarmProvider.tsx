"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { EventKind, Ledger } from "@/lib/ledger"
import {
  createPassport,
  harvestSeason,
  logEvent,
  registerFarm,
  startSeason,
} from "@/lib/ledger"
import { loadLedger, saveLedger } from "@/lib/store"

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
  const [ledger, setLedger] = useState<Ledger>(() => loadLedger())
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLedger(loadLedger())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveLedger(ledger)
  }, [ledger, ready])

  const run = useCallback((fn: (current: Ledger) => Ledger) => {
    try {
      setError(null)
      setLedger((current) => fn(current))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thực hiện được.")
    }
  }, [])

  const value = useMemo<FarmContextValue>(
    () => ({
      ledger,
      ready,
      error,
      clearError: () => setError(null),
      makePassport: (input) => run((current) => createPassport(current, input)),
      makeFarm: (input) => run((current) => registerFarm(current, input)),
      makeSeason: (input) => run((current) => startSeason(current, input)),
      addEvent: (input) => run((current) => logEvent(current, input)),
      closeSeason: (input) => {
        try {
          setError(null)
          const next = harvestSeason(ledger, input)
          const storyId = next.stories[next.stories.length - 1]?.id ?? null
          setLedger(next)
          return storyId
        } catch (err) {
          setError(err instanceof Error ? err.message : "Không chốt mùa được.")
          return null
        }
      },
    }),
    [error, ledger, ready, run],
  )

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>
}

export function useFarm() {
  const value = useContext(FarmContext)
  if (!value) throw new Error("useFarm must be used inside FarmProvider")
  return value
}
