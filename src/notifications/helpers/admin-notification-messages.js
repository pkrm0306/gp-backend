"use strict";
/**
 * Admin bell feed copy (legacy GreenPro admin UI style).
 * Uses manufacturer / company name — never the word "Vendor" in titles or messages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationMessages = void 0;
exports.resolveManufacturerDisplayName = resolveManufacturerDisplayName;
function resolveManufacturerDisplayName(input) {
    var _a, _b, _c, _d;
    return (String((_a = input.manufacturerName) !== null && _a !== void 0 ? _a : '').trim() ||
        String((_b = input.companyName) !== null && _b !== void 0 ? _b : '').trim() ||
        String((_c = input.contactName) !== null && _c !== void 0 ? _c : '').trim() ||
        String((_d = input.email) !== null && _d !== void 0 ? _d : '').trim() ||
        'Manufacturer');
}
exports.AdminNotificationMessages = {
    newRegistration: function (manufacturerName) {
        return {
            title: 'New Registration',
            message: "A New ".concat(manufacturerName, " Has Been Registered In The Portal"),
            actorName: manufacturerName,
        };
    },
    registrationComplete: function (manufacturerName) {
        return {
            title: 'Registration Complete',
            message: "".concat(manufacturerName, " Has Verified Email And Can Use The Portal"),
            actorName: manufacturerName,
        };
    },
    vendorRegistrationOtpSent: function (manufacturerName, email) {
        return {
            title: "Vendor Registration OTP \u2014 ".concat(manufacturerName),
            message: "Registration OTP email was sent to ".concat(email, " for ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    vendorOtpResent: function (manufacturerName, email) {
        return {
            title: "Vendor OTP Resent \u2014 ".concat(manufacturerName),
            message: "Verification OTP was resent to ".concat(email, " for ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    urnInitialApproved: function (manufacturerName, urnNo, productName) {
        var productLabel = (productName === null || productName === void 0 ? void 0 : productName.trim()) ? " (".concat(productName, ")") : '';
        return {
            title: "URN Initial Approval \u2014 ".concat(manufacturerName),
            message: "URN ".concat(urnNo).concat(productLabel, " was approved for ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    urnRegistrationRejected: function (manufacturerName, urnNo, productName) {
        var productLabel = (productName === null || productName === void 0 ? void 0 : productName.trim()) ? " \"".concat(productName, "\"") : '';
        return {
            title: "URN Registration Rejected \u2014 ".concat(manufacturerName),
            message: "URN ".concat(urnNo).concat(productLabel, " registration was rejected for ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    paymentProposalReady: function (manufacturerName, urnNo, paymentTypeLabel, paymentId) {
        return {
            title: "".concat(paymentTypeLabel, " Proposal \u2014 ").concat(manufacturerName),
            message: "".concat(paymentTypeLabel, " payment proposal (ref ").concat(paymentId, ") is ready for URN ").concat(urnNo, " \u2014 ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    plantMerged: function (manufacturerName, urnNo, mergeSummary) {
        return {
            title: "Plant Merge \u2014 ".concat(manufacturerName),
            message: "Manufacturing plant merge on URN ".concat(urnNo, " for ").concat(manufacturerName, ": ").concat(mergeSummary),
            actorName: manufacturerName,
        };
    },
    productNameChangeDecision: function (manufacturerName, urnNo, currentName, requestedName, decision) {
        var verb = decision === 'approved' ? 'approved' : 'rejected';
        return {
            title: "Product Name Change ".concat(decision === 'approved' ? 'Approved' : 'Rejected', " \u2014 ").concat(manufacturerName),
            message: "Name change request on URN ".concat(urnNo, " was ").concat(verb, ": \"").concat(currentName, "\" \u2192 \"").concat(requestedName, "\""),
            actorName: manufacturerName,
        };
    },
    documentUploaded: function (manufacturerName) {
        return {
            title: "Document Uploaded By ".concat(manufacturerName),
            message: "New Document Has Been Uploaded by ".concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    certificationFeeSubmitted: function (manufacturerName) {
        return {
            title: "Certification Fee Submitted By ".concat(manufacturerName),
            message: "Certification Fee Submitted By ".concat(manufacturerName, ", Please Review the portal"),
            actorName: manufacturerName,
        };
    },
    certificationFeeApproved: function (manufacturerName, urnNo) {
        return {
            title: "Certification Payment Approved \u2014 ".concat(manufacturerName),
            message: "Certification payment for URN ".concat(urnNo, " was approved for ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    urnSubmittedForReview: function (manufacturerName, urnNo, productNames) {
        if (productNames === void 0) { productNames = []; }
        var names = productNames
            .map(function (n) { return String(n !== null && n !== void 0 ? n : '').trim(); })
            .filter(Boolean);
        var productBit = names.length === 0
            ? ''
            : names.length === 1
                ? " (product: \"".concat(names[0], "\")")
                : " (".concat(names.length, " products)");
        return {
            title: "URN Submitted For Review By ".concat(manufacturerName),
            message: "".concat(manufacturerName, " sent URN ").concat(urnNo, " for review").concat(productBit, ". Please review the portal."),
            actorName: manufacturerName,
        };
    },
    productRegistered: function (manufacturerName, urnNo, productNames, eoiNo) {
        var names = productNames
            .map(function (n) { return String(n !== null && n !== void 0 ? n : '').trim(); })
            .filter(Boolean);
        var quoted = names.length === 0
            ? 'a product'
            : names.length === 1
                ? "\"".concat(names[0], "\"")
                : "".concat(names.length, " products: ").concat(names.map(function (n) { return "\"".concat(n, "\""); }).join(', '));
        var eoiSuffix = (eoiNo === null || eoiNo === void 0 ? void 0 : eoiNo.trim()) && names.length <= 1 ? " (EOI ".concat(eoiNo.trim(), ")") : '';
        var pluralTitle = names.length > 1 ? 'Products Registered' : 'Product Registered';
        return {
            title: "".concat(pluralTitle, " \u2014 ").concat(manufacturerName),
            message: "".concat(manufacturerName, " registered ").concat(quoted, " on URN ").concat(urnNo).concat(eoiSuffix),
            actorName: manufacturerName,
        };
    },
    manufacturerApproved: function (manufacturerName) {
        return {
            title: "Manufacturer Approved \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " has been verified and activated on the portal"),
            actorName: manufacturerName,
        };
    },
    manufacturerInactive: function (manufacturerName) {
        return {
            title: "Manufacturer Inactive \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " has been marked inactive on the portal"),
            actorName: manufacturerName,
        };
    },
    manufacturerRejected: function (manufacturerName) {
        return {
            title: "Unverified Manufacturer Removed \u2014 ".concat(manufacturerName),
            message: "Unverified registration for ".concat(manufacturerName, " was removed from the portal"),
            actorName: manufacturerName,
        };
    },
    productCertified: function (manufacturerName, urnNo, productName) {
        return {
            title: "Product Certified \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " product \"").concat(productName, "\" on URN ").concat(urnNo, " is now certified"),
            actorName: manufacturerName,
        };
    },
    productRejected: function (manufacturerName, urnNo, productName) {
        return {
            title: "Product Rejected \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " product \"").concat(productName, "\" on URN ").concat(urnNo, " was rejected"),
            actorName: manufacturerName,
        };
    },
    productNameChangeRequested: function (manufacturerName, urnNo, currentName, requestedName, reason) {
        var trimmedReason = String(reason !== null && reason !== void 0 ? reason : '').trim();
        var reasonSuffix = trimmedReason
            ? ". Reason: ".concat(trimmedReason.slice(0, 200)).concat(trimmedReason.length > 200 ? '…' : '')
            : '';
        return {
            title: "Product Name Change Request \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " requested renaming \"").concat(currentName, "\" to \"").concat(requestedName, "\" on URN ").concat(urnNo).concat(reasonSuffix),
            actorName: manufacturerName,
        };
    },
    productEnquiry: function (manufacturerName, visitorName) {
        return {
            title: "New Product Enquiry \u2014 ".concat(manufacturerName),
            message: "".concat(visitorName, " submitted an enquiry for ").concat(manufacturerName),
            actorName: visitorName,
        };
    },
    certificationExpiryReminder: function (manufacturerName, urnNo, eoiNo, stage) {
        return {
            title: "Certification Expiry \u2014 ".concat(manufacturerName),
            message: "".concat(stage, " reminder sent for ").concat(eoiNo || urnNo, " (").concat(manufacturerName, ")"),
            actorName: manufacturerName,
        };
    },
    urnMerged: function (manufacturerName, sourceUrn, targetUrn, movedCount) {
        return {
            title: "URN Merged \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " merged URN ").concat(sourceUrn, " into ").concat(targetUrn, " (").concat(movedCount, " products)"),
            actorName: manufacturerName,
        };
    },
    renewalSubmitted: function (manufacturerName, urnNo) {
        return {
            title: "Renewal Submitted \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " submitted renewal forms for URN ").concat(urnNo),
            actorName: manufacturerName,
        };
    },
    renewalDecision: function (manufacturerName, urnNo, decision) {
        var verb = decision === 'approved' ? 'approved for final review' : 'sent back to vendor';
        return {
            title: "Renewal Update \u2014 ".concat(manufacturerName),
            message: "Renewal for URN ".concat(urnNo, " was ").concat(verb),
            actorName: manufacturerName,
        };
    },
    renewalCompleted: function (manufacturerName, urnNo) {
        return {
            title: "Renewal Completed \u2014 ".concat(manufacturerName),
            message: "Renewal for URN ".concat(urnNo, " is complete for ").concat(manufacturerName),
            actorName: manufacturerName,
        };
    },
    passwordReset: function (email, portal) {
        var portalLabel = portal ? " (".concat(portal, " portal)") : '';
        return {
            title: 'Password Reset',
            message: "Password was reset for ".concat(email).concat(portalLabel),
            actorName: email,
        };
    },
    grievanceCreated: function (manufacturerName, grievanceNo, subject, category) {
        var categorySuffix = (category === null || category === void 0 ? void 0 : category.trim()) ? " (".concat(category.trim(), ")") : '';
        return {
            title: "Grievance Raised \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " raised grievance ").concat(grievanceNo).concat(categorySuffix, ": ").concat(subject),
            actorName: manufacturerName,
        };
    },
    accountDeletionRequested: function (manufacturerName, requestNo, reason) {
        return {
            title: "Account Deletion Requested \u2014 ".concat(manufacturerName),
            message: "".concat(manufacturerName, " submitted account deletion request ").concat(requestNo, " (").concat(reason, ")"),
            actorName: manufacturerName,
        };
    },
};
