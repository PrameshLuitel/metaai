'use server';

import {NextRequest, NextResponse} from 'next/server';
import {db} from '@/db';
import {tenants} from '@/db/schema';
import {eq} from 'drizzle-orm';

/**
 * Handles Meta webhook verification (GET) and incoming messages (POST).
 *
 * Webhook Verification:
 * Meta sends a GET request to this endpoint to verify its authenticity.
 * The request contains `hub.mode`, `hub.challenge`, and `hub.verify_token`.
 * We must check if `hub.verify_token` matches the one stored for the tenant
 * and respond with `hub.challenge`.
 *
 * Incoming Messages:
 * Meta sends a POST request with the message payload.
 * For now, we will log this payload to the console. In a production app,
 * this is where you would process the message, save it to the database,

 */
export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = searchParams.get('hub.verify_token');

  // A tenant identifier is needed to look up the correct verify token.
  // This could be passed as a query parameter or derived from the host.
  // For this example, we'll assume a query param `tenant_subdomain`.
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
      // Fetch the tenant's expected verify token from your database
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
  try {
    const payload = await req.json();
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

    // TODO: Process the incoming message payload here.
    // 1. Identify the tenant based on the request.
    // 2. Parse the message content, sender ID, etc.
    // 3. Save the message to the `conversations` table in your database.
    // 4. Potentially trigger a push notification or an AI summary job.

    return NextResponse.json({status: 'success'}, {status: 200});
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return NextResponse.json({error: 'Internal server error'}, {status: 500});
  }
}
