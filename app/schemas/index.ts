import * as z from 'zod';

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/);
const hexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export const searchHistoryItemSchema = z.object({
  startId: z.string(),
  startName: z.string(),
  startLine: z.string(),
  startLineColor: hexColorSchema,
  endId: z.string(),
  endName: z.string(),
  endLine: z.string(),
  startTime: timeSchema,
  endTime: timeSchema,
  endLineColor: hexColorSchema,
});

export type SearchHistoryItem = z.infer<typeof searchHistoryItemSchema>;

export const searchConditionSchema = z.object({
  departureStationId: z.number().int().positive(),
  arrivalStationId: z.number().int().positive(),
  searchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: timeSchema,
  endTime: timeSchema,
});

export type SearchConditionType = z.infer<typeof searchConditionSchema>;
