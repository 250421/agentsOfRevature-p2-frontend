import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/shared/PaginationControls'
import { usePagination } from '@/hooks/usePagination'
import { columns, type Hero } from '@/features/heroes/components/columns'
import { Button } from '@/components/ui/button'
import { useConfirm } from '@/hooks/use-confirm'
import { axiosInstance } from '@/lib/axios-config'
import axios from 'axios'
import { TransitionScreen } from '@/components/shared/TransitionScreen'


async function fetchHeroes(): Promise<Hero[]> {
  const response = await axios.get('https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json'); 

  return response.data;
}

export const Route = createFileRoute('/(protected)/_protected/heroselect')({
  component: RouteComponent,
})

export function RouteComponent() {
  const { data: heroes = [], isLoading } = useQuery<Hero[], Error>({
    queryKey:  ['heroes'],
    queryFn:   fetchHeroes,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable<Hero>({
    data: heroes,
    columns,
    state: {
      rowSelection,
      columnFilters,
    },
    onRowSelectionChange:  setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel:       getCoreRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    enableRowSelection:    true,
  })

  const filteredRows = table.getFilteredRowModel().rows
  const {
    displayedItems: pageRows,
    handlePrevPage,
    handleNextPage,
    canPrevPage,
    canNextPage,
  } = usePagination({
    allItems:    filteredRows,
    itemsPerPage: 15,
  })

  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search || '')
  const calamityIdStr = params.get('calamityId')
  const calamityId = Number(calamityIdStr);
  const queryClient = useQueryClient()
  const [confirm, ConfirmDialog] = useConfirm()

  // get selected heroes
  const selectedRows = table
  .getSelectedRowModel()
  .rows.map(r => r.original)
  const selectedNames = selectedRows.map(h => h.name)
  const selectedCount = table.getSelectedRowModel().rows.length

  // POST to backend
  const deployMutation = useMutation<
    { scenarioId: string },
    Error,
    string[]
  >({
    mutationFn: async (heroNames) => {
      // unpack exactly three names
      const [hero1, hero2, hero3] = heroNames;

      const payload = {
        calamityId,
        hero1,
        hero2,
        hero3,
      };
      console.log(payload)
      // using your axiosInstance
      const response = await axiosInstance.post<{ scenarioId: string }>(
        '/api/scenario',
        payload
      );

      return response.data;
    },
    onError(err) {
      console.error('failed to deploy:', err);
      alert(`Deploy failed: ${err.message}`);
    },
    onSuccess(data) {
      queryClient.setQueryData(['currentScenario'], data)
      navigate({ to: '/game' });
    },
  });


  async function handleDeployClick() {
    // open dialog
    const ok = await confirm()
    if (!ok) return

    // if exactly 3, trigger
    deployMutation.mutate(selectedNames)
  }

  if (deployMutation.isPending) {
    return <TransitionScreen text="Deploying your heroes..." />;
  }

  if (isLoading) {
    return <div>Loading…</div>
  }

  return (
    <div className="container mx-auto py-10 space-y-4 text-slate-100">
      
      <h1 className="text-2xl font-bold">Select 3 Heroes</h1>

      <div className="text-sm text-slate-400">
        {selectedCount} hero{selectedCount === 1 ? '' : 'es'} selected
      </div>

      <div className="flex flex-row">
        <PaginationControls
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          canPrevPage={canPrevPage}
          canNextPage={canNextPage}
        />

        <Input
          placeholder="Search for a hero"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />

        <Button
          onClick={handleDeployClick}
          disabled={selectedCount !== 3}
          className="ml-auto bg-blue-400"
        >
          Deploy Heroes
        </Button>
      </div>

      <table className="min-w-full border-collapse border-slate-500">
        <thead className="bg-slate-800">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="p-2 border">
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='bg-slate-700'>
          {pageRows.map(row => (
            <tr key={row.id} className="hover:bg-slate-500">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    <ConfirmDialog
      title="Deploy Heroes?"
      description={`You're about to deploy these three heroes: ${selectedNames[0]}, ${selectedNames[1]}, and ${selectedNames[2]}.`}
      confirmLabel="Yes, Deploy"
      cancelLabel="Cancel"
      destructive={false}
    />
  </div>
  )
}
