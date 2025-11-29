import { getConversations } from '@/lib/data';
import { ChatLayout } from '@/components/chat/chat-layout';

export default async function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    <div className="flex h-[calc(100vh_-_5rem)] flex-col rounded-xl border bg-background shadow-sm md:h-[calc(100vh_-_7rem)]">
        <ChatLayout conversations={conversations}>{children}</ChatLayout>
    </div>
  );
}
