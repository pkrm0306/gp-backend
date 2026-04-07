import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function ensureUploadDirectories() {
  const base = join(process.cwd(), 'uploads');
  const dirs = [
    base,
    join(base, 'manufacturers'),
    join(base, 'team-members'),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

/** Origins always allowed (API + common local frontends). */
const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5173',
  'https://greenpro-vendor.vercel.app',
];

function isCorsOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }
  const fromEnv =
    process.env.CORS_ORIGINS?.split(',')
      .map((o) => o.trim())
      .filter(Boolean) ?? [];
  const allowList = new Set([...DEFAULT_CORS_ORIGINS, ...fromEnv]);
  if (allowList.has(origin)) {
    return true;
  }
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol === 'https:' && hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  ensureUploadDirectories();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // Explicit CORS middleware (avoids flaky preflight handling and guarantees OPTIONS won't 404).
  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    const allowed = isCorsOriginAllowed(origin);
    if (origin && allowed) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
    if (process.env.CORS_CREDENTIALS === 'true') {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    res.header(
      'Access-Control-Allow-Methods',
      'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type,Authorization,Accept,X-Requested-With,X-Access-Token,Origin',
    );

    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('GreenPro API')
    .setDescription('Production-ready NestJS backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port,'0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
