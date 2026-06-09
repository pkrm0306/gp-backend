import { Types } from 'mongoose';
import { AuditStatusResolver } from './audit-status-resolver.service';
import { AuditValueTransformer } from './audit-value-transformer.service';

describe('AuditValueTransformer serialization', () => {
  let transformer: AuditValueTransformer;

  beforeEach(() => {
    transformer = new AuditValueTransformer(new AuditStatusResolver());
  });

  it('normalizes nested objects before persistence', () => {
    const objectId = new Types.ObjectId('507f1f77bcf86cd799439011');
    const snapshot = transformer.sanitizeSnapshot({
      productDetails: {
        summary: 'Low VOC paint',
        attributes: {
          color: 'White',
          updatedDate: '2026-06-09T00:00:00.000Z',
        },
      },
      documents: [
        {
          productDocumentId: 101,
          documentName: 'Test report',
          _id: 'ignored',
        },
      ],
      ownerId: objectId,
      approvedAt: new Date('2026-06-09T00:00:00.000Z'),
      count: BigInt(3),
    });

    expect(snapshot).toEqual({
      productDetails: {
        summary: 'Low VOC paint',
        attributes: {
          color: 'White',
        },
      },
      documents: [
        {
          documentName: 'Test report',
        },
      ],
      ownerId: '507f1f77bcf86cd799439011',
      approvedAt: '2026-06-09T00:00:00.000Z',
      count: '3',
    });
  });

  it('parses JSON object strings and drops [object Object] placeholders', () => {
    const snapshot = transformer.safeBodySnapshot({
      productDetails:
        '{"summary":"Low VOC paint","attributes":{"color":"White","updatedDate":"ignored"}}',
      brokenObject: '[object Object]',
      plainText: 'Keep this value',
    });

    expect(snapshot).toEqual({
      productDetails: {
        summary: 'Low VOC paint',
        attributes: {
          color: 'White',
        },
      },
      plainText: 'Keep this value',
    });
  });

  it('serializes changes consistently for complex before and after values', () => {
    const changes = transformer.sanitizeChanges({
      productDetails: {
        before: { summary: 'Old', attributes: { recycled: false } },
        after: { summary: 'New', attributes: { recycled: true } },
      },
      fileBuffer: {
        before: undefined,
        after: Buffer.from('file-content'),
      },
    });

    expect(changes).toEqual({
      productDetails: {
        before: { summary: 'Old', attributes: { recycled: false } },
        after: { summary: 'New', attributes: { recycled: true } },
      },
    });
  });

  it('prevents circular objects from breaking audit serialization', () => {
    const circular: Record<string, unknown> = { name: 'Circular product' };
    circular.self = circular;

    const snapshot = transformer.sanitizeSnapshot({
      productDetails: circular,
    });

    expect(snapshot).toEqual({
      productDetails: {
        name: 'Circular product',
        self: '[Circular]',
      },
    });
  });
});
