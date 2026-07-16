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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersioningService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var document_version_helper_1 = require("./helpers/document-version.helper");
var certification_document_version_util_1 = require("./helpers/certification-document-version.util");
var DocumentVersioningService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentVersioningService = _classThis = /** @class */ (function () {
        function DocumentVersioningService_1(connection, docStreamModel, docVersionModel, renewDocumentModel) {
            this.connection = connection;
            this.docStreamModel = docStreamModel;
            this.docVersionModel = docVersionModel;
            this.renewDocumentModel = renewDocumentModel;
            this.logger = new common_1.Logger(DocumentVersioningService.name);
        }
        DocumentVersioningService_1.prototype.trackDocumentVersionChange = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var ownsSession, session, _a, run, result, error_1;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            ownsSession = !input.session;
                            if (!((_b = input.session) !== null && _b !== void 0)) return [3 /*break*/, 1];
                            _a = _b;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.connection.startSession()];
                        case 2:
                            _a = (_c.sent());
                            _c.label = 3;
                        case 3:
                            session = _a;
                            run = function (activeSession) { return __awaiter(_this, void 0, void 0, function () {
                                var now, userObjectId, processType, renewalCycleId, urnNo, subsectionKey, slotKey, streamKey, stream, nextVersionNo, createdStreams, versionDocs, version;
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                return __generator(this, function (_k) {
                                    switch (_k.label) {
                                        case 0:
                                            now = new Date();
                                            userObjectId = (0, document_version_helper_1.toObjectId)(input.userId, 'userId');
                                            processType = (0, document_version_helper_1.normalizeProcessType)(input.processType);
                                            renewalCycleId = (0, document_version_helper_1.normalizeRenewalCycleId)(input.renewalCycleId);
                                            urnNo = input.urnNo.trim();
                                            subsectionKey = (_a = input.subsectionKey) !== null && _a !== void 0 ? _a : null;
                                            slotKey = input.slotKey;
                                            streamKey = (0, document_version_helper_1.buildStreamKey)({
                                                urnNo: urnNo,
                                                processType: processType,
                                                renewalCycleId: renewalCycleId,
                                                sectionKey: input.sectionKey,
                                                subsectionKey: subsectionKey,
                                                slotKey: slotKey,
                                            });
                                            return [4 /*yield*/, this.docStreamModel
                                                    .findOne({
                                                    urnNo: urnNo,
                                                    processType: processType,
                                                    renewalCycleId: renewalCycleId,
                                                    sectionKey: input.sectionKey,
                                                    subsectionKey: subsectionKey,
                                                    slotKey: slotKey,
                                                })
                                                    .session(activeSession)
                                                    .exec()];
                                        case 1:
                                            stream = _k.sent();
                                            nextVersionNo = ((_b = stream === null || stream === void 0 ? void 0 : stream.latestVersionNo) !== null && _b !== void 0 ? _b : 0) + 1;
                                            if (!(stream === null || stream === void 0 ? void 0 : stream.latestVersionId)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this.docVersionModel.updateOne({ _id: stream.latestVersionId }, { $set: { isLatest: false } }, { session: activeSession })];
                                        case 2:
                                            _k.sent();
                                            _k.label = 3;
                                        case 3:
                                            if (!!stream) return [3 /*break*/, 5];
                                            return [4 /*yield*/, this.docStreamModel.create([
                                                    {
                                                        urnNo: urnNo,
                                                        processType: processType,
                                                        renewalCycleId: renewalCycleId,
                                                        sectionKey: input.sectionKey,
                                                        subsectionKey: subsectionKey,
                                                        slotKey: slotKey,
                                                        streamKey: streamKey,
                                                        liveSource: input.liveSource,
                                                        liveRef: {
                                                            collection: input.liveRef.collection,
                                                            id: (0, document_version_helper_1.toObjectId)(input.liveRef.id, 'liveRef.id'),
                                                            field: input.liveRef.field,
                                                        },
                                                        latestVersionNo: 0,
                                                        latestVersionId: null,
                                                        isDeleted: false,
                                                        createdAt: now,
                                                        createdBy: userObjectId,
                                                        updatedAt: now,
                                                        updatedBy: userObjectId,
                                                    },
                                                ], { session: activeSession })];
                                        case 4:
                                            createdStreams = _k.sent();
                                            stream = createdStreams[0];
                                            _k.label = 5;
                                        case 5: return [4 /*yield*/, this.docVersionModel.create([
                                                {
                                                    streamId: stream._id,
                                                    urnNo: urnNo,
                                                    processType: processType,
                                                    renewalCycleId: renewalCycleId,
                                                    roundNo: (_c = input.roundNo) !== null && _c !== void 0 ? _c : null,
                                                    versionNo: nextVersionNo,
                                                    action: input.action,
                                                    filePath: (_d = input.filePath) !== null && _d !== void 0 ? _d : null,
                                                    originalName: (_e = input.originalName) !== null && _e !== void 0 ? _e : null,
                                                    storedName: (_f = input.storedName) !== null && _f !== void 0 ? _f : null,
                                                    mimeType: (_g = input.mimeType) !== null && _g !== void 0 ? _g : null,
                                                    sizeBytes: (_h = input.sizeBytes) !== null && _h !== void 0 ? _h : null,
                                                    checksum: (_j = input.checksum) !== null && _j !== void 0 ? _j : null,
                                                    isLatest: true,
                                                    createdAt: now,
                                                    createdBy: userObjectId,
                                                },
                                            ], { session: activeSession })];
                                        case 6:
                                            versionDocs = _k.sent();
                                            version = versionDocs[0];
                                            return [4 /*yield*/, this.docStreamModel.updateOne({ _id: stream._id }, {
                                                    $set: {
                                                        liveSource: input.liveSource,
                                                        liveRef: {
                                                            collection: input.liveRef.collection,
                                                            id: (0, document_version_helper_1.toObjectId)(input.liveRef.id, 'liveRef.id'),
                                                            field: input.liveRef.field,
                                                        },
                                                        latestVersionNo: nextVersionNo,
                                                        latestVersionId: version._id,
                                                        isDeleted: input.action === 'deleted',
                                                        streamKey: streamKey,
                                                        updatedAt: now,
                                                        updatedBy: userObjectId,
                                                    },
                                                }, { session: activeSession })];
                                        case 7:
                                            _k.sent();
                                            return [2 /*return*/, {
                                                    streamId: stream._id,
                                                    versionId: version._id,
                                                    versionNo: nextVersionNo,
                                                }];
                                    }
                                });
                            }); };
                            _c.label = 4;
                        case 4:
                            _c.trys.push([4, 9, 12, 13]);
                            if (!ownsSession) return [3 /*break*/, 7];
                            session.startTransaction();
                            return [4 /*yield*/, run(session)];
                        case 5:
                            result = _c.sent();
                            return [4 /*yield*/, session.commitTransaction()];
                        case 6:
                            _c.sent();
                            return [2 /*return*/, result];
                        case 7: return [4 /*yield*/, run(session)];
                        case 8: return [2 /*return*/, _c.sent()];
                        case 9:
                            error_1 = _c.sent();
                            if (!(ownsSession && session.inTransaction())) return [3 /*break*/, 11];
                            return [4 /*yield*/, session.abortTransaction()];
                        case 10:
                            _c.sent();
                            _c.label = 11;
                        case 11: throw error_1;
                        case 12:
                            if (ownsSession) {
                                session.endSession();
                            }
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.trackDocumentVersionChangeSafe = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.trackDocumentVersionChange(input)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("Failed to track document version for URN ".concat(input.urnNo, ", section ").concat(input.sectionKey, ", slot ").concat(input.slotKey), error_2 instanceof Error ? error_2.stack : String(error_2));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.trackAllProductDocument = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.trackDocumentVersionChangeSafe((0, document_version_helper_1.buildAllProductDocumentTrackInput)(input))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.trackPaymentDocument = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.trackDocumentVersionChangeSafe((0, document_version_helper_1.buildPaymentDocumentTrackInput)(input))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.getDocumentHistory = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var stream, versions, filtered;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveHistoryStream(query)];
                        case 1:
                            stream = _a.sent();
                            if (stream.isDeleted) {
                                return [2 /*return*/, {
                                        stream: this.mapStream(stream),
                                        versions: [],
                                    }];
                            }
                            return [4 /*yield*/, this.docVersionModel
                                    .find({ streamId: stream._id, action: { $ne: 'deleted' } })
                                    .sort({ versionNo: -1 })
                                    .lean()
                                    .exec()];
                        case 2:
                            versions = _a.sent();
                            return [4 /*yield*/, this.filterRenewHistoryVersions(query, versions)];
                        case 3:
                            filtered = _a.sent();
                            return [2 /*return*/, {
                                    stream: this.mapStream(stream),
                                    versions: filtered.map(function (version) { return _this.mapVersion(version); }),
                                }];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.getLatestDocumentMetadata = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var stream, latestVersion;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findStreamOrThrow(query)];
                        case 1:
                            stream = _a.sent();
                            if (stream.isDeleted) {
                                throw new common_1.NotFoundException('Document stream has been deleted');
                            }
                            return [4 /*yield*/, this.docVersionModel
                                    .findOne({ streamId: stream._id, isLatest: true })
                                    .lean()
                                    .exec()];
                        case 2:
                            latestVersion = _a.sent();
                            if (!latestVersion) {
                                throw new common_1.NotFoundException('Latest document version not found for stream');
                            }
                            return [2 /*return*/, {
                                    stream: this.mapStream(stream),
                                    latestVersion: this.mapVersion(latestVersion),
                                }];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.findStreamOrThrow = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var stream;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.resolveHistoryStream(query)];
                        case 1:
                            stream = _a.sent();
                            if (!stream) {
                                throw new common_1.NotFoundException('Document stream not found');
                            }
                            return [2 /*return*/, stream];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.resolveHistoryStream = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filter, stream, legacySlot;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            filter = (0, document_version_helper_1.buildStreamIdentityFilter)(query);
                            return [4 /*yield*/, this.docStreamModel.findOne(filter).exec()];
                        case 1:
                            stream = _b.sent();
                            if (!(!stream &&
                                query.anchorProductDocumentId &&
                                (0, document_version_helper_1.normalizeProcessType)(query.processType) === 'renewal' &&
                                (0, certification_document_version_util_1.usesRenewPerDocumentVersionSlot)(query.sectionKey))) return [3 /*break*/, 3];
                            legacySlot = (0, certification_document_version_util_1.certificationSlotKey)(query.sectionKey, (_a = query.subsectionKey) !== null && _a !== void 0 ? _a : null);
                            return [4 /*yield*/, this.docStreamModel
                                    .findOne(__assign(__assign({}, filter), { slotKey: legacySlot }))
                                    .exec()];
                        case 2:
                            stream = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, stream];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.normalizeDocPath = function (value) {
            return value.trim().replace(/\\/g, '/').toLowerCase();
        };
        DocumentVersioningService_1.prototype.filterRenewHistoryVersions = function (query, versions) {
            return __awaiter(this, void 0, void 0, function () {
                var urnNo, sectionKey, cycleId, deletedFilter, deletedDocs, deletedPaths, filtered, anchorId, docFilter, docRows, active, activePath, deletedPathsForAnchor;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if ((0, document_version_helper_1.normalizeProcessType)(query.processType) !== 'renewal') {
                                return [2 /*return*/, versions];
                            }
                            urnNo = query.urnNo.trim();
                            sectionKey = query.sectionKey;
                            cycleId = query.renewalCycleId && mongoose_1.Types.ObjectId.isValid(query.renewalCycleId)
                                ? new mongoose_1.Types.ObjectId(query.renewalCycleId)
                                : null;
                            deletedFilter = {
                                urnNo: urnNo,
                                documentForm: sectionKey,
                                isDeleted: true,
                            };
                            if (cycleId) {
                                deletedFilter.$or = [
                                    { renewalCycleId: cycleId },
                                    { renewalCycleId: null },
                                    { renewalCycleId: { $exists: false } },
                                ];
                            }
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find(deletedFilter)
                                    .select('documentLink productDocumentId')
                                    .lean()
                                    .exec()];
                        case 1:
                            deletedDocs = _b.sent();
                            deletedPaths = new Set(deletedDocs
                                .map(function (doc) { var _a; return _this.normalizeDocPath(String((_a = doc.documentLink) !== null && _a !== void 0 ? _a : '')); })
                                .filter(Boolean));
                            filtered = versions.filter(function (version) {
                                var _a;
                                var path = _this.normalizeDocPath(String((_a = version.filePath) !== null && _a !== void 0 ? _a : ''));
                                return !path || !deletedPaths.has(path);
                            });
                            anchorId = query.anchorProductDocumentId;
                            if (!anchorId || !(0, certification_document_version_util_1.usesRenewPerDocumentVersionSlot)(sectionKey)) {
                                return [2 /*return*/, filtered];
                            }
                            docFilter = {
                                urnNo: urnNo,
                                documentForm: sectionKey,
                                productDocumentId: anchorId,
                            };
                            if (cycleId) {
                                docFilter.renewalCycleId = cycleId;
                            }
                            return [4 /*yield*/, this.renewDocumentModel
                                    .find(docFilter)
                                    .select('documentLink isDeleted')
                                    .lean()
                                    .exec()];
                        case 2:
                            docRows = _b.sent();
                            active = docRows.find(function (doc) { return doc.isDeleted !== true; });
                            if (!active) {
                                return [2 /*return*/, []];
                            }
                            activePath = this.normalizeDocPath(String((_a = active.documentLink) !== null && _a !== void 0 ? _a : ''));
                            deletedPathsForAnchor = new Set(docRows
                                .filter(function (doc) { return doc.isDeleted === true; })
                                .map(function (doc) { var _a; return _this.normalizeDocPath(String((_a = doc.documentLink) !== null && _a !== void 0 ? _a : '')); })
                                .filter(Boolean));
                            return [2 /*return*/, filtered.filter(function (version) {
                                    var _a;
                                    var path = _this.normalizeDocPath(String((_a = version.filePath) !== null && _a !== void 0 ? _a : ''));
                                    if (!path)
                                        return false;
                                    if (deletedPathsForAnchor.has(path))
                                        return false;
                                    return !activePath || path === activePath;
                                })];
                    }
                });
            });
        };
        DocumentVersioningService_1.prototype.mapStream = function (stream) {
            var _a, _b, _c;
            var plain = typeof stream.toObject === 'function'
                ? stream.toObject()
                : stream;
            return {
                _id: plain._id,
                urnNo: plain.urnNo,
                processType: plain.processType,
                renewalCycleId: (_a = plain.renewalCycleId) !== null && _a !== void 0 ? _a : null,
                sectionKey: plain.sectionKey,
                subsectionKey: (_b = plain.subsectionKey) !== null && _b !== void 0 ? _b : null,
                slotKey: plain.slotKey,
                streamKey: plain.streamKey,
                liveSource: plain.liveSource,
                liveRef: plain.liveRef,
                latestVersionNo: plain.latestVersionNo,
                latestVersionId: (_c = plain.latestVersionId) !== null && _c !== void 0 ? _c : null,
                isDeleted: plain.isDeleted,
                createdAt: plain.createdAt,
                createdBy: plain.createdBy,
                updatedAt: plain.updatedAt,
                updatedBy: plain.updatedBy,
            };
        };
        DocumentVersioningService_1.prototype.mapVersion = function (version) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return {
                _id: version._id,
                streamId: version.streamId,
                urnNo: version.urnNo,
                processType: version.processType,
                renewalCycleId: (_a = version.renewalCycleId) !== null && _a !== void 0 ? _a : null,
                roundNo: (_b = version.roundNo) !== null && _b !== void 0 ? _b : null,
                versionNo: version.versionNo,
                action: version.action,
                filePath: (_c = version.filePath) !== null && _c !== void 0 ? _c : null,
                originalName: (_d = version.originalName) !== null && _d !== void 0 ? _d : null,
                storedName: (_e = version.storedName) !== null && _e !== void 0 ? _e : null,
                mimeType: (_f = version.mimeType) !== null && _f !== void 0 ? _f : null,
                sizeBytes: (_g = version.sizeBytes) !== null && _g !== void 0 ? _g : null,
                checksum: (_h = version.checksum) !== null && _h !== void 0 ? _h : null,
                isLatest: version.isLatest,
                createdAt: version.createdAt,
                createdBy: version.createdBy,
            };
        };
        return DocumentVersioningService_1;
    }());
    __setFunctionName(_classThis, "DocumentVersioningService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentVersioningService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentVersioningService = _classThis;
}();
exports.DocumentVersioningService = DocumentVersioningService;
