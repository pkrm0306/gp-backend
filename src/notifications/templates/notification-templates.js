"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_TEMPLATES = void 0;
var notification_types_1 = require("../interfaces/notification.types");
exports.NOTIFICATION_TEMPLATES = (_a = {},
    _a[notification_types_1.NotificationTemplateCode.PRODUCT_APPROVED] = {
        code: notification_types_1.NotificationTemplateCode.PRODUCT_APPROVED,
        email: {
            subject: 'GreenPro — Product approved: {{productName}}',
            html: "\n        <p>Hello,</p>\n        <p>Your product <strong>{{productName}}</strong> has been approved by {{approvedBy}}.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Your product {{productName}} has been approved by {{approvedBy}}.',
        },
        inApp: {
            title: 'Product approved',
            content: '{{productName}} was approved by {{approvedBy}}.',
            type: 'success',
            notifyType: 'PRODUCT_APPROVED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.PRODUCT_REJECTED] = {
        code: notification_types_1.NotificationTemplateCode.PRODUCT_REJECTED,
        email: {
            subject: 'GreenPro — Product rejected: {{productName}}',
            html: "\n        <p>Hello,</p>\n        <p>Your product <strong>{{productName}}</strong> was not approved.</p>\n        <p>Reason: {{reason}}</p>\n        <p>Reviewed by: {{rejectedBy}}</p>\n      ",
            text: 'Product {{productName}} was rejected. Reason: {{reason}}',
        },
        inApp: {
            title: 'Product rejected',
            content: '{{productName}} was rejected. {{reason}}',
            type: 'warning',
            notifyType: 'PRODUCT_REJECTED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.USER_CREATED] = {
        code: notification_types_1.NotificationTemplateCode.USER_CREATED,
        email: {
            subject: 'Welcome to GreenPro - Registration Successful',
            html: "\n        <p>Dear {{name}},</p>\n        <p>Your account has been created.</p>\n        <p><strong>Email:</strong> {{email}}</p>\n        <p><strong>Password:</strong> {{password}}</p>\n        <p><strong>OTP:</strong> {{otp}}</p>\n      ",
            text: 'Welcome. Email: {{email}} Password: {{password}} OTP: {{otp}}',
        },
        inApp: {
            title: 'Welcome to GreenPro',
            content: 'Your account was created. Verify your email with the OTP sent to you.',
            type: 'info',
            notifyType: 'USER_CREATED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.PASSWORD_RESET] = {
        code: notification_types_1.NotificationTemplateCode.PASSWORD_RESET,
        email: {
            subject: 'GreenPro - Password Reset',
            html: "\n        <p>Your password has been reset.</p>\n        <p><strong>New password:</strong> {{newPassword}}</p>\n        <p>Please sign in and change your password immediately.</p>\n      ",
            text: 'Your new password is: {{newPassword}}',
        },
        inApp: {
            title: 'Password reset',
            content: 'Your password was reset. Please sign in and update it.',
            type: 'warning',
            notifyType: 'PASSWORD_RESET',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.OTP_VERIFICATION] = {
        code: notification_types_1.NotificationTemplateCode.OTP_VERIFICATION,
        email: {
            subject: 'GreenPro - Email verification OTP',
            html: "\n        <p>Your verification code is:</p>\n        <h2>{{otp}}</h2>\n        <p>This code expires in {{expiresInMinutes}} minutes.</p>\n      ",
            text: 'Your OTP is {{otp}} (expires in {{expiresInMinutes}} minutes).',
        },
        inApp: {
            title: 'Verification OTP',
            content: 'Your OTP is {{otp}}.',
            type: 'info',
            notifyType: 'OTP_VERIFICATION',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE] = {
        code: notification_types_1.NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
        email: {
            subject: 'GreenPro — Email verified, registration complete',
            html: "\n        <p>Dear {{manufacturerName}},</p>\n        <p>Your email has been verified and your GreenPro account is ready.</p>\n        <p>You can sign in and continue product registration.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Your GreenPro vendor registration is complete. You can sign in now.',
        },
        inApp: {
            title: 'Registration complete',
            content: 'Your email is verified. You can sign in and register products.',
            type: 'success',
            notifyType: 'VENDOR_REGISTRATION_COMPLETE',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.URN_INITIAL_APPROVED] = {
        code: notification_types_1.NotificationTemplateCode.URN_INITIAL_APPROVED,
        email: {
            subject: 'GreenPro — URN {{urnNo}} approved for registration',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your product registration for URN <strong>{{urnNo}}</strong> has been approved by GreenPro.</p>\n        <p>Please sign in to the vendor portal to review the registration fee proposal and complete the next steps.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'URN {{urnNo}} registration approved. Sign in to review the registration fee proposal.',
        },
        inApp: {
            title: 'URN approved for registration',
            content: 'URN {{urnNo}} was approved. Review the registration fee proposal in the portal.',
            type: 'success',
            notifyType: 'URN_INITIAL_APPROVED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.URN_REGISTRATION_REJECTED] = {
        code: notification_types_1.NotificationTemplateCode.URN_REGISTRATION_REJECTED,
        email: {
            subject: 'GreenPro — URN {{urnNo}} registration not approved',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your product registration for URN <strong>{{urnNo}}</strong> was not approved at this stage.</p>\n        <p>{{reason}}</p>\n        <p>Contact GreenPro support if you need more information.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'URN {{urnNo}} registration was not approved. {{reason}}',
        },
        inApp: {
            title: 'URN registration not approved',
            content: 'URN {{urnNo}} was not approved. {{reason}}',
            type: 'warning',
            notifyType: 'URN_REGISTRATION_REJECTED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW] = {
        code: notification_types_1.NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW,
        email: {
            subject: 'GreenPro — URN {{urnNo}} submitted for review',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your certification forms for URN <strong>{{urnNo}}</strong> have been submitted for GreenPro review.</p>\n        <p>Our team will verify your submission and update you on next steps.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'URN {{urnNo}} submitted for review. We will notify you when verification progresses.',
        },
        inApp: {
            title: 'Submitted for review',
            content: 'URN {{urnNo}} is submitted for review. Editing is locked until admin responds.',
            type: 'info',
            notifyType: 'URN_SUBMITTED_FOR_REVIEW',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED] = {
        code: notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED,
        email: {
            subject: 'GreenPro — Certification payment submitted for {{urnNo}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>We received your certification payment submission for URN <strong>{{urnNo}}</strong>.</p>\n        <p>Payment reference: {{paymentId}}. Amount: {{quoteTotal}}.</p>\n        <p>Admin verification is pending.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Certification payment submitted for {{urnNo}}. Pending admin approval.',
        },
        inApp: {
            title: 'Certification payment submitted',
            content: 'Payment for {{urnNo}} is pending admin approval.',
            type: 'info',
            notifyType: 'CERTIFICATION_PAYMENT_SUBMITTED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED] = {
        code: notification_types_1.NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,
        email: {
            subject: 'GreenPro — Certification payment approved for {{urnNo}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your certification payment for URN <strong>{{urnNo}}</strong> has been approved.</p>\n        <p>Payment reference: {{paymentId}}.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Certification payment approved for {{urnNo}}.',
        },
        inApp: {
            title: 'Certification payment approved',
            content: 'Certification payment for URN {{urnNo}} was approved.',
            type: 'success',
            notifyType: 'CERTIFICATION_PAYMENT_APPROVED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.MANUFACTURER_APPROVED] = {
        code: notification_types_1.NotificationTemplateCode.MANUFACTURER_APPROVED,
        email: {
            subject: 'GreenPro — Your manufacturer account is approved',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your GreenPro manufacturer account has been verified and activated.</p>\n        <p>You can sign in to the vendor portal and continue product registration.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Your GreenPro manufacturer account has been approved.',
        },
        inApp: {
            title: 'Manufacturer account approved',
            content: 'Your manufacturer account is verified. You can continue product registration.',
            type: 'success',
            notifyType: 'MANUFACTURER_APPROVED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.MANUFACTURER_INACTIVE] = {
        code: notification_types_1.NotificationTemplateCode.MANUFACTURER_INACTIVE,
        email: {
            subject: 'GreenPro — Manufacturer account inactive',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your GreenPro manufacturer account has been marked inactive.</p>\n        <p>Vendor portal access is suspended until your account is reactivated by GreenPro.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Your GreenPro manufacturer account is inactive.',
        },
        inApp: {
            title: 'Manufacturer account inactive',
            content: 'Your manufacturer account is inactive. Portal access is suspended until reactivation.',
            type: 'warning',
            notifyType: 'MANUFACTURER_INACTIVE',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.MANUFACTURER_REJECTED] = {
        code: notification_types_1.NotificationTemplateCode.MANUFACTURER_REJECTED,
        email: {
            subject: 'GreenPro — Registration not approved',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your unverified GreenPro registration was not approved and has been removed.</p>\n        <p>Contact GreenPro support if you believe this is an error.</p>\n      ",
            text: 'Your unverified GreenPro registration was removed.',
        },
        inApp: {
            title: 'Registration not approved',
            content: 'Your unverified registration was not approved and has been removed.',
            type: 'warning',
            notifyType: 'MANUFACTURER_REJECTED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.PAYMENT_PROPOSAL_READY] = {
        code: notification_types_1.NotificationTemplateCode.PAYMENT_PROPOSAL_READY,
        email: {
            subject: 'GreenPro — {{paymentTypeLabel}} proposal ready for {{urnNo}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>A {{paymentTypeLabel}} payment proposal for URN <strong>{{urnNo}}</strong> is ready for your review.</p>\n        <p>Payment reference: {{paymentId}}. Amount: {{quoteTotal}}.</p>\n        <p>Please sign in to the vendor portal to review and proceed.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: '{{paymentTypeLabel}} proposal ready for {{urnNo}}. Sign in to review.',
        },
        inApp: {
            title: 'Payment proposal ready',
            content: '{{paymentTypeLabel}} proposal for URN {{urnNo}} is ready. Review it in the portal.',
            type: 'info',
            notifyType: 'PAYMENT_PROPOSAL_READY',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR] = {
        code: notification_types_1.NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR,
        email: {
            subject: 'GreenPro — New product enquiry for {{manufacturerName}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>You received a new product enquiry from <strong>{{visitorName}}</strong> ({{visitorEmail}}).</p>\n        <p>Phone: {{visitorPhone}}</p>\n        <p>{{visitorMessage}}</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'New enquiry from {{visitorName}} ({{visitorEmail}}).',
        },
        inApp: {
            title: 'New product enquiry',
            content: 'New enquiry from {{visitorName}} ({{visitorEmail}}).',
            type: 'info',
            notifyType: 'PRODUCT_ENQUIRY_VENDOR',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.CERTIFICATION_EXPIRY_REMINDER] = {
        code: notification_types_1.NotificationTemplateCode.CERTIFICATION_EXPIRY_REMINDER,
        email: {
            subject: 'GreenPro — Certification expiry reminder ({{eoiNo}})',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>This is a reminder that certification for <strong>{{productName}}</strong> ({{eoiNo}}) is approaching expiry.</p>\n        <p>{{reminderStage}}</p>\n        <p>Please begin renewal in the vendor portal if required.</p>\n      ",
            text: 'Certification expiry reminder for {{eoiNo}}.',
        },
        inApp: {
            title: 'Certification expiry reminder',
            content: 'Certification for {{productName}} ({{eoiNo}}) is approaching expiry. {{reminderStage}}',
            type: 'warning',
            notifyType: 'CERTIFICATION_EXPIRY_REMINDER',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.URN_MERGED] = {
        code: notification_types_1.NotificationTemplateCode.URN_MERGED,
        email: {
            subject: 'GreenPro — URN merge completed ({{sourceUrnNo}} → {{targetUrnNo}})',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>GreenPro merged URN <strong>{{sourceUrnNo}}</strong> into <strong>{{targetUrnNo}}</strong>.</p>\n        <p>{{movedCount}} product(s) were moved. Please review your URN in the vendor portal.</p>\n      ",
            text: 'URN {{sourceUrnNo}} merged into {{targetUrnNo}}.',
        },
        inApp: {
            title: 'URN merge completed',
            content: 'URN {{sourceUrnNo}} was merged into {{targetUrnNo}}. {{movedCount}} product(s) moved.',
            type: 'info',
            notifyType: 'URN_MERGED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.PLANT_MERGED] = {
        code: notification_types_1.NotificationTemplateCode.PLANT_MERGED,
        email: {
            subject: 'GreenPro — Manufacturing plant merge completed ({{urnNo}})',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>GreenPro completed a manufacturing plant merge for {{productName}} on URN <strong>{{urnNo}}</strong>{{eoiSuffix}}.</p>\n        <p>{{mergeSummary}}</p>\n        <p>Please review plant details in the vendor portal.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Manufacturing plant merge completed for {{urnNo}}. {{mergeSummary}}',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.RENEWAL_SUBMITTED] = {
        code: notification_types_1.NotificationTemplateCode.RENEWAL_SUBMITTED,
        email: {
            subject: 'GreenPro — Renewal submitted for {{urnNo}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your renewal process forms for URN <strong>{{urnNo}}</strong> have been submitted for GreenPro review.</p>\n      ",
            text: 'Renewal submitted for {{urnNo}}.',
        },
        inApp: {
            title: 'Renewal submitted',
            content: 'Renewal forms for URN {{urnNo}} were submitted for review.',
            type: 'info',
            notifyType: 'RENEWAL_SUBMITTED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.RENEWAL_DECISION] = {
        code: notification_types_1.NotificationTemplateCode.RENEWAL_DECISION,
        email: {
            subject: 'GreenPro — Renewal update for {{urnNo}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your renewal for URN <strong>{{urnNo}}</strong>: {{decisionMessage}}</p>\n      ",
            text: 'Renewal update for {{urnNo}}: {{decisionMessage}}',
        },
        inApp: {
            title: 'Renewal update',
            content: 'Renewal for URN {{urnNo}}: {{decisionMessage}}',
            type: 'info',
            notifyType: 'RENEWAL_DECISION',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.RENEWAL_COMPLETED] = {
        code: notification_types_1.NotificationTemplateCode.RENEWAL_COMPLETED,
        email: {
            subject: 'GreenPro — Renewal completed for {{urnNo}}',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Renewal for URN <strong>{{urnNo}}</strong> is complete. Your renewed validity dates are updated in the portal.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Renewal completed for {{urnNo}}.',
        },
        inApp: {
            title: 'Renewal completed',
            content: 'Renewal for URN {{urnNo}} is complete. Validity dates are updated in the portal.',
            type: 'success',
            notifyType: 'RENEWAL_COMPLETED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.PRODUCT_NAME_CHANGE_DECISION] = {
        code: notification_types_1.NotificationTemplateCode.PRODUCT_NAME_CHANGE_DECISION,
        email: {
            subject: 'GreenPro — Product Name Change Request {{decisionLabel}}',
            html: "\n        <p>Dear {{manufacturerName}},</p>\n        <p>Your product name change request has been <strong>{{decisionLabel}}</strong>.</p>\n        <p><strong>URN:</strong> {{urnNo}}</p>\n        <p><strong>EOI No:</strong> {{eoiNo}}</p>\n        <p><strong>Current Name:</strong> {{currentName}}</p>\n        <p><strong>Requested Name:</strong> {{requestedName}}</p>\n        <p>{{decisionDetail}}</p>\n        <p>{{remarksBlock}}</p>\n        <p>Regards,<br/>GreenPro Admin</p>\n      ",
            text: 'Product name change for {{urnNo}} was {{decisionLabel}}.',
        },
        inApp: {
            title: 'Product name change {{decisionLabel}}',
            content: 'Name change for {{urnNo}} ({{currentName}} → {{requestedName}}) was {{decisionLabel}}.',
            type: 'info',
            notifyType: 'PRODUCT_NAME_CHANGE_DECISION',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.GRIEVANCE_RESPONDED] = {
        code: notification_types_1.NotificationTemplateCode.GRIEVANCE_RESPONDED,
        email: {
            subject: 'GreenPro — Grievance {{grievanceNo}} response received',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Admin has responded to your grievance <strong>{{grievanceNo}}</strong>.</p>\n        <p><strong>Subject:</strong> {{subject}}</p>\n        <p><strong>Category:</strong> {{category}}</p>\n        <p>Please sign in to the portal to review the response.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Admin responded to grievance {{grievanceNo}} ({{subject}}). Please review it in the portal.',
        },
        inApp: {
            title: 'Grievance response received',
            content: 'Admin responded to grievance {{grievanceNo}}: {{subject}}. Please review it in the portal.',
            type: 'info',
            notifyType: 'GRIEVANCE_RESPONDED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.GRIEVANCE_CLOSED] = {
        code: notification_types_1.NotificationTemplateCode.GRIEVANCE_CLOSED,
        email: {
            subject: 'GreenPro — Grievance {{grievanceNo}} closed',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your grievance <strong>{{grievanceNo}}</strong> has been closed.</p>\n        <p><strong>Subject:</strong> {{subject}}</p>\n        <p><strong>Category:</strong> {{category}}</p>\n        <p>Please sign in to the portal for details.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Grievance {{grievanceNo}} ({{subject}}) has been closed. Please review it in the portal.',
        },
        inApp: {
            title: 'Grievance closed',
            content: 'Grievance {{grievanceNo}} ({{subject}}) has been closed. Please review it in the portal.',
            type: 'success',
            notifyType: 'GRIEVANCE_CLOSED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_APPROVED] = {
        code: notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_APPROVED,
        email: {
            subject: 'GreenPro — Account deletion request {{requestNo}} approved',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your account deletion request <strong>{{requestNo}}</strong> has been approved.</p>\n        <p><strong>Reason:</strong> {{reason}}</p>\n        <p>This does not automatically delete your account. Our team will process the request as per policy.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Account deletion request {{requestNo}} has been approved. This does not automatically delete your account.',
        },
        inApp: {
            title: 'Account deletion request approved',
            content: 'Request {{requestNo}} ({{reason}}) was approved. Account deletion is processed offline and is not automatic.',
            type: 'info',
            notifyType: 'ACCOUNT_DELETION_APPROVED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_REJECTED] = {
        code: notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_REJECTED,
        email: {
            subject: 'GreenPro — Account deletion request {{requestNo}} rejected',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your account deletion request <strong>{{requestNo}}</strong> has been rejected.</p>\n        <p><strong>Reason:</strong> {{reason}}</p>\n        <p><strong>Remarks:</strong> {{adminRemarks}}</p>\n        <p>Please sign in to the portal for details.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Account deletion request {{requestNo}} was rejected. Remarks: {{adminRemarks}}.',
        },
        inApp: {
            title: 'Account deletion request rejected',
            content: 'Request {{requestNo}} was rejected. Remarks: {{adminRemarks}}.',
            type: 'warning',
            notifyType: 'ACCOUNT_DELETION_REJECTED',
        },
    },
    _a[notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_COMPLETED] = {
        code: notification_types_1.NotificationTemplateCode.ACCOUNT_DELETION_COMPLETED,
        email: {
            subject: 'GreenPro — Account deletion request {{requestNo}} completed',
            html: "\n        <p>Hello {{manufacturerName}},</p>\n        <p>Your account deletion request <strong>{{requestNo}}</strong> has been marked completed in our workflow.</p>\n        <p><strong>Reason:</strong> {{reason}}</p>\n        <p>Please contact support if you have questions.</p>\n        <p>Thank you,<br/>The GreenPro Team</p>\n      ",
            text: 'Account deletion request {{requestNo}} has been marked completed.',
        },
        inApp: {
            title: 'Account deletion request completed',
            content: 'Request {{requestNo}} ({{reason}}) has been marked completed in the deletion workflow.',
            type: 'success',
            notifyType: 'ACCOUNT_DELETION_COMPLETED',
        },
    },
    _a);
