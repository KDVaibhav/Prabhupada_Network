import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { QueryService } from './query.service';
import { CreateQueryDto, UpdateQueryDto } from './query.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @SkipAuth()
  @Post()
  create(@Body() createQueryDto: CreateQueryDto) {
    return this.queryService.create(createQueryDto);
  }

  @Get()
  findAll() {
    return this.queryService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.queryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQueryDto: UpdateQueryDto) {
    return this.queryService.update(id, updateQueryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.queryService.delete(id);
  }
}
