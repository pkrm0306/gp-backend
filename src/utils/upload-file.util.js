"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPublicFileUrl = buildPublicFileUrl;
exports.extractUploadsKeyFromAbsoluteUrl = extractUploadsKeyFromAbsoluteUrl;
exports.resolveStoredUploadUrl = resolveStoredUploadUrl;
exports.resolvePublicUploadUrl = resolvePublicUploadUrl;
exports.uploadFile = uploadFile;
exports.uploadCertifiedProductImage = uploadCertifiedProductImage;
exports.uploadUrnAssessmentReport = uploadUrnAssessmentReport;
exports.deleteUploadedFile = deleteUploadedFile;
exports.normalizeUploadsRelativePath = normalizeUploadsRelativePath;
exports.deleteMetaFromDocumentLink = deleteMetaFromDocumentLink;
exports.deleteUploadedFileByDocumentLink = deleteUploadedFileByDocumentLink;
var client_s3_1 = require("@aws-sdk/client-s3");
var fs_1 = require("fs");
var path_1 = require("path");
var s3_config_1 = require("../config/s3.config");
function safeBaseName(original) {
    return ((0, path_1.basename)(original || 'file').replace(/[^a-zA-Z0-9._-]/g, '_') || 'file');
}
function normalizeFolder(folderName) {
    return folderName.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}
function buildS3PublicUrl(bucket, region, key) {
    var encodedKey = key
        .split('/')
        .map(function (segment) { return encodeURIComponent(segment); })
        .join('/');
    return "https://".concat(bucket, ".s3.").concat(region, ".amazonaws.com/").concat(encodedKey);
}
function buildPublicFileUrl(bucket, region, key) {
    var encodedKey = key
        .split('/')
        .map(function (segment) { return encodeURIComponent(segment); })
        .join('/');
    if (!(0, s3_config_1.preferDirectS3PublicUrl)()) {
        var cloudFrontBase = (0, s3_config_1.getCloudFrontBaseUrl)();
        if (cloudFrontBase) {
            return "".concat(cloudFrontBase.replace(/\/+$/, ''), "/").concat(encodedKey);
        }
    }
    return buildS3PublicUrl(bucket, region, key);
}
/** Extract `uploads/...` object key from a public S3 or CloudFront URL. */
function extractUploadsKeyFromAbsoluteUrl(url) {
    try {
        var pathname = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, '');
        return pathname.startsWith('uploads/') ? pathname : null;
    }
    catch (_a) {
        return null;
    }
}
/**
 * Resolve a stored upload path or URL to the public URL clients should use.
 * When S3 + CloudFront are configured, returns a CloudFront URL (unless
 * `AWS_S3_USE_DIRECT_PUBLIC_URL=true`). Rewrites legacy S3 URLs and `/uploads/...` paths.
 */
function resolveStoredUploadUrl(stored) {
    var raw = String(stored !== null && stored !== void 0 ? stored : '').trim();
    if (!raw) {
        return '';
    }
    if (!(0, s3_config_1.isS3Configured)()) {
        return raw;
    }
    var bucket = (0, s3_config_1.getS3Bucket)();
    var region = (0, s3_config_1.getS3Region)();
    if (/^https?:\/\//i.test(raw)) {
        var key = extractUploadsKeyFromAbsoluteUrl(raw);
        if (key) {
            return buildPublicFileUrl(bucket, region, key);
        }
        return raw;
    }
    var rel = normalizeUploadsRelativePath(raw);
    if (rel) {
        var key = rel.startsWith('uploads/') ? rel : "uploads/".concat(rel);
        return buildPublicFileUrl(bucket, region, key);
    }
    return raw;
}
/**
 * Resolve a stored upload path to the URL public website clients should load.
 * Prefers CloudFront/S3 when configured; otherwise builds an absolute URL from
 * `localBaseUrl` or `API_BASE_URL`, or returns a root-relative `/uploads/...` path.
 */
