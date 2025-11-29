import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { llmProviderEnum } from '@/db/schema';
import type { z } from 'zod';

// Define provider-specific plugins here. In a real app, you might lazy-load them.
const providerPlugins = {
    gemini: (apiKey: string) => googleAI({ apiKey }),
    // openai: (apiKey: string) => openAI({ apiKey }), // Example for another provider
};

type LlmProvider = z.infer<typeof llmProviderEnum>;

/**
 * Initializes a tenant-specific Genkit instance based on the provider.
 * @param apiKey The API key for the LLM provider.
 * @param provider The LLM provider to use.
 * @returns A Genkit instance configured with the provided API key and provider.
 */
export function initAi(apiKey: string, provider: LlmProvider = 'gemini') {
  if (!apiKey) {
    throw new GenkitError({
      status: 'INVALID_ARGUMENT',
      message: 'LLM API key is required.',
    });
  }

  const getPlugin = providerPlugins[provider];

  if (!getPlugin) {
    throw new GenkitError({
        status: 'INVALID_ARGUMENT',
        message: `Unsupported LLM provider: ${provider}. Supported providers are: ${Object.keys(providerPlugins).join(', ')}`
    });
  }

  return genkit({
    plugins: [getPlugin(apiKey)],
  });
}
