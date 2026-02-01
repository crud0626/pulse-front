import * as z from 'zod';

const User = z.object({
  name: z.string(),
});

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);

export const searchHistoryItemSchema = z.object({
  startId: z.string(),
  startName: z.string(),
  startLine: z.string(),
  endId: z.string(),
  endName: z.string(),
  endLine: z.string(),
  startTime: timeSchema,
  endTime: timeSchema,
});

export type SearchHistoryItem = z.infer<typeof searchHistoryItemSchema>;
