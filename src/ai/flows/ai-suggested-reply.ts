'use server';

/**
 * @fileOverview AI-powered suggested replies for customer messages in Romanch, considering conversation context and Nepali festivals.
 *
 * - generateSuggestedReply - A function that generates a suggested reply.
 * - AISuggestedReplyInput - The input type for the generateSuggestedReply function.
 * - AISuggestedReplyOutput - The return type for the generateSuggestedReply function.
 */

import {initAi} from '@/ai/genkit';
import {z} from 'genkit';
import {db} from '@/db';
import {tenants} from '@/db/schema';
import {eq} from 'drizzle-orm';
import { GenkitError } from 'genkit';

const AISuggestedReplyInputSchema = z.object({
  tenantId: z.number().describe('The ID of the tenant to fetch the API key for.'),
  conversationHistory: z
    .string()
    .describe('The recent conversation history between the business and the customer.'),
  userMessage: z.string().describe('The latest message from the customer.'),
  currentFestival: z.string().optional().describe('The current Nepali festival, if any.'),
  businessContext: z.string().describe('Contextual information about the business, such as inventory or policies.'),
});
export type AISuggestedReplyInput = z.infer<typeof AISuggestedReplyInputSchema>;

const AISuggestedReplyOutputSchema = z.object({
  suggestedReply: z
    .string()
    .describe('An AI-generated suggested reply to the customer message, in Romanch.'),
});
export type AISuggestedReplyOutput = z.infer<typeof AISuggestedReplyOutputSchema>;

async function getTenantAiConfig(tenantId: number) {
    if (!db) {
        throw new GenkitError({
            status: 'UNAVAILABLE',
            message: 'Database connection is not available.'
        });
    }
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
        columns: {
            llmApiKey: true,
            llmProvider: true,
        }
    });

    if (!tenant || !tenant.llmApiKey || !tenant.llmProvider) {
        throw new GenkitError({
            status: 'NOT_FOUND',
            message: `API key or provider for tenant ${tenantId} not found.`,
        });
    }
    return { apiKey: tenant.llmApiKey, provider: tenant.llmProvider };
}

export async function generateSuggestedReply(
  input: AISuggestedReplyInput
): Promise<AISuggestedReplyOutput> {
  const { apiKey, provider } = await getTenantAiConfig(input.tenantId);
  const ai = initAi(apiKey, provider);

  const prompt = ai.definePrompt({
    name: 'aiSuggestedReplyPrompt',
    input: {schema: AISuggestedReplyInputSchema},
    output: {schema: AISuggestedReplyOutputSchema},
    prompt: `You are a helpful AI assistant for a Nepali business. You speak 'Romanch' (Nepali mixed with English). You are polite.

    Current Festival Context: {{#if currentFestival}}{{{currentFestival}}}{{else}}No festival currently.{{/if}}

    Conversation History:
    {{conversationHistory}}

    Latest Message:
    {{userMessage}}

    Business Context:
    {{businessContext}}

    Generate a short, relevant reply in Romanch.  If the user asks about price, check the context provided. Currency: NPR.`,
  });

  const generateSuggestedReplyFlow = ai.defineFlow(
    {
      name: 'generateSuggestedReplyFlow',
      inputSchema: AISuggestedReplyInputSchema,
      outputSchema: AISuggestedReplyOutputSchema,
    },
    async (flowInput) => {
      const {output} = await prompt(flowInput);
      return output!;
    }
  );

  return generateSuggestedReplyFlow(input);
}
