import mongoose from 'mongoose';
import { z } from 'zod';

export const SubscriberSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  phone: { type: String },

});

export interface Subscriber extends mongoose.Document {
  name?: string;
  email: string;
  phone?: string;
}

export const CreateSubscriberDto = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
});

export type CreateSubscriberDto = z.infer<typeof CreateSubscriberDto>;

export const UpdateSubscriberDto = CreateSubscriberDto.partial();

export type UpdateSubscriberDto = z.infer<typeof UpdateSubscriberDto>;
