import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateJoinUsDto,
  UpdateJoinUsDto,
  JoinUs,
  JoinUsSchema,
} from './join-us.schema';

@Injectable()
export class JoinUsService {
  constructor(@InjectModel('JoinUs') private joinUsModel: Model<JoinUs>) {}

  async create(createJoinUsDto: CreateJoinUsDto) {
    const user = await this.joinUsModel.findOne({
      email: createJoinUsDto.email,
    });
    if (user) {
      const userId: string = user._id.toString();
      return this.update(userId, createJoinUsDto);
    }
    const createdJoinUs = new this.joinUsModel(createJoinUsDto);
    return await createdJoinUs.save();
  }

  async findAll() {
    return await this.joinUsModel.find().exec();
  }

  async findOne(id: string) {
    return await this.joinUsModel.findById(id).exec();
  }

  async update(id: string, updateJoinUsDto: UpdateJoinUsDto) {
    return await this.joinUsModel
      .findByIdAndUpdate(id, updateJoinUsDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.joinUsModel.findByIdAndDelete(id).exec();
  }
}
