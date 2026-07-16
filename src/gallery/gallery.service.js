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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("mongoose");
var gallery_id_counter_schema_1 = require("./schemas/gallery-id-counter.schema");
function toDateOnlyIso(value) {
    return value.toISOString().slice(0, 10);
}
var GalleryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GalleryService = _classThis = /** @class */ (function () {
        function GalleryService_1(galleryModel, galleryCounterModel) {
            this.galleryModel = galleryModel;
            this.galleryCounterModel = galleryCounterModel;
        }
        GalleryService_1.prototype.resolveImagePath = function (image) {
            var raw = String(image !== null && image !== void 0 ? image : '').trim();
            if (!raw)
                return '';
            if (raw.startsWith('/uploads/')) {
                return raw.replace(/^\/uploads\//, '');
            }
            if (raw.startsWith('uploads/')) {
                return raw.replace(/^uploads\//, '');
            }
            return raw;
        };
        GalleryService_1.prototype.nextGalleryId = function () {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.galleryCounterModel
                                .findOneAndUpdate({ _id: gallery_id_counter_schema_1.GALLERY_ID_COUNTER_KEY }, { $inc: { seq: 1 } }, { new: true, upsert: true })
                                .exec()];
                        case 1:
                            doc = _a.sent();
                            if (!doc || typeof doc.seq !== 'number' || !Number.isFinite(doc.seq)) {
                                throw new Error('Failed to allocate gallery id');
                            }
                            return [2 /*return*/, doc.seq];
                    }
                });
            });
        };
        GalleryService_1.prototype.parseGalleryIdentifier = function (identifier) {
            var raw = String(identifier !== null && identifier !== void 0 ? identifier : '').trim();
            if (!raw)
                throw new common_1.BadRequestException('Gallery id is required');
            if (mongoose_1.Types.ObjectId.isValid(raw)) {
                return { where: { _id: new mongoose_1.Types.ObjectId(raw) } };
            }
            var asNumber = Number.parseInt(raw, 10);
            if (!Number.isFinite(asNumber) || asNumber <= 0) {
                throw new common_1.BadRequestException('Invalid gallery id (expected Mongo _id or numeric galleryId)');
            }
            return { where: { galleryId: asNumber } };
        };
        GalleryService_1.prototype.formatGalleryResponse = function (item) {
            var _a, _b, _c, _d, _e, _f;
            if (!item)
                return item;
            var obj = typeof item.toObject === 'function' ? item.toObject() : item;
            var id = (obj === null || obj === void 0 ? void 0 : obj._id)
                ? String(obj._id)
                : (obj === null || obj === void 0 ? void 0 : obj.id)
                    ? String(obj.id)
                    : undefined;
            var _g = obj !== null && obj !== void 0 ? obj : {}, _id = _g._id, __v = _g.__v, rest = __rest(_g, ["_id", "__v"]);
            var dateValue = (rest === null || rest === void 0 ? void 0 : rest.date) instanceof Date
                ? rest.date
                : (rest === null || rest === void 0 ? void 0 : rest.date)
                    ? new Date(rest.date)
                    : null;
            var datePart = dateValue && !Number.isNaN(dateValue.getTime())
                ? toDateOnlyIso(dateValue)
                : '';
            var images = Array.isArray(rest === null || rest === void 0 ? void 0 : rest.galleryImages)
                ? rest.galleryImages
                : (rest === null || rest === void 0 ? void 0 : rest.image)
                    ? [rest.image]
                    : [];
            return __assign(__assign({}, rest), { id: id, galleryId: rest === null || rest === void 0 ? void 0 : rest.galleryId, eventId: rest === null || rest === void 0 ? void 0 : rest.galleryId, title: (_a = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _a !== void 0 ? _a : '', eventName: (_b = rest === null || rest === void 0 ? void 0 : rest.title) !== null && _b !== void 0 ? _b : '', description: (_c = rest === null || rest === void 0 ? void 0 : rest.description) !== null && _c !== void 0 ? _c : '', eventDescription: (_d = rest === null || rest === void 0 ? void 0 : rest.description) !== null && _d !== void 0 ? _d : '', date: datePart, eventDate: datePart, image: (_e = images[0]) !== null && _e !== void 0 ? _e : null, galleryImages: images, gallery_image: (_f = rest === null || rest === void 0 ? void 0 : rest.gallery_image) !== null && _f !== void 0 ? _f : this.resolveImagePath(rest === null || rest === void 0 ? void 0 : rest.image), is_active: Number(rest === null || rest === void 0 ? void 0 : rest.status) === 1 });
        };
        GalleryService_1.prototype.mapGalleryListRow = function (g, serialNo) {
            var _a;
            var formatted = this.formatGalleryResponse(g);
            return {
                s_no: serialNo,
                id: formatted.id,
                eventId: formatted.galleryId,
                galleryId: formatted.galleryId,
                image: formatted.image,
                galleryImages: formatted.galleryImages,
                gallery_image: formatted.gallery_image,
                title: formatted.title,
                eventName: formatted.title,
                description: formatted.description,
                eventDescription: formatted.description,
                galleryType: (_a = formatted.galleryType) !== null && _a !== void 0 ? _a : '',
                date: formatted.date,
                eventDate: formatted.date,
                is_active: formatted.is_active,
            };
        };
        GalleryService_1.prototype.createGallery = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var galleryId, now, images, doc, saved;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.nextGalleryId()];
                        case 1:
                            galleryId = _a.sent();
                            now = new Date();
                            images = Array.isArray(payload.galleryImages) && payload.galleryImages.length
                                ? payload.galleryImages
                                : payload.image
                                    ? [payload.image]
                                    : [];
                            doc = new this.galleryModel({
                                galleryId: galleryId,
                                title: payload.title,
                                image: images[0],
                                gallery_image: this.resolveImagePath(images[0]),
                                galleryImages: images,
                                galleryType: payload.galleryType,
                                description: payload.description,
                                date: payload.date,
                                status: payload.status === 0 || payload.status === 1 ? payload.status : 1,
                                createdDate: now,
                                updatedDate: now,
                            });
                            return [4 /*yield*/, doc.save()];
                        case 2:
                            saved = _a.sent();
                            return [2 /*return*/, this.formatGalleryResponse(saved)];
                    }
                });
            });
        };
        GalleryService_1.prototype.updateGallery = function (identifier, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var where, $set, first, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseGalleryIdentifier(identifier).where;
                            $set = { updatedDate: new Date() };
                            if (payload.title !== undefined && String(payload.title).trim() !== '') {
                                $set.title = payload.title;
                            }
                            if (payload.date !== undefined) {
                                $set.date = payload.date;
                            }
                            if (payload.description !== undefined &&
                                String(payload.description).trim() !== '') {
                                $set.description = payload.description;
                            }
                            if (payload.galleryType !== undefined) {
                                $set.galleryType = payload.galleryType;
                            }
                            if (payload.image !== undefined) {
                                $set.image = payload.image;
                                $set.gallery_image = this.resolveImagePath(payload.image);
                            }
                            if (payload.galleryImages !== undefined) {
                                $set.galleryImages = Array.isArray(payload.galleryImages)
                                    ? payload.galleryImages
                                    : [];
                                first = Array.isArray(payload.galleryImages)
                                    ? payload.galleryImages[0]
                                    : undefined;
                                if (first) {
                                    $set.image = first;
                                    $set.gallery_image = this.resolveImagePath(first);
                                }
                            }
                            return [4 /*yield*/, this.galleryModel
                                    .findOneAndUpdate(__assign({}, where), { $set: $set }, { new: true })
                                    .lean()
                                    .exec()];
                        case 1:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Gallery item not found');
                            }
                            return [2 /*return*/, this.formatGalleryResponse(updated)];
                    }
                });
            });
        };
        GalleryService_1.prototype.listGalleryPaginated = function () {
            return __awaiter(this, arguments, void 0, function (page, perPage, options) {
                var safePage, safePerPage, where, _a, total, rows, totalPages, data;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (perPage === void 0) { perPage = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
                            safePerPage = Number.isFinite(perPage) && perPage > 0 ? Math.floor(perPage) : 50;
                            where = {};
                            if (options === null || options === void 0 ? void 0 : options.activeOnly) {
                                where.status = 1;
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.galleryModel.countDocuments(where).exec(),
                                    this.galleryModel
                                        .find(where)
                                        .sort({ createdDate: -1, _id: -1 })
                                        .skip((safePage - 1) * safePerPage)
                                        .limit(safePerPage)
                                        .lean()
                                        .exec(),
                                ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], rows = _a[1];
                            totalPages = total > 0 ? Math.ceil(total / safePerPage) : 0;
                            data = (rows !== null && rows !== void 0 ? rows : []).map(function (row, idx) {
                                return _this.mapGalleryListRow(row, (safePage - 1) * safePerPage + idx + 1);
                            });
                            return [2 /*return*/, {
                                    data: data,
                                    pagination: {
                                        page: safePage,
                                        perPage: safePerPage,
                                        total: total,
                                        totalPages: totalPages,
                                    },
                                }];
                    }
                });
            });
        };
        GalleryService_1.prototype.getGalleryById = function (identifier) {
            return __awaiter(this, void 0, void 0, function () {
                var where, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseGalleryIdentifier(identifier).where;
                            return [4 /*yield*/, this.galleryModel.findOne(where).lean().exec()];
                        case 1:
                            item = _a.sent();
                            if (!item) {
                                throw new common_1.NotFoundException('Gallery item not found');
                            }
                            return [2 /*return*/, this.formatGalleryResponse(item)];
                    }
                });
            });
        };
        GalleryService_1.prototype.deleteGallery = function (identifier) {
            return __awaiter(this, void 0, void 0, function () {
                var where, res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseGalleryIdentifier(identifier).where;
                            return [4 /*yield*/, this.galleryModel.deleteOne(where).exec()];
                        case 1:
                            res = _a.sent();
                            if (!res || res.deletedCount === 0) {
                                throw new common_1.NotFoundException('Gallery item not found');
                            }
                            return [2 /*return*/, { id: String(identifier !== null && identifier !== void 0 ? identifier : '').trim() }];
                    }
                });
            });
        };
        GalleryService_1.prototype.setOrToggleGalleryStatus = function (identifier, status) {
            return __awaiter(this, void 0, void 0, function () {
                var where, nextStatus, current, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = this.parseGalleryIdentifier(identifier).where;
                            if (!(status === 0 || status === 1)) return [3 /*break*/, 1];
                            nextStatus = status;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.galleryModel
                                .findOne(where)
                                .select('status')
                                .lean()
                                .exec()];
                        case 2:
                            current = _a.sent();
                            if (!current) {
                                throw new common_1.NotFoundException('Gallery item not found');
                            }
                            nextStatus = Number(current.status) === 1 ? 0 : 1;
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.galleryModel
                                .findOneAndUpdate(where, { $set: { status: nextStatus, updatedDate: new Date() } }, { new: true })
                                .select('_id galleryId status')
                                .lean()
                                .exec()];
                        case 4:
                            updated = _a.sent();
                            if (!updated) {
                                throw new common_1.NotFoundException('Gallery item not found');
                            }
                            return [2 /*return*/, {
                                    id: String(updated._id),
                                    galleryId: updated.galleryId,
                                    status: nextStatus === 1 ? 'active' : 'inactive',
                                    is_active: nextStatus === 1,
                                }];
                    }
                });
            });
        };
        return GalleryService_1;
    }());
    __setFunctionName(_classThis, "GalleryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GalleryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GalleryService = _classThis;
}();
exports.GalleryService = GalleryService;
