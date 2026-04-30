"use client"

import { useState, useCallback, useEffect } from "react"

const STORAGE_KEY = "mito-edited-prices"
const NAMES_STORAGE_KEY = "mito-edited-names"

export interface EditedPrice {
  priceMayor: number
  priceBulto: number
}

type PriceMap = Record<string, EditedPrice>
type NameMap = Record<string, string>

export function usePriceEditor() {
  const [editedPrices, setEditedPrices] = useState<PriceMap>({})
  const [editedNames, setEditedNames] = useState<NameMap>({})
  const [isAdmin, setIsAdmin] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setEditedPrices(JSON.parse(stored))
      }
      const storedNames = localStorage.getItem(NAMES_STORAGE_KEY)
      if (storedNames) {
        setEditedNames(JSON.parse(storedNames))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage whenever editedPrices changes
  const persist = useCallback((prices: PriceMap) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prices))
    } catch {
      // ignore storage errors
    }
  }, [])

  const persistNames = useCallback((names: NameMap) => {
    try {
      localStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(names))
    } catch {
      // ignore storage errors
    }
  }, [])

  const updatePrice = useCallback(
    (code: string, field: "priceMayor" | "priceBulto", value: number) => {
      setEditedPrices((prev) => {
        const next = {
          ...prev,
          [code]: {
            ...prev[code],
            [field]: value,
          },
        }
        persist(next)
        return next
      })
    },
    [persist]
  )

  const updateName = useCallback(
    (code: string, name: string) => {
      setEditedNames((prev) => {
        const next = { ...prev, [code]: name }
        persistNames(next)
        return next
      })
    },
    [persistNames]
  )

  const getName = useCallback(
    (code: string, originalName: string): { name: string; isNameEdited: boolean } => {
      const edited = editedNames[code]
      if (edited !== undefined) {
        return { name: edited, isNameEdited: true }
      }
      return { name: originalName, isNameEdited: false }
    },
    [editedNames]
  )

  const resetAllPrices = useCallback(() => {
    setEditedPrices({})
    setEditedNames({})
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(NAMES_STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const resetPrice = useCallback(
    (code: string) => {
      setEditedPrices((prev) => {
        const next = { ...prev }
        delete next[code]
        persist(next)
        return next
      })
      setEditedNames((prev) => {
        const next = { ...prev }
        delete next[code]
        persistNames(next)
        return next
      })
    },
    [persist, persistNames]
  )

  const getPrice = useCallback(
    (
      code: string,
      originalMayor: number,
      originalBulto: number
    ): { priceMayor: number; priceBulto: number; isEdited: boolean } => {
      const edited = editedPrices[code]
      const hasEditedName = editedNames[code] !== undefined
      if (edited || hasEditedName) {
        return {
          priceMayor: edited?.priceMayor ?? originalMayor,
          priceBulto: edited?.priceBulto ?? originalBulto,
          isEdited: true,
        }
      }
      return { priceMayor: originalMayor, priceBulto: originalBulto, isEdited: false }
    },
    [editedPrices, editedNames]
  )

  const editedCount = Object.keys(editedPrices).length + Object.keys(editedNames).length

  return {
    isAdmin,
    setIsAdmin,
    updatePrice,
    updateName,
    getName,
    resetAllPrices,
    resetPrice,
    getPrice,
    editedCount,
  }
}
