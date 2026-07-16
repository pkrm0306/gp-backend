"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIGRATION_PHASES = exports.TABLE_REGISTRY = void 0;
exports.getTablesByPhase = getTablesByPhase;
exports.getTableDefinition = getTableDefinition;
var vendorFk = {
    mysqlColumn: 'vendor_id',
    refTable: 'vendors',
    mongoField: 'vendorId',
};
var urnFk = { mysqlColumn: 'urn_no', mongoField: 'urnNo' };
function processTable(mysqlTable, mysqlPk, numericIdField, phase) {
    if (phase === void 0) { phase = 7; }
    return {
        mysqlTable: mysqlTable,
        mongoCollection: mysqlTable,
        phase: phase,
        mysqlPk: mysqlPk,
        numericIdField: numericIdField,
        handler: 'generic',
        foreignKeys: [vendorFk],
        dateColumns: ['created_date', 'updated_date'],
        dependsOn: ['vendors'],
    };
}
function renewTable(mysqlTable, mysqlPk, numericIdField) {
    return {
        mysqlTable: mysqlTable,
        mongoCollection: mysqlTable,
        phase: 9,
        mysqlPk: mysqlPk,
        numericIdField: numericIdField,
        handler: 'generic',
        foreignKeys: [vendorFk],
        dateColumns: ['created_date', 'updated_date'],
        dependsOn: ['vendors'],
    };
}
function rawMaterialsTable(mysqlTable, mysqlPk, numericIdField) {
    return {
        mysqlTable: mysqlTable,
        mongoCollection: mysqlTable,
        phase: 8,
        mysqlPk: mysqlPk,
        numericIdField: numericIdField,
        handler: 'generic',
        foreignKeys: [vendorFk],
        dateColumns: ['created_date', 'updated_date'],
        dependsOn: ['vendors'],
    };
}
/** All MySQL tables from live dump `greenpro (16).sql` (Jul 07, 2026) */
exports.TABLE_REGISTRY = [
    // Phase 1 — reference data
    {
        mysqlTable: 'sectors',
        mongoCollection: 'sectors',
        phase: 1,
        mysqlPk: 'id',
        numericIdField: 'id',
        handler: 'generic',
        preserveColumns: ['id', 'name', 'status', 'created_at', 'updated_at'],
        dateColumns: ['created_at', 'updated_at'],
    },
    {
        mysqlTable: 'categories',
        mongoCollection: 'categories',
        phase: 1,
        mysqlPk: 'category_id',
        numericIdField: 'category_id',
        handler: 'generic',
        preserveColumns: [
            'category_id',
            'category_name',
            'category_image',
            'category_raw_material_forms',
            'category_status',
            'sector',
            'created_date',
            'updated_date',
        ],
        dateColumns: ['created_date', 'updated_date'],
    },
    {
        mysqlTable: 'standards',
        mongoCollection: 'standards',
        phase: 1,
        mysqlPk: 'id',
        numericIdField: 'id',
        handler: 'generic',
        columnMap: {
            resourse_standard_type: 'resource_standard_type',
            original_filename: 'original_filename',
            filename: 'filename',
            name: 'name',
            status: 'status',
            created_at: 'created_at',
            updated_at: 'updated_at',
        },
        preserveColumns: [
            'id',
            'name',
            'filename',
            'original_filename',
            'resource_standard_type',
            'status',
            'created_at',
            'updated_at',
        ],
        dateColumns: ['created_at', 'updated_at'],
    },
    {
        mysqlTable: 'states',
        mongoCollection: 'states',
        phase: 1,
        mysqlPk: 'id',
        numericIdField: 'legacyStateId',
        handler: 'custom:countries-states',
        dependsOn: [],
    },
    // Phase 2 — manufacturers + vendors (merged)
    {
        mysqlTable: 'manufacturers',
        mongoCollection: 'manufacturers',
        phase: 2,
        mysqlPk: 'manufacturer_id',
        numericIdField: 'legacyManufacturerId',
        handler: 'custom:manufacturers-vendors',
        dependsOn: [],
    },
    {
        mysqlTable: 'vendors',
        mongoCollection: 'manufacturers',
        phase: 2,
        mysqlPk: 'vendor_id',
        numericIdField: 'legacyVendorId',
        handler: 'custom:manufacturers-vendors',
        dependsOn: ['manufacturers'],
    },
    // Phase 3 — users
    {
        mysqlTable: 'admin',
        mongoCollection: 'users',
        phase: 3,
        mysqlPk: 'id',
        numericIdField: 'legacyAdminId',
        handler: 'custom:users',
        dependsOn: [],
    },
    {
        mysqlTable: 'vendor_users',
        mongoCollection: 'users',
        phase: 3,
        mysqlPk: 'vendor_user_id',
        numericIdField: 'legacyVendorUserId',
        handler: 'custom:users',
        dependsOn: ['vendors'],
    },
    {
        mysqlTable: 'team_members',
        mongoCollection: 'users',
        phase: 3,
        mysqlPk: 'team_member_id',
        numericIdField: 'legacyTeamMemberId',
        handler: 'custom:users',
        dependsOn: [],
    },
    // Phase 4 — products & plants
    {
        mysqlTable: 'products',
        mongoCollection: 'products',
        phase: 4,
        mysqlPk: 'product_id',
        numericIdField: 'productId',
        handler: 'custom:products',
        dependsOn: ['categories', 'vendors', 'manufacturers'],
    },
    {
        mysqlTable: 'product_plants',
        mongoCollection: 'product_plants',
        phase: 4,
        mysqlPk: 'product_plant_id',
        numericIdField: 'productPlantId',
        handler: 'custom:product-plants',
        dependsOn: ['products', 'vendors', 'categories', 'manufacturers', 'states'],
    },
    {
        mysqlTable: 'offline_product_plants',
        mongoCollection: 'migration_legacy_archives',
        phase: 4,
        mysqlPk: 'product_plant_id',
        numericIdField: 'legacyOfflineProductPlantId',
        handler: 'custom:archives',
        dependsOn: [],
        notes: 'No MERN collection — archived for reference',
    },
    // Phase 5 — payments
    {
        mysqlTable: 'payment_details',
        mongoCollection: 'payment_details',
        phase: 5,
        mysqlPk: 'payment_id',
        numericIdField: 'paymentId',
        handler: 'custom:payments',
        dependsOn: ['vendors'],
    },
    {
        mysqlTable: 'online_payment_details',
        mongoCollection: 'migration_online_payments',
        phase: 5,
        mysqlPk: 'online_payment_id',
        numericIdField: 'legacyOnlinePaymentId',
        handler: 'custom:payments',
        dependsOn: ['payment_details'],
        notes: 'Embedded PG audit — separate staging collection',
    },
    // Phase 6 — documents
    {
        mysqlTable: 'all_product_documents',
        mongoCollection: 'all_product_documents',
        phase: 6,
        mysqlPk: 'product_document_id',
        numericIdField: 'productDocumentId',
        handler: 'custom:documents',
        dependsOn: ['vendors'],
    },
    {
        mysqlTable: 'all_renew_product_documents',
        mongoCollection: 'all_renew_product_documents',
        phase: 6,
        mysqlPk: 'product_document_id',
        numericIdField: 'productDocumentId',
        handler: 'generic',
        foreignKeys: [vendorFk],
        columnMap: {
            urn_no: 'urnNo',
            eoi_no: 'eoiNo',
            document_form: 'documentForm',
            document_form_subsection: 'documentFormSubsection',
            form_primary_id: 'formPrimaryId',
            document_name: 'documentName',
            document_original_name: 'documentOriginalName',
            document_link: 'documentLink',
            created_date: 'createdDate',
            updated_date: 'updatedDate',
        },
        dateColumns: ['created_date', 'updated_date'],
        dependsOn: ['vendors'],
    },
    // Phase 7 — registration process
    processTable('process_product_design', 'product_design_id', 'productDesignId'),
    processTable('process_pd_measures', 'product_design_measure_id', 'productDesignMeasureId'),
    processTable('process_product_performance', 'process_product_performance_id', 'processProductPerformanceId'),
    processTable('process_manufacturing', 'process_manufacturing_id', 'processManufacturingId'),
    processTable('process_mp_manufacturing_units', 'process_mp_manufacturing_unit_id', 'processMpManufacturingUnitId'),
    processTable('process_mp_energy_consumption', 'process_mp_energy_consumption_id', 'processMpEnergyConsumptionId'),
    processTable('process_waste_management', 'process_waste_management_id', 'processWasteManagementId'),
    processTable('process_wm_manufacturing_units', 'process_wm_manufacturing_unit_id', 'processWmManufacturingUnitId'),
    processTable('process_life_cycle_approach', 'process_life_cycle_approach_id', 'processLifeCycleApproachId'),
    processTable('process_product_stewardship', 'process_product_stewardship_id', 'processProductStewardshipId'),
    processTable(
    // NOTE: source table name is spelled "awarness" but its PK column is "awerness_id".
    'process_ps_stakeholder_edu_awarness', 'process_ps_stakeholder_edu_awerness_id', 'processPsStakeholderEduAwarnessId'),
    processTable('process_innovation', 'process_innovation_id', 'processInnovationId'),
    {
        mysqlTable: 'process_comments',
        mongoCollection: 'process_comments',
        phase: 7,
        mysqlPk: 'process_comments_id',
        numericIdField: 'processCommentsId',
        handler: 'generic',
        foreignKeys: [vendorFk],
        dateColumns: ['updated_date'],
        dependsOn: ['vendors'],
    },
    processTable('process_final_review', 'process_final_review_id', 'processFinalReviewId'),
    // Phase 8 — raw materials (15 tables)
    rawMaterialsTable('raw_materials_utilization', 'raw_materials_utilization_id', 'rawMaterialsUtilizationId'),
    rawMaterialsTable('raw_materials_utilization_manufacturing_units', 'raw_materials_utilization_manufacturing_units_id', 'rawMaterialsUtilizationManufacturingUnitsId'),
    rawMaterialsTable('raw_materials_utilization_rmc', 'raw_materials_utilization_rmc_id', 'rawMaterialsUtilizationRmcId'),
    rawMaterialsTable('raw_materials_recovery', 'raw_materials_recovery_id', 'rawMaterialsRecoveryId'),
    rawMaterialsTable('raw_materials_recycled_content', 'raw_materials_recycled_content_id', 'rawMaterialsRecycledContentId'),
    rawMaterialsTable('raw_materials_hazardous', 'raw_materials_hazardous_id', 'rawMaterialsHazardousId'),
    rawMaterialsTable('raw_materials_hazardous_products', 'raw_materials_hazardous_products_id', 'rawMaterialsHazardousProductsId'),
    rawMaterialsTable('raw_materials_additives', 'raw_materials_additives_id', 'rawMaterialsAdditivesId'),
    rawMaterialsTable('raw_materials_green_supply', 'raw_materials_green_supply_id', 'rawMaterialsGreenSupplyId'),
    rawMaterialsTable('raw_materials_rapidly_renewable_materials', 'raw_materials_rapidly_renewable_materials_id', 'rawMaterialsRapidlyRenewableMaterialsId'),
    rawMaterialsTable('raw_materials_regional_materials', 'raw_materials_regional_materials_id', 'rawMaterialsRegionalMaterialsId'),
    rawMaterialsTable('raw_materials_reduce_environmental', 'raw_materials_reduce_environmental_id', 'rawMaterialsReduceEnvironmentalId'),
    rawMaterialsTable('raw_materials_optimization_of_raw_mix', 'raw_materials_optimization_of_raw_mix_id', 'rawMaterialsOptimizationOfRawMixId'),
    rawMaterialsTable('raw_materials_elimination_of_formaldehyde', 'raw_materials_elimination_of_formaldehyde_id', 'rawMaterialsEliminationOfFormaldehydeId'),
    rawMaterialsTable('raw_materials_elimination_of_prohibited_flame', 'raw_materials_elimination_of_prohibited_flame_id', 'rawMaterialsEliminationOfProhibitedFlameId'),
    rawMaterialsTable('raw_materials_elimination_of_prohibited_flame_solvents', 'raw_materials_elimination_of_prohibited_flame_solvents_id', 'rawMaterialsEliminationOfProhibitedFlameSolventsId'),
    rawMaterialsTable('raw_materials_elimination_of_prohibited_flame_solvents_products', 'raw_materials_elimination_prohibited_flame_solvents_products_id', 'rawMaterialsEliminationProhibitedFlameSolventsProductsId'),
    // Phase 9 — renewal process
    // NOTE: process_renew_* tables are schema copies of their base tables and reuse
    // the BASE table's PK column names (not a *_renew_* variant).
    renewTable('process_renew_product_performance', 'process_product_performance_id', 'processRenewProductPerformanceId'),
    renewTable('process_renew_manufacturing', 'process_manufacturing_id', 'processRenewManufacturingId'),
    renewTable('process_renew_mp_manufacturing_units', 'process_mp_manufacturing_unit_id', 'processRenewMpManufacturingUnitId'),
    renewTable('process_renew_mp_energy_consumption', 'process_mp_energy_consumption_id', 'processRenewMpEnergyConsumptionId'),
    renewTable('process_renew_waste_management', 'process_waste_management_id', 'processRenewWasteManagementId'),
    renewTable('process_renew_wm_manufacturing_units', 'process_wm_manufacturing_unit_id', 'processRenewWmManufacturingUnitId'),
    renewTable('process_renew_product_stewardship', 'process_product_stewardship_id', 'processRenewProductStewardshipId'),
    renewTable('process_renew_ps_stakeholder_edu_awarness', 'process_ps_stakeholder_edu_awerness_id', 'processRenewPsStakeholderEduAwarnessId'),
    renewTable('process_renew_innovation', 'process_innovation_id', 'processRenewInnovationId'),
    renewTable('process_renew_comments', 'process_comments_id', 'processRenewCommentsId'),
    // Phase 10 — synthetic renewal cycles
    {
        mysqlTable: 'renewal_cycles',
        mongoCollection: 'renewal_cycles',
        phase: 10,
        mysqlPk: 'synthetic_id',
        numericIdField: 'legacyRenewalCycleId',
        handler: 'custom:renewal-cycles',
        dependsOn: ['products', 'payment_details'],
        notes: 'Synthesized from products + renew payments — not in MySQL',
    },
    // Phase 11 — CMS & comms
    {
        mysqlTable: 'banners',
        mongoCollection: 'banners',
        phase: 11,
        mysqlPk: 'banner_id',
        numericIdField: 'legacyBannerId',
        handler: 'custom:cms',
        dependsOn: ['vendors'],
    },
    {
        mysqlTable: 'events',
        mongoCollection: 'events',
        phase: 11,
        mysqlPk: 'event_id',
        numericIdField: 'eventId',
        handler: 'generic',
        columnMap: {
            event_id: 'eventId',
            event_name: 'eventName',
            event_image: 'event_image',
            event_date: 'eventDate',
            event_start_time: 'eventStartTime',
            event_end_time: 'eventEndTime',
            event_location: 'eventLocation',
            event_description: 'eventDescription',
            contact_person_name: 'contactPersonName',
            contact_person_designation: 'contactPersonDesignation',
            contact_person_email: 'contactPersonEmail',
            contact_person_phone: 'contactPersonPhone',
            event_status: 'eventStatus',
            created_date: 'createdDate',
            updated_date: 'updatedDate',
        },
        dateColumns: ['event_date', 'created_date', 'updated_date'],
        dependsOn: [],
    },
    {
        mysqlTable: 'contacts',
        mongoCollection: 'contactmessages',
        phase: 11,
        mysqlPk: 'contact_id',
        numericIdField: 'legacyContactId',
        handler: 'custom:cms',
        dependsOn: [],
    },
    {
        mysqlTable: 'subscription_list',
        mongoCollection: 'newslettersubscribers',
        phase: 11,
        mysqlPk: 'subscription_id',
        numericIdField: 'legacySubscriptionId',
        handler: 'custom:cms',
        dependsOn: [],
    },
    {
        mysqlTable: 'notifications',
        mongoCollection: 'notifications',
        phase: 11,
        mysqlPk: 'id',
        numericIdField: 'legacyNotificationId',
        handler: 'custom:cms',
        dependsOn: ['admin', 'vendor_users'],
    },
    // Phase 12 — archives (no direct MERN target)
    {
        mysqlTable: 'basic_details',
        mongoCollection: 'migration_legacy_archives',
        phase: 12,
        mysqlPk: 'basic_details_id',
        numericIdField: 'legacyBasicDetailsId',
        handler: 'custom:archives',
        dependsOn: [],
    },
    {
        mysqlTable: 'newsletter_release',
        mongoCollection: 'migration_legacy_archives',
        phase: 12,
        mysqlPk: 'newsletter_release_id',
        numericIdField: 'legacyNewsletterReleaseId',
        handler: 'custom:archives',
        dependsOn: [],
    },
];
function getTablesByPhase(phase) {
    var sorted = __spreadArray([], exports.TABLE_REGISTRY, true).sort(function (a, b) { return a.phase - b.phase; });
    if (phase === undefined)
        return sorted;
    return sorted.filter(function (t) { return t.phase === phase; });
}
function getTableDefinition(mysqlTable) {
    return exports.TABLE_REGISTRY.find(function (t) { return t.mysqlTable === mysqlTable; });
}
exports.MIGRATION_PHASES = [
    { phase: 1, label: 'Reference data (sectors, categories, standards, states)' },
    { phase: 2, label: 'Manufacturers + vendors (merged)' },
    { phase: 3, label: 'Users (admin, vendor_users, team_members)' },
    { phase: 4, label: 'Products & plants' },
    { phase: 5, label: 'Payments' },
    { phase: 6, label: 'Documents' },
    { phase: 7, label: 'Registration process forms' },
    { phase: 8, label: 'Raw materials (15 tables)' },
    { phase: 9, label: 'Renewal process forms' },
    { phase: 10, label: 'Synthetic renewal_cycles' },
    { phase: 11, label: 'CMS & notifications' },
    { phase: 12, label: 'Legacy archives' },
];
// silence unused import warning
void urnFk;
