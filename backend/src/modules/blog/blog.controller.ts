import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './blog.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateBlogDto))
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateBlogDto))
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
