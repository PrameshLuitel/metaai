import { getConversations } from '@/lib/data';
import { ChatLayout } from '@/components/chat/chat-layout';

export default async function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    <main className="flex h-[calc(100vh_-_3.5rem)] flex-col bg-background md:h-full">
        <ChatLayout conversations={conversations}>{children}</ChatLayout>
    </main>
  );
}
