import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, CreateDonationDto, UpdateDonationDto } from './donation.schema';

@Injectable()
export class DonationService {
  constructor(@InjectModel('Donation') private donationModel: Model<Donation>) {}

  async create(createDonationDto: CreateDonationDto) {
    try {
      const newDonation = new this.donationModel(createDonationDto);
      await newDonation.save();
      return { message: 'Donation created successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating donation', error);
    }
  }

  async findAll() {
    try {
      return await this.donationModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching donations', error);
    }
  }

  async findOne(id: string) {
    try {
      const donation = await this.donationModel.findById(id);
      if (!donation) {
        throw new BadRequestException('Donation not found');
      }
      return donation;
    } catch (error) {
      throw new BadRequestException('Error fetching donation by ID', error);
    }
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {
    try {
      const donation = await this.donationModel.findByIdAndUpdate(id, updateDonationDto, { new: true });
      if (!donation) {
        throw new BadRequestException('Donation not found');
      }
      return { message: 'Donation updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating donation', error);
    }
  }

  async delete(id: string) {
    try {
      const donation = await this.donationModel.findByIdAndDelete(id);
      if (!donation) {
        throw new BadRequestException('Donation not found');
      }
      return { message: 'Donation deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting donation', error);
    }
  }
}
