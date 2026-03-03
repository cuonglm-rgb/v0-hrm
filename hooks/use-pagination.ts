"use client"

import { useState, useMemo, useCallback } from "react"

interface UsePaginationResult<T> {
  paginatedData: T[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
}

export function usePagination<T>(data: T[], initialPageSize = 50): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const totalItems = data.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const safePage = Math.min(currentPage, totalPages)

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, safePage, pageSize])

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size)
    setCurrentPage(1)
  }, [])

  return {
    paginatedData,
    currentPage: safePage,
    totalPages,
    pageSize,
    totalItems,
    setPage,
    setPageSize,
  }
}
