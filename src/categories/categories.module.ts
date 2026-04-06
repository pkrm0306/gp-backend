import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './schemas/category.schema';
import {
  CategoryIdCounter,
  CategoryIdCounterSchema,
} from './schemas/category-id-counter.schema';
import { Product, ProductSchema } from '../product-registration/schemas/product.schema';
import { ProductPlant, ProductPlantSchema } from '../product-registration/schemas/product-plant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: CategoryIdCounter.name, schema: CategoryIdCounterSchema },
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
