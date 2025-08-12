import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, CreateEventDto, UpdateEventDto } from './event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel('Event') private eventModel: Model<Event>) {}

  async create(createEventDto: CreateEventDto) {
    try {
      const newEvent = new this.eventModel(createEventDto);
      await newEvent.save();
      return { message: 'Event created successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating event', error);
    }
  }

  async findAll() {
    try {
      const events = await this.eventModel.find();
      return events;
    } catch (error) {
      throw new BadRequestException('Error fetching events', error);
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.eventModel.findById(id);
      if (!event) {
        throw new BadRequestException('Event not found');
      }
      return event;
    } catch (error) {
      throw new BadRequestException('Error fetching event by ID', error);
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.eventModel.findByIdAndUpdate(
        id,
        updateEventDto,
        { new: true },
      );
      if (!event) {
        throw new BadRequestException('Event not found');
      }
      return { message: 'Event updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating event', error);
    }
  }

  async delete(id: string) {
    try {
      const event = await this.eventModel.findByIdAndDelete(id);
      if (!event) {
        throw new BadRequestException('Event not found');
      }
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting event', error);
    }
  }

  async updateSchedule(
    id: string,
    schedule: { fields: string[]; rows: string[][] },
  ) {
    return this.eventModel.findByIdAndUpdate(id, { schedule }, { new: true });
  }
}