function resolvePublicUploadUrl(stored, localBaseUrl) {
    var _a;
    var raw = String(stored !== null && stored !== void 0 ? stored : '').trim();
    if (!raw || raw.toLowerCase() === 'string') {
        return null;
    }
    var resolved = resolveStoredUploadUrl(raw);
    var candidate = resolved || raw;
    if (/^https?:\/\//i.test(candidate)) {
        return candidate;
    }
    var pathPart = candidate.replace(/^\/+/, '');
    var underUploads = pathPart.startsWith('uploads/')
        ? pathPart
        : "uploads/".concat(pathPart);
    var segments = underUploads.split('/').map(function (s) { return encodeURIComponent(s); });
    var base = String((_a = localBaseUrl !== null && localBaseUrl !== void 0 ? localBaseUrl : process.env.API_BASE_URL) !== null && _a !== void 0 ? _a : '')
        .trim()
        .replace(/\/$/, '');
    if (base) {
        return "".concat(base, "/").concat(segments.join('/'));
    }
    return "/".concat(segments.join('/'));
}
/**
 * Upload a Multer **memory** file to S3 (if configured) or to `uploads/{folderName}/`.
 */
function uploadFile(file, folderName) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBuffer, folder, baseName, client, bucket, region, key, dir, dest, relativePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileBuffer = (file === null || file === void 0 ? void 0 : file.buffer) && file.buffer.length > 0
                        ? file.buffer
                        : (file === null || file === void 0 ? void 0 : file.path) && (0, fs_1.existsSync)(file.path)
                            ? (0, fs_1.readFileSync)(file.path)
                            : null;
                    if (!fileBuffer) {
                        throw new Error('uploadFile requires file buffer or valid file.path');
                    }
                    folder = normalizeFolder(folderName);
                    baseName = "".concat(Date.now(), "_").concat(safeBaseName(file.originalname));
                    if (!(0, s3_config_1.isS3Configured)()) return [3 /*break*/, 2];
                    client = (0, s3_config_1.getS3Client)();
                    bucket = (0, s3_config_1.getS3Bucket)();
                    region = (0, s3_config_1.getS3Region)();
                    key = "uploads/".concat(folder, "/").concat(baseName);
                    return [4 /*yield*/, client.send(new client_s3_1.PutObjectCommand({
                            Bucket: bucket,
                            Key: key,
                            Body: fileBuffer,
                            ContentType: file.mimetype || 'application/octet-stream',
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            storage: 's3',
                            fileName: baseName,
                            relativePath: "".concat(folder, "/").concat(baseName),
                            fileUrl: buildPublicFileUrl(bucket, region, key),
                            s3Key: key,
                        }];
                case 2:
                    dir = (0, path_1.join)(process.cwd(), 'uploads', folder);
                    (0, fs_1.mkdirSync)(dir, { recursive: true });
                    dest = (0, path_1.join)(dir, baseName);
                    (0, fs_1.writeFileSync)(dest, fileBuffer);
                    relativePath = "".concat(folder, "/").concat(baseName);
                    if ((file === null || file === void 0 ? void 0 : file.path) && (0, fs_1.existsSync)(file.path)) {
                        try {
                            (0, fs_1.unlinkSync)(file.path);
                        }
                        catch (_b) {
                            /* ignore */
                        }
                    }
                    return [2 /*return*/, {
                            storage: 'local',
                            fileName: baseName,
                            relativePath: relativePath,
                            fileUrl: "/uploads/".concat(relativePath.split('/').map(encodeURIComponent).join('/')),
                        }];
            }
        });
    });
}
/** Certified product images — stored under `uploads/products/` with public CDN URL when configured. */
function uploadCertifiedProductImage(file) {
    return __awaiter(this, void 0, void 0, function () {
        var uploaded, fileUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadFile(file, 'products')];
                case 1:
                    uploaded = _a.sent();
                    fileUrl = resolveStoredUploadUrl(uploaded.fileUrl) || uploaded.fileUrl;
                    return [2 /*return*/, __assign(__assign({}, uploaded), { fileUrl: fileUrl })];
            }
        });
    });
}
/** Admin assessment report for a certified URN — stored under `uploads/urns/{urnNo}/assessment-reports/`. */
function uploadUrnAssessmentReport(file, urnNo) {
    return __awaiter(this, void 0, void 0, function () {
        var safeUrn, uploaded, fileUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    safeUrn = String(urnNo !== null && urnNo !== void 0 ? urnNo : '')
                        .trim()
                        .replace(/[^a-zA-Z0-9_-]/g, '_');
                    return [4 /*yield*/, uploadFile(file, "urns/".concat(safeUrn, "/assessment-reports"))];
                case 1:
                    uploaded = _a.sent();
                    fileUrl = resolveStoredUploadUrl(uploaded.fileUrl) || uploaded.fileUrl;
                    return [2 /*return*/, __assign(__assign({}, uploaded), { fileUrl: fileUrl })];
            }
        });
    });
}
/**
 * Remove file from S3 or local disk based on stored metadata.
 */
