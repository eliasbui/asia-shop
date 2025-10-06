"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/shared/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product } from '@/lib/api/seller/types';

interface ProductTableProps {
  data: Product[];
  loading?: boolean;
  onCreate?: () => void;
}

export function ProductTable({ data, loading, onCreate }: ProductTableProps) {
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Product',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">SKU: {row.original.sku}</span>
          </div>
        )
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <Badge>{row.original.category}</Badge>
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.discountPrice ?? row.original.price)
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="text-sm font-medium">{row.original.stock}</div>
            {row.original.variants && row.original.variants.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {row.original.variants.length} variants
              </div>
            )}
          </div>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  if (loading) {
    return <Skeleton className="h-72 w-full" />;
  }

  if (!data.length) {
    return (
      <EmptyState
        title="No products yet"
        description="Upload your catalog or create a new listing to start selling."
        actionLabel="Create product"
        onAction={onCreate}
      />
    );
  }

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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
}
