"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var platform_express_1 = require("@nestjs/platform-express");
var express_1 = require("express");
/** Bulk product registration and large JSON payloads exceed Express default 100kb. */
var JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '15mb';
var path_1 = require("path");
var fs_1 = require("fs");
var app_module_1 = require("./app.module");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
var response_interceptor_1 = require("./common/interceptors/response.interceptor");
function ensureUploadDirectories() {
    var base = (0, path_1.join)(process.cwd(), 'uploads');
    var emailTemplates = (0, path_1.join)(process.cwd(), 'email_templates');
    var dirs = [
        base,
        emailTemplates,
        (0, path_1.join)(emailTemplates, 'cronJob'),
        (0, path_1.join)(base, 'categories'),
        (0, path_1.join)(base, 'banners'),
        (0, path_1.join)(base, 'manufacturers'),
        (0, path_1.join)(base, 'events'),
        (0, path_1.join)(base, 'gallery'),
        (0, path_1.join)(base, 'summits'),
        (0, path_1.join)(base, 'team-members'),
    ];
    for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
        var dir = dirs_1[_i];
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        }
    }
}
/**
 * Serves `GET /uploads/**` from disk before Nest's router runs.
 * Otherwise Nest answers first with 404 and static middleware never runs.
 * Root matches every other `join(process.cwd(), 'uploads', ...)` write path.
 */
function mountUploadStaticOnExpress(server) {
    var uploadsRoot = (0, path_1.join)(process.cwd(), 'uploads');
    var emailTemplatesRoot = (0, path_1.join)(process.cwd(), 'email_templates');
    server.use('/uploads', express_1.default.static(uploadsRoot, { index: false, fallthrough: true }));
    server.use('/email_templates', express_1.default.static(emailTemplatesRoot, { index: false, fallthrough: true }));
    /** Legacy: DB has `/uploads/<file>` while the file lives in `uploads/categories/`. */
    server.use('/uploads', function (req, res, next) {
        var _a;
        var rel = String((_a = req.path) !== null && _a !== void 0 ? _a : '').replace(/^\/+/, '');
        if (!rel || rel.includes('/')) {
            next();
            return;
        }
        var candidate = (0, path_1.join)(uploadsRoot, 'categories', rel);
        if ((0, fs_1.existsSync)(candidate)) {
            res.sendFile(candidate, function (err) {
                if (err)
                    next(err);
            });
            return;
        }
        next();
    });
}
/** Legacy admin links used `/standards/{file}.pdf` before uploadFile() used `/uploads/standards/`. */
function mountLegacyStandardsFileRedirect(server) {
    var uploadsRoot = (0, path_1.join)(process.cwd(), 'uploads');
    server.get('/standards/:filename', function (req, res, next) {
        var _a;
        var name = String((_a = req.params.filename) !== null && _a !== void 0 ? _a : '').trim();
        if (!name || name.includes('..') || name.includes('/')) {
            next();
            return;
        }
        var candidate = (0, path_1.join)(uploadsRoot, 'standards', name);
        if (!(0, fs_1.existsSync)(candidate)) {
            next();
            return;
        }
        var encoded = name.split('/').map(encodeURIComponent).join('/');
        res.redirect(302, "/uploads/standards/".concat(encoded));
    });
}
var ALLOWED_CORS_ORIGINS = [
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
    'https://greenpro-new-design-admin.vercel.app',
    'https://greenpro-new-design-vendor.vercel.app',
    'https://updateddesign.vercel.app',
];
function buildCorsOrigins() {
    var _a, _b;
    var deploymentOrigins = [
        process.env.RENDER_EXTERNAL_URL,
        process.env.APP_URL,
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
    ]
        .map(function (o) { return String(o || '').trim(); })
        .filter(Boolean);
    var fromEnv = (_b = (_a = process.env.CORS_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',').map(function (o) { return o.trim(); }).filter(Boolean)) !== null && _b !== void 0 ? _b : [];
    return __spreadArray([], new Set(__spreadArray(__spreadArray(__spreadArray([], ALLOWED_CORS_ORIGINS, true), deploymentOrigins, true), fromEnv, true)), true);
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var server, app, corsOrigins, config, document, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ensureUploadDirectories();
                    server = (0, express_1.default)();
                    server.use((0, express_1.json)({ limit: JSON_BODY_LIMIT }));
                    server.use((0, express_1.urlencoded)({ extended: true, limit: JSON_BODY_LIMIT }));
                    mountUploadStaticOnExpress(server);
                    mountLegacyStandardsFileRedirect(server);
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server))];
                case 1:
                    app = _a.sent();
                    corsOrigins = buildCorsOrigins();
                    app.enableCors({
                        origin: function (origin, callback) {
                            // Allow non-browser clients (no Origin header)
                            if (!origin)
                                return callback(null, true);
                            // Reflect exact origin (required when Authorization header is sent)
                            if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
                                return callback(null, origin);
                            }
                            if (corsOrigins.includes(origin))
                                return callback(null, origin);
                            if (/^https:\/\/([a-z0-9-]+\.)*onrender\.com$/i.test(origin)) {
                                return callback(null, origin);
                            }
                            // Vercel production + preview deployments (hostname varies per branch).
                            if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin)) {
                                return callback(null, origin);
                            }
                            return callback(new Error("CORS blocked for origin: ".concat(origin)), false);
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
                        exposedHeaders: [
                            'Content-Disposition',
                            'Content-Type',
                            'X-GreenPro-Certificate-Count',
                            'X-Export-Row-Count',
                            'X-Export-Has-Data',
                        ],
                        optionsSuccessStatus: 204,
                        preflightContinue: false,
                    });
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true,
                    }));
                    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
                    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
                    config = new swagger_1.DocumentBuilder()
                        .setTitle('GreenPro API')
                        .setDescription('Production-ready NestJS backend API')
                        .setVersion('1.0')
                        .addBearerAuth()
                        .build();
                    document = swagger_1.SwaggerModule.createDocument(app, config);
                    swagger_1.SwaggerModule.setup('api', app, document, {
                        swaggerOptions: {
                            persistAuthorization: true,
                        },
                    });
                    port = process.env.PORT || 3000;
                    return [4 /*yield*/, app.listen(port, '0.0.0.0')];
                case 2:
                    _a.sent();
                    console.log("Application is running on: http://localhost:".concat(port));
                    console.log("Swagger documentation: http://localhost:".concat(port, "/api"));
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
