'use server';

/**
 * @fileOverview Summarizes customer conversations and analyzes sentiment.
 *
 * - summarizeConversation - A function that handles the conversation summarization and sentiment analysis process.
 * - SummarizeConversationInput - The input type for the summarizeConversation function.
 * - SummarizeConversationOutput - The return type for the summarizeConversation function.
 */

import {initAi} from '@/ai/genkit';
import {z} from 'genkit';
import {db} from '@/db';
import {tenants} from '@/db/schema';
import {eq} from 'drizzle-orm';
import { GenkitError } from 'genkit';


const SummarizeConversationInputSchema = z.object({
  tenantId: z.number().describe('The ID of the tenant to fetch the API key for.'),
  platform: z.string().describe('The platform where the conversation took place (e.g., WhatsApp, Messenger).'),
  customerId: z.string().describe('The unique identifier of the customer.'),
  conversationText: z.string().describe('The complete text of the conversation.'),
});
export type SummarizeConversationInput = z.infer<typeof SummarizeConversationInputSchema>;

const SummarizeConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
  sentimentScore: z.number().describe('A numerical score indicating the overall sentiment of the conversation (-1 to 1).'),
  suggestedReply: z.string().optional().describe('An AI-suggested reply to the customer.'),
});
export type SummarizeConversationOutput = z.infer<typeof SummarizeConversationOutputSchema>;

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

export async function summarizeConversation(input: SummarizeConversationInput): Promise<SummarizeConversationOutput> {
  const { apiKey, provider } = await getTenantAiConfig(input.tenantId);
  const ai = initAi(apiKey, provider);

  const summarizeConversationPrompt = ai.definePrompt({
    name: 'summarizeConversationPrompt',
    input: {schema: SummarizeConversationInputSchema},
    output: {schema: SummarizeConversationOutputSchema},
    prompt: `You are an AI assistant helping a Nepali business summarize customer conversations.

    Analyze the following conversation and provide a summary, sentiment score, and a suggested reply.

    Platform: {{{platform}}}
    Customer ID: {{{customerId}}}
    Conversation:
    {{#if conversationText}}
    {{conversationText}}
    {{else}}
    No conversation text provided.
    {{/if}}

    Respond in Nepali mixed with English (Romanch).
    Current Festival Context: [Insert Date Check]. Currency: NPR.
    Format the sentiment score as a number between -1 and 1.
  `,
  });

  const summarizeConversationFlow = ai.defineFlow(
    {
      name: 'summarizeConversationFlow',
      inputSchema: SummarizeConversationInputSchema,
      outputSchema: SummarizeConversationOutputSchema,
    },
    async (flowInput) => {
      const {output} = await summarizeConversationPrompt(flowInput);
      return output!;
    }
  );

  return summarizeConversationFlow(input);
}
