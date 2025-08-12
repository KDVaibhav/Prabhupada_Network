import {
  Controller,
  Get,
  Post,
  Body
} from '@nestjs/common';
import { JoinUsService } from './join-us.service';
import { CreateJoinUsDto, UpdateJoinUsDto } from './join-us.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('join-us')
export class JoinUsController {
  constructor(private readonly joinUsService: JoinUsService) {}
  @SkipAuth()
  @Post()
  create(@Body() createJoinUsDto: CreateJoinUsDto) {
    return this.joinUsService.create(createJoinUsDto);
  }

  @Get()
  findAll() {
    return this.joinUsService.findAll();
  }
}
