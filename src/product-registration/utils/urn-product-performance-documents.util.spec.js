"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urn_product_performance_documents_util_1 = require("./urn-product-performance-documents.util");
describe('urn-product-performance-documents.util', function () {
    it('accepts performance test report docs', function () {
        expect((0, urn_product_performance_documents_util_1.isUrnProductPerformanceDocument)({
            documentForm: 'product_performance',
            documentFormSubsection: 'test_report_files',
        })).toBe(true);
    });
    it('merges product_performance_documents with all_urn_product_documents', function () {
        var docs = (0, urn_product_performance_documents_util_1.collectUrnScopedProductPerformanceDocuments)({
            product_performance_documents: [
                { productDocumentId: 1, documentForm: 'product_performance', documentFormSubsection: 'test_report_files' },
            ],
            all_urn_product_documents: [
                { productDocumentId: 2, documentForm: 'product_performance', documentFormSubsection: 'test_report_files' },
                { productDocumentId: 3, documentForm: 'process_manufacturing', documentFormSubsection: 'energy_consumption_documents' },
            ],
        });
        expect(docs.map(function (doc) { return doc.productDocumentId; })).toEqual([1, 2]);
    });
    it('merges renew payload documents onto primary detail row', function () {
        var _a;
        var rows = (0, urn_product_performance_documents_util_1.mergeRenewProductPerformanceDocumentsOntoDetailRows)([
            {
                product_performance_documents: [
                    {
                        productDocumentId: 1,
                        documentForm: 'product_performance',
                        documentFormSubsection: 'test_report_files',
                    },
                ],
            },
        ], {
            product_performance_documents: [
                {
                    productDocumentId: 2,
                    documentForm: 'product_performance',
                    documentFormSubsection: 'test_report_files',
                },
                {
                    productDocumentId: 3,
                    documentForm: 'product_performance',
                    documentFormSubsection: 'test_report_files',
                },
            ],
        });
        expect((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.product_performance_documents).toHaveLength(3);
    });
});
