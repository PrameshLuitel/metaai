import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
// To add a new provider, import its Genkit plugin, e.g.:
// import {openAI} from 'genkitx-openai';

// Define provider-specific plugins here.
// The key (e.g., 'gemini', 'openai') should match what users enter in the settings.
const providerPlugins = {
    gemini: (apiKey: string) => googleAI({ apiKey }),
    // openai: (apiKey: string) => openAI({ apiKey }), // Example for another provider
};

type SupportedProviders = keyof typeof providerPlugins;

/**
 * Initializes a tenant-specific Genkit instance based on the provider.
 * @param apiKey The API key for the LLM provider.
 * @param provider The LLM provider to use (as a string).
 * @returns A Genkit instance configured with the provided API key and provider.
 */
export function initAi(apiKey: string, provider: string = 'gemini') {
  if (!apiKey) {
    throw new GenkitError({
      status: 'INVALID_ARGUMENT',
      message: 'LLM API key is required.',
    });
  }

  const getPlugin = providerPlugins[provider as SupportedProviders];

  if (!getPlugin) {
    throw new GenkitError({
        status: 'INVALID_ARGUMENT',
        message: `Unsupported LLM provider: "${provider}". Supported providers are: ${Object.keys(providerPlugins).join(', ')}`
    });
  }

  return genkit({
    plugins: [getPlugin(apiKey)],
  });
}
