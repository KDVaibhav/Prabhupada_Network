import mongoose from 'mongoose';
import { z } from 'zod';

export const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  mediaType: { type: String, required: true, enum: ['image', 'video'] },
  url: { type: String, required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: false,
  },
  uploadedAt: { type: Date, default: Date.now },
});

export interface Gallery extends mongoose.Document {
  title: string;
  mediaType: 'image' | 'video';
  url: string;
  eventId?: string;
  uploadedAt: Date;
}

export const CreateGalleryDto = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  mediaType: z.enum(['image', 'video']),
  url: z.string().url({ message: 'Invalid URL' }),
  eventId: z.string().optional(),
});

export type CreateGalleryDto = z.infer<typeof CreateGalleryDto>;

export const UpdateGalleryDto = CreateGalleryDto.partial();

export type UpdateGalleryDto = z.infer<typeof UpdateGalleryDto>;
