import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express, {
  urlencoded,
  Request,
  Response,
  NextFunction,
} from 'express';
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
    join(base, 'banners'),
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

/**
 * Serves `GET /uploads/**` from disk before Nest's router runs.
 * Otherwise Nest answers first with 404 and static middleware never runs.
 * Root matches every other `join(process.cwd(), 'uploads', ...)` write path.
 */
function mountUploadStaticOnExpress(server: express.Application) {
  const uploadsRoot = join(process.cwd(), 'uploads');
  server.use(
    '/uploads',
    express.static(uploadsRoot, { index: false, fallthrough: true }),
  );
  /** Legacy: DB has `/uploads/<file>` while the file lives in `uploads/categories/`. */
  server.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    const rel = String(req.path ?? '').replace(/^\/+/, '');
    if (!rel || rel.includes('/')) {
      next();
      return;
    }
    const candidate = join(uploadsRoot, 'categories', rel);
    if (existsSync(candidate)) {
      res.sendFile(candidate, (err) => {
        if (err) next(err);
      });
      return;
    }
    next();
  });
}

/** Legacy admin links used `/standards/{file}.pdf` before uploadFile() used `/uploads/standards/`. */
function mountLegacyStandardsFileRedirect(server: express.Application) {
  const uploadsRoot = join(process.cwd(), 'uploads');
  server.get('/standards/:filename', (req: Request, res: Response, next: NextFunction) => {
    const name = String(req.params.filename ?? '').trim();
    if (!name || name.includes('..') || name.includes('/')) {
      next();
      return;
    }
    const candidate = join(uploadsRoot, 'standards', name);
    if (!existsSync(candidate)) {
      next();
      return;
    }
    const encoded = name.split('/').map(encodeURIComponent).join('/');
    res.redirect(302, `/uploads/standards/${encoded}`);
  });
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
  'https://cursor-greenpro-admin-mern-dun.vercel.app',
  'https://greenpro-portals.vercel.app',
  'https://admin-nine-beta-48.vercel.app',
  'https://vendor-five-zeta.vercel.app',
  'https://cursor-greenpro-demo1.vercel.app',
  'https://greenpro-demo1.vercel.app',
  'https://demo1-portal-two.vercel.app',
  'https://admin-zwyy08rcy-prabhas-projects-0ea6425f.vercel.app',
  'https://demo1-admin-oq6t6e647-prabhas-projects-0ea6425f.vercel.app',
  'https://demo1-admin.vercel.app',
];

function buildCorsOrigins(): string[] {
  const deploymentOrigins = [
    process.env.RENDER_EXTERNAL_URL,
    process.env.APP_URL,
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ]
    .map((o) => String(o || '').trim())
    .filter(Boolean);
  const fromEnv =
    process.env.CORS_ORIGINS?.split(',')
      .map((o) => o.trim())
      .filter(Boolean) ?? [];
  return [
    ...new Set([...ALLOWED_CORS_ORIGINS, ...deploymentOrigins, ...fromEnv]),
  ];
}

async function bootstrap() {
  ensureUploadDirectories();

  const server = express();
  mountUploadStaticOnExpress(server);
  mountLegacyStandardsFileRedirect(server);

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  app.use(urlencoded({ extended: true, limit: '1mb' }));

  const corsOrigins = buildCorsOrigins();
  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header)
      if (!origin) return callback(null, true);

      // Reflect exact origin (required when Authorization header is sent)
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
        return callback(null, origin);
      }

      if (corsOrigins.includes(origin)) return callback(null, origin);

      if (/^https:\/\/([a-z0-9-]+\.)*onrender\.com$/i.test(origin)) {
        return callback(null, origin);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-Access-Token',
      'X-Request-Id',
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
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();