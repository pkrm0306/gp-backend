"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isS3Configured = isS3Configured;
exports.getS3Client = getS3Client;
exports.getS3Bucket = getS3Bucket;
exports.getS3Region = getS3Region;
exports.getCloudFrontBaseUrl = getCloudFrontBaseUrl;
exports.preferDirectS3PublicUrl = preferDirectS3PublicUrl;
var client_s3_1 = require("@aws-sdk/client-s3");
var client = null;
/**
 * All four must be set to use S3; otherwise uploads fall back to local disk.
 */
function isS3Configured() {
    var _a, _b, _c, _d;
    var key = (_a = process.env.AWS_ACCESS_KEY_ID) === null || _a === void 0 ? void 0 : _a.trim();
    var secret = (_b = process.env.AWS_SECRET_ACCESS_KEY) === null || _b === void 0 ? void 0 : _b.trim();
    var region = (_c = process.env.AWS_REGION) === null || _c === void 0 ? void 0 : _c.trim();
    var bucket = (_d = process.env.AWS_S3_BUCKET) === null || _d === void 0 ? void 0 : _d.trim();
    return !!(key && secret && region && bucket);
}
function getS3Client() {
    if (!isS3Configured()) {
        throw new Error('S3 is not configured (missing AWS env vars)');
    }
    if (!client) {
        client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    return client;
}
function getS3Bucket() {
    return process.env.AWS_S3_BUCKET.trim();
}
function getS3Region() {
    return process.env.AWS_REGION.trim();
}
function getCloudFrontBaseUrl() {
    var _a;
    var raw = (_a = process.env.AWS_CLOUDFRONT_URL) === null || _a === void 0 ? void 0 : _a.trim();
    if (!raw)
        return null;
    try {
        var parsed = new URL(raw);
        var segments = parsed.pathname.split('/').filter(Boolean);
        if (segments.length === 0) {
            return parsed.origin;
        }
        // If a file path is provided (e.g. /dummy.png), drop the file part.
        var last = segments[segments.length - 1];
        var looksLikeFile = /\.[a-zA-Z0-9]+$/.test(last);
        var kept = looksLikeFile ? segments.slice(0, -1) : segments;
        var path = kept.length > 0 ? "/".concat(kept.join('/')) : '';
        return "".concat(parsed.origin).concat(path);
    }
    catch (_b) {
        return null;
    }
}
/**
 * When `true`, public file URLs use the S3 virtual-hosted–style URL
 * (`https://{bucket}.s3.{region}.amazonaws.com/...`) even if `AWS_CLOUDFRONT_URL` is set.
 * CloudFront still serves the same objects from S3; this only changes the URL string stored/returned.
 */
function preferDirectS3PublicUrl() {
    var _a;
    var v = (_a = process.env.AWS_S3_USE_DIRECT_PUBLIC_URL) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
}
