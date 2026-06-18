import {
  collectProductDesignUploadFiles,
  hasAtLeastOneProductDesignContent,
  hasProductDesignDocumentUpload,
  isAllowedSupportingDesignFile,
} from './product-design-upload.util';

describe('product-design-upload.util', () => {
  it('allows document-only save with eco vision upload', () => {
    const files = [
      {
        fieldname: 'ecoVisionFile',
        originalname: 'eco.pdf',
        size: 100,
      },
    ] as Express.Multer.File[];

    const { ecoVisionFiles, supportingDocumentFiles } =
      collectProductDesignUploadFiles(files);

    expect(
      hasAtLeastOneProductDesignContent({
        ecoVisionFiles,
        supportingDocumentFiles,
        allUploadFiles: files,
      }),
    ).toBe(true);
    expect(
      hasProductDesignDocumentUpload({
        ecoVisionFiles,
        supportingDocumentFiles,
        allUploadFiles: files,
      }),
    ).toBe(true);
  });

  it('allows document-only save with supporting design upload', () => {
    const files = [
      {
        fieldname: 'supportingDesignFile',
        originalname: 'sheet.xlsx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 100,
      },
    ] as Express.Multer.File[];

    expect(isAllowedSupportingDesignFile(files[0])).toBe(true);

    const { ecoVisionFiles, supportingDocumentFiles } =
      collectProductDesignUploadFiles(files);

    expect(supportingDocumentFiles).toHaveLength(1);
    expect(
      hasAtLeastOneProductDesignContent({
        ecoVisionFiles,
        supportingDocumentFiles,
        allUploadFiles: files,
      }),
    ).toBe(true);
  });

  it('collects files when field name uses array suffix', () => {
    const files = [
      {
        fieldname: 'ecoVisionFile[]',
        originalname: 'vision.pdf',
        size: 50,
      },
    ] as Express.Multer.File[];

    const { ecoVisionFiles } = collectProductDesignUploadFiles(files);
    expect(ecoVisionFiles).toHaveLength(1);
  });

  it('collects uncategorized upload parts as eco vision files', () => {
    const files = [
      {
        fieldname: 'attachment',
        originalname: 'notes.pdf',
        size: 50,
      },
    ] as Express.Multer.File[];

    const { ecoVisionFiles } = collectProductDesignUploadFiles(files);
    expect(ecoVisionFiles).toHaveLength(1);
  });

  it('counts retained documents as document upload', () => {
    expect(
      hasProductDesignDocumentUpload({
        ecoVisionFiles: [],
        supportingDocumentFiles: [],
        retainedSupportingDocumentCount: 1,
      }),
    ).toBe(true);
  });
});
