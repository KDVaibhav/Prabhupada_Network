import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto, UpdateDonationDto } from './donation.schema';

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post('create')
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationService.create(createDonationDto);
  }

  @Get()
  findAll() {
    return this.donationService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.donationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationService.update(id, updateDonationDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.donationService.delete(id);
  }
}
