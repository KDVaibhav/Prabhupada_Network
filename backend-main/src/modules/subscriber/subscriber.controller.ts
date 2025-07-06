import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto, UpdateSubscriberDto } from './subscriber.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}
  @SkipAuth()
  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscriberService.create(createSubscriberDto);
  }

  @Get()
  findAll() {
    return this.subscriberService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.subscriberService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
    return this.subscriberService.update(id, updateSubscriberDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subscriberService.delete(id);
  }
}
