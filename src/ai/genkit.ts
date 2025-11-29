import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Global AI instance with a default key for development or when a tenant key isn't available.
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY || 'invalid_key'})],
  model: 'googleai/gemini-2.5-flash',
});

/**
 * Initializes a tenant-specific Genkit instance.
 * @param apiKey The Gemini API key for the tenant.
 * @returns A Genkit instance configured with the provided API key.
 */
export function initAi(apiKey: string) {
  if (!apiKey) {
    throw new GenkitError({
      status: 'INVALID_ARGUMENT',
      message: 'Gemini API key is required.',
    });
  }
  return genkit({
    plugins: [googleAI({apiKey})],
    model: 'googleai/gemini-2.5-flash',
  });
}
