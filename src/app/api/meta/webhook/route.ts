'use server';

import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/db';
import {conversations, messages, tenants} from '@/db/schema';
import {and, eq} from 'drizzle-orm';

/**
 * Handles Meta webhook verification (GET) and incoming messages (POST).
 */
export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = searchParams.get('hub.verify_token');

  const tenantSubdomain = searchParams.get('tenant_subdomain');

  if (!tenantSubdomain) {
    console.error('Webhook verification failed: Missing tenant_subdomain');
    return NextResponse.json({error: 'Tenant identifier is required'}, {status: 400});
  }

  if (mode === 'subscribe' && verifyToken) {
    try {
      if (!db) {
        throw new Error('Database not connected');
      }
      const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.subdomain, tenantSubdomain),
        columns: {
          metaWebhookVerifyToken: true,
        },
      });

      if (tenant && tenant.metaWebhookVerifyToken === verifyToken) {
        console.log('Webhook verified successfully for tenant:', tenantSubdomain);
        return new NextResponse(challenge, {status: 200});
      } else {
        console.warn('Webhook verification failed: Token mismatch for tenant:', tenantSubdomain);
        return NextResponse.json({error: 'Verification token mismatch'}, {status: 403});
      }
    } catch (error) {
      console.error('Error during webhook verification:', error);
      return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
  } else {
    return NextResponse.json({error: 'Invalid verification request'}, {status: 400});
  }
}

export async function POST(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const tenantSubdomain = searchParams.get('tenant_subdomain');
  
  if (!db) {
      console.error('Webhook processing failed: Database not connected');
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  if (!tenantSubdomain) {
    console.error('Webhook processing failed: Missing tenant_subdomain');
    return NextResponse.json({error: 'Tenant identifier is required'}, {status: 400});
  }

  try {
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.subdomain, tenantSubdomain),
    });

    if (!tenant) {
        console.error(`Webhook processing failed: Tenant not found for subdomain ${tenantSubdomain}`);
        return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const payload = await req.json();
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

    // Process WhatsApp messages
    if (payload.object === 'whatsapp_business_account') {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const messageData = change.value.messages[0];
            if (messageData && messageData.type === 'text') {
              const from = messageData.from; // Customer's phone number
              const customerName = change.value.contacts[0].profile.name;
              const text = messageData.text.body;

              // 1. Find or create the conversation
              let conversation = await db.query.conversations.findFirst({
                where: and(eq(conversations.tenantId, tenant.id), eq(conversations.customerId, from)),
              });

              if (!conversation) {
                const newConversation = await db.insert(conversations).values({
                    tenantId: tenant.id,
                    customerId: from,
                    customerName: customerName,
                    platform: 'WhatsApp',
                    avatarUrl: `https://i.pravatar.cc/150?u=${from}`
                }).returning();
                conversation = newConversation[0];
              }

              if (conversation) {
                 // 2. Save the message
                await db.insert(messages).values({
                    conversationId: conversation.id,
                    sender: 'customer',
                    content: text,
                });

                // 3. Update last message timestamp
                await db.update(conversations)
                    .set({ lastMessageAt: new Date() })
                    .where(eq(conversations.id, conversation.id));

                // TODO: Here you could trigger AI summarization or other jobs
              }
            }
          }
        }
      }
    }

    return NextResponse.json({status: 'success'}, {status: 200});
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
}
