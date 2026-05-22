import { BadRequestException } from '@nestjs/common';
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
    controller = new AdminController(adminServiceMock, {} as any);
  });

  it('lists banners for vendor id from token', async () => {
    adminServiceMock.listBanners.mockResolvedValue([{ id: 'b1', title: 'Banner 1' }] as any);

    const res = await controller.listBanners({ vendorId: 'v1' });
    expect(adminServiceMock.listBanners).toHaveBeenCalledWith('v1');
    expect(res.message).toBe('Banners retrieved successfully');
    expect(res.data).toHaveLength(1);
  });

  it('creates banner with body + uploaded image', async () => {
    adminServiceMock.createBanner.mockResolvedValue({ id: 'b1', title: 'Banner 1' } as any);

    const file = {
      originalname: 'banner.jpg',
      mimetype: 'image/jpeg',
      filename: 'banner-x.jpg',
      path: '/tmp/banner-x.jpg',
      size: 10,
      buffer: Buffer.from('x'),
      stream: null as any,
      destination: '/tmp',
      fieldname: 'image',
      encoding: '7bit',
    } as Express.Multer.File;

    const res = await controller.createBanner(
      { vendorId: 'v1' },
      { title: 'Banner 1', description: 'Desc', sequenceNumber: 1, status: 'active' },
      file as any,
    );

    expect(adminServiceMock.createBanner).toHaveBeenCalled();
    expect(res.message).toBe('Banner created successfully');
  });

  it('throws for create when vendor id missing', async () => {
    await expect(
      controller.createBanner(
        {} as any,
        { title: 'Banner 1', description: 'Desc', sequenceNumber: 1 },
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('edits banner and forwards payload', async () => {
    adminServiceMock.updateBanner.mockResolvedValue({ id: 'b1', title: 'Updated' } as any);

    const res = await controller.editBanner(
      { vendorId: 'v1' },
      'b1',
      { title: 'Updated', description: 'Desc', sequenceNumber: 2, status: 'inactive' },
      undefined,
    );

    expect(adminServiceMock.updateBanner).toHaveBeenCalledWith('v1', 'b1', {
      title: 'Updated',
      status: 'inactive',
      sequenceNumber: 2,
      description: 'Desc',
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

