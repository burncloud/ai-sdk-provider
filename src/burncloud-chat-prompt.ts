// Type for BurnCloud Cache Control following Anthropic's pattern
export type BurnCloudCacheControl = { type: 'ephemeral' };

export type BurnCloudChatPrompt = Array<ChatCompletionMessageParam>;

export type ChatCompletionMessageParam =
  | ChatCompletionSystemMessageParam
  | ChatCompletionUserMessageParam
  | ChatCompletionAssistantMessageParam
  | ChatCompletionToolMessageParam;

export interface ChatCompletionSystemMessageParam {
  role: 'system';
  content: string;
  cache_control?: BurnCloudCacheControl;
}

export interface ChatCompletionUserMessageParam {
  role: 'user';
  content: string | Array<ChatCompletionContentPart>;
  cache_control?: BurnCloudCacheControl;
}

export type ChatCompletionContentPart =
  | ChatCompletionContentPartText
  | ChatCompletionContentPartImage
  | ChatCompletionContentPartFile;

export interface ChatCompletionContentPartFile {
  type: 'file';
  file: {
    filename: string;
    file_data: string;
  };
  cache_control?: BurnCloudCacheControl;
}

export interface ChatCompletionContentPartImage {
  type: 'image_url';
  image_url: {
    url: string;
  };
  cache_control?: BurnCloudCacheControl;
}

export interface ChatCompletionContentPartText {
  type: 'text';
  text: string;
  cache_control?: BurnCloudCacheControl;
}

export interface ChatCompletionAssistantMessageParam {
  role: 'assistant';
  content?: string | null;
  tool_calls?: Array<ChatCompletionMessageToolCall>;
  cache_control?: BurnCloudCacheControl;
}

export interface ChatCompletionMessageToolCall {
  type: 'function';
  id: string;
  function: {
    arguments: string;
    name: string;
  };
}

export interface ChatCompletionToolMessageParam {
  role: 'tool';
  content: string;
  tool_call_id: string;
  cache_control?: BurnCloudCacheControl;
}
