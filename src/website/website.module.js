"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var website_controller_1 = require("./website.controller");
var website_service_1 = require("./website.service");
var newsletter_subscriber_schema_1 = require("./schemas/newsletter-subscriber.schema");
var contact_message_schema_1 = require("./schemas/contact-message.schema");
var event_schema_1 = require("../events/schemas/event.schema");
var product_schema_1 = require("../product-registration/schemas/product.schema");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var category_schema_1 = require("../categories/schemas/category.schema");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
var manufacturers_module_1 = require("../manufacturers/manufacturers.module");
var categories_module_1 = require("../categories/categories.module");
var product_registration_module_1 = require("../product-registration/product-registration.module");
var admin_module_1 = require("../admin/admin.module");
var gallery_module_1 = require("../gallery/gallery.module");
var summits_module_1 = require("../summits/summits.module");
var notification_schema_1 = require("../common/schemas/notification.schema");
var notifications_module_1 = require("../notifications/notifications.module");
var website_analytics_module_1 = require("./website-analytics.module");
var WebsiteModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                mongoose_1.MongooseModule.forFeature([
                    { name: newsletter_subscriber_schema_1.NewsletterSubscriber.name, schema: newsletter_subscriber_schema_1.NewsletterSubscriberSchema },
                    { name: contact_message_schema_1.ContactMessage.name, schema: contact_message_schema_1.ContactMessageSchema },
                    { name: event_schema_1.Event.name, schema: event_schema_1.EventSchema },
                    { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                    { name: manufacturer_schema_1.Manufacturer.name, schema: manufacturer_schema_1.ManufacturerSchema },
                    { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                    { name: vendor_user_schema_1.VendorUser.name, schema: vendor_user_schema_1.VendorUserSchema },
                    { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                ]),
                manufacturers_module_1.ManufacturersModule,
                categories_module_1.CategoriesModule,
                product_registration_module_1.ProductRegistrationModule,
                admin_module_1.AdminModule,
                gallery_module_1.GalleryModule,
                summits_module_1.SummitsModule,
                notifications_module_1.NotificationsModule,
                website_analytics_module_1.WebsiteAnalyticsModule,
            ],
            controllers: [website_controller_1.WebsiteController],
            providers: [website_service_1.WebsiteService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WebsiteModule = _classThis = /** @class */ (function () {
        function WebsiteModule_1() {
        }
        return WebsiteModule_1;
    }());
    __setFunctionName(_classThis, "WebsiteModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebsiteModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebsiteModule = _classThis;
}();
exports.WebsiteModule = WebsiteModule;
