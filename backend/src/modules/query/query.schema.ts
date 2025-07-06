import mongoose from 'mongoose';
import { z } from 'zod';

export const QuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
});

export interface Query extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const CreateQueryDto = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

export type CreateQueryDto = z.infer<typeof CreateQueryDto>;

export const UpdateQueryDto = CreateQueryDto.partial();

export type UpdateQueryDto = z.infer<typeof UpdateQueryDto>;
