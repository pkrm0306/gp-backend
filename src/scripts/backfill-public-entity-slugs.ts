/**
 * Backfill unique public `slug` fields on categories, manufacturers, and products.
 *
 * Usage:
 *   DRY_RUN=true  npm run migrate:public-entity-slugs
 *   DRY_RUN=false npm run migrate:public-entity-slugs
 *
 * Also runs automatically (non-dry) via service onModuleInit on API boot.
 */
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppModule } from '../app.module';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { allocateUniqueSlug } from '../common/utils/unique-slug.util';

type Counters = { scanned: number; updated: number; skipped: number };

async function backfillCollection(opts: {
  label: string;
  model: Model<any>;
  nameField: string;
  fallback: string;
  dryRun: boolean;
}): Promise<Counters> {
  const counters: Counters = { scanned: 0, updated: 0, skipped: 0 };
  const cursor = opts.model
    .find({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    })
    .select(`_id ${opts.nameField} slug`)
    .lean()
    .cursor();

  for await (const doc of cursor) {
    counters.scanned += 1;
    const name = String((doc as Record<string, unknown>)[opts.nameField] ?? '');
    const slug = await allocateUniqueSlug(
      name,
      async (candidate) => {
        const existing = await opts.model
          .findOne({
            slug: candidate,
            _id: { $ne: doc._id as Types.ObjectId },
          })
          .select('_id')
          .lean()
          .exec();
        return Boolean(existing);
      },
      { fallback: opts.fallback },
    );

    if (opts.dryRun) {
      console.log(`[dry-run] ${opts.label} ${doc._id} → ${slug}`);
      counters.updated += 1;
      continue;
    }

    await opts.model.updateOne({ _id: doc._id }, { $set: { slug } }).exec();
    counters.updated += 1;
  }

  return counters;
}

async function run() {
  const dryRun = String(process.env.DRY_RUN ?? 'true').toLowerCase() === 'true';
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const categoryModel = app.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );
    const manufacturerModel = app.get<Model<ManufacturerDocument>>(
      getModelToken(Manufacturer.name),
    );
    const productModel = app.get<Model<ProductDocument>>(
      getModelToken(Product.name),
    );

    console.log(`Backfill public entity slugs (dryRun=${dryRun})`);

    const categories = await backfillCollection({
      label: 'category',
      model: categoryModel,
      nameField: 'category_name',
      fallback: 'category',
      dryRun,
    });
    const manufacturers = await backfillCollection({
      label: 'manufacturer',
      model: manufacturerModel,
      nameField: 'manufacturerName',
      fallback: 'manufacturer',
      dryRun,
    });
    const products = await backfillCollection({
      label: 'product',
      model: productModel,
      nameField: 'productName',
      fallback: 'product',
      dryRun,
    });

    console.log(
      JSON.stringify(
        {
          dryRun,
          categories,
          manufacturers,
          products,
        },
        null,
        2,
      ),
    );

    if (!dryRun) {
      try {
        await categoryModel.syncIndexes();
        await manufacturerModel.syncIndexes();
        await productModel.syncIndexes();
        console.log('syncIndexes completed for category/manufacturer/product');
      } catch (err) {
        console.error('syncIndexes failed:', err);
      }
    }
  } finally {
    await app.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
