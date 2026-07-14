import { NotificationTemplateCode } from '../interfaces/notification.types';

export interface EmailTemplateContent {
  subject: string;
  html: string;
  text?: string;
}

export interface InAppTemplateContent {
  title: string;
  content: string;
  type?: string;
  notifyType?: string;
}

export interface NotificationTemplateDefinition {
  code: NotificationTemplateCode;
  email?: EmailTemplateContent;
  inApp?: InAppTemplateContent;
}

export const NOTIFICATION_TEMPLATES: Record<
  NotificationTemplateCode,
  NotificationTemplateDefinition
> = {
  [NotificationTemplateCode.PRODUCT_APPROVED]: {
    code: NotificationTemplateCode.PRODUCT_APPROVED,
    email: {
      subject: 'GreenPro — Product approved: {{productName}}',
      html: `
        <p>Hello,</p>
        <p>Your product <strong>{{productName}}</strong> has been approved by {{approvedBy}}.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Your product {{productName}} has been approved by {{approvedBy}}.',
    },
    inApp: {
      title: 'Product approved',
      content: '{{productName}} was approved by {{approvedBy}}.',
      type: 'success',
      notifyType: 'PRODUCT_APPROVED',
    },
  },
  [NotificationTemplateCode.PRODUCT_REJECTED]: {
    code: NotificationTemplateCode.PRODUCT_REJECTED,
    email: {
      subject: 'GreenPro — Product rejected: {{productName}}',
      html: `
        <p>Hello,</p>
        <p>Your product <strong>{{productName}}</strong> was not approved.</p>
        <p>Reason: {{reason}}</p>
        <p>Reviewed by: {{rejectedBy}}</p>
      `,
      text: 'Product {{productName}} was rejected. Reason: {{reason}}',
    },
    inApp: {
      title: 'Product rejected',
      content: '{{productName}} was rejected. {{reason}}',
      type: 'warning',
      notifyType: 'PRODUCT_REJECTED',
    },
  },
  [NotificationTemplateCode.USER_CREATED]: {
    code: NotificationTemplateCode.USER_CREATED,
    email: {
      subject: 'Welcome to GreenPro - Registration Successful',
      html: `
        <p>Dear {{name}},</p>
        <p>Your account has been created.</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Password:</strong> {{password}}</p>
        <p><strong>OTP:</strong> {{otp}}</p>
      `,
      text: 'Welcome. Email: {{email}} Password: {{password}} OTP: {{otp}}',
    },
    inApp: {
      title: 'Welcome to GreenPro',
      content: 'Your account was created. Verify your email with the OTP sent to you.',
      type: 'info',
      notifyType: 'USER_CREATED',
    },
  },
  [NotificationTemplateCode.PASSWORD_RESET]: {
    code: NotificationTemplateCode.PASSWORD_RESET,
    email: {
      subject: 'GreenPro - Password Reset',
      html: `
        <p>Your password has been reset.</p>
        <p><strong>New password:</strong> {{newPassword}}</p>
        <p>Please sign in and change your password immediately.</p>
      `,
      text: 'Your new password is: {{newPassword}}',
    },
    inApp: {
      title: 'Password reset',
      content: 'Your password was reset. Please sign in and update it.',
      type: 'warning',
      notifyType: 'PASSWORD_RESET',
    },
  },
  [NotificationTemplateCode.OTP_VERIFICATION]: {
    code: NotificationTemplateCode.OTP_VERIFICATION,
    email: {
      subject: 'GreenPro - Email verification OTP',
      html: `
        <p>Your verification code is:</p>
        <h2>{{otp}}</h2>
        <p>This code expires in {{expiresInMinutes}} minutes.</p>
      `,
      text: 'Your OTP is {{otp}} (expires in {{expiresInMinutes}} minutes).',
    },
    inApp: {
      title: 'Verification OTP',
      content: 'Your OTP is {{otp}}.',
      type: 'info',
      notifyType: 'OTP_VERIFICATION',
    },
  },
  [NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE]: {
    code: NotificationTemplateCode.VENDOR_REGISTRATION_COMPLETE,
    email: {
      subject: 'GreenPro — Email verified, registration complete',
      html: `
        <p>Dear {{manufacturerName}},</p>
        <p>Your email has been verified and your GreenPro account is ready.</p>
        <p>You can sign in and continue product registration.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Your GreenPro vendor registration is complete. You can sign in now.',
    },
    inApp: {
      title: 'Registration complete',
      content: 'Your email is verified. You can sign in and register products.',
      type: 'success',
      notifyType: 'VENDOR_REGISTRATION_COMPLETE',
    },
  },
  [NotificationTemplateCode.URN_INITIAL_APPROVED]: {
    code: NotificationTemplateCode.URN_INITIAL_APPROVED,
    email: {
      subject: 'GreenPro — URN {{urnNo}} approved for registration',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your product registration for URN <strong>{{urnNo}}</strong> has been approved by GreenPro.</p>
        <p>Please sign in to the vendor portal to review the registration fee proposal and complete the next steps.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'URN {{urnNo}} registration approved. Sign in to review the registration fee proposal.',
    },
    inApp: {
      title: 'URN approved for registration',
      content:
        'URN {{urnNo}} was approved. Review the registration fee proposal in the portal.',
      type: 'success',
      notifyType: 'URN_INITIAL_APPROVED',
    },
  },
  [NotificationTemplateCode.URN_REGISTRATION_REJECTED]: {
    code: NotificationTemplateCode.URN_REGISTRATION_REJECTED,
    email: {
      subject: 'GreenPro — URN {{urnNo}} registration not approved',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your product registration for URN <strong>{{urnNo}}</strong> was not approved at this stage.</p>
        <p>{{reason}}</p>
        <p>Contact GreenPro support if you need more information.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'URN {{urnNo}} registration was not approved. {{reason}}',
    },
    inApp: {
      title: 'URN registration not approved',
      content: 'URN {{urnNo}} was not approved. {{reason}}',
      type: 'warning',
      notifyType: 'URN_REGISTRATION_REJECTED',
    },
  },
  [NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW]: {
    code: NotificationTemplateCode.URN_SUBMITTED_FOR_REVIEW,
    email: {
      subject: 'GreenPro — URN {{urnNo}} submitted for review',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your certification forms for URN <strong>{{urnNo}}</strong> have been submitted for GreenPro review.</p>
        <p>Our team will verify your submission and update you on next steps.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'URN {{urnNo}} submitted for review. We will notify you when verification progresses.',
    },
    inApp: {
      title: 'Submitted for review',
      content: 'URN {{urnNo}} is submitted for review. Editing is locked until admin responds.',
      type: 'info',
      notifyType: 'URN_SUBMITTED_FOR_REVIEW',
    },
  },
  [NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED]: {
    code: NotificationTemplateCode.CERTIFICATION_PAYMENT_SUBMITTED,
    email: {
      subject: 'GreenPro — Certification payment submitted for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>We received your certification payment submission for URN <strong>{{urnNo}}</strong>.</p>
        <p>Payment reference: {{paymentId}}. Amount: {{quoteTotal}}.</p>
        <p>Admin verification is pending.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Certification payment submitted for {{urnNo}}. Pending admin approval.',
    },
    inApp: {
      title: 'Certification payment submitted',
      content: 'Payment for {{urnNo}} is pending admin approval.',
      type: 'info',
      notifyType: 'CERTIFICATION_PAYMENT_SUBMITTED',
    },
  },
  [NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED]: {
    code: NotificationTemplateCode.CERTIFICATION_PAYMENT_APPROVED,
    email: {
      subject: 'GreenPro — Certification payment approved for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your certification payment for URN <strong>{{urnNo}}</strong> has been approved.</p>
        <p>Payment reference: {{paymentId}}.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Certification payment approved for {{urnNo}}.',
    },
    inApp: {
      title: 'Certification payment approved',
      content: 'Certification payment for URN {{urnNo}} was approved.',
      type: 'success',
      notifyType: 'CERTIFICATION_PAYMENT_APPROVED',
    },
  },
  [NotificationTemplateCode.MANUFACTURER_APPROVED]: {
    code: NotificationTemplateCode.MANUFACTURER_APPROVED,
    email: {
      subject: 'GreenPro — Your manufacturer account is approved',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your GreenPro manufacturer account has been verified and activated.</p>
        <p>You can sign in to the vendor portal and continue product registration.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Your GreenPro manufacturer account has been approved.',
    },
    inApp: {
      title: 'Manufacturer account approved',
      content:
        'Your manufacturer account is verified. You can continue product registration.',
      type: 'success',
      notifyType: 'MANUFACTURER_APPROVED',
    },
  },
  [NotificationTemplateCode.MANUFACTURER_INACTIVE]: {
    code: NotificationTemplateCode.MANUFACTURER_INACTIVE,
    email: {
      subject: 'GreenPro — Manufacturer account inactive',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your GreenPro manufacturer account has been marked inactive.</p>
        <p>Vendor portal access is suspended until your account is reactivated by GreenPro.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Your GreenPro manufacturer account is inactive.',
    },
    inApp: {
      title: 'Manufacturer account inactive',
      content:
        'Your manufacturer account is inactive. Portal access is suspended until reactivation.',
      type: 'warning',
      notifyType: 'MANUFACTURER_INACTIVE',
    },
  },
  [NotificationTemplateCode.MANUFACTURER_REJECTED]: {
    code: NotificationTemplateCode.MANUFACTURER_REJECTED,
    email: {
      subject: 'GreenPro — Registration not approved',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your unverified GreenPro registration was not approved and has been removed.</p>
        <p>Contact GreenPro support if you believe this is an error.</p>
      `,
      text: 'Your unverified GreenPro registration was removed.',
    },
    inApp: {
      title: 'Registration not approved',
      content: 'Your unverified registration was not approved and has been removed.',
      type: 'warning',
      notifyType: 'MANUFACTURER_REJECTED',
    },
  },
  [NotificationTemplateCode.PAYMENT_PROPOSAL_READY]: {
    code: NotificationTemplateCode.PAYMENT_PROPOSAL_READY,
    email: {
      subject: 'GreenPro — {{paymentTypeLabel}} proposal ready for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>A {{paymentTypeLabel}} payment proposal for URN <strong>{{urnNo}}</strong> is ready for your review.</p>
        <p>Payment reference: {{paymentId}}. Amount: {{quoteTotal}}.</p>
        <p>Please sign in to the vendor portal to review and proceed.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: '{{paymentTypeLabel}} proposal ready for {{urnNo}}. Sign in to review.',
    },
    inApp: {
      title: 'Payment proposal ready',
      content:
        '{{paymentTypeLabel}} proposal for URN {{urnNo}} is ready. Review it in the portal.',
      type: 'info',
      notifyType: 'PAYMENT_PROPOSAL_READY',
    },
  },
  [NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR]: {
    code: NotificationTemplateCode.PRODUCT_ENQUIRY_VENDOR,
    email: {
      subject: 'GreenPro — New product enquiry for {{manufacturerName}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>You received a new product enquiry from <strong>{{visitorName}}</strong> ({{visitorEmail}}).</p>
        <p>Phone: {{visitorPhone}}</p>
        <p>{{visitorMessage}}</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'New enquiry from {{visitorName}} ({{visitorEmail}}).',
    },
    inApp: {
      title: 'New product enquiry',
      content: 'New enquiry from {{visitorName}} ({{visitorEmail}}).',
      type: 'info',
      notifyType: 'PRODUCT_ENQUIRY_VENDOR',
    },
  },
  [NotificationTemplateCode.CERTIFICATION_EXPIRY_REMINDER]: {
    code: NotificationTemplateCode.CERTIFICATION_EXPIRY_REMINDER,
    email: {
      subject: 'GreenPro — Certification expiry reminder ({{eoiNo}})',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>This is a reminder that certification for <strong>{{productName}}</strong> ({{eoiNo}}) is approaching expiry.</p>
        <p>{{reminderStage}}</p>
        <p>Please begin renewal in the vendor portal if required.</p>
      `,
      text: 'Certification expiry reminder for {{eoiNo}}.',
    },
    inApp: {
      title: 'Certification expiry reminder',
      content:
        'Certification for {{productName}} ({{eoiNo}}) is approaching expiry. {{reminderStage}}',
      type: 'warning',
      notifyType: 'CERTIFICATION_EXPIRY_REMINDER',
    },
  },
  [NotificationTemplateCode.URN_MERGED]: {
    code: NotificationTemplateCode.URN_MERGED,
    email: {
      subject: 'GreenPro — URN merge completed ({{sourceUrnNo}} → {{targetUrnNo}})',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>GreenPro merged URN <strong>{{sourceUrnNo}}</strong> into <strong>{{targetUrnNo}}</strong>.</p>
        <p>{{movedCount}} product(s) were moved. Please review your URN in the vendor portal.</p>
      `,
      text: 'URN {{sourceUrnNo}} merged into {{targetUrnNo}}.',
    },
    inApp: {
      title: 'URN merge completed',
      content:
        'URN {{sourceUrnNo}} was merged into {{targetUrnNo}}. {{movedCount}} product(s) moved.',
      type: 'info',
      notifyType: 'URN_MERGED',
    },
  },
  [NotificationTemplateCode.RENEWAL_SUBMITTED]: {
    code: NotificationTemplateCode.RENEWAL_SUBMITTED,
    email: {
      subject: 'GreenPro — Renewal submitted for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your renewal process forms for URN <strong>{{urnNo}}</strong> have been submitted for GreenPro review.</p>
      `,
      text: 'Renewal submitted for {{urnNo}}.',
    },
    inApp: {
      title: 'Renewal submitted',
      content: 'Renewal forms for URN {{urnNo}} were submitted for review.',
      type: 'info',
      notifyType: 'RENEWAL_SUBMITTED',
    },
  },
  [NotificationTemplateCode.RENEWAL_DECISION]: {
    code: NotificationTemplateCode.RENEWAL_DECISION,
    email: {
      subject: 'GreenPro — Renewal update for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your renewal for URN <strong>{{urnNo}}</strong>: {{decisionMessage}}</p>
      `,
      text: 'Renewal update for {{urnNo}}: {{decisionMessage}}',
    },
    inApp: {
      title: 'Renewal update',
      content: 'Renewal for URN {{urnNo}}: {{decisionMessage}}',
      type: 'info',
      notifyType: 'RENEWAL_DECISION',
    },
  },
  [NotificationTemplateCode.RENEWAL_COMPLETED]: {
    code: NotificationTemplateCode.RENEWAL_COMPLETED,
    email: {
      subject: 'GreenPro — Renewal completed for {{urnNo}}',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Renewal for URN <strong>{{urnNo}}</strong> is complete. Your renewed validity dates are updated in the portal.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Renewal completed for {{urnNo}}.',
    },
    inApp: {
      title: 'Renewal completed',
      content:
        'Renewal for URN {{urnNo}} is complete. Validity dates are updated in the portal.',
      type: 'success',
      notifyType: 'RENEWAL_COMPLETED',
    },
  },
  [NotificationTemplateCode.PRODUCT_NAME_CHANGE_DECISION]: {
    code: NotificationTemplateCode.PRODUCT_NAME_CHANGE_DECISION,
    email: {
      subject: 'GreenPro — Product Name Change Request {{decisionLabel}}',
      html: `
        <p>Dear {{manufacturerName}},</p>
        <p>Your product name change request has been <strong>{{decisionLabel}}</strong>.</p>
        <p><strong>URN:</strong> {{urnNo}}</p>
        <p><strong>EOI No:</strong> {{eoiNo}}</p>
        <p><strong>Current Name:</strong> {{currentName}}</p>
        <p><strong>Requested Name:</strong> {{requestedName}}</p>
        <p>{{decisionDetail}}</p>
        <p>{{remarksBlock}}</p>
        <p>Regards,<br/>GreenPro Admin</p>
      `,
      text: 'Product name change for {{urnNo}} was {{decisionLabel}}.',
    },
    inApp: {
      title: 'Product name change {{decisionLabel}}',
      content:
        'Name change for {{urnNo}} ({{currentName}} → {{requestedName}}) was {{decisionLabel}}.',
      type: 'info',
      notifyType: 'PRODUCT_NAME_CHANGE_DECISION',
    },
  },
  [NotificationTemplateCode.GRIEVANCE_RESPONDED]: {
    code: NotificationTemplateCode.GRIEVANCE_RESPONDED,
    email: {
      subject: 'GreenPro — Grievance {{grievanceNo}} response received',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Admin has responded to your grievance <strong>{{grievanceNo}}</strong>.</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Category:</strong> {{category}}</p>
        <p>Please sign in to the portal to review the response.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Admin responded to grievance {{grievanceNo}} ({{subject}}). Please review it in the portal.',
    },
    inApp: {
      title: 'Grievance response received',
      content:
        'Admin responded to grievance {{grievanceNo}}: {{subject}}. Please review it in the portal.',
      type: 'info',
      notifyType: 'GRIEVANCE_RESPONDED',
    },
  },
  [NotificationTemplateCode.GRIEVANCE_CLOSED]: {
    code: NotificationTemplateCode.GRIEVANCE_CLOSED,
    email: {
      subject: 'GreenPro — Grievance {{grievanceNo}} closed',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your grievance <strong>{{grievanceNo}}</strong> has been closed.</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p><strong>Category:</strong> {{category}}</p>
        <p>Please sign in to the portal for details.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Grievance {{grievanceNo}} ({{subject}}) has been closed. Please review it in the portal.',
    },
    inApp: {
      title: 'Grievance closed',
      content:
        'Grievance {{grievanceNo}} ({{subject}}) has been closed. Please review it in the portal.',
      type: 'success',
      notifyType: 'GRIEVANCE_CLOSED',
    },
  },
  [NotificationTemplateCode.ACCOUNT_DELETION_APPROVED]: {
    code: NotificationTemplateCode.ACCOUNT_DELETION_APPROVED,
    email: {
      subject: 'GreenPro — Account deletion request {{requestNo}} approved',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your account deletion request <strong>{{requestNo}}</strong> has been approved.</p>
        <p><strong>Reason:</strong> {{reason}}</p>
        <p>This does not automatically delete your account. Our team will process the request as per policy.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Account deletion request {{requestNo}} has been approved. This does not automatically delete your account.',
    },
    inApp: {
      title: 'Account deletion request approved',
      content:
        'Request {{requestNo}} ({{reason}}) was approved. Account deletion is processed offline and is not automatic.',
      type: 'info',
      notifyType: 'ACCOUNT_DELETION_APPROVED',
    },
  },
  [NotificationTemplateCode.ACCOUNT_DELETION_REJECTED]: {
    code: NotificationTemplateCode.ACCOUNT_DELETION_REJECTED,
    email: {
      subject: 'GreenPro — Account deletion request {{requestNo}} rejected',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your account deletion request <strong>{{requestNo}}</strong> has been rejected.</p>
        <p><strong>Reason:</strong> {{reason}}</p>
        <p><strong>Remarks:</strong> {{adminRemarks}}</p>
        <p>Please sign in to the portal for details.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Account deletion request {{requestNo}} was rejected. Remarks: {{adminRemarks}}.',
    },
    inApp: {
      title: 'Account deletion request rejected',
      content:
        'Request {{requestNo}} was rejected. Remarks: {{adminRemarks}}.',
      type: 'warning',
      notifyType: 'ACCOUNT_DELETION_REJECTED',
    },
  },
  [NotificationTemplateCode.ACCOUNT_DELETION_COMPLETED]: {
    code: NotificationTemplateCode.ACCOUNT_DELETION_COMPLETED,
    email: {
      subject: 'GreenPro — Account deletion request {{requestNo}} completed',
      html: `
        <p>Hello {{manufacturerName}},</p>
        <p>Your account deletion request <strong>{{requestNo}}</strong> has been marked completed in our workflow.</p>
        <p><strong>Reason:</strong> {{reason}}</p>
        <p>Please contact support if you have questions.</p>
        <p>Thank you,<br/>The GreenPro Team</p>
      `,
      text: 'Account deletion request {{requestNo}} has been marked completed.',
    },
    inApp: {
      title: 'Account deletion request completed',
      content:
        'Request {{requestNo}} ({{reason}}) has been marked completed in the deletion workflow.',
      type: 'success',
      notifyType: 'ACCOUNT_DELETION_COMPLETED',
    },
  },
};
