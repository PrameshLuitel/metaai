import type { InventoryItem, Order, Conversation } from '@/lib/types';
// import { db } from '@/db';
// import { inventory as inventoryTable, orders as ordersTable, conversations as conversationsTable } from '@/db/schema';
// import { eq } from 'drizzle-orm';

const MOCK_INVENTORY: InventoryItem[] = [
    { id: 1, name: 'Steamed Momos (Buff)', variant: '10 pcs', priceNpr: 200, stock: 50, lowStockThreshold: 10, imageUrl: "https://images.unsplash.com/photo-1696233022180-b42b5c787ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxtb21vJTIwZHVtcGxpbmd8ZW58MHx8fHwxNzY0NDExMzk5fDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 2, name: 'Wai Wai Noodles', variant: '1 packet', priceNpr: 30, stock: 200, lowStockThreshold: 50, imageUrl: "https://images.unsplash.com/photo-1641736495436-921e490112e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxpbnN0YW50JTIwbm9vZGxlc3xlbnwwfHx8fDE3NjQzNzkxODF8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 3, name: 'Goldstar Shoes', variant: 'Size 9', priceNpr: 1500, stock: 20, lowStockThreshold: 5, imageUrl: "https://images.unsplash.com/photo-1579528542333-4148f1769c35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxzbmVha2VycyUyMHNob2VzfGVufDB8fHx8fDE3NjQzOTI1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { id: 4, name: 'Buff Sukuti', variant: '250g', priceNpr: 800, stock: 30, lowStockThreshold: 5, imageUrl: "https://images.unsplash.com/photo-1603048374877-b98f840ad441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZHJpZWQlMjBtZWF0fGVufDB8fHx8MTc2NDQxMTM5OXww&ixlib=rb-4.1.0&q=80&w=1080" },
];

const MOCK_ORDERS: Order[] = [
    { id: 1, customerName: 'Aayush Shrestha', status: 'Paid', paymentMethod: 'eSewa', totalAmount: 700, items: [], createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)), proofScreenshotUrl: null },
    { id: 2, customerName: 'Bipana Lama', status: 'Pending', paymentMethod: 'FonePay', totalAmount: 2500, items: [], createdAt: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000)), proofScreenshotUrl: null },
    { id: 3, customerName: 'Chandan Kumar', status: 'Udhaari', paymentMethod: 'Udhaari', totalAmount: 360, items: [], createdAt: new Date(Date.now() - (3 * 24 * 60 * 60 * 1000)), proofScreenshotUrl: null },
    { id: 4, customerName: 'Deepa Thapa', status: 'Paid', paymentMethod: 'Khalti', totalAmount: 120, items: [], createdAt: new Date(Date.now() - (4 * 24 * 60 * 60 * 1000)), proofScreenshotUrl: null },
];

const MOCK_CONVERSATIONS: Conversation[] = [
    { id: '1', customerName: 'Sita Rai', platform: 'WhatsApp', lastMessage: 'Hajur, price kati ho?', lastMessageAt: new Date(Date.now() - 5 * 60 * 1000), unreadCount: 2, sentimentScore: 0.0, avatarUrl: "https://i.pravatar.cc/150?u=cust_f_12345", customerId: '9841234567', aiSummary: null, messages: [] },
    { id: '2', customerName: 'Gita Thapa', platform: 'Messenger', lastMessage: 'Delivery charge kati lagcha?', lastMessageAt: new Date(Date.now() - 30 * 60 * 1000), unreadCount: 0, sentimentScore: 0.3, avatarUrl: "https://i.pravatar.cc/150?u=cust_f_12346", customerId: 'm.me/gitathapa', aiSummary: null, messages: [] },
    { id: '3', customerName: 'Hari Khadka', platform: 'Instagram', lastMessage: 'Photo pathaunus na.', lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), unreadCount: 0, sentimentScore: -0.5, avatarUrl: "https://i.pravatar.cc/150?u=cust_m_12347", customerId: '@harikhadka', aiSummary: null, messages: [] },
];


// Server Actions
export async function getInventory(): Promise<InventoryItem[]> {
    // try {
    //     const data = await db.select().from(inventoryTable);
    //     // Map to InventoryItem type, assuming schema matches
    //     return data.map(item => ({
    //         ...item,
    //         priceNpr: Number(item.priceNpr), // Drizzle returns decimal as string
    //         imageUrl: item.imageUrl || undefined,
    //     }));
    // } catch (error) {
    //     console.error("Database Error:", error);
    //     return [];
    // }
    return MOCK_INVENTORY;
}

export async function getOrders(): Promise<Order[]> {
    // try {
    //     const data = await db.select().from(ordersTable);
    //     // Map to Order type, assuming schema matches
    //     return data.map(order => ({
    //         ...order,
    //         totalAmount: Number(order.totalAmount),
    //         items: order.items as any, // Assuming 'items' is a JSON column
    //         createdAt: new Date(order.createdAt),
    //         proofScreenshotUrl: order.proofScreenshotUrl || null,
    //     }));
    // } catch (error) {
    //     console.error("Database Error:", error);
    //     return [];
    // }
    return MOCK_ORDERS;
}

export async function getConversations(): Promise<Conversation[]> {
    // try {
    //     const data = await db.select().from(conversationsTable);
    //     // Map to Conversation type, assuming schema matches
    //     return data.map(convo => ({
    //         id: String(convo.id), // Ensure id is a string
    //         platform: convo.platform,
    //         customerId: convo.customerId,
    //         customerName: convo.customerName || 'Unknown',
    //         lastMessage: "Click to view", // Placeholder, as we don't store this directly
    //         lastMessageAt: new Date(convo.lastMessageAt),
    //         sentimentScore: Number(convo.sentimentScore),
    //         aiSummary: convo.aiSummary || null,
    //         unreadCount: 0, // This would need a separate tracking mechanism
    //         avatarUrl: convo.avatarUrl || undefined,
    //         messages: [], // Messages would need to be fetched on demand
    //     }));
    // } catch (error) {
    //     console.error("Database Error:", error);
    //     return [];
    // }
    return MOCK_CONVERSATIONS;
}


export async function getConversationById(id: string): Promise<Conversation | null> {
    // try {
    //     const conversationArray = await db.select().from(conversationsTable).where(
    //         eq(conversationsTable.id, parseInt(id, 10))
    //     ).limit(1);

    //     if (conversationArray.length === 0) {
    //         return null;
    //     }
    //     const convo = conversationArray[0];
    //     // In a real app, you would fetch messages for this conversation
    //     // For now, returning mock messages
    // } catch (error) {
    //      console.error("Database Error:", error);
    //     return null;
    // }
    const convo = MOCK_CONVERSATIONS.find(c => c.id === id);
    if (!convo) return null;

    return {
        ...convo,
        messages: [
            { id: 'msg1', from: 'customer', text: 'Hello, I have a question about my order.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
            { id: 'msg2', from: 'business', text: 'Of course, how can I help you?', timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000) },
            { id: 'msg3', from: 'customer', text: 'My tracking number is not working.', timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000) }
        ]
    };
}
