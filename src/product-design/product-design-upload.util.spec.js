"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var product_design_upload_util_1 = require("./product-design-upload.util");
describe('product-design-upload.util', function () {
    it('allows document-only save with eco vision upload', function () {
        var files = [
            {
                fieldname: 'ecoVisionFile',
                originalname: 'eco.pdf',
                size: 100,
            },
        ];
        var _a = (0, product_design_upload_util_1.collectProductDesignUploadFiles)(files), ecoVisionFiles = _a.ecoVisionFiles, supportingDocumentFiles = _a.supportingDocumentFiles;
        expect((0, product_design_upload_util_1.hasAtLeastOneProductDesignContent)({
            ecoVisionFiles: ecoVisionFiles,
            supportingDocumentFiles: supportingDocumentFiles,
            allUploadFiles: files,
        })).toBe(true);
        expect((0, product_design_upload_util_1.hasProductDesignDocumentUpload)({
            ecoVisionFiles: ecoVisionFiles,
            supportingDocumentFiles: supportingDocumentFiles,
            allUploadFiles: files,
        })).toBe(true);
    });
    it('allows document-only save with supporting design upload', function () {
        var files = [
            {
                fieldname: 'supportingDesignFile',
                originalname: 'sheet.xlsx',
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                size: 100,
            },
        ];
        expect((0, product_design_upload_util_1.isAllowedSupportingDesignFile)(files[0])).toBe(true);
        var _a = (0, product_design_upload_util_1.collectProductDesignUploadFiles)(files), ecoVisionFiles = _a.ecoVisionFiles, supportingDocumentFiles = _a.supportingDocumentFiles;
        expect(supportingDocumentFiles).toHaveLength(1);
        expect((0, product_design_upload_util_1.hasAtLeastOneProductDesignContent)({
            ecoVisionFiles: ecoVisionFiles,
            supportingDocumentFiles: supportingDocumentFiles,
            allUploadFiles: files,
        })).toBe(true);
    });
    it('collects files when field name uses array suffix', function () {
        var files = [
            {
                fieldname: 'ecoVisionFile[]',
                originalname: 'vision.pdf',
                size: 50,
            },
        ];
        var ecoVisionFiles = (0, product_design_upload_util_1.collectProductDesignUploadFiles)(files).ecoVisionFiles;
        expect(ecoVisionFiles).toHaveLength(1);
    });
    it('collects uncategorized upload parts as eco vision files', function () {
        var files = [
            {
                fieldname: 'attachment',
                originalname: 'notes.pdf',
                size: 50,
            },
        ];
        var ecoVisionFiles = (0, product_design_upload_util_1.collectProductDesignUploadFiles)(files).ecoVisionFiles;
        expect(ecoVisionFiles).toHaveLength(1);
    });
    it('counts retained documents as document upload', function () {
        expect((0, product_design_upload_util_1.hasProductDesignDocumentUpload)({
            ecoVisionFiles: [],
            supportingDocumentFiles: [],
            retainedSupportingDocumentCount: 1,
        })).toBe(true);
    });
});
