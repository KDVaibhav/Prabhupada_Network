import mongoose from 'mongoose';
import { z } from 'zod';

export const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, default: '' },
});

export interface Event extends mongoose.Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string;
}

export const CreateEventDto = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  date: z.date(),
  location: z.string().min(1, { message: 'Location is required' }),
  imageUrl: z.string().optional(),
});

export type CreateEventDto = z.infer<typeof CreateEventDto>;

export const UpdateEventDto = CreateEventDto.partial();

export type UpdateEventDto = z.infer<typeof UpdateEventDto>;
