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
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_notification_service_1 = require("./lifecycle-notification.service");
var notification_types_1 = require("./interfaces/notification.types");
var notification_types_2 = require("./interfaces/notification.types");
describe('LifecycleNotificationService', function () {
    var send = jest.fn().mockResolvedValue({
        results: [{ channel: notification_types_2.NotificationChannel.EMAIL, success: true }],
    });
    var sendInBackground = jest.fn();
    var resolveByManufacturerId = jest.fn();
    var createFeedNotification = jest.fn();
    var sendAdminAlertEmailInBackground = jest.fn();
    var service = new lifecycle_notification_service_1.LifecycleNotificationService({ send: send, sendInBackground: sendInBackground }, { resolveByManufacturerId: resolveByManufacturerId }, {
        createFeedNotification: createFeedNotification,
        sendAdminAlertEmailInBackground: sendAdminAlertEmailInBackground,
    });
    beforeEach(function () {
        jest.clearAllMocks();
        resolveByManufacturerId.mockResolvedValue({
            userId: '507f1f77bcf86cd799439011',
            email: 'vendor@example.com',
            vendorName: 'Acme Vendor',
            companyName: 'Acme Co',
        });
    });
    it('sends email + in-app for URN initial approval and notifies admin', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyUrnInitialApproved({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        type: [notification_types_2.NotificationChannel.EMAIL, notification_types_2.NotificationChannel.IN_APP],
                        template: notification_types_1.NotificationTemplateCode.URN_INITIAL_APPROVED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'urn_initial_approved',
                        ccGroups: ['TEAM_LEADS'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends email-only for signup (USER_CREATED)', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyNewVendorRegistered({
                        userId: '507f1f77bcf86cd799439011',
                        email: 'vendor@example.com',
                        name: 'Acme Vendor',
                        companyName: 'Acme Co',
                        password: 'secret',
                        otp: '123456',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        type: [notification_types_2.NotificationChannel.EMAIL],
                        template: notification_types_1.NotificationTemplateCode.USER_CREATED,
                    }));
                    expect(createFeedNotification).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends email-only for OTP resend', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyVendorOtpResent({
                        userId: '507f1f77bcf86cd799439011',
                        email: 'vendor@example.com',
                        name: 'Acme Vendor',
                        otp: '654321',
                        expiresInMinutes: 10,
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        type: [notification_types_2.NotificationChannel.EMAIL],
                        template: notification_types_1.NotificationTemplateCode.OTP_VERIFICATION,
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies admin when vendor registers (OTP email)', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyNewVendorRegistered({
                        userId: '507f1f77bcf86cd799439011',
                        email: 'vendor@example.com',
                        name: 'Acme Vendor',
                        companyName: 'Acme Co',
                        password: 'secret',
                        otp: '123456',
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'vendor_registration_otp',
                        ccGroups: ['SHEshi'],
                    }));
                    expect(send).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not create admin feed on register failure path only after success', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    send.mockResolvedValueOnce({
                        results: [{ channel: notification_types_2.NotificationChannel.EMAIL, success: false, error: 'fail' }],
                    });
                    return [4 /*yield*/, expect(service.notifyNewVendorRegistered({
                            userId: '507f1f77bcf86cd799439011',
                            email: 'vendor@example.com',
                            name: 'Acme Vendor',
                            companyName: 'Acme Co',
                            password: 'secret',
                            otp: '123456',
                        })).rejects.toThrow()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates single admin feed on registration complete (OTP verified)', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyVendorRegistrationComplete('507f1f77bcf86cd799439011', 'vendor@example.com', 'Acme Co')];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        type: [notification_types_2.NotificationChannel.EMAIL, notification_types_2.NotificationChannel.IN_APP],
                        template: notification_types_1.NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledTimes(1);
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        title: 'Registration Complete',
                        message: expect.stringContaining('Acme Co'),
                        type: 'success',
                        referenceType: 'vendor_registration',
                        emailSubject: expect.stringContaining('Registration Complete'),
                        ccGroups: ['SHEshi'],
                    }));
                    expect(sendAdminAlertEmailInBackground).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends admin alert when vendor registers a product', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyProductRegistered({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        eoiNo: 'GP001',
                        productName: 'Widget',
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'product_registered',
                        message: expect.stringContaining('"Widget"'),
                        emailSubject: expect.stringContaining('Product registered'),
                        emailHtmlExtra: expect.stringContaining('Widget'),
                        ccGroups: ['TEAM_LEADS'],
                    }));
                    expect(createFeedNotification.mock.calls[0][0].emailHtmlExtra).toContain('Vendor registered');
                    expect(createFeedNotification.mock.calls[0][0].emailHtmlExtra).toContain('Product name list');
                    expect(send).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends admin alert with all product names for bulk registration', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyProductRegistered({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-2',
                        productNames: ['Widget', 'Gadget', 'Device'],
                        eoiNos: ['EOI-1', 'EOI-2', 'EOI-3'],
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'product_registered',
                        title: expect.stringContaining('Products Registered'),
                        message: expect.stringMatching(/Widget.*Gadget.*Device/),
                        emailSubject: expect.stringContaining('Products registered'),
                        emailHtmlExtra: expect.stringMatching(/Widget[\s\S]*Gadget[\s\S]*Device/),
                        ccGroups: ['TEAM_LEADS'],
                    }));
                    expect(createFeedNotification.mock.calls[0][0].emailHtmlExtra).toContain('EOI-2');
                    expect(send).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends admin-only alert on submit for review', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyUrnSubmittedForReview({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        productNames: ['Widget', 'Gadget'],
                        eoiNos: ['EOI-1', 'EOI-2'],
                        manufacturerName: 'Acme Co',
                    })];
                case 1:
                    _a.sent();
                    expect(sendInBackground).not.toHaveBeenCalled();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'urn_submitted_for_review',
                        emailSubject: expect.stringContaining('Vendor sent URN URN-1 for review'),
                        emailHtmlExtra: expect.stringMatching(/Vendor sent this URN for review[\s\S]*Widget[\s\S]*Gadget/),
                        ccGroups: ['TEAM_LEADS'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('still notifies admin when vendor recipient is missing on submit for review', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolveByManufacturerId.mockResolvedValue(null);
                    return [4 /*yield*/, service.notifyUrnSubmittedForReview({
                            manufacturerId: '507f1f77bcf86cd799439011',
                            urnNo: 'URN-1',
                            manufacturerName: 'Acme Co',
                        })];
                case 1:
                    _a.sent();
                    expect(sendInBackground).not.toHaveBeenCalled();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        title: expect.stringContaining('Acme Co'),
                        referenceType: 'urn_submitted_for_review',
                        emailSubject: expect.stringContaining('URN-1'),
                        emailHtmlExtra: expect.stringContaining('Vendor sent this URN for review'),
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor email only on urn registration rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyUrnRegistrationRejected({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        productName: 'Widget',
                        reason: 'Incomplete documents',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.URN_REGISTRATION_REJECTED,
                    }));
                    expect(createFeedNotification).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends admin feed + email on manufacturer approved', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyManufacturerApproved('507f1f77bcf86cd799439011', {
                        manufacturerName: 'Acme Co',
                        vendorEmail: 'vendor@example.com',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.MANUFACTURER_APPROVED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        emailSubject: expect.stringContaining('Manufacturer verified'),
                        ccGroups: ['SHEshi'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends admin feed + email on manufacturer inactive', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyManufacturerInactive('507f1f77bcf86cd799439011')];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.MANUFACTURER_INACTIVE,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        ccGroups: ['SHEshi'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor email + admin feed on manufacturer rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyManufacturerRejected('Rejected Co', '507f1f77bcf86cd799439011', { vendorEmail: 'rejected@example.com' })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        type: [notification_types_2.NotificationChannel.EMAIL],
                        template: notification_types_1.NotificationTemplateCode.MANUFACTURER_REJECTED,
                        email: 'rejected@example.com',
                    }));
                    expect(createFeedNotification).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('skips vendor email on manufacturer rejected when no vendorEmail', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyManufacturerRejected('Rejected Co', '507f1f77bcf86cd799439011')];
                case 1:
                    _a.sent();
                    expect(send).not.toHaveBeenCalled();
                    expect(createFeedNotification).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor email on plant merged and notifies admin', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyPlantMerged({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        eoiNo: 'EOI-1',
                        productName: 'Widget',
                        mergeSummary: '2 plant(s) were merged into "Main Plant".',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.PLANT_MERGED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'plant_merge',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor email on payment proposal ready and notifies admin', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyPaymentProposalReady({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        paymentId: 42,
                        paymentType: 'registration',
                        quoteTotal: 1000,
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.PAYMENT_PROPOSAL_READY,
                        payload: expect.objectContaining({ paymentTypeLabel: 'Registration fee' }),
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'payment_proposal_registration',
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor + admin on product certified', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyProductCertified({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        productName: 'Widget',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.PRODUCT_APPROVED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor email only on product rejected', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyProductRejected({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        productName: 'Widget',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.PRODUCT_REJECTED,
                    }));
                    expect(createFeedNotification).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends admin feed + email on document uploaded with team lead CC', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyDocumentUploaded({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({ ccGroups: ['TEAM_LEADS'] }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor + admin on certification payment approved', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyCertificationPaymentApproved({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        paymentId: 9,
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({ ccGroups: ['TEAM_LEADS'] }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor + admin on product enquiry with sheshi CC', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyProductEnquiry({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        manufacturerName: 'Acme Co',
                        vendorEmail: 'vendor@example.com',
                        visitorName: 'Jane',
                        visitorEmail: 'jane@example.com',
                        visitorPhone: '+911234567890',
                        visitorMessage: 'Interested',
                    })];
                case 1:
                    _a.sent();
                    expect(sendInBackground).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({ ccGroups: ['SHEshi'] }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor email on URN merge', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyUrnMerged({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        sourceUrnNo: 'URN-A',
                        targetUrnNo: 'URN-B',
                        movedCount: 3,
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.URN_MERGED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({ ccGroups: ['TEAM_LEADS'] }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor + admin on renewal submitted', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyRenewalSubmitted({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.RENEWAL_SUBMITTED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor + admin on renewal decision', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyRenewalDecision({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                        decision: 'sent_back',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.RENEWAL_DECISION,
                    }));
                    expect(createFeedNotification).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('sends vendor + admin on renewal completed', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyRenewalCompleted({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        urnNo: 'URN-1',
                    })];
                case 1:
                    _a.sent();
                    expect(send).toHaveBeenCalledWith(expect.objectContaining({
                        template: notification_types_1.NotificationTemplateCode.RENEWAL_COMPLETED,
                    }));
                    expect(createFeedNotification).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates admin feed + email for 60-day expiry reminder', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyCertificationExpiryAdmin({
                        manufacturerName: 'Acme Co',
                        urnNo: 'URN-1',
                        eoiNo: 'EOI-1',
                        stage: '60-day',
                        includeAdminEmail: false,
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'certification_expiry_60-day',
                        ccGroups: ['SHEshi'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates admin feed + email for weekly expiry reminder', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyCertificationExpiryAdmin({
                        manufacturerName: 'Acme Co',
                        urnNo: 'URN-1',
                        eoiNo: 'EOI-1',
                        stage: 'weekly',
                        includeAdminEmail: true,
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        referenceType: 'certification_expiry_weekly',
                        ccGroups: ['SHEshi'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates admin feed + email when vendor requests product name change', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyProductNameChangeRequested({
                        manufacturerId: '507f1f77bcf86cd799439011',
                        requestId: '66545c2f3d4f04cc8ec2ab99',
                        urnNo: 'URN-20260527122016',
                        eoiNo: 'GPPM1003016',
                        currentName: 'Old Product',
                        requestedName: 'New Product',
                        reason: 'Brand naming correction',
                        manufacturerName: 'Acme Co',
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        title: 'Product Name Change Request — Acme Co',
                        message: expect.stringContaining('Old Product'),
                        type: 'info',
                        referenceType: 'product_name_change_request',
                        referenceId: '66545c2f3d4f04cc8ec2ab99',
                        actorName: 'Acme Co',
                        emailSubject: expect.stringContaining('Product Name Change Request'),
                        emailHtmlExtra: expect.stringContaining('Brand naming correction'),
                        ccGroups: ['SHEshi'],
                    }));
                    return [2 /*return*/];
            }
        });
    }); });
    it('notifies admin on password reset with sheshi CC', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, service.notifyPasswordResetAdmin({
                        email: 'vendor@example.com',
                        portal: 'vendor',
                        userId: '507f1f77bcf86cd799439011',
                    })];
                case 1:
                    _a.sent();
                    expect(createFeedNotification).toHaveBeenCalledWith(expect.objectContaining({
                        title: 'Password Reset',
                        referenceType: 'password_reset',
                        ccGroups: ['SHEshi'],
                    }));
                    expect(sendAdminAlertEmailInBackground).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
