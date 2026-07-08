require('dotenv').config();

async function main() {
  const { NestFactory } = require('@nestjs/core');
  const { AppModule } = require('./dist/app.module');
  const { ProductRegistrationService } = require('./dist/product-registration/product-registration.service');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  try {
    const svc = app.get(ProductRegistrationService);
    const result = await svc.adminListProducts({
      status: [2],
      page: 1,
      limit: 1,
      groupBy: 'urn',
    });
    console.log(
      JSON.stringify(
        {
          total: result.total,
          statusCounts: result.statusCounts,
        },
        null,
        2,
      ),
    );
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
