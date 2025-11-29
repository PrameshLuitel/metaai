"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { InventoryItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { formatCurrencyNPR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="rounded-md object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">{item.variant}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
        const item = row.original;
        const isLowStock = item.stock <= item.lowStockThreshold;
        return (
            <div className="flex items-center gap-2">
                <div className={cn("h-2.5 w-2.5 rounded-full", isLowStock ? "bg-red-500" : "bg-green-500")}></div>
                <span>{item.stock} in stock</span>
                {isLowStock && <Badge variant="destructive">Low Stock</Badge>}
            </div>
        )
    }
  },
  {
    accessorKey: "priceNpr",
    header: "Price",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatCurrencyNPR(row.original.priceNpr)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Sales</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