function deleteUploadedFile(params) {
    return __awaiter(this, void 0, void 0, function () {
        var storage_type, s3_key, relativePath, client, _a, rel, full;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    storage_type = params.storage_type, s3_key = params.s3_key, relativePath = params.relativePath;
                    if (!(storage_type === 's3' && s3_key)) return [3 /*break*/, 5];
                    if (!(0, s3_config_1.isS3Configured)()) {
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    client = (0, s3_config_1.getS3Client)();
                    return [4 /*yield*/, client.send(new client_s3_1.DeleteObjectCommand({
                            Bucket: (0, s3_config_1.getS3Bucket)(),
                            Key: s3_key,
                        }))];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
                case 5:
                    rel = relativePath.replace(/^\/+/, '');
                    full = (0, path_1.join)(process.cwd(), 'uploads', rel);
                    try {
                        if ((0, fs_1.existsSync)(full)) {
                            (0, fs_1.unlinkSync)(full);
                        }
                    }
                    catch (_c) {
                        /* ignore */
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/** Strip `/uploads/` prefix and decode URI segments for local/S3 relative paths. */
function normalizeUploadsRelativePath(input) {
    var value = String(input !== null && input !== void 0 ? input : '').trim().replace(/\\/g, '/');
    if (!value) {
        return '';
    }
    if (/^https?:\/\//i.test(value)) {
        try {
            value = decodeURIComponent(new URL(value).pathname);
        }
        catch (_a) {
            return '';
        }
    }
    value = value.replace(/^\/+/, '');
    if (value.startsWith('uploads/')) {
        value = value.slice('uploads/'.length);
    }
    return value
        .split('/')
        .map(function (segment) {
        try {
            return decodeURIComponent(segment);
        }
        catch (_a) {
            return segment;
        }
    })
        .join('/');
}
/**
 * Infer delete metadata from a value stored in `all_product_documents.documentLink`.
 */
function deleteMetaFromDocumentLink(documentLink) {
    var raw = String(documentLink !== null && documentLink !== void 0 ? documentLink : '').trim();
    if (!raw) {
        return null;
    }
    var relativePath = normalizeUploadsRelativePath(raw);
    if (!relativePath) {
        return null;
    }
    if (/^https?:\/\//i.test(raw) && (0, s3_config_1.isS3Configured)()) {
        return {
            storage_type: 's3',
            s3_key: "uploads/".concat(relativePath),
            relativePath: relativePath,
        };
    }
    return {
        storage_type: 'local',
        relativePath: relativePath,
    };
}
/** Delete a certification/product document file from S3 or local disk. */
function deleteUploadedFileByDocumentLink(documentLink) {
    return __awaiter(this, void 0, void 0, function () {
        var meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = documentLink
                        ? deleteMetaFromDocumentLink(documentLink)
                        : null;
                    if (!meta) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, deleteUploadedFile({
                            storage_type: meta.storage_type,
                            s3_key: meta.s3_key,
                            relativePath: meta.relativePath,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
