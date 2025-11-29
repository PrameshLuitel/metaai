'use server';

/**
 * @fileOverview AI-powered suggested replies for customer messages in Romanch, considering conversation context and Nepali festivals.
 *
 * - generateSuggestedReply - A function that generates a suggested reply.
 * - AISuggestedReplyInput - The input type for the generateSuggestedReply function.
 * - AISuggestedReplyOutput - The return type for the generateSuggestedReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestedReplyInputSchema = z.object({
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

export async function generateSuggestedReply(
  input: AISuggestedReplyInput
): Promise<AISuggestedReplyOutput> {
  return generateSuggestedReplyFlow(input);
}

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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
