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
exports.UrnSiteVisitsService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var urn_site_visit_util_1 = require("./urn-site-visit.util");
var active_product_filter_1 = require("../product-registration/constants/active-product.filter");
var urn_site_visit_workflow_util_1 = require("./urn-site-visit-workflow.util");
var UrnSiteVisitsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UrnSiteVisitsService = _classThis = /** @class */ (function () {
        function UrnSiteVisitsService_1(siteVisitModel, productModel, productPlantModel) {
            this.siteVisitModel = siteVisitModel;
            this.productModel = productModel;
            this.productPlantModel = productPlantModel;
        }
        UrnSiteVisitsService_1.prototype.normalizeUrnNo = function (urnNo) {
            return String(urnNo !== null && urnNo !== void 0 ? urnNo : '')
                .trim()
                .replace(/\/+$/g, '');
        };
        UrnSiteVisitsService_1.prototype.urnCandidates = function (urnNo) {
            var normalized = this.normalizeUrnNo(urnNo);
            if (!normalized)
                return [];
            return [normalized, "".concat(normalized, "/")];
        };
        UrnSiteVisitsService_1.prototype.toObjectId = function (id, fieldName) {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new common_1.BadRequestException("Invalid ".concat(fieldName, " format: ").concat(id));
            }
            return new mongoose_1.Types.ObjectId(id);
        };
        UrnSiteVisitsService_1.prototype.parseOptionalDate = function (value) {
            if (value === undefined || value === null || String(value).trim() === '') {
                return null;
            }
            var d = new Date(value);
            if (Number.isNaN(d.getTime())) {
                throw new common_1.BadRequestException('Invalid auditConductedOn date');
            }
            return d;
        };
        UrnSiteVisitsService_1.prototype.parseActorId = function (userId) {
            if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
                return null;
            }
            return new mongoose_1.Types.ObjectId(userId);
        };
        UrnSiteVisitsService_1.prototype.assertUrnExists = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedUrn, urnOptions, product;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            normalizedUrn = this.normalizeUrnNo(urnNo);
                            if (!normalizedUrn) {
                                throw new common_1.BadRequestException('urnNo is required');
                            }
                            urnOptions = this.urnCandidates(normalizedUrn);
                            return [4 /*yield*/, this.productModel
                                    .findOne((0, active_product_filter_1.matchActiveProducts)({ urnNo: { $in: urnOptions } }))
                                    .select('vendorId manufacturerId urnStatus urnNo')
                                    .sort({ createdDate: 1 })
                                    .lean()
                                    .exec()];
                        case 1:
                            product = _c.sent();
                            if (!product) {
                                throw new common_1.NotFoundException("No products found for URN: ".concat(normalizedUrn));
                            }
                            return [2 /*return*/, {
                                    normalizedUrn: this.normalizeUrnNo(String((_a = product.urnNo) !== null && _a !== void 0 ? _a : normalizedUrn)),
                                    vendorId: product.vendorId,
                                    manufacturerId: product.manufacturerId,
                                    urnStatus: Number((_b = product.urnStatus) !== null && _b !== void 0 ? _b : 0),
                                }];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.logSiteVisitEvent = function (action, urnNo, siteVisitId, name, urnStatus, extra) {
            var labelByAction = {
                urn_site_visit_created: "Admin added site visit '".concat(name, "' for URN ").concat(urnNo),
                urn_site_visit_updated: "Admin updated site visit '".concat(name, "' for URN ").concat(urnNo),
                urn_site_visit_deleted: "Admin deleted site visit '".concat(name, "' for URN ").concat(urnNo),
            };
            // Site visits are stored in urn_site_visits and audit_log — not activity_log,
            // so Quick View workflow status is not overwritten by auxiliary admin events.
            console.info("[URN Site Visit] ".concat(action), __assign({ urnNo: urnNo, siteVisitId: siteVisitId, name: name, urnStatus: urnStatus, activity: labelByAction[action] }, extra));
        };
        /**
         * Vendor dashboard `site_visit` is derived from products.urnStatus (see vendor-applications.util).
         * When the first visit is created during process forms (status 3), move to site-visit-in-progress (5).
         * Do not change workflow stage once the vendor has submitted for review (status >= 4).
         */
        UrnSiteVisitsService_1.prototype.resolveMaxUrnWorkflowStatus = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var urnOptions, rows, maxStatus, _i, rows_1, row;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            urnOptions = this.urnCandidates(urnNo);
                            return [4 /*yield*/, this.productModel
                                    .find((0, active_product_filter_1.matchActiveProducts)({ urnNo: { $in: urnOptions } }))
                                    .select('urnStatus')
                                    .lean()
                                    .exec()];
                        case 1:
                            rows = _b.sent();
                            maxStatus = 0;
                            for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                row = rows_1[_i];
                                maxStatus = Math.max(maxStatus, Number((_a = row.urnStatus) !== null && _a !== void 0 ? _a : 0));
                            }
                            return [2 /*return*/, maxStatus];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.syncUrnStatusAfterSiteVisitChange = function (urnNo, vendorId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnOptions, activeCount, currentStatus, decision;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            urnOptions = this.urnCandidates(urnNo);
                            return [4 /*yield*/, this.siteVisitModel.countDocuments({
                                    urnNo: { $in: urnOptions },
                                    isDeleted: { $ne: true },
                                })];
                        case 1:
                            activeCount = _a.sent();
                            if (activeCount === 0) {
                                return [2 /*return*/, this.resolveMaxUrnWorkflowStatus(urnNo)];
                            }
                            return [4 /*yield*/, this.resolveMaxUrnWorkflowStatus(urnNo)];
                        case 2:
                            currentStatus = _a.sent();
                            decision = (0, urn_site_visit_workflow_util_1.resolveSiteVisitUrnStatusAfterCreate)(currentStatus);
                            if (!decision.shouldUpdate) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.productModel.updateMany((0, active_product_filter_1.matchActiveProducts)({ urnNo: { $in: urnOptions }, vendorId: vendorId }), { $set: { urnStatus: decision.nextStatus, updatedDate: new Date() } })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, decision.nextStatus];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.normalizePlantNameKey = function (name) {
            return String(name !== null && name !== void 0 ? name : '')
                .trim()
                .toLowerCase();
        };
        /**
         * Active manufacturing plants for a URN — used for admin site-visit `name` dropdown.
         */
        UrnSiteVisitsService_1.prototype.listPlantOptionsForUrn = function (urnNo) {
            return __awaiter(this, void 0, void 0, function () {
                var urnContext, urnOptions, rows, byName, _i, rows_2, row, plantName, key, eoiNo, entry, existing, eois;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.assertUrnExists(urnNo)];
                        case 1:
                            urnContext = _g.sent();
                            urnOptions = this.urnCandidates(urnContext.normalizedUrn);
                            return [4 /*yield*/, this.productPlantModel
                                    .aggregate([
                                    {
                                        $match: (0, active_product_filter_1.matchActiveProductPlants)({
                                            urnNo: { $in: urnOptions },
                                        }),
                                    },
                                    {
                                        $lookup: {
                                            from: 'states',
                                            localField: 'stateId',
                                            foreignField: '_id',
                                            as: 'state',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$state',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'countries',
                                            localField: 'countryId',
                                            foreignField: '_id',
                                            as: 'country',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$country',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $project: {
                                            plantName: 1,
                                            eoiNo: 1,
                                            plantLocation: 1,
                                            city: 1,
                                            stateName: {
                                                $ifNull: [
                                                    '$state.stateName',
                                                    { $ifNull: ['$state.state_name', '$state.name'] },
                                                ],
                                            },
                                            countryName: {
                                                $ifNull: [
                                                    '$country.countryName',
                                                    { $ifNull: ['$country.country_name', '$country.name'] },
                                                ],
                                            },
                                        },
                                    },
                                    { $sort: { plantName: 1, eoiNo: 1 } },
                                ])
                                    .exec()];
                        case 2:
                            rows = _g.sent();
                            byName = new Map();
                            for (_i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
                                row = rows_2[_i];
                                plantName = String((_a = row.plantName) !== null && _a !== void 0 ? _a : '').trim();
                                if (!plantName)
                                    continue;
                                key = this.normalizePlantNameKey(plantName);
                                eoiNo = String((_b = row.eoiNo) !== null && _b !== void 0 ? _b : '').trim();
                                entry = {
                                    plantName: plantName,
                                    eoiNo: eoiNo,
                                    plantLocation: String((_c = row.plantLocation) !== null && _c !== void 0 ? _c : '').trim(),
                                    city: String((_d = row.city) !== null && _d !== void 0 ? _d : '').trim(),
                                    stateName: String((_e = row.stateName) !== null && _e !== void 0 ? _e : '').trim(),
                                    countryName: String((_f = row.countryName) !== null && _f !== void 0 ? _f : '').trim(),
                                    label: plantName,
                                };
                                existing = byName.get(key);
                                if (!existing) {
                                    byName.set(key, entry);
                                    continue;
                                }
                                if (eoiNo && existing.eoiNo && existing.eoiNo !== eoiNo) {
                                    eois = new Set([existing.eoiNo, eoiNo].filter(function (v) { return v.trim() !== ''; }));
                                    entry.label = "".concat(plantName, " (").concat(Array.from(eois).join(', '), ")");
                                }
                                byName.set(key, entry);
                            }
                            return [2 /*return*/, Array.from(byName.values()).sort(function (a, b) {
                                    return a.label.localeCompare(b.label);
                                })];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.assertPlantNameForUrn = function (urnNo, plantName) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedName, options, key, match;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            normalizedName = plantName.trim();
                            if (!normalizedName) {
                                throw new common_1.BadRequestException('name is required');
                            }
                            return [4 /*yield*/, this.listPlantOptionsForUrn(urnNo)];
                        case 1:
                            options = _a.sent();
                            if (options.length === 0) {
                                throw new common_1.BadRequestException('No manufacturing plants are registered for this URN. Add plants on the product registration before scheduling a site visit.');
                            }
                            key = this.normalizePlantNameKey(normalizedName);
                            match = options.find(function (o) { return _this.normalizePlantNameKey(o.plantName) === key; });
                            if (!match) {
                                throw new common_1.BadRequestException("name must be one of the manufacturing plants for this URN: ".concat(options.map(function (o) { return o.plantName; }).join(', ')));
                            }
                            return [2 /*return*/, match.plantName];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.list = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var urnContext, page, limit, skip, urnOptions, filter, escaped, regex, sortField, sortOrder, _a, rows, total;
                var _b;
                var _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.assertUrnExists(dto.urnNo)];
                        case 1:
                            urnContext = _g.sent();
                            page = (_c = dto.page) !== null && _c !== void 0 ? _c : 1;
                            limit = (_d = dto.limit) !== null && _d !== void 0 ? _d : 10;
                            skip = (page - 1) * limit;
                            urnOptions = this.urnCandidates(urnContext.normalizedUrn);
                            filter = {
                                urnNo: { $in: urnOptions },
                            };
                            if (!dto.includeDeleted) {
                                filter.isDeleted = { $ne: true };
                            }
                            if ((_e = dto.search) === null || _e === void 0 ? void 0 : _e.trim()) {
                                escaped = dto.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                regex = new RegExp(escaped, 'i');
                                filter.$or = [{ name: regex }, { conductedBy: regex }, { city: regex }];
                            }
                            sortField = (_f = dto.sortBy) !== null && _f !== void 0 ? _f : 'createdAt';
                            sortOrder = dto.order === 'asc' ? 1 : -1;
                            return [4 /*yield*/, Promise.all([
                                    this.siteVisitModel
                                        .find(filter)
                                        .sort((_b = {}, _b[sortField] = sortOrder, _b))
                                        .skip(skip)
                                        .limit(limit)
                                        .exec(),
                                    this.siteVisitModel.countDocuments(filter).exec(),
                                ])];
                        case 2:
                            _a = _g.sent(), rows = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    data: rows.map(function (r) { return (0, urn_site_visit_util_1.formatSiteVisitRecord)(r); }),
                                    total: total,
                                    page: page,
                                    limit: limit,
                                }];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.findAllByUrnForEmbed = function (urnNo_1) {
            return __awaiter(this, arguments, void 0, function (urnNo, limit) {
                var urnContext, urnOptions, rows;
                if (limit === void 0) { limit = 100; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.assertUrnExists(urnNo).catch(function () { return null; })];
                        case 1:
                            urnContext = _a.sent();
                            if (!urnContext) {
                                return [2 /*return*/, []];
                            }
                            urnOptions = this.urnCandidates(urnContext.normalizedUrn);
                            return [4 /*yield*/, this.siteVisitModel
                                    .find({ urnNo: { $in: urnOptions }, isDeleted: { $ne: true } })
                                    .sort({ createdAt: -1 })
                                    .limit(limit)
                                    .exec()];
                        case 2:
                            rows = _a.sent();
                            return [2 /*return*/, rows.map(function (r) { return (0, urn_site_visit_util_1.formatSiteVisitRecord)(r); })];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.getById = function (id, urnNoQuery) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, doc, expected, actual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            objectId = this.toObjectId(id, 'id');
                            return [4 /*yield*/, this.siteVisitModel.findById(objectId).exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.isDeleted) {
                                throw new common_1.NotFoundException('Site visit not found');
                            }
                            if (urnNoQuery) {
                                expected = this.normalizeUrnNo(urnNoQuery);
                                actual = this.normalizeUrnNo(doc.urnNo);
                                if (expected && actual !== expected) {
                                    throw new common_1.BadRequestException('Site visit does not belong to the requested URN');
                                }
                            }
                            return [2 /*return*/, (0, urn_site_visit_util_1.formatSiteVisitRecord)(doc)];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.create = function (dto, actorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var urnContext, normalizedName, duplicate, actor, doc, urnStatus;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.assertUrnExists(dto.urnNo)];
                        case 1:
                            urnContext = _d.sent();
                            return [4 /*yield*/, this.assertPlantNameForUrn(urnContext.normalizedUrn, dto.name)];
                        case 2:
                            normalizedName = _d.sent();
                            return [4 /*yield*/, this.siteVisitModel
                                    .findOne({
                                    urnNo: { $in: this.urnCandidates(urnContext.normalizedUrn) },
                                    name: normalizedName,
                                    isDeleted: { $ne: true },
                                })
                                    .lean()
                                    .exec()];
                        case 3:
                            duplicate = _d.sent();
                            if (duplicate) {
                                throw new common_1.ConflictException('A site visit with this name already exists for this URN');
                            }
                            actor = this.parseActorId(actorUserId);
                            return [4 /*yield*/, this.siteVisitModel.create({
                                    urnNo: urnContext.normalizedUrn,
                                    name: normalizedName,
                                    addressLine1: dto.addressLine1.trim(),
                                    addressLine2: String((_a = dto.addressLine2) !== null && _a !== void 0 ? _a : '').trim(),
                                    city: dto.city.trim(),
                                    state: dto.state.trim(),
                                    postalCode: '',
                                    country: dto.country.trim(),
                                    auditType: ((_b = dto.auditType) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                                    auditConductedOn: this.parseOptionalDate(dto.auditConductedOn),
                                    conductedBy: ((_c = dto.conductedBy) === null || _c === void 0 ? void 0 : _c.trim()) || null,
                                    createdBy: actor,
                                    updatedBy: actor,
                                    isDeleted: false,
                                })];
                        case 4:
                            doc = _d.sent();
                            return [4 /*yield*/, this.syncUrnStatusAfterSiteVisitChange(urnContext.normalizedUrn, urnContext.vendorId)];
                        case 5:
                            urnStatus = _d.sent();
                            this.logSiteVisitEvent('urn_site_visit_created', urnContext.normalizedUrn, String(doc._id), doc.name, urnStatus);
                            return [2 /*return*/, (0, urn_site_visit_util_1.formatSiteVisitRecord)(doc)];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.update = function (id, dto, actorUserId, rawBody) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, existing, urnContext, updateFields, $set, name_1, duplicate, updated, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (rawBody &&
                                (rawBody.urnNo !== undefined ||
                                    rawBody.urn_no !== undefined ||
                                    rawBody['urnNo'] !== undefined)) {
                                throw new common_1.BadRequestException('urnNo cannot be changed on update');
                            }
                            objectId = this.toObjectId(id, 'id');
                            return [4 /*yield*/, this.siteVisitModel.findById(objectId).exec()];
                        case 1:
                            existing = _c.sent();
                            if (!existing || existing.isDeleted) {
                                throw new common_1.NotFoundException('Site visit not found');
                            }
                            return [4 /*yield*/, this.assertUrnExists(existing.urnNo)];
                        case 2:
                            urnContext = _c.sent();
                            updateFields = [];
                            $set = {};
                            if (!(dto.name !== undefined)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.assertPlantNameForUrn(urnContext.normalizedUrn, dto.name)];
                        case 3:
                            name_1 = _c.sent();
                            if (!(name_1 !== existing.name)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.siteVisitModel
                                    .findOne({
                                    _id: { $ne: objectId },
                                    urnNo: { $in: this.urnCandidates(urnContext.normalizedUrn) },
                                    name: name_1,
                                    isDeleted: { $ne: true },
                                })
                                    .lean()
                                    .exec()];
                        case 4:
                            duplicate = _c.sent();
                            if (duplicate) {
                                throw new common_1.ConflictException('A site visit with this name already exists for this URN');
                            }
                            _c.label = 5;
                        case 5:
                            $set.name = name_1;
                            updateFields.push('name');
                            _c.label = 6;
                        case 6:
                            if (dto.addressLine1 !== undefined) {
                                $set.addressLine1 = dto.addressLine1.trim();
                                updateFields.push('addressLine1');
                            }
                            if (dto.addressLine2 !== undefined) {
                                $set.addressLine2 = dto.addressLine2.trim();
                                updateFields.push('addressLine2');
                            }
                            if (dto.city !== undefined) {
                                $set.city = dto.city.trim();
                                updateFields.push('city');
                            }
                            if (dto.state !== undefined) {
                                $set.state = dto.state.trim();
                                updateFields.push('state');
                            }
                            if (dto.country !== undefined) {
                                $set.country = dto.country.trim();
                                updateFields.push('country');
                            }
                            if (dto.auditType !== undefined) {
                                $set.auditType =
                                    dto.auditType === null ? null : String(dto.auditType).trim() || null;
                                updateFields.push('auditType');
                            }
                            if (dto.auditConductedOn !== undefined) {
                                $set.auditConductedOn = this.parseOptionalDate(dto.auditConductedOn);
                                updateFields.push('auditConductedOn');
                            }
                            if (dto.conductedBy !== undefined) {
                                $set.conductedBy =
                                    dto.conductedBy === null
                                        ? null
                                        : String(dto.conductedBy).trim() || null;
                                updateFields.push('conductedBy');
                            }
                            if (updateFields.length === 0) {
                                throw new common_1.BadRequestException('No updatable fields provided');
                            }
                            $set.updatedBy = this.parseActorId(actorUserId);
                            return [4 /*yield*/, this.siteVisitModel
                                    .findByIdAndUpdate(objectId, { $set: $set }, { new: true })
                                    .exec()];
                        case 7:
                            updated = _c.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Site visit not found after update');
                            }
                            _a = this.logSiteVisitEvent;
                            _b = ['urn_site_visit_updated',
                                urnContext.normalizedUrn,
                                String(updated._id),
                                updated.name];
                            return [4 /*yield*/, this.resolveMaxUrnWorkflowStatus(urnContext.normalizedUrn)];
                        case 8:
                            _a.apply(this, _b.concat([_c.sent(), { fields: updateFields }]));
                            return [2 /*return*/, (0, urn_site_visit_util_1.formatSiteVisitRecord)(updated)];
                    }
                });
            });
        };
        UrnSiteVisitsService_1.prototype.softDelete = function (id, actorUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var objectId, existing, urnContext, actor, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            objectId = this.toObjectId(id, 'id');
                            return [4 /*yield*/, this.siteVisitModel.findById(objectId).exec()];
                        case 1:
                            existing = _c.sent();
                            if (!existing) {
                                throw new common_1.NotFoundException('Site visit not found');
                            }
                            if (existing.isDeleted) {
                                throw new common_1.NotFoundException('Site visit not found');
                            }
                            return [4 /*yield*/, this.assertUrnExists(existing.urnNo)];
                        case 2:
                            urnContext = _c.sent();
                            actor = this.parseActorId(actorUserId);
                            return [4 /*yield*/, this.siteVisitModel.findByIdAndUpdate(objectId, {
                                    $set: { isDeleted: true, updatedBy: actor },
                                })];
                        case 3:
                            _c.sent();
                            _a = this.logSiteVisitEvent;
                            _b = ['urn_site_visit_deleted',
                                urnContext.normalizedUrn,
                                String(existing._id),
                                existing.name];
                            return [4 /*yield*/, this.resolveMaxUrnWorkflowStatus(urnContext.normalizedUrn)];
                        case 4:
                            _a.apply(this, _b.concat([_c.sent()]));
                            return [2 /*return*/];
                    }
                });
            });
        };
        return UrnSiteVisitsService_1;
    }());
    __setFunctionName(_classThis, "UrnSiteVisitsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UrnSiteVisitsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UrnSiteVisitsService = _classThis;
}();
exports.UrnSiteVisitsService = UrnSiteVisitsService;
