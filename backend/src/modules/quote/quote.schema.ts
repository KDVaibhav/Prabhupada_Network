import mongoose from 'mongoose';
import { z } from 'zod';

// Mongoose Schema Definition
export const QuoteSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
});

// TypeScript Interface for Quote
export interface Quote extends mongoose.Document {
  quote: string;
  location: string;
  date: Date;
}

// Zod Schema for Create Quote DTO
export const CreateQuoteDto = z.object({
  quote: z.string().min(1, { message: 'Quote is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  date: z.date(),
});

export type CreateQuoteDto = z.infer<typeof CreateQuoteDto>;

// Zod Schema for Update Quote DTO (Partial)
export const UpdateQuoteDto = CreateQuoteDto.partial();

export type UpdateQuoteDto = z.infer<typeof UpdateQuoteDto>;
