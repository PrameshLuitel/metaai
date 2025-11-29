import { getConversations } from '@/lib/data';
import { ChatLayout } from '@/components/chat/chat-layout';

export default async function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    <div className="relative flex h-[calc(100vh_-_3.5rem)]">
      <ChatLayout conversations={conversations}>{children}</ChatLayout>
    </div>
  );
}
