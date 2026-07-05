import {
  buildPublicFileUrl,
  extractUploadsKeyFromAbsoluteUrl,
  resolvePublicUploadUrl,
  resolveStoredUploadUrl,
} from './upload-file.util';

describe('upload-file CloudFront URL helpers', () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    process.env.AWS_ACCESS_KEY_ID = 'test-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret';
    process.env.AWS_REGION = 'ap-south-1';
    process.env.AWS_S3_BUCKET = 'greenpro-bucket';
    process.env.AWS_CLOUDFRONT_URL = 'https://d111.cloudfront.net';
    delete process.env.AWS_S3_USE_DIRECT_PUBLIC_URL;
  });

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('buildPublicFileUrl uses CloudFront when configured', () => {
    const url = buildPublicFileUrl(
      'greenpro-bucket',
      'ap-south-1',
      'uploads/products/123_photo.jpg',
    );
    expect(url).toBe(
      'https://d111.cloudfront.net/uploads/products/123_photo.jpg',
    );
  });

  it('extractUploadsKeyFromAbsoluteUrl parses S3 virtual-hosted URLs', () => {
    expect(
      extractUploadsKeyFromAbsoluteUrl(
        'https://greenpro-bucket.s3.ap-south-1.amazonaws.com/uploads/products/a.jpg',
      ),
    ).toBe('uploads/products/a.jpg');
  });

  it('resolveStoredUploadUrl rewrites S3 URL to CloudFront', () => {
    const resolved = resolveStoredUploadUrl(
      'https://greenpro-bucket.s3.ap-south-1.amazonaws.com/uploads/products/a.jpg',
    );
    expect(resolved).toBe(
      'https://d111.cloudfront.net/uploads/products/a.jpg',
    );
  });

  it('resolveStoredUploadUrl rewrites relative uploads path to CloudFront', () => {
    expect(resolveStoredUploadUrl('/uploads/products/b.jpg')).toBe(
      'https://d111.cloudfront.net/uploads/products/b.jpg',
    );
  });

  it('resolveStoredUploadUrl leaves local paths when S3 is not configured', () => {
    delete process.env.AWS_ACCESS_KEY_ID;
    expect(resolveStoredUploadUrl('/uploads/products/b.jpg')).toBe(
      '/uploads/products/b.jpg',
    );
  });

  it('resolvePublicUploadUrl rewrites bare category filename to CloudFront', () => {
    expect(resolvePublicUploadUrl('categories/1775737394232.jpg')).toBe(
      'https://d111.cloudfront.net/uploads/categories/1775737394232.jpg',
    );
  });

  it('resolvePublicUploadUrl rewrites localhost category URL to CloudFront', () => {
    expect(
      resolvePublicUploadUrl(
        'http://localhost:3000/uploads/categories/1775737394232.jpg',
      ),
    ).toBe('https://d111.cloudfront.net/uploads/categories/1775737394232.jpg');
  });

  it('resolvePublicUploadUrl uses localBaseUrl when S3 is not configured', () => {
    delete process.env.AWS_ACCESS_KEY_ID;
    expect(
      resolvePublicUploadUrl('categories/a.jpg', 'http://localhost:3000'),
    ).toBe('http://localhost:3000/uploads/categories/a.jpg');
  });
});
