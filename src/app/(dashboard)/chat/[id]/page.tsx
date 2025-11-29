'use client';

import React from 'react';
import { getConversationById } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { generateSuggestedReply } from "@/ai/flows/ai-suggested-reply";
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';

function AISuggestion({ conversationText, tenantId }: { conversationText: string, tenantId: number }) {
    // This is just an example. In a real app, you would probably want to
    // pass more context to the AI.
    const {data: suggestion, isLoading} = useQuery({
        queryKey: ['suggestion', conversationText, tenantId],
        queryFn: () => generateSuggestedReply({
            tenantId,
            conversationHistory: conversationText,
            userMessage: "", // Assuming we suggest based on history
            businessContext: "We are a local business in Nepal."
        }),
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    })

    if (isLoading) {
        return <Skeleton className="h-8 w-48" />;
    }

    if (!suggestion) {
        return null;
    }

    return (
        <Button size="sm" variant="outline" className="h-8 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{suggestion.suggestedReply}</span>
        </Button>
    )
}

export default function ChatConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: conversation, isLoading, isError } = useQuery({
    queryKey: ['conversation', params.id],
    queryFn: () => getConversationById(params.id),
  });

  if (isLoading) {
    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
                 <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    <Skeleton className="ml-auto h-16 w-3/4 rounded-lg" />
                    <Skeleton className="h-16 w-3/4 rounded-lg" />
                    <Skeleton className="ml-auto h-12 w-1/2 rounded-lg" />
                    <Skeleton className="h-16 w-3/4 rounded-lg" />
                </div>
            </div>
            <div className="flex-col items-start gap-2 border-t p-4">
                <div className="flex w-full items-center gap-2 overflow-x-auto pb-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="relative w-full">
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
        </div>
    )
  }

  if (isError || !conversation) {
    // This will be caught by the error boundary
    if(isError) throw new Error("Failed to load conversation.");
    // This will show Next.js's default 404 page
    notFound();
  }

  const conversationTextForAI = conversation.messages.map(m => `${m.from}: ${m.text}`).join('\n');

  // In a real app, you'd get the tenantId from the authenticated user's session
  const MOCK_TENANT_ID = 1;

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={conversation.avatarUrl} alt="Image" />
            <AvatarFallback>{conversation.customerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">
              {conversation.customerName}
            </p>
            <p className="text-sm text-muted-foreground">
              via {conversation.platform}
            </p>
          </div>
        </div>
        <Badge variant={conversation.sentimentScore > 0.1 ? "default" : conversation.sentimentScore < -0.1 ? "destructive" : "secondary"}>
          {conversation.sentimentScore > 0.1 ? "Positive" : conversation.sentimentScore < -0.1 ? "Negative" : "Neutral"}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
            {conversation.messages.slice().reverse().map((message) => (
                <div
                key={message.id}
                className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.from === "business"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
                >
                <p>{message.text}</p>
                <time className={cn("text-xs self-end opacity-70", message.from === 'business' ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                    {format(new Date(message.timestamp), 'p')}
                </time>
                </div>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 border-t p-4">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-2">
            <AISuggestion conversationText={conversationTextForAI} tenantId={MOCK_TENANT_ID} />
            <AISuggestion conversationText={conversationTextForAI} tenantId={MOCK_TENANT_ID} />
        </div>
        <div className="relative w-full">
            <Input placeholder="Type your message..." className="pr-12" />
            <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
