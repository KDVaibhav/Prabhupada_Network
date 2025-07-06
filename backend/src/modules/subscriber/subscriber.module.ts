import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberController } from './subscriber.controller';
import { SubscriberService } from './subscriber.service';
import { SubscriberSchema } from './subscriber.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subscriber', schema: SubscriberSchema }]),
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService],
})
export class SubscriberModule {}
