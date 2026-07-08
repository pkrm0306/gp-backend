export function snakeToCamel(input: string): string {
  return input.replace(/_([a-z0-9])/gi, (_, ch: string) => ch.toUpperCase());
}

/** raw_materials_3_1 -> rawMaterials31 */
export function mapProcessCommentsColumn(mysqlColumn: string): string | null {
  const rm = mysqlColumn.match(/^raw_materials_3_(\d+)$/);
  if (rm) {
    return `rawMaterials3${rm[1]}`;
  }
  const map: Record<string, string> = {
    manfacturing_process: 'manfacturingProcess',
    urn_no: 'urnNo',
    vendor_id: 'vendorId',
    product_id: 'productId',
    category_id: 'categoryId',
    manufacturer_id: 'manufacturerId',
    created_date: 'createdDate',
    updated_date: 'updatedDate',
    eoi_no: 'eoiNo',
    document_form: 'documentForm',
    document_form_subsection: 'documentFormSubsection',
    form_primary_id: 'formPrimaryId',
    document_name: 'documentName',
    document_original_name: 'documentOriginalName',
    document_link: 'documentLink',
  };
  return map[mysqlColumn] ?? snakeToCamel(mysqlColumn);
}
