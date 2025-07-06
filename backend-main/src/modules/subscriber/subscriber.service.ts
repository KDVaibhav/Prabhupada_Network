import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscriber, CreateSubscriberDto, UpdateSubscriberDto } from './subscriber.schema';

@Injectable()
export class SubscriberService {
  constructor(@InjectModel('Subscriber') private subscriberModel: Model<Subscriber>) {}

  async create(createSubscriberDto: CreateSubscriberDto) {
    try {
      const newSubscriber = new this.subscriberModel(createSubscriberDto);
      await newSubscriber.save();
      return { message: 'Subscribed successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating subscriber', error);
    }
  }

  async findAll() {
    try {
      return await this.subscriberModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching subscribers', error);
    }
  }

  async findOne(id: string) {
    try {
      const subscriber = await this.subscriberModel.findById(id);
      if (!subscriber) throw new BadRequestException('Subscriber not found');
      return subscriber;
    } catch (error) {
      throw new BadRequestException('Error fetching subscriber by ID', error);
    }
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto) {
    try {
      const updated = await this.subscriberModel.findByIdAndUpdate(id, updateSubscriberDto, { new: true });
      if (!updated) throw new BadRequestException('Subscriber not found');
      return { message: 'Subscriber updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating subscriber', error);
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.subscriberModel.findByIdAndDelete(id);
      if (!deleted) throw new BadRequestException('Subscriber not found');
      return { message: 'Subscriber deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting subscriber', error);
    }
  }
}
