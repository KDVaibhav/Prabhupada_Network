import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CreateCourseDto, UpdateCourseDto } from './course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel('Course') private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      const newCourse = new this.courseModel(createCourseDto);
      await newCourse.save();
      return { message: 'Course created successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating course', error);
    }
  }

  async findAll() {
    try {
      return await this.courseModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching courses', error);
    }
  }

  async findOne(id: string) {
    try {
      const course = await this.courseModel.findById(id);
      if (!course) {
        throw new BadRequestException('Course not found');
      }
      return course;
    } catch (error) {
      throw new BadRequestException('Error fetching course by ID', error);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true });
      if (!course) {
        throw new BadRequestException('Course not found');
      }
      return { message: 'Course updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating course', error);
    }
  }

  async delete(id: string) {
    try {
      const course = await this.courseModel.findByIdAndDelete(id);
      if (!course) {
        throw new BadRequestException('Course not found');
      }
      return { message: 'Course deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting course', error);
    }
  }
}
