import type { InventoryItem, Order, Conversation, UserProfile, ChatMessage } from '@/lib/types';
import { db } from '@/db';
import { inventory as inventoryTable, orders as ordersTable, conversations as conversationsTable, users as usersTable, messages as messagesTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Server Actions
export async function getInventory(): Promise<InventoryItem[]> {
    if (!db) return [];
    try {
        const data = await db.select().from(inventoryTable);
        // Map to InventoryItem type, assuming schema matches
        return data.map(item => ({
            ...item,
            id: item.id,
            priceNpr: Number(item.priceNpr), // Drizzle returns decimal as string
            imageUrl: item.imageUrl ?? undefined,
            lowStockThreshold: item.lowStockThreshold ?? 0,
            variant: item.variant ?? null,
        }));
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}

export async function getOrders(): Promise<Order[]> {
    if (!db) return [];
    try {
        const data = await db.select().from(ordersTable);
        // Map to Order type, assuming schema matches
        return data.map(order => ({
            ...order,
            id: order.id,
            totalAmount: Number(order.totalAmount),
            items: order.items as any, // Assuming 'items' is a JSON column
            createdAt: new Date(order.createdAt),
            proofScreenshotUrl: order.proofScreenshotUrl || null,
        }));
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}

export async function getConversations(): Promise<Conversation[]> {
    if (!db) return [];
    try {
        const data = await db.query.conversations.findMany({
            orderBy: [desc(conversationsTable.lastMessageAt)],
            with: {
                messages: {
                    orderBy: [desc(messagesTable.createdAt)],
                    limit: 1,
                }
            }
        });
        
        return data.map(convo => ({
            id: String(convo.id),
            platform: convo.platform,
            customerId: convo.customerId,
            customerName: convo.customerName || 'Unknown',
            lastMessage: convo.messages[0]?.content || "No messages yet",
            lastMessageAt: new Date(convo.lastMessageAt),
            sentimentScore: Number(convo.sentimentScore),
            aiSummary: convo.aiSummary || null,
            unreadCount: 0, // This would need a separate tracking mechanism
            avatarUrl: convo.avatarUrl ?? undefined,
            messages: [], // Full messages are fetched on demand
        }));
    } catch (error) {
        console.error("Database Error getting conversations:", error);
        return [];
    }
}


export async function getConversationById(id: string): Promise<Conversation | null> {
    if (!db) return null;
    try {
        const conversationId = parseInt(id, 10);
        if (isNaN(conversationId)) return null;

        const convo = await db.query.conversations.findFirst({
            where: eq(conversationsTable.id, conversationId),
            with: {
                messages: {
                    orderBy: [desc(messagesTable.createdAt)]
                }
            }
        });

        if (!convo) {
            return null;
        }

        return {
            id: String(convo.id),
            platform: convo.platform,
            customerId: convo.customerId,
            customerName: convo.customerName || 'Unknown',
            lastMessage: convo.messages[0]?.content || "No messages yet",
            lastMessageAt: new Date(convo.lastMessageAt),
            sentimentScore: Number(convo.sentimentScore),
            aiSummary: convo.aiSummary || null,
            unreadCount: 0,
            avatarUrl: convo.avatarUrl ?? undefined,
            messages: convo.messages.map(msg => ({
                id: String(msg.id),
                from: msg.sender,
                text: msg.content,
                timestamp: new Date(msg.createdAt),
            }))
        };
    } catch (error) {
         console.error("Database Error getting conversation by ID:", error);
        return null;
    }
}

export async function getUsers(): Promise<UserProfile[]> {
    if (!db) return [];
    try {
        // In a real app, you'd likely want to filter by tenantId from session
        const data = await db.select().from(usersTable);
        return data.map(user => ({
            id: user.id,
            tenantId: String(user.tenantId),
            role: user.role,
            name: user.name || null,
            email: user.email,
            avatarUrl: user.avatarUrl || null,
        }));
    } catch (error) {
        console.error("Database Error getting users:", error);
        return [];
    }
}
