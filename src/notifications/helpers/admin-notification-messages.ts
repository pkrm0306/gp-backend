/**
 * Admin bell feed copy (legacy GreenPro admin UI style).
 * Uses manufacturer / company name — never the word "Vendor" in titles or messages.
 */

export function resolveManufacturerDisplayName(input: {
  manufacturerName?: string;
  companyName?: string;
  contactName?: string;
  email?: string;
}): string {
  return (
    String(input.manufacturerName ?? '').trim() ||
    String(input.companyName ?? '').trim() ||
    String(input.contactName ?? '').trim() ||
    String(input.email ?? '').trim() ||
    'Manufacturer'
  );
}

export const AdminNotificationMessages = {
  newRegistration(manufacturerName: string) {
    return {
      title: 'New Registration',
      message: `A New ${manufacturerName} Has Been Registered In The Portal`,
      actorName: manufacturerName,
    };
  },

  registrationComplete(manufacturerName: string) {
    return {
      title: 'Registration Complete',
      message: `${manufacturerName} Has Verified Email And Can Use The Portal`,
      actorName: manufacturerName,
    };
  },

  documentUploaded(manufacturerName: string) {
    return {
      title: `Document Uploaded By ${manufacturerName}`,
      message: `New Document Has Been Uploaded by ${manufacturerName}`,
      actorName: manufacturerName,
    };
  },

  certificationFeeSubmitted(manufacturerName: string) {
    return {
      title: `Certification Fee Submitted By ${manufacturerName}`,
      message: `Certification Fee Submitted By ${manufacturerName}, Please Review the portal`,
      actorName: manufacturerName,
    };
  },

  certificationFeeApproved(manufacturerName: string, urnNo: string) {
    return {
      title: `Certification Payment Approved — ${manufacturerName}`,
      message: `Certification payment for URN ${urnNo} was approved for ${manufacturerName}`,
      actorName: manufacturerName,
    };
  },

  urnSubmittedForReview(manufacturerName: string, urnNo: string) {
    return {
      title: `URN Submitted For Review By ${manufacturerName}`,
      message: `${manufacturerName} submitted URN ${urnNo} for review. Please review the portal.`,
      actorName: manufacturerName,
    };
  },

  manufacturerApproved(manufacturerName: string) {
    return {
      title: `Manufacturer Approved — ${manufacturerName}`,
      message: `${manufacturerName} has been verified and activated on the portal`,
      actorName: manufacturerName,
    };
  },

  manufacturerInactive(manufacturerName: string) {
    return {
      title: `Manufacturer Inactive — ${manufacturerName}`,
      message: `${manufacturerName} has been marked inactive on the portal`,
      actorName: manufacturerName,
    };
  },

  manufacturerRejected(manufacturerName: string) {
    return {
      title: `Unverified Manufacturer Removed — ${manufacturerName}`,
      message: `Unverified registration for ${manufacturerName} was removed from the portal`,
      actorName: manufacturerName,
    };
  },

  productCertified(manufacturerName: string, urnNo: string, productName: string) {
    return {
      title: `Product Certified — ${manufacturerName}`,
      message: `${manufacturerName} product "${productName}" on URN ${urnNo} is now certified`,
      actorName: manufacturerName,
    };
  },

  productRejected(manufacturerName: string, urnNo: string, productName: string) {
    return {
      title: `Product Rejected — ${manufacturerName}`,
      message: `${manufacturerName} product "${productName}" on URN ${urnNo} was rejected`,
      actorName: manufacturerName,
    };
  },

  productNameChangeRequested(
    manufacturerName: string,
    urnNo: string,
    currentName: string,
    requestedName: string,
    reason?: string,
  ) {
    const trimmedReason = String(reason ?? '').trim();
    const reasonSuffix = trimmedReason
      ? `. Reason: ${trimmedReason.slice(0, 200)}${
          trimmedReason.length > 200 ? '…' : ''
        }`
      : '';
    return {
      title: `Product Name Change Request — ${manufacturerName}`,
      message: `${manufacturerName} requested renaming "${currentName}" to "${requestedName}" on URN ${urnNo}${reasonSuffix}`,
      actorName: manufacturerName,
    };
  },

  productEnquiry(manufacturerName: string, visitorName: string) {
    return {
      title: `New Product Enquiry — ${manufacturerName}`,
      message: `${visitorName} submitted an enquiry for ${manufacturerName}`,
      actorName: visitorName,
    };
  },

  certificationExpiryReminder(
    manufacturerName: string,
    urnNo: string,
    eoiNo: string,
    stage: string,
  ) {
    return {
      title: `Certification Expiry — ${manufacturerName}`,
      message: `${stage} reminder sent for ${eoiNo || urnNo} (${manufacturerName})`,
      actorName: manufacturerName,
    };
  },

  urnMerged(
    manufacturerName: string,
    sourceUrn: string,
    targetUrn: string,
    movedCount: number,
  ) {
    return {
      title: `URN Merged — ${manufacturerName}`,
      message: `${manufacturerName} merged URN ${sourceUrn} into ${targetUrn} (${movedCount} products)`,
      actorName: manufacturerName,
    };
  },

  renewalSubmitted(manufacturerName: string, urnNo: string) {
    return {
      title: `Renewal Submitted — ${manufacturerName}`,
      message: `${manufacturerName} submitted renewal forms for URN ${urnNo}`,
      actorName: manufacturerName,
    };
  },

  renewalDecision(
    manufacturerName: string,
    urnNo: string,
    decision: 'approved' | 'sent_back',
  ) {
    const verb =
      decision === 'approved' ? 'approved for final review' : 'sent back to vendor';
    return {
      title: `Renewal Update — ${manufacturerName}`,
      message: `Renewal for URN ${urnNo} was ${verb}`,
      actorName: manufacturerName,
    };
  },

  renewalCompleted(manufacturerName: string, urnNo: string) {
    return {
      title: `Renewal Completed — ${manufacturerName}`,
      message: `Renewal for URN ${urnNo} is complete for ${manufacturerName}`,
      actorName: manufacturerName,
    };
  },

  passwordReset(email: string, portal?: string) {
    const portalLabel = portal ? ` (${portal} portal)` : '';
    return {
      title: 'Password Reset',
      message: `Password was reset for ${email}${portalLabel}`,
      actorName: email,
    };
  },

  grievanceCreated(
    manufacturerName: string,
    grievanceNo: string,
    subject: string,
    category?: string,
  ) {
    const categorySuffix = category?.trim() ? ` (${category.trim()})` : '';
    return {
      title: `Grievance Raised — ${manufacturerName}`,
      message: `${manufacturerName} raised grievance ${grievanceNo}${categorySuffix}: ${subject}`,
      actorName: manufacturerName,
    };
  },

  accountDeletionRequested(
    manufacturerName: string,
    requestNo: string,
    reason: string,
  ) {
    return {
      title: `Account Deletion Requested — ${manufacturerName}`,
      message: `${manufacturerName} submitted account deletion request ${requestNo} (${reason})`,
      actorName: manufacturerName,
    };
  },
};
