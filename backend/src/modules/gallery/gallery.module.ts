import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GallerySchema } from './gallery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Gallery', schema: GallerySchema }]),
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
