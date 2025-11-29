'use server';

/**
 * @fileOverview Generates AI business responses in Romanch, considering Nepali festivals.
 *
 * - generateBusinessResponse - A function that generates a business response.
 * - GenerateBusinessResponseInput - The input type for the generateBusinessResponse function.
 * - GenerateBusinessResponseOutput - The return type for the generateBusinessResponse function.
 */

import {initAi} from '@/ai/genkit';
import {z} from 'genkit';
import {getNepaliFestivals} from '@/utils/festival-calendar';
import {db} from '@/db';
import {tenants} from '@/db/schema';
import {eq} from 'drizzle-orm';
import { GenkitError } from 'genkit';

const GenerateBusinessResponseInputSchema = z.object({
  tenantId: z.number().describe('The ID of the tenant to fetch the API key for.'),
  context: z.string().describe('Contextual information for the response, including product details or order information.'),
  userMessage: z.string().describe('The customer inquiry message.'),
});
export type GenerateBusinessResponseInput = z.infer<typeof GenerateBusinessResponseInputSchema>;

const GenerateBusinessResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response in Romanch.'),
});
export type GenerateBusinessResponseOutput = z.infer<typeof GenerateBusinessResponseOutputSchema>;

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

export async function generateBusinessResponse(input: GenerateBusinessResponseInput): Promise<GenerateBusinessResponseOutput> {
  const { apiKey, provider } = await getTenantAiConfig(input.tenantId);
  const ai = initAi(apiKey, provider);
  
  const prompt = ai.definePrompt({
    name: 'generateBusinessResponsePrompt',
    input: {schema: GenerateBusinessResponseInputSchema.extend({ festivalContext: z.string() })},
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
    async (flowInput) => {
      const today = new Date();
      const festivalContext = getNepaliFestivals(today)
        .map(festival => `${festival.name} (${festival.date.toLocaleDateString('en-NP')})`)
        .join(', ');

      const {output} = await prompt({...flowInput, festivalContext});
      return output!;
    }
  );

  return generateBusinessResponseFlow(input);
}
