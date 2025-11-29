'use server';

/**
 * @fileOverview Generates AI business responses in Romanch, considering Nepali festivals.
 *
 * - generateBusinessResponse - A function that generates a business response.
 * - GenerateBusinessResponseInput - The input type for the generateBusinessResponse function.
 * - GenerateBusinessResponseOutput - The return type for the generateBusinessResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getNepaliFestivals} from '@/utils/festival-calendar';

const GenerateBusinessResponseInputSchema = z.object({
  context: z.string().describe('Contextual information for the response, including product details or order information.'),
  userMessage: z.string().describe('The customer inquiry message.'),
});
export type GenerateBusinessResponseInput = z.infer<typeof GenerateBusinessResponseInputSchema>;

const GenerateBusinessResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response in Romanch.'),
});
export type GenerateBusinessResponseOutput = z.infer<typeof GenerateBusinessResponseOutputSchema>;

export async function generateBusinessResponse(input: GenerateBusinessResponseInput): Promise<GenerateBusinessResponseOutput> {
  return generateBusinessResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessResponsePrompt',
  input: {schema: GenerateBusinessResponseInputSchema},
  output: {schema: GenerateBusinessResponseOutputSchema},
  prompt: `You are a helpful AI assistant for a Nepali business. You speak 'Romanch' (Nepali mixed with English). You are polite.
  If the user asks about price, check the context provided.

  Current Festival Context: {{festivalContext}}
  Currency: NPR.

  Context: {{{context}}}
  User Message: {{{userMessage}}}
  Response: `,
});

const generateBusinessResponseFlow = ai.defineFlow(
  {
    name: 'generateBusinessResponseFlow',
    inputSchema: GenerateBusinessResponseInputSchema,
    outputSchema: GenerateBusinessResponseOutputSchema,
  },
  async input => {
    const today = new Date();
    const festivalContext = getNepaliFestivals(today)
      .map(festival => `${festival.name} (${festival.date.toLocaleDateString('en-NP')})`)
      .join(', ');

    const {output} = await prompt({...input, festivalContext});
    return output!;
  }
);
