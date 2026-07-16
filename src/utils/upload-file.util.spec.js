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
Object.defineProperty(exports, "__esModule", { value: true });
var upload_file_util_1 = require("./upload-file.util");
describe('upload-file CloudFront URL helpers', function () {
    var envBackup = __assign({}, process.env);
    beforeEach(function () {
        process.env.AWS_ACCESS_KEY_ID = 'test-key';
        process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
        process.env.AWS_REGION = 'ap-south-1';
        process.env.AWS_S3_BUCKET = 'greenpro-bucket';
        process.env.AWS_CLOUDFRONT_URL = 'https://d111.cloudfront.net';
        delete process.env.AWS_S3_USE_DIRECT_PUBLIC_URL;
    });
    afterEach(function () {
        process.env = __assign({}, envBackup);
    });
    it('buildPublicFileUrl uses CloudFront when configured', function () {
        var url = (0, upload_file_util_1.buildPublicFileUrl)('greenpro-bucket', 'ap-south-1', 'uploads/products/123_photo.jpg');
        expect(url).toBe('https://d111.cloudfront.net/uploads/products/123_photo.jpg');
    });
    it('extractUploadsKeyFromAbsoluteUrl parses S3 virtual-hosted URLs', function () {
        expect((0, upload_file_util_1.extractUploadsKeyFromAbsoluteUrl)('https://greenpro-bucket.s3.ap-south-1.amazonaws.com/uploads/products/a.jpg')).toBe('uploads/products/a.jpg');
    });
    it('resolveStoredUploadUrl rewrites S3 URL to CloudFront', function () {
        var resolved = (0, upload_file_util_1.resolveStoredUploadUrl)('https://greenpro-bucket.s3.ap-south-1.amazonaws.com/uploads/products/a.jpg');
        expect(resolved).toBe('https://d111.cloudfront.net/uploads/products/a.jpg');
    });
    it('resolveStoredUploadUrl rewrites relative uploads path to CloudFront', function () {
        expect((0, upload_file_util_1.resolveStoredUploadUrl)('/uploads/products/b.jpg')).toBe('https://d111.cloudfront.net/uploads/products/b.jpg');
    });
    it('resolveStoredUploadUrl leaves local paths when S3 is not configured', function () {
        delete process.env.AWS_ACCESS_KEY_ID;
        expect((0, upload_file_util_1.resolveStoredUploadUrl)('/uploads/products/b.jpg')).toBe('/uploads/products/b.jpg');
    });
    it('resolvePublicUploadUrl rewrites bare category filename to CloudFront', function () {
        expect((0, upload_file_util_1.resolvePublicUploadUrl)('categories/1775737394232.jpg')).toBe('https://d111.cloudfront.net/uploads/categories/1775737394232.jpg');
    });
    it('resolvePublicUploadUrl rewrites localhost category URL to CloudFront', function () {
        expect((0, upload_file_util_1.resolvePublicUploadUrl)('http://localhost:3000/uploads/categories/1775737394232.jpg')).toBe('https://d111.cloudfront.net/uploads/categories/1775737394232.jpg');
    });
    it('resolvePublicUploadUrl uses localBaseUrl when S3 is not configured', function () {
        delete process.env.AWS_ACCESS_KEY_ID;
        expect((0, upload_file_util_1.resolvePublicUploadUrl)('categories/a.jpg', 'http://localhost:3000')).toBe('http://localhost:3000/uploads/categories/a.jpg');
    });
});
