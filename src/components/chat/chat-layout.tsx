"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  conversations: Conversation[];
  children: React.ReactNode;
}

export function ChatLayout({ conversations, children }: ChatLayoutProps) {
  const pathname = usePathname();
  const isChatActive = pathname.includes('/chat/') && pathname.split('/').length > 2;

  return (
    <div className={cn(
      "grid w-full h-full grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]",
      isChatActive ? "grid-cols-[0px_1fr] md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]" : ""
    )}>
      <div className={cn(
        "flex-col border-r bg-background",
        isChatActive ? "hidden md:flex" : "flex"
      )}>
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-px">
            {conversations.map((convo) => {
              const isActive = pathname === `/chat/${convo.id}`;
              return (
                <Link
                  key={convo.id}
                  href={`/chat/${convo.id}`}
                  className={cn(
                    "flex items-start gap-4 p-4 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={convo.avatarUrl} alt={convo.customerName} />
                    <AvatarFallback>{convo.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{convo.customerName}</p>
                      <time className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(convo.lastMessageAt), { addSuffix: true })}
                      </time>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="truncate text-muted-foreground">
                            {convo.lastMessage}
                        </p>
                        {convo.unreadCount > 0 && (
                            <Badge className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                                {convo.unreadCount}
                            </Badge>
                        )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
      <div className={cn(
        "flex-col",
        isChatActive ? "flex" : "hidden md:flex"
      )}>{children}</div>
    </div>
  );
}
