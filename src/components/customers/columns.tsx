"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { UserProfile } from "@/lib/types";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const getRoleBadgeVariant = (role: UserProfile['role']) => {
    switch (role) {
        case 'admin':
            return 'default';
        case 'staff':
            return 'secondary';
        case 'viewer':
            return 'outline';
        default:
            return 'secondary';
    }
}


export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || 'User'} />}
                    <AvatarFallback>{(user.name || user.email).charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{user.name || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.original.role;
        return <Badge variant={getRoleBadgeVariant(role)}>{role}</Badge>
    }
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
            <DropdownMenuItem>Edit Role</DropdownMenuItem>
            <DropdownMenuItem>Send Password Reset</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
