import mongoose from 'mongoose';
import { z } from 'zod';

export const UserSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '', unique: true },
  password: { type: String, default: '' },
  otp: { type: String, default: '' },
  otpExpiresAt: { type: Date, default: Date.now },
});

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpiresAt: Date;
}

export const CreateUserDto = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

// TypeScript Type Inference from Zod Schema
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = CreateUserDto.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const ForgetPasswordDto = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z
    .string()
    .min(6, { message: 'OTP must be at least 6 characters' })
    .optional(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .optional(),
});

export type ForgetPasswordDto = z.infer<typeof ForgetPasswordDto>;