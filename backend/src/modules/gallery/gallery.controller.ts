import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from './gallery.schema';
import { SkipAuth } from '../auth/skip-auth.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  create(@Body() createGalleryDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryDto);
  }

  @SkipAuth()
  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @SkipAuth()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    return this.galleryService.update(id, updateGalleryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.galleryService.delete(id);
  }
}
