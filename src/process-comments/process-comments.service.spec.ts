import { BadRequestException } from '@nestjs/common';
import { ProcessCommentsService } from './process-comments.service';

describe('ProcessCommentsService comment validation', () => {
  const service = Object.create(
    ProcessCommentsService.prototype,
  ) as ProcessCommentsService;

  it('rejects upsert when a provided section comment is empty', () => {
    expect(() =>
      (service as any).assertMeaningfulCommentFields({
        urnNo: 'URN-1',
        productDesign: '<p></p>',
      }),
    ).toThrow(BadRequestException);

    expect(() =>
      (service as any).assertMeaningfulCommentFields({
        urnNo: 'URN-1',
        productDesign: '<p>Valid note</p>',
      }),
    ).not.toThrow();
  });

  it('allows upsert when section fields are omitted', () => {
    expect(() =>
      (service as any).assertMeaningfulCommentFields({
        urnNo: 'URN-1',
      }),
    ).not.toThrow();
  });
});
