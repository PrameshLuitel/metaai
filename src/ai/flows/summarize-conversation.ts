// SummarizeConversation user story implementation.

'use server';

/**
 * @fileOverview Summarizes customer conversations and analyzes sentiment.
 *
 * - summarizeConversation - A function that handles the conversation summarization and sentiment analysis process.
 * - SummarizeConversationInput - The input type for the summarizeConversation function.
 * - SummarizeConversationOutput - The return type for the summarizeConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationInputSchema = z.object({
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

export async function summarizeConversation(input: SummarizeConversationInput): Promise<SummarizeConversationOutput> {
  return summarizeConversationFlow(input);
}

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
  async input => {
    const {output} = await summarizeConversationPrompt(input);
    return output!;
  }
);
