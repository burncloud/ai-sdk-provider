# BurnCloud Provider for Vercel AI SDK

The BurnCloud provider for the Vercel AI SDK gives access to over 100 large language model on the BurnCloud chat and completion APIs.

# Supported models

You can find the latest list of models supported by [BurnCloud](https://ai.burncloud.com/pricing) here.

Package require:

- ai:4.1.46
- @burncloud/ai-sdk-provider:1.0.2

Example:

```ts
import { createBurnCloud } from '@burncloud/ai-sdk-provider';
import { streamText } from 'ai';

// how to get the api key? please visit https://ai.burncloud.com
const burncloud = createBurnCloud({ apiKey: 'sk-123abc123abc123abc123abc123abc123abc' });
const model = burncloud('claude-3-7-sonnet-20250219', {
  extraBody: {
    reasoning: {
      max_tokens: 10,
    },
  },
});

console.log('Sending request...');
const response = await streamText({
  model,
  messages: [{ role: 'user', content: 'Please describe what a quantum computer is.' }],
});
console.log('Response received...');

// Print all properties of the response object
console.log('Response keys:', Object.keys(response));

// Use response.baseStream to read stream data
const reader = response.baseStream.getReader();
let result = '';
console.log('Starting to read stream data...');

let count = 0;
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    console.log('Stream data reading completed');
    break;
  }
  
  count++;
  console.log(`Reading chunk ${count}:`, value);
  console.log('Data type:', typeof value);
  
  // If value is ArrayBuffer or ArrayBufferView
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    result += new TextDecoder().decode(value);
  }
  // If value is an object
  else if (typeof value === 'object' && value !== null) {
    result += JSON.stringify(value);
  }
  // If value is a string
  else if (typeof value === 'string') {
    result += value;
  }
  // Other types
  else {
    result += String(value);
  }
}

console.log('Final result:', result);
```
