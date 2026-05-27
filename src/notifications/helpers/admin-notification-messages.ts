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

  urnSubmittedForReview(manufacturerName: string, urnNo: string) {
    return {
      title: `URN Submitted For Review By ${manufacturerName}`,
      message: `${manufacturerName} submitted URN ${urnNo} for review. Please review the portal.`,
      actorName: manufacturerName,
    };
  },
};
