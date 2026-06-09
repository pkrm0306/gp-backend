export type RenewDetailsIncludeMode = 'summary' | 'full';

export type RenewDetailsHttpPayload = {
  data: Array<Record<string, unknown>>;
  products: Array<Record<string, unknown>>;
  product_details_list?: Array<Record<string, unknown>>;
  manufacturer: Record<string, unknown> | null;
  manufacturing_details: Record<string, unknown> | null;
  plants: Array<Record<string, unknown>>;
  plant_details: Array<Record<string, unknown>>;
  all_renew_product_documents: Array<Record<string, unknown>>;
  all_urn_product_documents: Array<Record<string, unknown>>;
  documents: Array<Record<string, unknown>>;
  renewContext: Record<string, unknown>;
  urnContext?: Record<string, unknown>;
  siteVisits: unknown[];
  payment?: Record<string, unknown> | null;
  payments?: Array<Record<string, unknown>>;
  vendor?: Record<string, unknown> | null;
  category?: Record<string, unknown> | null;
  tabReviews?: Record<string, unknown>;
  processComments?: Record<string, unknown>;
};

export function parseRenewDetailsInclude(raw?: string): RenewDetailsIncludeMode {
  const value = String(raw ?? '').trim().toLowerCase();
  return value === 'full' ? 'full' : 'summary';
}

function buildCompactProductDetailsList(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return rows.map((row) => {
    const productDetails = (row.product_details ?? {}) as Record<string, unknown>;
    const plants = (row.plants as Array<Record<string, unknown>> | undefined) ?? [];
    const eoiNo = String(productDetails.eoiNo ?? row.eoiNo ?? '').trim();
    const plantsForEoi = eoiNo
      ? plants.filter((plant) => String(plant.eoiNo ?? '').trim() === eoiNo)
      : plants;
    const unitCount = Number(
      productDetails.plantCount ??
        productDetails.hpUnits ??
        plantsForEoi.length ??
        0,
    );
    return {
      eoiNo: productDetails.eoiNo ?? row.eoiNo ?? null,
      productName: productDetails.productName ?? row.productName ?? null,
      productStatus: productDetails.productStatus ?? row.productStatus ?? null,
      hpUnits: unitCount,
      plantCount: unitCount,
      product_details: productDetails,
    };
  });
}

function buildVendorSummary(
  first: Record<string, unknown>,
): Record<string, unknown> | null {
  const vendor = first.vendor as Record<string, unknown> | undefined;
  if (!vendor) {
    return null;
  }
  const manufacturer = first.manufacturer as Record<string, unknown> | undefined;
  const company =
    vendor.companyName ??
    vendor.manufacturerName ??
    vendor.vendor_name ??
    manufacturer?.manufacturerName ??
    null;
  return {
    _id: vendor._id ?? null,
    company,
    contact: vendor.contactName ?? company,
    email: vendor.vendor_email ?? vendor.email ?? null,
    phone: vendor.vendor_phone ?? vendor.phone ?? null,
  };
}

export function buildRenewDetailsHttpResponse(
  result: RenewDetailsHttpPayload,
  include: RenewDetailsIncludeMode,
): Record<string, unknown> {
  const first = (result.data[0] ?? {}) as Record<string, unknown>;
  const category =
    result.category ??
    (first.category as Record<string, unknown> | null | undefined) ??
    null;
  const vendor = result.vendor ?? buildVendorSummary(first);
  const urnContext = result.urnContext ?? {
    urnNo: result.renewContext.urnNo,
    urnStatus: result.renewContext.urnStatus,
    productRenewStatus: result.renewContext.productRenewStatus,
    product_renew_status: result.renewContext.productRenewStatus,
    renewCycleNo: result.renewContext.renewCycleNo,
    vendorId: result.renewContext.vendorId,
    manufacturerId: result.renewContext.manufacturerId,
    renewalCycleId: result.renewContext.renewalCycleId,
  };

  const productDetailsList =
    include === 'full'
      ? (result.product_details_list ??
        buildCompactProductDetailsList(result.data))
      : result.data;

  const body: Record<string, unknown> = {
    success: true,
    message: 'Renew details fetched successfully',
    data: result.data,
    product_details_list: productDetailsList,
    products: result.products,
    manufacturer: result.manufacturer,
    manufacturing_details: result.manufacturing_details,
    plants: result.plants,
    plant_details: result.plant_details,
    all_renew_product_documents: result.all_renew_product_documents,
    all_urn_product_documents: result.all_urn_product_documents,
    documents: result.documents,
    renewContext: result.renewContext,
    urnContext,
    siteVisits: result.siteVisits,
    site_visits: result.siteVisits,
  };

  if (include === 'full') {
    body.payment = result.payment ?? null;
    body.payments = result.payments ?? [];
    body.category = category;
    body.vendor = vendor;
    if (result.tabReviews !== undefined) {
      body.tabReviews = result.tabReviews;
    }
    if (result.processComments !== undefined) {
      body.processComments = result.processComments;
    }
  }

  return body;
}
