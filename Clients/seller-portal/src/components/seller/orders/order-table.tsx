"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/lib/api/seller/types';

interface OrderTableProps {
  data: Order[];
  locale: string;
}

export function OrderTable({ data, locale }: OrderTableProps) {
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'orderNumber',
        header: 'Order',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Link className="text-sm font-semibold text-primary" href={`/${locale}/seller/orders/${row.original.id}`}>
              #{row.original.orderNumber}
            </Link>
            <span className="text-xs text-muted-foreground">{row.original.customerName}</span>
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => formatCurrency(row.original.total, row.original.currency)
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => new Intl.DateTimeFormat().format(row.original.createdAt)
      }
    ],
    [locale]
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

function statusVariant(status: Order['status']) {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return 'warning';
    case 'shipped':
    case 'delivered':
      return 'success';
    case 'returned':
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}
