import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { QuerySchema } from './query.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Query', schema: QuerySchema }]),
  ],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
