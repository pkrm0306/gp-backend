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
exports.NotificationsModule = void 0;
var common_1 = require("@nestjs/common");
var mongoose_1 = require("@nestjs/mongoose");
var config_1 = require("@nestjs/config");
var email_module_1 = require("../common/email.module");
var sequence_helper_1 = require("../product-registration/helpers/sequence.helper");
var user_notification_schema_1 = require("./schemas/user-notification.schema");
var notification_schema_1 = require("../common/schemas/notification.schema");
var manufacturer_schema_1 = require("../manufacturers/schemas/manufacturer.schema");
var notification_template_registry_1 = require("./templates/notification-template.registry");
var notification_channel_registry_1 = require("./channels/notification-channel.registry");
var email_notification_channel_1 = require("./channels/email-notification.channel");
var in_app_notification_channel_1 = require("./channels/in-app-notification.channel");
var notification_service_1 = require("./notification.service");
var notification_helper_1 = require("./notification.helper");
var notification_constants_1 = require("./constants/notification.constants");
var notification_recipient_service_1 = require("./helpers/notification-recipient.service");
var admin_system_notification_service_1 = require("./helpers/admin-system-notification.service");
var lifecycle_notification_service_1 = require("./lifecycle-notification.service");
var product_document_upload_notification_helper_1 = require("./helpers/product-document-upload-notification.helper");
var vendor_users_module_1 = require("../vendor-users/vendor-users.module");
var user_notifications_service_1 = require("./user-notifications.service");
var vendor_notifications_controller_1 = require("./vendor-notifications.controller");
var NotificationsModule = function () {
    var _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [
                config_1.ConfigModule,
                email_module_1.EmailModule,
                vendor_users_module_1.VendorUsersModule,
                mongoose_1.MongooseModule.forFeature([
                    { name: user_notification_schema_1.UserNotification.name, schema: user_notification_schema_1.UserNotificationSchema },
                    { name: notification_schema_1.Notification.name, schema: notification_schema_1.NotificationSchema },
                    { name: manufacturer_schema_1.Manufacturer.name, schema: manufacturer_schema_1.ManufacturerSchema },
                ]),
            ],
            controllers: [vendor_notifications_controller_1.VendorNotificationsController],
            providers: [
                sequence_helper_1.SequenceHelper,
                notification_template_registry_1.NotificationTemplateRegistry,
                email_notification_channel_1.EmailNotificationChannel,
                in_app_notification_channel_1.InAppNotificationChannel,
                {
                    provide: notification_constants_1.NOTIFICATION_CHANNEL_HANDLERS,
                    useFactory: function (email, inApp) { return [email, inApp]; },
                    inject: [email_notification_channel_1.EmailNotificationChannel, in_app_notification_channel_1.InAppNotificationChannel],
                },
                notification_channel_registry_1.NotificationChannelRegistry,
                notification_service_1.NotificationService,
                notification_helper_1.NotificationHelper,
                notification_recipient_service_1.NotificationRecipientService,
                admin_system_notification_service_1.AdminSystemNotificationService,
                lifecycle_notification_service_1.LifecycleNotificationService,
                product_document_upload_notification_helper_1.ProductDocumentUploadNotificationHelper,
                user_notifications_service_1.UserNotificationsService,
            ],
            exports: [
                notification_helper_1.NotificationHelper,
                notification_service_1.NotificationService,
                notification_template_registry_1.NotificationTemplateRegistry,
                lifecycle_notification_service_1.LifecycleNotificationService,
                product_document_upload_notification_helper_1.ProductDocumentUploadNotificationHelper,
                notification_recipient_service_1.NotificationRecipientService,
                admin_system_notification_service_1.AdminSystemNotificationService,
                user_notifications_service_1.UserNotificationsService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationsModule = _classThis = /** @class */ (function () {
        function NotificationsModule_1() {
        }
        return NotificationsModule_1;
    }());
    __setFunctionName(_classThis, "NotificationsModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationsModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationsModule = _classThis;
}();
exports.NotificationsModule = NotificationsModule;
