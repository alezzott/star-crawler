import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

interface TablePaginationProps {
  pageCount: number
  pageIndex: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onPageChange: (page: number) => void
}

export function TablePagination({
  pageCount,
  pageIndex,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageChange,
}: TablePaginationProps) {
  return (
    <section className="flex flex-row items-center justify-between gap-8 pt-5">
      <article>
        <h1 className="text-sm text-nowrap text-[#252525]">
          Página <b>{pageIndex + 1}</b> de <b>{pageCount}</b>
        </h1>
      </article>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              type="button"
              aria-label="Primeira página"
              onClick={() => onPageChange(0)}
              disabled={pageIndex === 0}
              className={
                'border border-gray-300 bg-gray-200 text-black transition-colors duration-200 ' +
                'hover:bg-white hover:text-gray-500' +
                (pageIndex === 0 ? ' cursor-not-allowed opacity-50' : '')
              }
            >
              <ChevronsLeft />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href="/"
              aria-disabled={!canPreviousPage}
              onClick={(e) => {
                e.preventDefault()
                onPreviousPage()
              }}
              tabIndex={!canPreviousPage ? -1 : 0}
              className={
                'border border-gray-300 transition-colors duration-200 hover:bg-white' +
                (!canPreviousPage ? ' cursor-not-allowed opacity-50' : '')
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault()
                onNextPage()
              }}
              aria-disabled={!canNextPage}
              href="/"
              tabIndex={!canNextPage ? -1 : 0}
              className={
                'border border-gray-300 transition-colors duration-200 hover:bg-white' +
                (!canNextPage ? ' cursor-not-allowed opacity-50' : '')
              }
            />
          </PaginationItem>
          <PaginationItem>
            <Button
              type="button"
              aria-label="Última página"
              onClick={() => onPageChange(pageCount - 1)}
              disabled={pageIndex === pageCount - 1}
              className={
                'border border-gray-300 bg-gray-200 text-black transition-colors duration-200 ' +
                'hover:bg-white hover:text-gray-500' +
                (pageIndex === pageCount - 1
                  ? ' cursor-not-allowed opacity-50'
                  : '')
              }
            >
              <ChevronsRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  )
}
