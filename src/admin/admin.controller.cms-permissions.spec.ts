import { PERMISSIONS_KEY } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AdminController } from './admin.controller';

describe('AdminController CMS permission metadata', () => {
  it('requires ARTICLES_VIEW on listArticles', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      AdminController.prototype.listArticles,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.ARTICLES_VIEW]);
  });

  it('requires ARTICLES_VIEW on getArticleById', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      AdminController.prototype.getArticleById,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.ARTICLES_VIEW]);
  });

  it('requires ARTICLES_STATUS (not EVENTS_UPDATE) on updateArticleStatus', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      AdminController.prototype.updateArticleStatus,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.ARTICLES_STATUS]);
    expect(permissions).not.toContain(PERMISSIONS.EVENTS_UPDATE);
  });

  it('requires GALLERY_STATUS on updateGalleryStatus', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      AdminController.prototype.updateGalleryStatus,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.GALLERY_STATUS]);
  });
});
