import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quote, CreateQuoteDto, UpdateQuoteDto } from './quote.schema';

@Injectable()
export class QuoteService {
  constructor(@InjectModel('Quote') private quoteModel: Model<Quote>) {}

  async create(createQuoteDto: CreateQuoteDto) {
    try {
      const newQuote = new this.quoteModel(createQuoteDto);
      await newQuote.save();
      console.log(newQuote)
      return { message: 'Quote added successfully' };
    } catch (error) {
      throw new BadRequestException('Error creating quote', error);
    }
  }

  async findAll() {
    try {
      return await this.quoteModel.find();
    } catch (error) {
      throw new BadRequestException('Error fetching quotes', error);
    }
  }

  async findOne(id: string) {
    try {
      const quote = await this.quoteModel.findById(id);
      if (!quote) {
        throw new BadRequestException('Quote not found');
      }
      return quote;
    } catch (error) {
      throw new BadRequestException('Error fetching quote by ID', error);
    }
  }

  async update(id: string, updateQuoteDto: UpdateQuoteDto) {
    try {
      const quote = await this.quoteModel.findByIdAndUpdate(id, updateQuoteDto, { new: true });
      if (!quote) {
        throw new BadRequestException('Quote not found');
      }
      return { message: 'Quote updated successfully' };
    } catch (error) {
      throw new BadRequestException('Error updating quote', error);
    }
  }

  async delete(id: string) {
    try {
      const quote = await this.quoteModel.findByIdAndDelete(id);
      if (!quote) {
        throw new BadRequestException('Quote not found');
      }
      return { message: 'Quote deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting quote', error);
    }
  }
}
