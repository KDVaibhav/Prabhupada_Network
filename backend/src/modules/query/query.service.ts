import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query, CreateQueryDto, UpdateQueryDto } from './query.schema';

@Injectable()
export class QueryService {
  constructor(@InjectModel('Query') private queryModel: Model<Query>) {}

  async create(createQueryDto: CreateQueryDto) {
    try {
      const newQuery = new this.queryModel(createQueryDto);
      await newQuery.save();
      return { message: 'Query submitted successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating query', error);
    }
  }

  async findAll() {
    try {
      return await this.queryModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching queries', error);
    }
  }

  async findOne(id: string) {
    try {
      const query = await this.queryModel.findById(id);
      if (!query) throw new BadRequestException('Query not found');
      return query;
    } catch (error) {
      throw new BadRequestException('Error fetching query by ID', error);
    }
  }

  async update(id: string, updateQueryDto: UpdateQueryDto) {
    try {
      const updated = await this.queryModel.findByIdAndUpdate(id, updateQueryDto, { new: true });
      if (!updated) throw new BadRequestException('Query not found');
      return { message: 'Query updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating query', error);
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.queryModel.findByIdAndDelete(id);
      if (!deleted) throw new BadRequestException('Query not found');
      return { message: 'Query deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting query', error);
    }
  }
}
