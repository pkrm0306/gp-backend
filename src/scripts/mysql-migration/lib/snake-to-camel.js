"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snakeToCamel = snakeToCamel;
exports.mapProcessCommentsColumn = mapProcessCommentsColumn;
function snakeToCamel(input) {
    return input.replace(/_([a-z0-9])/gi, function (_, ch) { return ch.toUpperCase(); });
}
/** raw_materials_3_1 -> rawMaterials31 */
function mapProcessCommentsColumn(mysqlColumn) {
    var _a;
    var rm = mysqlColumn.match(/^raw_materials_3_(\d+)$/);
    if (rm) {
        return "rawMaterials3".concat(rm[1]);
    }
    var map = {
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
    return (_a = map[mysqlColumn]) !== null && _a !== void 0 ? _a : snakeToCamel(mysqlColumn);
}
