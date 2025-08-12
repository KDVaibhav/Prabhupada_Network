import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JoinUsService } from './join-us.service';
import { JoinUsController } from './join-us.controller';
import { JoinUsSchema } from './join-us.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'JoinUs', schema: JoinUsSchema }]),
  ],
  controllers: [JoinUsController],
  providers: [JoinUsService],
})
export class JoinUsModule {}
