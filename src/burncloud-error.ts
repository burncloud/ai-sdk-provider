import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';
import { z } from 'zod';

export const BurnCloudErrorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
    type: z.string(),
    param: z.any().nullable(),
    code: z.string().nullable(),
  }),
});

export type BurnCloudErrorData = z.infer<typeof BurnCloudErrorResponseSchema>;

export const burncloudFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: BurnCloudErrorResponseSchema,
  errorToMessage: (data) => data.error.message,
});
