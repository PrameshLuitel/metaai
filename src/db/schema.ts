import {
  pgTable,
  text,
  varchar,
  serial,
  integer,
  decimal,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff', 'viewer']);
export const tenantTierEnum = pgEnum('tenant_tier', ['free', 'pro', 'enterprise']);
export const orderStatusEnum = pgEnum('order_status', ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled', 'Udhaari']);
export const paymentMethodEnum = pgEnum('payment_method', ['eSewa', 'Khalti', 'FonePay', 'Cash', 'Udhaari']);
export const conversationPlatformEnum = pgEnum('conversation_platform', ['WhatsApp', 'Messenger', 'Instagram']);

// Tenants Table
export const tenants = pgTable('tenants', {
  id: serial('id').primaryKey(),
  subdomain: varchar('subdomain', { length: 255 }).unique().notNull(),
  businessName: varchar('business_name', { length: 255 }).notNull(),
  tier: tenantTierEnum('tier').default('free').notNull(),
  geminiApiKey: text('gemini_api_key'), // New field for tenant-specific API key
  metaAppId: text('meta_app_id'),
  metaAppSecret: text('meta_app_secret'),
  metaWebhookVerifyToken: text('meta_webhook_verify_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Users Table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(), // Using auth_id from a service like Clerk/Firebase Auth
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('staff').notNull(),
  tenantId: integer('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Inventory Table
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  variant: varchar('variant', { length: 255 }),
  priceNpr: decimal('price_npr', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(0),
  imageUrl: text('image_url'),
  tenantId: integer('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders Table
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  status: orderStatusEnum('status').default('Pending').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  proofScreenshotUrl: text('proof_screenshot_url'),
  items: jsonb('items').notNull(), // JSON array of { inventoryId: number, quantity: number, price: number }
  tenantId: integer('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Conversations Table
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  platform: conversationPlatformEnum('platform').notNull(),
  customerId: varchar('customer_id', { length: 255 }).notNull(), // e.g., phone number for WhatsApp
  customerName: varchar('customer_name', { length: 255 }),
  sentimentScore: decimal('sentiment_score', { precision: 3, scale: 2 }).default('0').notNull(),
  aiSummary: text('ai_summary'),
  avatarUrl: text('avatar_url'),
  tenantId: integer('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
});


// Relations
export const tenantRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  inventory: many(inventory),
  orders: many(orders),
  conversations: many(conversations),
}));

export const userRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));
