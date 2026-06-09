import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import {
  GalleryIdCounter,
  GalleryIdCounterSchema,
} from './schemas/gallery-id-counter.schema';
import { GalleryService } from './gallery.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallery.name, schema: GallerySchema },
      { name: GalleryIdCounter.name, schema: GalleryIdCounterSchema },
    ]),
  ],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
