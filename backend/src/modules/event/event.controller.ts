import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './event.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventService.delete(id);
  }

  @Post(':id/schedule')
  async addOrUpdateSchedule(
    @Param('id') id: string,
    @Body() scheduleDto: { fields: string[]; rows: string[][] },
  ) {
    return this.eventService.updateSchedule(id, scheduleDto);
  }
}
