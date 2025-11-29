export type Tenant = {
  id: string;
  subdomain: string;
  businessName: string;
  tier: 'free' | 'pro' | 'enterprise';
};

export type User = {
  id: string; // auth_id
  role: 'admin' | 'staff' | 'viewer';
  tenantId: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type NepaliAddress = {
  province: string;
  district: string;
  municipality: string;
  ward: number;
  tole: string;
  landmark?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  variant: string;
  priceNpr: number;
  stock: number;
  lowStockThreshold: number;
  imageUrl?: string;
};

export type OrderItem = {
  inventoryId: string;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Cancelled' | 'Udhaari';
  paymentMethod: 'eSewa' | 'Khalti' | 'FonePay' | 'Cash' | 'Udhaari';
  totalAmount: number;
  proofScreenshotUrl: string | null;
  createdAt: Date;
  items: OrderItem[];
};

export type ChatMessage = {
  id: string;
  from: 'customer' | 'business';
  text: string;
  timestamp: Date;
}

export type Conversation = {
  id: string;
  platform: 'WhatsApp' | 'Messenger' | 'Instagram';
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageAt: Date;
  sentimentScore: number;
  aiSummary: string | null;
  unreadCount: number;
  avatarUrl?: string;
  messages: ChatMessage[];
};
