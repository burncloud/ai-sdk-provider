import type {
  BurnCloudChatModelId,
  BurnCloudChatSettings,
} from './burncloud-chat-settings';
import type {
  BurnCloudCompletionModelId,
  BurnCloudCompletionSettings,
} from './burncloud-completion-settings';

import { loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';

import { BurnCloudChatLanguageModel } from './burncloud-chat-language-model';
import { BurnCloudCompletionLanguageModel } from './burncloud-completion-language-model';

export type { BurnCloudCompletionSettings };

export interface BurnCloudProvider {
  (
    modelId: BurnCloudChatModelId,
    settings?: BurnCloudCompletionSettings,
  ): BurnCloudCompletionLanguageModel;
  (
    modelId: BurnCloudChatModelId,
    settings?: BurnCloudChatSettings,
  ): BurnCloudChatLanguageModel;

  languageModel(
    modelId: BurnCloudChatModelId,
    settings?: BurnCloudCompletionSettings,
  ): BurnCloudCompletionLanguageModel;
  languageModel(
    modelId: BurnCloudChatModelId,
    settings?: BurnCloudChatSettings,
  ): BurnCloudChatLanguageModel;

  /**
Creates a BurnCloud chat model for text generation.
   */
  chat(
    modelId: BurnCloudChatModelId,
    settings?: BurnCloudChatSettings,
  ): BurnCloudChatLanguageModel;

  /**
Creates a BurnCloud completion model for text generation.
   */
  completion(
    modelId: BurnCloudCompletionModelId,
    settings?: BurnCloudCompletionSettings,
  ): BurnCloudCompletionLanguageModel;
}

export interface BurnCloudProviderSettings {
  /**
Base URL for the BurnCloud API calls.
     */
  baseURL?: string;

  /**
@deprecated Use `baseURL` instead.
     */
  baseUrl?: string;

  /**
API key for authenticating requests.
     */
  apiKey?: string;

  /**
Custom headers to include in the requests.
     */
  headers?: Record<string, string>;

  /**
BurnCloud compatibility mode. Should be set to `strict` when using the BurnCloud API,
and `compatible` when using 3rd party providers. In `compatible` mode, newer
information such as streamOptions are not being sent. Defaults to 'compatible'.
   */
  compatibility?: 'strict' | 'compatible';

  /**
Custom fetch implementation. You can use it as a middleware to intercept requests,
or to provide a custom fetch implementation for e.g. testing.
    */
  fetch?: typeof fetch;

  /**
A JSON object to send as the request body to access BurnCloud features & upstream provider features.
  */
  extraBody?: Record<string, unknown>;
}

/**
Create a BurnCloud provider instance.
 */
export function createBurnCloud(
  options: BurnCloudProviderSettings = {},
): BurnCloudProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
    'https://ai.burncloud.com/v1';

  // we default to compatible, because strict breaks providers like Groq:
  const compatibility = options.compatibility ?? 'compatible';

  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'BURNCLOUD_API_KEY',
      description: 'BurnCloud',
    })}`,
    ...options.headers,
  });

  const createChatModel = (
    modelId: BurnCloudChatModelId,
    settings: BurnCloudChatSettings = {},
  ) =>
    new BurnCloudChatLanguageModel(modelId, settings, {
      provider: 'burncloud.chat',
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch,
      extraBody: options.extraBody,
    });

  const createCompletionModel = (
    modelId: BurnCloudCompletionModelId,
    settings: BurnCloudCompletionSettings = {},
  ) =>
    new BurnCloudCompletionLanguageModel(modelId, settings, {
      provider: 'burncloud.completion',
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      compatibility,
      fetch: options.fetch,
      extraBody: options.extraBody,
    });

  const createLanguageModel = (
    modelId: BurnCloudChatModelId | BurnCloudCompletionModelId,
    settings?: BurnCloudChatSettings | BurnCloudCompletionSettings,
  ) => {
    if (new.target) {
      throw new Error(
        'The BurnCloud model function cannot be called with the new keyword.',
      );
    }

    if (modelId === 'openai/gpt-3.5-turbo-instruct') {
      return createCompletionModel(
        modelId,
        settings as BurnCloudCompletionSettings,
      );
    }

    return createChatModel(modelId, settings as BurnCloudChatSettings);
  };

  const provider = function (
    modelId: BurnCloudChatModelId | BurnCloudCompletionModelId,
    settings?: BurnCloudChatSettings | BurnCloudCompletionSettings,
  ) {
    return createLanguageModel(modelId, settings);
  };

  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;

  return provider as BurnCloudProvider;
}

/**
Default BurnCloud provider instance. It uses 'strict' compatibility mode.
 */
export const burncloud = createBurnCloud({
  compatibility: 'strict', // strict for BurnCloud API
});
