import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { DonationSchema } from './donation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Donation', schema: DonationSchema }]),
  ],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
