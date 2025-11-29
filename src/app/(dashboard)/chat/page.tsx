import { MessageCircle } from 'lucide-react';

export default function ChatDefaultPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="rounded-full border bg-background p-4">
        <MessageCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-medium">Select a conversation</h2>
        <p className="text-muted-foreground">
          Choose a conversation from the list to start chatting.
        </p>
      </div>
    </div>
  );
}
