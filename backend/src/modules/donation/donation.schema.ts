import mongoose from 'mongoose';
import { z } from 'zod';

export const DonationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, default: '' },
  donationDate: { type: Date, default: Date.now },
});

export interface Donation extends mongoose.Document {
  donorName: string;
  amount: number;
  message: string;
  donationDate: Date;
}

export const CreateDonationDto = z.object({
  donorName: z.string().min(1, { message: 'Donor Name is required' }),
  amount: z.number().positive({ message: 'Amount must be positive' }),
  message: z.string().optional(),
});

export type CreateDonationDto = z.infer<typeof CreateDonationDto>;

export const UpdateDonationDto = CreateDonationDto.partial();

export type UpdateDonationDto = z.infer<typeof UpdateDonationDto>;
