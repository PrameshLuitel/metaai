import type { InventoryItem, Order, Conversation, UserProfile } from '@/lib/types';
import { db } from '@/db';
import { inventory as inventoryTable, orders as ordersTable, conversations as conversationsTable, users as usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
        const data = await db.select().from(conversationsTable);
        // Map to Conversation type, assuming schema matches
        return data.map(convo => ({
            id: String(convo.id), // Ensure id is a string
            platform: convo.platform,
            customerId: convo.customerId,
            customerName: convo.customerName || 'Unknown',
            lastMessage: "Click to view", // Placeholder, as we don't store this directly
            lastMessageAt: new Date(convo.lastMessageAt),
            sentimentScore: Number(convo.sentimentScore),
            aiSummary: convo.aiSummary || null,
            unreadCount: 0, // This would need a separate tracking mechanism
            avatarUrl: convo.avatarUrl ?? undefined,
            messages: [], // Messages would need to be fetched on demand
        }));
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}


export async function getConversationById(id: string): Promise<Conversation | null> {
    if (!db) return null;
    try {
        const conversationArray = await db.select().from(conversationsTable).where(
            eq(conversationsTable.id, parseInt(id, 10))
        ).limit(1);

        if (conversationArray.length === 0) {
            return null;
        }
        const convo = conversationArray[0];
        // In a real app, you would fetch messages for this conversation
        // For now, returning mock messages
        return {
            id: String(convo.id),
            platform: convo.platform,
            customerId: convo.customerId,
            customerName: convo.customerName || 'Unknown',
            lastMessage: "Click to view",
            lastMessageAt: new Date(convo.lastMessageAt),
            sentimentScore: Number(convo.sentimentScore),
            aiSummary: convo.aiSummary || null,
            unreadCount: 0,
            avatarUrl: convo.avatarUrl ?? undefined,
            messages: [
                { id: 'msg1', from: 'customer', text: 'Hello, I have a question about my order.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                { id: 'msg2', from: 'business', text: 'Of course, how can I help you?', timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000) },
                { id: 'msg3', from: 'customer', text: 'My tracking number is not working.', timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000) }
            ]
        };
    } catch (error) {
         console.error("Database Error:", error);
        return null;
    }
}

export async function getUsers(): Promise<UserProfile[]> {
    if (!db) return [];
    try {
        const data = await db.select().from(usersTable);
        // In a real app, you'd likely want to filter by tenantId
        return data.map(user => ({
            id: user.id,
            tenantId: String(user.tenantId),
            role: user.role,
            name: user.name || null,
            email: user.email,
            avatarUrl: user.avatarUrl || null,
        }));
    } catch (error) {
        console.error("Database Error:", error);
        return [];
    }
}