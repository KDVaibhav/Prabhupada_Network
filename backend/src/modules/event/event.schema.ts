import mongoose from 'mongoose';
import { optional, z } from 'zod';

export const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['parent', 'child'], default: 'child' },
  parentEventId: { type: String, default: '' },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  schedule: {
    fields: [String],
    rows: [[String]],
  },
});

export interface Event extends mongoose.Document {
  title: string;
  description: string;
  type: string;
  parentEventId: string;
  date: Date;
  location: string;
  imageUrl: string;
}

export const CreateEventDto = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  parent: z.string(),
  parentEventId: z.string().optional(),
  date: z.date(),
  location: z.string().min(1, { message: 'Location is required' }),
  imageUrl: z.string().optional(),
});

export type CreateEventDto = z.infer<typeof CreateEventDto>;

export const UpdateEventDto = CreateEventDto.partial();

export type UpdateEventDto = z.infer<typeof UpdateEventDto>;
