import mongoose from 'mongoose';
import { z } from 'zod';

export const JoinUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: [{ type: String }], // Array of selected services
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export interface JoinUs extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  services: string[];
  message?: string;
  createdAt: Date;
}

export const CreateJoinUsDto = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  services: z.array(z.string()).min(1, { message: 'At least one service must be selected' }),
  message: z.string().optional(),
});

export type CreateJoinUsDto = z.infer<typeof CreateJoinUsDto>;

export const UpdateJoinUsDto = CreateJoinUsDto.partial();

export type UpdateJoinUsDto = z.infer<typeof UpdateJoinUsDto>;