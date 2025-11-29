"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/lib/types";
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
import { formatCurrencyNPR } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
        case 'Paid':
        case 'Completed':
            return 'default';
        case 'Pending':
            return 'secondary';
        case 'Udhaari':
            return 'destructive';
        case 'Shipped':
            return 'outline';
        default:
            return 'secondary';
    }
}

const getPaymentBadgeColor = (method: Order['paymentMethod']) => {
    switch(method) {
        case 'eSewa': return 'bg-green-600 hover:bg-green-700';
        case 'Khalti': return 'bg-purple-600 hover:bg-purple-700';
        case 'FonePay': return 'bg-blue-600 hover:bg-blue-700';
        case 'Udhaari': return 'bg-red-600 hover:bg-red-700';
        default: return 'bg-gray-500 hover:bg-gray-600';
    }
}


export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => <div className="font-medium">{row.original.customerName}</div>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
    }
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
        const method = row.original.paymentMethod;
        return <Badge className={`${getPaymentBadgeColor(method)} text-white`}>{method}</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
        const date = row.original.createdAt;
        return <span>{formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
    }
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatCurrencyNPR(row.original.totalAmount)}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
            <DropdownMenuItem>Contact Customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
