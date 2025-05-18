import { leaderboardColumns as columns, data } from "../data";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { cn } from "@/lib/utils";


export function LeaderboardTable() {
  const table = useReactTable({
    columns,
    data,
    initialState: {
      sorting: [
        {
          id: "prestige",
          desc: true,
        },
      ],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-sm overflow-hidden w-lg mx-auto shadow-sm shadow-blue-950">
      <Table className="table-fixed">
      <TableHeader className="bg-slate-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                style={{ width: 'auto' }}
                className={cn(
                  "py-3 not-last:text-left font-semibold uppercase tracking-widest text-blue-400",
                  header.column.getCanSort() && "cursor-pointer",
                )}
              >
                <div className="flex items-center gap-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "desc" && <ArrowDownWideNarrow />}
                  {header.column.getIsSorted() === "asc" && <ArrowUpNarrowWide />}
                  {header.column.getCanSort() && header.column.getIsSorted() === false && <ArrowDownUp />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No data.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
}
