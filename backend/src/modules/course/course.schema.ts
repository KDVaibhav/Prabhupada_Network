import mongoose from 'mongoose';
import { z } from 'zod';

// Mongoose Schema Definition
export const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },  // e.g., "3 months", "6 weeks"
  price: { type: Number, required: true },
  imageUrl: { type: String, default: '' },     // Optional image for the course
  publishedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },  // Whether the course is currently active or not
});

// TypeScript Interface for Course
export interface Course extends mongoose.Document {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: number;
  imageUrl: string;
  publishedAt: Date;
  isActive: boolean;
}

// Zod Schema for Create Course DTO
export const CreateCourseDto = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  instructor: z.string().min(1, { message: 'Instructor name is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  price: z.number().positive({ message: 'Price must be a positive number' }),
  imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),
  isActive: z.boolean().optional(),
});

// TypeScript Type Inference from Zod Schema
export type CreateCourseDto = z.infer<typeof CreateCourseDto>;

// Zod Schema for Update Course DTO (Partial)
export const UpdateCourseDto = CreateCourseDto.partial();

export type UpdateCourseDto = z.infer<typeof UpdateCourseDto>;

