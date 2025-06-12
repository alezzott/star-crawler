'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import { useImportCsv } from '@/shared/hooks/useImportCsv'
import { useJobStatus } from '@/shared/hooks/useJobStatus'
import { useImportedRepos } from '@/shared/hooks/useImportRepos'
import { TablePagination } from './table/TablePaginationItem'
import { ChevronsUpDown, Link } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { Input } from '../ui/input'
import { TableSortableHeader } from './table/TableSortableHeader'
import { LoaderSpinning } from '../ui/loader-spinning'

export function ImportItem() {
  const [jobId, setJobId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [searchInput, setSearchInput] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const [debouncedSearch] = useDebounce(searchInput, 500)

  const prevStatus = useRef<string>(null)
  const importCsv = useImportCsv()
  const { data: jobStatus, isLoading, error } = useJobStatus(jobId || undefined)
  const {
    data: importData,
    isLoading: isLoadingImport,
    error: isImportError,
  } = useImportedRepos(page, undefined, filters)

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <TableSortableHeader column={column}>ID</TableSortableHeader>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <TableSortableHeader column={column}>Nome</TableSortableHeader>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'stars',
        header: ({ column }) => (
          <TableSortableHeader column={column}>Stars</TableSortableHeader>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <a
              href={row.original.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                buttonVariants({ variant: 'default' }) +
                ' flex items-center gap-2'
              }
            >
              <Link className="inline" size={14} />
            </a>
          </div>
        ),
      },
    ],
    []
  )

  const handleClearFilters = () => {
    setSearchInput('')
    setFilters({})
    setPage(1)
  }

  const table = useReactTable({
    data: importData?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return
    importCsv.mutate(file, {
      onSuccess: (data) => setJobId(data.jobId),
      onError: () => toast.error('Erro ao importar CSV'),
    })
  }

  useEffect(() => {
    if (!jobStatus?.status) return

    if (jobStatus.status !== prevStatus.current) {
      switch (jobStatus.status) {
        case 'pending':
        case 'processing':
          toast.dismiss()
          toast.info('Importação em processamento...')
          break
        case 'done':
          toast.dismiss()
          toast.success('Importação concluída com sucesso!')
          break
        case 'error':
          toast.dismiss()
          toast.error('Falha ao importar repositórios')
          break
      }
      prevStatus.current = jobStatus.status
    }
  }, [jobStatus?.status])

  useEffect(() => {
    let newFilters = {}
    if (debouncedSearch) {
      newFilters = { name: debouncedSearch }
    }

    if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
      setFilters(newFilters)
      setPage(1)
    }
  }, [debouncedSearch])

  const total = importData?.total ?? 0
  const limit = importData?.limit ?? 20
  const pageCount = Math.ceil(total / limit)
  const pageIndex = page - 1

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col">
      <div className="mb-6 flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={importCsv.isPending || isLoading}
        >
          Importar CSV
        </Button>
      </div>
      {isLoadingImport && (
        <div className="mb-4 text-blue-500">Carregando repositórios...</div>
      )}
      {isImportError && (
        <div className="mb-4 text-red-500">
          Erro ao carregar repositórios importados.
        </div>
      )}
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Buscar por nome do repo"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border"
        />
        <Button variant="outline" onClick={handleClearFilters}>
          Limpar busca
        </Button>
      </div>
      {isLoadingImport ? (
        <div className="flex h-32 items-center justify-center">
          <LoaderSpinning size={40} />
        </div>
      ) : (
        <section className="bg-background !rounded-md border border-neutral-300">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-8 text-center"
                  >
                    Nenhum repositório encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </section>
      )}
      <TablePagination
        pageCount={pageCount}
        pageIndex={pageIndex}
        canPreviousPage={pageIndex > 0}
        canNextPage={pageIndex < pageCount - 1}
        onPreviousPage={() => setPage((p) => Math.max(1, p - 1))}
        onNextPage={() => setPage((p) => Math.min(pageCount, p + 1))}
        onPageChange={(p) => setPage(p + 1)}
      />
    </main>
  )
}
