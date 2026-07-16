"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var mongoose_1 = require("@nestjs/mongoose");
var app_module_1 = require("../app.module");
var document_section_key_constants_1 = require("../common/constants/document-section-key.constants");
var all_product_document_schema_1 = require("../product-design/schemas/all-product-document.schema");
var document_versioning_service_1 = require("../documents/document-versioning.service");
var doc_stream_schema_1 = require("../documents/schemas/doc-stream.schema");
var certification_document_version_util_1 = require("../documents/helpers/certification-document-version.util");
var document_version_helper_1 = require("../documents/helpers/document-version.helper");
var TARGET_SECTIONS = [
    document_section_key_constants_1.DocumentSectionKey.PROCESS_LIFE_CYCLE_APPROACH,
    document_section_key_constants_1.DocumentSectionKey.PROCESS_PRODUCT_STEWARDSHIP,
    document_section_key_constants_1.DocumentSectionKey.PROCESS_MANUFACTURING,
    document_section_key_constants_1.DocumentSectionKey.PROCESS_WASTE_MANAGEMENT,
];
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var dryRun, app, allProductDocumentModel, docStreamModel, versioning, scanned, created, skippedExisting, docs, groups, _i, docs_1, doc, sectionKey, slotKey, key, bucket, _a, groups_1, _b, group, liveDoc, sectionKey, subsectionKey, slotKey, existing;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    dryRun = String((_c = process.env.DRY_RUN) !== null && _c !== void 0 ? _c : 'true').toLowerCase() === 'true';
                    return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
                            logger: ['error', 'warn', 'log'],
                        })];
                case 1:
                    app = _l.sent();
                    allProductDocumentModel = app.get((0, mongoose_1.getModelToken)(all_product_document_schema_1.AllProductDocument.name));
                    docStreamModel = app.get((0, mongoose_1.getModelToken)(doc_stream_schema_1.DocStream.name));
                    versioning = app.get(document_versioning_service_1.DocumentVersioningService);
                    scanned = 0;
                    created = 0;
                    skippedExisting = 0;
                    _l.label = 2;
                case 2:
                    _l.trys.push([2, , 9, 11]);
                    return [4 /*yield*/, allProductDocumentModel
                            .find({
                            documentForm: { $in: __spreadArray([], TARGET_SECTIONS, true) },
                            isDeleted: { $ne: true },
                        })
                            .sort({ createdDate: 1, productDocumentId: 1 })
                            .lean()
                            .exec()];
                case 3:
                    docs = (_l.sent());
                    groups = new Map();
                    for (_i = 0, docs_1 = docs; _i < docs_1.length; _i++) {
                        doc = docs_1[_i];
                        scanned += 1;
                        sectionKey = String((_d = doc.documentForm) !== null && _d !== void 0 ? _d : '').trim();
                        slotKey = (0, certification_document_version_util_1.certificationSlotKeyModeForSection)(sectionKey) === 'subsectionTag'
                            ? (0, certification_document_version_util_1.certificationSlotKey)(sectionKey, doc.documentFormSubsection, doc.documentTag)
                            : (0, document_version_helper_1.slotKeyFromSubsection)(doc.documentFormSubsection);
                        key = "".concat(doc.urnNo, "|initial|").concat(sectionKey, "|").concat((_e = doc.documentFormSubsection) !== null && _e !== void 0 ? _e : '', "|").concat(slotKey);
                        bucket = (_f = groups.get(key)) !== null && _f !== void 0 ? _f : [];
                        bucket.push(doc);
                        groups.set(key, bucket);
                    }
                    _a = 0, groups_1 = groups;
                    _l.label = 4;
                case 4:
                    if (!(_a < groups_1.length)) return [3 /*break*/, 8];
                    _b = groups_1[_a], group = _b[1];
                    liveDoc = group[group.length - 1];
                    sectionKey = String(liveDoc.documentForm);
                    subsectionKey = (_g = liveDoc.documentFormSubsection) !== null && _g !== void 0 ? _g : null;
                    slotKey = (0, document_version_helper_1.slotKeyFromSubsection)(subsectionKey);
                    return [4 /*yield*/, docStreamModel
                            .findOne({
                            urnNo: liveDoc.urnNo,
                            processType: 'initial',
                            renewalCycleId: null,
                            sectionKey: sectionKey,
                            subsectionKey: subsectionKey,
                            slotKey: slotKey,
                        })
                            .lean()
                            .exec()];
                case 5:
                    existing = _l.sent();
                    if (existing) {
                        skippedExisting += 1;
                        return [3 /*break*/, 7];
                    }
                    if (dryRun) {
                        created += 1;
                        return [3 /*break*/, 7];
                    }
                    return [4 /*yield*/, versioning.trackAllProductDocument({
                            urnNo: liveDoc.urnNo,
                            sectionKey: sectionKey,
                            subsectionKey: subsectionKey,
                            slotKey: slotKey,
                            action: 'added',
                            documentId: liveDoc._id,
                            productDocumentId: liveDoc.productDocumentId,
                            filePath: (_h = liveDoc.documentLink) !== null && _h !== void 0 ? _h : null,
                            originalName: (_j = liveDoc.documentOriginalName) !== null && _j !== void 0 ? _j : null,
                            storedName: (_k = liveDoc.documentName) !== null && _k !== void 0 ? _k : null,
                            userId: liveDoc.vendorId,
                            processType: 'initial',
                        })];
                case 6:
                    _l.sent();
                    created += 1;
                    _l.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 4];
                case 8:
                    console.log(JSON.stringify({
                        dryRun: dryRun,
                        scannedDocuments: scanned,
                        slotGroups: groups.size,
                        streamsCreated: created,
                        skippedExistingStreams: skippedExisting,
                        sections: TARGET_SECTIONS,
                    }, null, 2));
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, app.close()];
                case 10:
                    _l.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
run().catch(function (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
});
