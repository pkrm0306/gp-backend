import { BadRequestException } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController Banner Endpoints', () => {
  let controller: AdminController;

  const adminServiceMock = {
    listBanners: jest.fn(),
    createBanner: jest.fn(),
    updateBanner: jest.fn(),
    getBannerById: jest.fn(),
    setOrToggleBannerStatus: jest.fn(),
    deleteBanner: jest.fn(),
  } as unknown as jest.Mocked<AdminService>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AdminController(
      adminServiceMock,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  it('lists banners for vendor id from token', async () => {
    adminServiceMock.listBanners.mockResolvedValue([{ id: 'b1', title: 'Banner 1' }] as any);

    const res = await controller.listBanners({ vendorId: 'v1' });
    expect(adminServiceMock.listBanners).toHaveBeenCalledWith('v1');
    expect(res.message).toBe('Banners retrieved successfully');
    expect(res.data).toHaveLength(1);
  });

  it('lists banners for platform admin without vendor id', async () => {
    adminServiceMock.listBanners.mockResolvedValue([] as any);

    await controller.listBanners({ role: 'admin' });

    expect(adminServiceMock.listBanners).toHaveBeenCalledWith(null);
  });

  it('creates banner with body + image URL', async () => {
    adminServiceMock.createBanner.mockResolvedValue({ id: 'b1', title: 'Banner 1' } as any);

    const res = await controller.createBanner(
      { vendorId: 'v1' },
      {
        title: 'Banner 1',
        sequenceNumber: 1,
        status: 'active',
        imageUrl: 'https://example.com/banner.jpg',
      },
      { body: {} } as any,
      undefined,
    );

    expect(adminServiceMock.createBanner).toHaveBeenCalledWith(
      'v1',
      expect.objectContaining({ imageUrl: 'https://example.com/banner.jpg' }),
      'manual_url',
    );
    expect(res.message).toBe('Banner created successfully');
  });

  it('throws for create when vendor id missing for vendor accounts', async () => {
    await expect(
      controller.createBanner(
        { role: 'vendor' } as any,
        { title: 'Banner 1', sequenceNumber: 1 },
        { body: {} } as any,
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates banner for platform admin without vendor id', async () => {
    adminServiceMock.createBanner.mockResolvedValue({ id: 'b1', title: 'Banner 1' } as any);

    await controller.createBanner(
      { role: 'staff' },
      {
        title: 'Banner 1',
        sequenceNumber: 1,
        status: 'active',
        imageUrl: 'https://example.com/banner.jpg',
      },
      { body: {} } as any,
      undefined,
    );

    expect(adminServiceMock.createBanner).toHaveBeenCalledWith(
      null,
      expect.objectContaining({ imageUrl: 'https://example.com/banner.jpg' }),
      'manual_url',
    );
  });

  it('creates banner with video only (no image)', async () => {
    const uploadFileUtil = require('../utils/upload-file.util');
    const spy = jest
      .spyOn(uploadFileUtil, 'uploadFile')
      .mockResolvedValue({ fileUrl: '/uploads/banners/banner-video-1.mp4' });

    adminServiceMock.createBanner.mockResolvedValue({
      id: 'b1',
      title: 'Video Banner',
      videoUrl: '/uploads/banners/banner-video-1.mp4',
    } as any);

    const res = await controller.createBanner(
      { vendorId: 'v1' },
      {
        title: 'Video Banner',
        sequenceNumber: 1,
        status: 'active',
        videoDurationSeconds: 12,
      },
      { body: { videoDurationSeconds: 12 } } as any,
      {
        video: [
          {
            fieldname: 'video',
            originalname: 'clip.mp4',
            mimetype: 'video/mp4',
            size: 1024,
            buffer: Buffer.alloc(1024),
          } as any,
        ],
      },
    );

    expect(adminServiceMock.createBanner).toHaveBeenCalledWith(
      'v1',
      expect.objectContaining({
        imageUrl: '',
        videoUrl: '/uploads/banners/banner-video-1.mp4',
      }),
      'manual_url',
      'binary_upload',
    );
    expect(res.message).toBe('Banner created successfully');
    spy.mockRestore();
  });

  it('rejects create when neither image nor video is provided', async () => {
    await expect(
      controller.createBanner(
        { vendorId: 'v1' },
        { title: 'Banner 1', sequenceNumber: 1 },
        { body: {} } as any,
        undefined,
      ),
    ).rejects.toThrow(/Banner media is required/);
  });

  it('edits banner and forwards payload', async () => {
    adminServiceMock.updateBanner.mockResolvedValue({ id: 'b1', title: 'Updated' } as any);

    const res = await controller.editBanner(
      { vendorId: 'v1' },
      'b1',
      { title: 'Updated', sequenceNumber: 2, status: 'inactive' },
      {} as any,
      undefined,
    );

    expect(adminServiceMock.updateBanner).toHaveBeenCalledWith('v1', 'b1', {
      title: 'Updated',
      status: 'inactive',
      sequenceNumber: 2,
    });
    expect(res.message).toBe('Banner updated successfully');
  });

  it('edits banner while accepting public imageUrl', async () => {
    adminServiceMock.updateBanner.mockResolvedValue({ id: 'b1', title: 'Updated' } as any);

    const res = await controller.editBanner(
      { vendorId: 'v1' },
      'b1',
      {
        title: 'Updated',
        sequenceNumber: 2,
        status: 'active',
        imageUrl: 'https://cdn.example.com/existing-banner.jpg',
      },
      {} as any,
      undefined,
    );

    expect(adminServiceMock.updateBanner).toHaveBeenCalledWith('v1', 'b1', {
      imageUrl: 'https://cdn.example.com/existing-banner.jpg',
      imageSource: 'manual_url',
      title: 'Updated',
      status: 'active',
      sequenceNumber: 2,
    });
    expect(res.message).toBe('Banner updated successfully');
  });

  it('gets banner by id', async () => {
    adminServiceMock.getBannerById.mockResolvedValue({ id: 'b1', title: 'Banner' } as any);
    const res = await controller.getBannerById({ vendorId: 'v1' }, 'b1');
    expect(adminServiceMock.getBannerById).toHaveBeenCalledWith('v1', 'b1');
    expect(res.message).toBe('Banner retrieved successfully');
  });

  it('updates banner status', async () => {
    adminServiceMock.setOrToggleBannerStatus.mockResolvedValue({
      id: 'b1',
      status: 'inactive',
      is_active: false,
    } as any);
    const res = await controller.updateBannerStatus(
      { vendorId: 'v1' },
      'b1',
      { status: 'inactive' } as any,
    );
    expect(adminServiceMock.setOrToggleBannerStatus).toHaveBeenCalledWith(
      'v1',
      'b1',
      'inactive',
    );
    expect(res.message).toBe('Banner status updated successfully');
  });

  it('deletes banner via post route', async () => {
    adminServiceMock.deleteBanner.mockResolvedValue({ id: 'b1' } as any);
    const res = await controller.deleteBannerPost({ vendorId: 'v1' }, { id: 'b1' } as any);
    expect(adminServiceMock.deleteBanner).toHaveBeenCalledWith('v1', 'b1');
    expect(res.message).toBe('Banner deleted successfully');
  });
});

describe('AdminController Banner permission metadata', () => {
  it('requires BANNERS_VIEW on getBannerById', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      AdminController.prototype.getBannerById,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.BANNERS_VIEW]);
  });

  it('requires BANNERS_DELETE on delete routes', () => {
    expect(
      Reflect.getMetadata(PERMISSIONS_KEY, AdminController.prototype.deleteBannerPost) as string[],
    ).toEqual([PERMISSIONS.BANNERS_DELETE]);
    expect(
      Reflect.getMetadata(PERMISSIONS_KEY, AdminController.prototype.deleteBannerDelete) as string[],
    ).toEqual([PERMISSIONS.BANNERS_DELETE]);
  });

  it('requires BANNERS_STATUS on updateBannerStatus', () => {
    const permissions = Reflect.getMetadata(
      PERMISSIONS_KEY,
      AdminController.prototype.updateBannerStatus,
    ) as string[];
    expect(permissions).toEqual([PERMISSIONS.BANNERS_STATUS]);
  });
});

