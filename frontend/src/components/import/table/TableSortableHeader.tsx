import { ChevronsUpDown } from 'lucide-react'
import { Column } from '@tanstack/react-table'
import React from 'react'

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>
  children: React.ReactNode
}

export function TableSortableHeader<TData>({
  column,
  children,
}: SortableHeaderProps<TData>) {
  return (
    <button
      type="button"
      className="flex items-center gap-1"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children}
      <ChevronsUpDown
        size={14}
        className={column.getIsSorted() ? 'text-blue-500' : 'text-gray-400'}
      />
    </button>
  )
}
