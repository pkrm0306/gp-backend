import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { urlencoded, Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

function ensureUploadDirectories() {
  const base = join(process.cwd(), 'uploads');
  const dirs = [
    base,
    join(base, 'categories'),
    join(base, 'manufacturers'),
    join(base, 'events'),
    join(base, 'team-members'),
  ];
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}

const ALLOWED_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
  'http://127.0.0.1:3004',
  'http://127.0.0.1:5173',
  'https://cursor-greenpro-admin-mern-cyan.vercel.app',
  'https://cursor-greenpro-website-mern-seven.vercel.app',
  'https://cursor-greenpro-admin-mern-dun.vercel.app/',

];

function buildCorsOrigins(): string[] {
  const fromEnv =
    process.env.CORS_ORIGINS?.split(',')
      .map((o) => o.trim())
      .filter(Boolean) ?? [];
  return [...new Set([...ALLOWED_CORS_ORIGINS, ...fromEnv])];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  ensureUploadDirectories();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  /**
   * Legacy static fallback:
   * Some older records store category images as `/uploads/<filename>` but the actual file
   * may live under `uploads/categories/<filename>`. If the request is a plain filename
   * (no nested path), try serving it from `uploads/categories` as a fallback.
   */
  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    const rel = String(req.path ?? '').replace(/^\/+/, '');
    if (!rel || rel.includes('/')) {
      next();
      return;
    }
    const candidate = join(process.cwd(), 'uploads', 'categories', rel);
    if (existsSync(candidate)) {
      res.sendFile(candidate);
      return;
    }
    next();
  });

  app.use(urlencoded({ extended: true, limit: '1mb' }));

  const corsOrigins = buildCorsOrigins();
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-Access-Token',
      'Origin',
    ],
    credentials: process.env.CORS_CREDENTIALS === 'true',
    optionsSuccessStatus: 204,
    preflightContinue: false,
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
