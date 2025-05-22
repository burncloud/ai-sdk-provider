import type {
  BurnCloudChatModelId,
  BurnCloudChatSettings,
} from './burncloud-chat-settings';
import type {
  BurnCloudCompletionModelId,
  BurnCloudCompletionSettings,
} from './burncloud-completion-settings';
import type { BurnCloudProviderSettings } from './burncloud-provider';

import { loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';

import { BurnCloudChatLanguageModel } from './burncloud-chat-language-model';
import { BurnCloudCompletionLanguageModel } from './burncloud-completion-language-model';

/**
@deprecated Use `createBurnCloud` instead.
 */
export class BurnCloud {
  /**
Use a different URL prefix for API calls, e.g. to use proxy servers.
The default prefix is `https://ai.burncloud.com/v1`.
   */
  readonly baseURL: string;

  /**
API key that is being send using the `Authorization` header.
It defaults to the `BURNCLOUD_API_KEY` environment variable.
 */
  readonly apiKey?: string;

  /**
Custom headers to include in the requests.
   */
  readonly headers?: Record<string, string>;

  /**
   * Creates a new BurnCloud provider instance.
   */
  constructor(options: BurnCloudProviderSettings = {}) {
    this.baseURL =
      withoutTrailingSlash(options.baseURL ?? options.baseUrl) ??
      'https://ai.burncloud.com/v1';
    this.apiKey = options.apiKey;
    this.headers = options.headers;
  }

  private get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: 'BURNCLOUD_API_KEY',
          description: 'BurnCloud',
        })}`,
        ...this.headers,
      }),
    };
  }

  chat(modelId: BurnCloudChatModelId, settings: BurnCloudChatSettings = {}) {
    return new BurnCloudChatLanguageModel(modelId, settings, {
      provider: 'burncloud.chat',
      ...this.baseConfig,
      compatibility: 'strict',
      url: ({ path }) => `${this.baseURL}${path}`,
    });
  }

  completion(
    modelId: BurnCloudCompletionModelId,
    settings: BurnCloudCompletionSettings = {},
  ) {
    return new BurnCloudCompletionLanguageModel(modelId, settings, {
      provider: 'burncloud.completion',
      ...this.baseConfig,
      compatibility: 'strict',
      url: ({ path }) => `${this.baseURL}${path}`,
    });
  }
}
