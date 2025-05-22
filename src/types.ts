import type { LanguageModelV1 } from '@ai-sdk/provider';

// Re-export the LanguageModelV1 type to ensure proper type compatibility
export type { LanguageModelV1 };

// Export our model types with explicit type constraints
export type BurnCloudLanguageModel = LanguageModelV1;

export type BurnCloudProviderOptions = {
  models?: string[];

  /**
   * https://ai.burncloud.com/docs/use-cases/reasoning-tokens
   * One of `max_tokens` or `effort` is required.
   * If `exclude` is true, reasoning will be removed from the response. Default is false.
   */
  reasoning?: {
    exclude?: boolean;
  } & (
    | {
        max_tokens: number;
      }
    | {
        effort: 'high' | 'medium' | 'low';
      }
  );

  /**
   * A unique identifier representing your end-user, which can
   * help BurnCloud to monitor and detect abuse.
   */
  user?: string;
};

export type BurnCloudSharedSettings = BurnCloudProviderOptions & {
  /**
   * @deprecated use `reasoning` instead
   */
  includeReasoning?: boolean;

  extraBody?: Record<string, any>;
};
