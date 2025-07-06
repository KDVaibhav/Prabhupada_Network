import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { QuoteSchema } from './quote.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quote', schema: QuoteSchema }]),
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
