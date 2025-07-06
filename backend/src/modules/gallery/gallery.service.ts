import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, CreateGalleryDto, UpdateGalleryDto } from './gallery.schema';

@Injectable()
export class GalleryService {
  constructor(@InjectModel('Gallery') private galleryModel: Model<Gallery>) {}

  async create(createGalleryDto: CreateGalleryDto) {
    try {
      const newGalleryItem = new this.galleryModel(createGalleryDto);
      await newGalleryItem.save();
      return { message: 'Gallery item created successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating gallery item', error);
    }
  }

  async findAll() {
    try {
      return await this.galleryModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching gallery items', error);
    }
  }

  async findOne(id: string) {
    try {
      const galleryItem = await this.galleryModel.findById(id);
      if (!galleryItem) {
        throw new BadRequestException('Gallery item not found');
      }
      return galleryItem;
    } catch (error) {
      throw new BadRequestException('Error fetching gallery item by ID', error);
    }
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    try {
      const galleryItem = await this.galleryModel.findByIdAndUpdate(
        id,
        updateGalleryDto,
        { new: true },
      );
      if (!galleryItem) {
        throw new BadRequestException('Gallery item not found');
      }
      return { message: 'Gallery item updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating gallery item', error);
    }
  }

  async delete(id: string) {
    try {
      const galleryItem = await this.galleryModel.findByIdAndDelete(id);
      if (!galleryItem) {
        throw new BadRequestException('Gallery item not found');
      }
      return { message: 'Gallery item deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting gallery item', error);
    }
  }
}
