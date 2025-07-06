import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto, UpdateQuoteDto } from './quote.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto) {
    console.log(createQuoteDto);
    return this.quoteService.create(createQuoteDto);
  }
  @SkipAuth()
  @Get()
  findAll() {
    return this.quoteService.findAll();
  }
  @SkipAuth()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.quoteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.quoteService.delete(id);
  }
}
