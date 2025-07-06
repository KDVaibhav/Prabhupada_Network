import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './course.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UsePipes(new ZodValidationPipe(CreateCourseDto))
  @Post('create')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.courseService.findAll();
  }
  
  @SkipAuth()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courseService.delete(id);
  }
}
