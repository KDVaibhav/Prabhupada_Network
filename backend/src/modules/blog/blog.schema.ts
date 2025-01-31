import mongoose from 'mongoose';
import { z } from 'zod';

export const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  imageUri: {type: String, required: true},
  publishedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
});

export interface Blog extends mongoose.Document {
  title: string;
  content: string;
  author: string;
  imageUri: string;
  publishedAt: Date;
  tags: string[];
}

export const CreateBlogDto = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  imageUri: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateBlogDto = z.infer<typeof CreateBlogDto>;

export const UpdateBlogDto = CreateBlogDto.partial();

export type UpdateBlogDto = z.infer<typeof UpdateBlogDto>;
