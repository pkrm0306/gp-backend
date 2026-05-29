import { AdminListProductsDto } from '../../product-registration/dto/admin-list-products.dto';

/**
 * Public website certified grid — same validation as admin product list filters.
 * Use `AdminListProductsDto` directly (not `extends`) so ValidationPipe whitelists all fields.
 */
export type PublicWebsiteCertifiedProductsListDto = AdminListProductsDto;
