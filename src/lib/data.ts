import type { InventoryItem, Order, Conversation } from '@/lib/types';
import { placeholderImages } from './placeholder-images.json';

// Mock Inventory Data
export const mockInventory: InventoryItem[] = [
  {
    id: 'inv_001',
    name: 'Chicken Momo (Steam)',
    variant: '10 pcs',
    priceNpr: 180,
    stock: 50,
    lowStockThreshold: 10,
    imageUrl: placeholderImages.find(p => p.id === 'momo-1')?.imageUrl || '',
  },
  {
    id: 'inv_002',
    name: 'Buff Sukuti',
    variant: 'Plate',
    priceNpr: 350,
    stock: 8,
    lowStockThreshold: 5,
    imageUrl: placeholderImages.find(p => p.id === 'sukuti-1')?.imageUrl || '',
  },
  {
    id: 'inv_003',
    name: 'Goldstar Shoes',
    variant: 'G10, Size 8',
    priceNpr: 1250,
    stock: 25,
    lowStockThreshold: 5,
    imageUrl: placeholderImages.find(p => p.id === 'shoes-1')?.imageUrl || '',
  },
  {
    id: 'inv_004',
    name: 'Wai Wai Noodles',
    variant: 'Box (30 pcs)',
    priceNpr: 600,
    stock: 100,
    lowStockThreshold: 20,
    imageUrl: placeholderImages.find(p => p.id === 'noodles-1')?.imageUrl || '',
  },
  {
    id: 'inv_005',
    name: 'Pork Sekuwa',
    variant: '1 Stick',
    priceNpr: 120,
    stock: 45,
    lowStockThreshold: 15,
    imageUrl: placeholderImages.find(p => p.id === 'sekuwa-1')?.imageUrl || '',
  },
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'ord_001',
    customerName: 'Aayush Shrestha',
    status: 'Paid',
    paymentMethod: 'eSewa',
    totalAmount: 700,
    proofScreenshotUrl: 'https://example.com/proof1.jpg',
    createdAt: new Date('2024-07-20T10:30:00'),
    items: [
      { inventoryId: 'inv_002', quantity: 2 },
    ]
  },
  {
    id: 'ord_002',
    customerName: 'Bipana Lama',
    status: 'Pending',
    paymentMethod: 'FonePay',
    totalAmount: 2500,
    proofScreenshotUrl: null,
    createdAt: new Date('2024-07-21T14:00:00'),
    items: [
      { inventoryId: 'inv_003', quantity: 2 },
    ]
  },
  {
    id: 'ord_003',
    customerName: 'Chandan Kumar',
    status: 'Udhaari',
    paymentMethod: 'Udhaari',
    totalAmount: 360,
    proofScreenshotUrl: null,
    createdAt: new Date('2024-07-21T18:45:00'),
    items: [
      { inventoryId: 'inv_001', quantity: 2 },
    ]
  },
  {
    id: 'ord_004',
    customerName: 'Deepa Thapa',
    status: 'Paid',
    paymentMethod: 'Khalti',
    totalAmount: 120,
    proofScreenshotUrl: 'https://example.com/proof4.jpg',
    createdAt: new Date('2024-07-22T09:15:00'),
    items: [
      { inventoryId: 'inv_005', quantity: 1 },
    ]
  },
];

// Mock Conversations Data
export const mockConversations: Conversation[] = [
    {
        id: 'con_001',
        platform: 'WhatsApp',
        customerId: 'cust_9841234567',
        customerName: 'Rohan Joshi',
        lastMessage: 'Hello, momo cha?',
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        sentimentScore: 0.2,
        aiSummary: 'Customer is asking about the availability of momo.',
        unreadCount: 2,
        avatarUrl: `https://i.pravatar.cc/150?u=cust_9841234567`,
        messages: [
            { id: 'msg1', from: 'customer', text: 'Hello, momo cha?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
            { id: 'msg2', from: 'business', text: 'Hajur cha. Kati plate pathaidim?', timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000) },
            { id: 'msg3', from: 'customer', text: 'Ek plate chicken steam pathaidinu. Location: Baneshwor', timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000) }
        ]
    },
    {
        id: 'con_002',
        platform: 'Messenger',
        customerId: 'cust_m_12345',
        customerName: 'Sunita Rai',
        lastMessage: 'Price kati ho sukuti ko?',
        lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        sentimentScore: 0.1,
        aiSummary: 'Inquiring about the price of sukuti.',
        unreadCount: 0,
        avatarUrl: `https://i.pravatar.cc/150?u=cust_m_12345`,
        messages: [
             { id: 'msg4', from: 'customer', text: 'Price kati ho sukuti ko?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
             { id: 'msg5', from: 'business', text: 'Hajur, Rs. 350 per plate ho.', timestamp: new Date(Date.now() - 23.5 * 60 * 60 * 1000) },
        ]
    },
];

// Server Actions (Simulated)
export const getInventory = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInventory;
}

export const getOrders = async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return mockOrders;
}

export const getConversations = async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockConversations;
}

export const getConversationById = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockConversations.find(c => c.id === id) || null;
}
