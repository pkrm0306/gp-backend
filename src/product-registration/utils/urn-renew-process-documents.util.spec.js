"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urn_renew_process_documents_util_1 = require("./urn-renew-process-documents.util");
describe('urn-renew-process-documents.util', function () {
    it('accepts manufacturing process docs by subsection', function () {
        expect((0, urn_renew_process_documents_util_1.isUrnManufacturingProcessDocument)({
            documentForm: 'process_manufacturing',
            documentFormSubsection: 'energy_consumption_documents',
        })).toBe(true);
    });
    it('accepts waste management supporting docs', function () {
        expect((0, urn_renew_process_documents_util_1.isUrnWasteManagementProcessDocument)({
            documentForm: 'process_waste_management',
            documentFormSubsection: 'wm_supporting_documents',
        })).toBe(true);
    });
    it('accepts innovation implementation docs', function () {
        expect((0, urn_renew_process_documents_util_1.isUrnInnovationProcessDocument)({
            documentForm: 'process_innovation',
            documentFormSubsection: 'innovation_implementation_documents',
        })).toBe(true);
    });
    it('collects manufacturing docs from all_renew_product_documents', function () {
        var docs = (0, urn_renew_process_documents_util_1.collectUrnScopedManufacturingProcessDocuments)({
            process_manufacturing_documents: [
                {
                    productDocumentId: 1,
                    documentForm: 'process_manufacturing',
                    documentFormSubsection: 'energy_consumption_documents',
                },
            ],
            all_renew_product_documents: [
                {
                    productDocumentId: 2,
                    documentForm: 'process_manufacturing',
                    documentFormSubsection: 'energy_conservation_supporting_documents',
                },
                {
                    productDocumentId: 3,
                    documentForm: 'product_performance',
                    documentFormSubsection: 'test_report_files',
                },
            ],
        });
        expect(docs.map(function (doc) { return doc.productDocumentId; })).toEqual([1, 2]);
    });
    it('merges renew process documents onto primary detail row', function () {
        var _a, _b, _c;
        var rows = (0, urn_renew_process_documents_util_1.mergeAllRenewProcessDocumentsOntoDetailRows)([
            {
                process_manufacturing_documents: [
                    {
                        productDocumentId: 1,
                        documentForm: 'process_manufacturing',
                        documentFormSubsection: 'energy_consumption_documents',
                    },
                ],
                process_waste_management_documents: [],
                process_innovation_documents: [],
            },
        ], {
            process_manufacturing_documents: [
                {
                    productDocumentId: 2,
                    documentForm: 'process_manufacturing',
                    documentFormSubsection: 'energy_conservation_supporting_documents',
                },
            ],
            process_waste_management_documents: [
                {
                    productDocumentId: 3,
                    documentForm: 'process_waste_management',
                    documentFormSubsection: 'wm_supporting_documents',
                },
            ],
            process_innovation_documents: [
                {
                    productDocumentId: 4,
                    documentForm: 'process_innovation',
                    documentFormSubsection: 'innovation_implementation_documents',
                },
            ],
        });
        expect((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.process_manufacturing_documents).toHaveLength(2);
        expect((_b = rows[0]) === null || _b === void 0 ? void 0 : _b.process_waste_management_documents).toHaveLength(1);
        expect((_c = rows[0]) === null || _c === void 0 ? void 0 : _c.process_innovation_documents).toHaveLength(1);
    });
    it('finalize unions cert and renew buckets onto section arrays', function () {
        var _a;
        var rows = (0, urn_renew_process_documents_util_1.finalizeUrnProcessDocumentFieldsOnDetailRows)([
            {
                process_manufacturing_documents: [
                    {
                        productDocumentId: 1,
                        documentForm: 'process_manufacturing',
                        documentFormSubsection: 'energy_consumption_documents',
                    },
                ],
            },
        ], [
            {
                all_renew_product_documents: [
                    {
                        productDocumentId: 2,
                        documentForm: 'process_manufacturing',
                        documentFormSubsection: 'energy_conservation_supporting_documents',
                    },
                    {
                        productDocumentId: 3,
                        documentForm: 'process_manufacturing',
                        documentFormSubsection: 'energy_conservation_supporting_documents',
                    },
                ],
            },
        ]);
        expect((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.process_manufacturing_documents).toHaveLength(3);
    });
});
