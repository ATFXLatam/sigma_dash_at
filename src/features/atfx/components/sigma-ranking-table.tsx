import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTablePagination } from '@/components/data-table/pagination'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  SIGMA_RANKING,
  SIGMA_RANKING_MONTH,
  type SigmaRankingEntry,
} from '@/features/atfx/components/sigma-ranking-data'
import { formatters } from '@/lib/planner/formatters'

type SigmaRankingRow = SigmaRankingEntry & { rank: number }

function buildRows(): SigmaRankingRow[] {
  return [...SIGMA_RANKING]
    .sort((a, b) => b.grossDeposit - a.grossDeposit)
    .map((row, i) => ({ ...row, rank: i + 1 }))
}

export function SigmaRankingTable() {
  const rows = useMemo(() => buildRows(), [])
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'grossDeposit', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<SigmaRankingRow>[]>(
    () => [
      {
        accessorKey: 'rank',
        header: '#',
        cell: ({ row }) => (
          <span className='font-medium tabular-nums'>#{row.original.rank}</span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'bdm',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='BDM' />
        ),
        cell: ({ row }) => (
          <span className='inline-flex items-center gap-2 font-medium'>
            {row.original.bdm}
            {row.original.status === 'Inactive' ? (
              <span className='rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium uppercase leading-none text-muted-foreground'>
                Inactive
              </span>
            ) : null}
          </span>
        ),
      },
      {
        accessorKey: 'country',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Country' />
        ),
        cell: ({ row }) => (
          <span className='text-muted-foreground'>{row.original.country}</span>
        ),
      },
      {
        accessorKey: 'teamOffice',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Team Office' />
        ),
        cell: ({ row }) => (
          <span className='text-muted-foreground'>
            {row.original.teamOffice}
          </span>
        ),
      },
      {
        accessorKey: 'grossDeposit',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Gross Deposit' />
        ),
        cell: ({ row }) => (
          <span className='tabular-nums'>
            {formatters.currency({ number: row.original.grossDeposit })}
          </span>
        ),
      },
      {
        accessorKey: 'clients',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Clients' />
        ),
        cell: ({ row }) => (
          <span className='tabular-nums'>
            {formatters.unit(row.original.clients)}
          </span>
        ),
      },
      {
        accessorKey: 'month',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Month' />
        ),
        cell: ({ row }) => (
          <span className='text-muted-foreground'>{row.original.month}</span>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  })

  return (
    <div className='space-y-4'>
      <Input
        placeholder='Search BDM…'
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className='max-w-xs'
      />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <p className='text-xs text-muted-foreground'>
        {SIGMA_RANKING_MONTH} · ranked by Gross Deposit · Sigma tournament
        snapshot
      </p>
    </div>
  )
}
