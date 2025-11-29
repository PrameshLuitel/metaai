import { getConversations } from '@/lib/data';
import { ChatLayout } from '@/components/chat/chat-layout';

export default async function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    <div className="flex h-full flex-col rounded-xl border bg-background shadow-sm">
        <ChatLayout conversations={conversations}>{children}</ChatLayout>
    </div>
  );
}
