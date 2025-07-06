import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, CreateBlogDto, UpdateBlogDto } from './blog.schema';

@Injectable()
export class BlogService {
  constructor(@InjectModel('Blog') private blogModel: Model<Blog>) {}

  async create(createBlogDto: CreateBlogDto) {
    try {
      console.log(createBlogDto.imageUrl)
      const newBlog = new this.blogModel(createBlogDto);
      await newBlog.save();
      return { message: 'Blog created successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating blog', error);
    }
  }

  async findAll() {
    try {
      return await this.blogModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching blogs', error);
    }
  }

  async findOne(id: string) {
    try {
      const blog = await this.blogModel.findById(id);
      if (!blog) {
        throw new BadRequestException('Blog not found');
      }
      return blog;
    } catch (error) {
      throw new BadRequestException('Error fetching blog by ID', error);
    }
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    try {
      const blog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, {
        new: true,
      });
      if (!blog) {
        throw new BadRequestException('Blog not found');
      }
      return { message: 'Blog updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating blog', error);
    }
  }

  async delete(id: string) {
    try {
      const blog = await this.blogModel.findByIdAndDelete(id);
      if (!blog) {
        throw new BadRequestException('Blog not found');
      }
      return { message: 'Blog deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting blog', error);
    }
  }
}
