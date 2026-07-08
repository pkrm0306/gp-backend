import type { MigrationContext, MigrationResult, TableDefinition } from '../lib/types';
import { runGenericMigrator } from '../lib/generic-migrator';
import { migrateCountriesAndStates } from './custom/countries-and-states';
import { migrateManufacturersAndVendors } from './custom/manufacturers-and-vendors';
import { migrateUsers } from './custom/users';
import { migrateProducts } from './custom/products';
import { migrateProductPlants } from './custom/product-plants';
import { migratePayments } from './custom/payments';
import { migrateDocuments } from './custom/documents';
import { migrateCms } from './custom/cms';
import { migrateArchives } from './custom/archives';
import { migrateRenewalCycles } from './custom/renewal-cycles';

export async function runTableMigration(
  ctx: MigrationContext,
  definition: TableDefinition,
): Promise<MigrationResult> {
  const handler = definition.handler;

  if (handler === 'generic') {
    return runGenericMigrator(ctx, definition);
  }

  switch (handler) {
    case 'custom:countries-states':
      return migrateCountriesAndStates(ctx);
    case 'custom:manufacturers-vendors':
      return migrateManufacturersAndVendors(
        ctx,
        definition.mysqlTable as 'manufacturers' | 'vendors',
      );
    case 'custom:users':
      return migrateUsers(
        ctx,
        definition.mysqlTable as 'admin' | 'vendor_users' | 'team_members',
      );
    case 'custom:products':
      return migrateProducts(ctx);
    case 'custom:product-plants':
      return migrateProductPlants(ctx);
    case 'custom:payments':
      return migratePayments(
        ctx,
        definition.mysqlTable as 'payment_details' | 'online_payment_details',
      );
    case 'custom:documents':
      return migrateDocuments(ctx);
    case 'custom:cms':
      return migrateCms(
        ctx,
        definition.mysqlTable as
          | 'banners'
          | 'contacts'
          | 'subscription_list'
          | 'notifications',
      );
    case 'custom:archives':
      return migrateArchives(ctx, definition);
    case 'custom:renewal-cycles':
      return migrateRenewalCycles(ctx);
    default:
      throw new Error(`Unknown migration handler: ${handler}`);
  }
}
