import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  Header,
  BadRequestException,
  applyDecorators,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  hasExplicitCategoryIdFields,
} from '../standards/utils/merge-category-ids.util';
import {
  mergeTeamMemberSectorIdsFromFormObject,
  hasExplicitTeamMemberSectorFields,
} from './utils/merge-team-member-sectors-from-form.util';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ChangePasswordDto } from '../manufacturers/dto/change-password.dto';
import { UpdateProfileDto } from '../manufacturers/dto/update-manufacturer-profile.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { EditTeamMemberDto } from './dto/edit-team-member.dto';
import { DeleteTeamMemberDto } from './dto/delete-team-member.dto';
import { CreateBannerDto } from './dto/create-banner.dto';
import { DeleteBannerDto } from './dto/delete-banner.dto';
import { UpdateBannerStatusDto } from './dto/update-banner-status.dto';
import { EditBannerDto } from './dto/edit-banner.dto';
import { ListTeamMembersQueryDto } from './dto/list-team-members-query.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ManufacturerReplyDto } from './dto/manufacturer-reply.dto';
import { ContactReplyDto } from './dto/contact-reply.dto';
import { ListNotificationsQueryDto } from './dto/list-notifications-query.dto';
import { DeleteNewsletterSubscriberDto } from './dto/delete-newsletter-subscriber.dto';
import { UpdateNewsletterSubscriberStatusDto } from './dto/update-newsletter-subscriber-status.dto';
import { DeleteContactMessageDto } from './dto/delete-contact-message.dto';
import { Public } from '../common/decorators/public.decorator';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import type { Express, Request } from 'express';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  DASHBOARD_PERMISSION_CATALOG,
  PERMISSIONS,
} from '../common/constants/permissions.constants';
import { GALLERY_TYPES, GalleryType } from '../events/schemas/event.schema';
import { uploadFile } from '../utils/upload-file.util';
import {
  createBannerDiskMulterOptions,
  pickBannerImageFile,
} from './utils/banner-image-upload.util';
import { adminImageMemoryMulterOptions } from '../common/upload/multer-universal.config';
import {
  DashboardActivityQueryDto,
  DashboardMetricsQueryDto,
  DashboardRecentProductsQueryDto,
} from './dto/dashboard-metrics-query.dto';

const bannerImageMultipartFields = [
  { name: 'image', maxCount: 1 },
  { name: 'bannerImage', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
];

const storage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'manufacturers'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `manufacturer-${uniqueSuffix}${ext}`);
  },
});

const teamMemberStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'team-members'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `team-member-${uniqueSuffix}${ext}`);
  },
});

const teamMemberImageInterceptor = FileInterceptor('image', {
  storage: teamMemberStorage,
  fileFilter: (req, file, cb) => {
    if (!file?.originalname) {
      cb(null, true);
      return;
    }
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

function TeamMemberEditDocs() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    UseInterceptors(teamMemberImageInterceptor),
    ApiOperation({
      summary: 'Edit team member',
      description:
        '**POST** or **PATCH** — same handler. Multipart form: **id** (team member from list), name, designation, email, mobile, optional **image** (270×400px recommended), social URLs. ' +
        '**Sectors** multiselect — fixed options only (GET **/admin/team-member/sector-options**): Building, Industries, Consumer Products, Facility Services. Send names or ids 1–4 via **sectors**, **sectors[]**, **sector_ids**, etc. Omit sector fields to leave assignment unchanged. Category fields are not accepted. ' +
        'Same JWT workarounds as create (**x-access-token** / **access_token**) if Bearer is dropped on multipart.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiHeader({
      name: 'x-access-token',
      required: false,
      description:
        'Raw JWT if Bearer header is not sent (multipart / Swagger workaround)',
    }),
    ApiQuery({
      name: 'access_token',
      required: false,
      description: 'Raw JWT query fallback for multipart / Swagger',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Team member MongoDB id' },
          name: { type: 'string' },
          designation: { type: 'string' },
          email: { type: 'string' },
          mobile: { type: 'string' },
          displayOrder: { type: 'number', minimum: 1 },
          team: {
            type: 'string',
            enum: ['administrative', 'technical', 'finance', 'marketing'],
          },
          image: { type: 'string', format: 'binary' },
          facebookUrl: { type: 'string' },
          twitterUrl: { type: 'string' },
          linkedinUrl: { type: 'string' },
          roleId: { type: 'string', description: 'Legacy single role id' },
          roleIds: {
            oneOf: [
              { type: 'array', items: { type: 'string' } },
              { type: 'string', description: 'JSON string array' },
            ],
          },
          'roleIds[]': {
            type: 'array',
            items: { type: 'string' },
            description: 'Repeated multipart fields for role ids',
          },
          sectors: {
            oneOf: [
              {
                type: 'array',
                items: {
                  oneOf: [{ type: 'integer' }, { type: 'string' }],
                },
              },
              { type: 'string', description: 'JSON array of sector names or ids' },
            ],
            description:
              'Multiselect: Building, Industries, Consumer Products, Facility Services',
          },
          sector: {
            oneOf: [{ type: 'integer' }, { type: 'string' }],
            description: 'Single sector name or id (1–4)',
          },
          'sectors[]': {
            oneOf: [
              { type: 'array', items: { type: 'integer' } },
              { type: 'string' },
            ],
          },
          sector_ids: {
            oneOf: [
              { type: 'array', items: { type: 'integer' } },
              { type: 'string' },
            ],
          },
          sectorIds: { type: 'string' },
        },
        required: ['id', 'name', 'email', 'mobile', 'displayOrder', 'team'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Team member updated successfully',
    }),
    ApiResponse({ status: 404, description: 'Team member not found' }),
    ApiResponse({
      status: 409,
      description: 'Email or phone already exists for another member',
    }),
  );
}

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly manufacturersService: ManufacturersService,
  ) {}

  @Get('dashboard/metrics')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin dashboard metrics',
    description:
      'Returns dashboard KPIs, optional **charts** time-series, and **visibleSections** for RBAC. ' +
      'Query filters: `period`, `year`, `month`, `quarter`, `productStatus` (pending|active|completed|overdue), ' +
      '`categoryId` (ObjectId or slug), `region` (north|south|east|west via plant states), `granularity` (monthly|weekly|quarterly). ' +
      'Platform admins (`type: admin`) always receive full metrics.',
  })
  @ApiResponse({ status: 200, description: 'Dashboard metrics retrieved' })
  async getDashboardMetrics(
    @CurrentUser()
    user: {
      role: string;
      type?: string;
      manufacturerId: string;
      userId: string;
    },
    @Query() query: DashboardMetricsQueryDto,
  ) {
    const filters = await this.adminService.resolveDashboardMetricsFilters(query);
    const data = await this.adminService.getDashboardMetricsForUser({
      role: user.role,
      type: user.type,
      manufacturerId: user.manufacturerId,
      userId: user.userId,
      filters,
      query,
    });
    return {
      message: 'Admin dashboard metrics retrieved successfully',
      data,
    };
  }

  @Get('dashboard/filters')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANUFACTURERS_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dashboard filter options',
    description:
      'Returns period/year/month labels and values for the admin dashboard filter bar. ' +
      'Use the same query param names when calling GET /admin/dashboard/metrics.',
  })
  getDashboardFilters() {
    return {
      message: 'Dashboard filter options retrieved successfully',
      data: this.adminService.getDashboardFilterOptions(),
    };
  }

  @Get('dashboard/recent-products')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recent products for admin dashboard table',
    description:
      'Latest product/URN rows (same shape as POST /api/admin/products/list).',
  })
  async getDashboardRecentProducts(@Query() query: DashboardRecentProductsQueryDto) {
    const result = await this.adminService.getDashboardRecentProducts(
      query.page ?? 1,
      query.limit ?? 10,
    );
    return {
      message: 'Recent products retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('dashboard/activity')
  @AnyPermissions(
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_CERTIFICATION_VIEW,
    PERMISSIONS.PRODUCTS_VIEW,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recent certification activity for admin dashboard',
  })
  async getDashboardActivity(@Query() query: DashboardActivityQueryDto) {
    const data = await this.adminService.getDashboardActivity(query.limit ?? 20);
    return {
      message: 'Dashboard activity retrieved successfully',
      data,
    };
  }

  private parseEventStatus(raw: unknown): number | undefined {
    if (raw === undefined || raw === null || String(raw).trim() === '') {
      return undefined;
    }
    const v = String(raw).trim().toLowerCase();
    if (v === '1' || v === 'active' || v === 'true') return 1;
    if (v === '0' || v === 'inactive' || v === 'false') return 0;
    throw new BadRequestException(
      'Invalid status. Use active/inactive (or 1/0)',
    );
  }

  private parseExternalUrlToggle(
    raw: unknown,
    required = false,
  ): boolean | undefined {
    if (raw === undefined || raw === null || String(raw).trim() === '') {
      if (required) {
        throw new BadRequestException('externalUrl is required (true/false)');
      }
      return undefined;
    }
    const v = String(raw).trim().toLowerCase();
    if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return true;
    if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
    throw new BadRequestException('Invalid externalUrl. Use true/false (or 1/0)');
  }

  private resolveExternalUrlRaw(body: any): unknown {
    return (
      body?.externalUrl ??
      body?.external_url ??
      body?.externalURL ??
      body?.isExternalUrl ??
      body?.is_external_url
    );
  }

  private parseGalleryType(raw: unknown, required = false): GalleryType | undefined {
    if (raw === undefined || raw === null || String(raw).trim() === '') {
      if (required) {
        throw new BadRequestException(
          `galleryType is required. Use one of: ${GALLERY_TYPES.join(', ')}`,
        );
      }
      return undefined;
    }
    const value = String(raw).trim();
    const matched = GALLERY_TYPES.find(
      (t) => t.toLowerCase() === value.toLowerCase(),
    );
    if (!matched) {
      throw new BadRequestException(
        `Invalid galleryType. Use one of: ${GALLERY_TYPES.join(', ')}`,
      );
    }
    return matched;
  }

  private normalizeTeamMemberRoleIds(body: any): string[] {
    const parseJsonArray = (value: string): string[] | null => {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map((v) => String(v)) : null;
      } catch {
        return null;
      }
    };

    const candidates: string[] = [];
    const roleIdsArrayField = body?.['roleIds[]'];
    if (Array.isArray(roleIdsArrayField)) {
      candidates.push(...roleIdsArrayField.map((v: unknown) => String(v)));
    } else if (roleIdsArrayField !== undefined && roleIdsArrayField !== null) {
      candidates.push(String(roleIdsArrayField));
    }

    const roleIds = body?.roleIds;
    if (Array.isArray(roleIds)) {
      candidates.push(...roleIds.map((v: unknown) => String(v)));
    } else if (typeof roleIds === 'string') {
      const trimmed = roleIds.trim();
      const parsed = trimmed.startsWith('[') ? parseJsonArray(trimmed) : null;
      if (parsed) {
        candidates.push(...parsed);
      } else if (trimmed) {
        candidates.push(trimmed);
      }
    } else if (roleIds !== undefined && roleIds !== null) {
      candidates.push(String(roleIds));
    }

    const normalized = Array.from(
      new Set(
        candidates
          .map((v) => v.trim())
          .filter((v) => /^[a-fA-F0-9]{24}$/.test(v)),
      ),
    );
    if (normalized.length > 0) return normalized;

    const roleId = String(body?.roleId ?? '').trim();
    return /^[a-fA-F0-9]{24}$/.test(roleId) ? [roleId] : [];
  }

  private mapGalleryResponse(item: any) {
    const images = Array.isArray(item?.galleryImages)
      ? item.galleryImages
      : item?.eventImage
        ? [item.eventImage]
        : [];
    const rawDate = item?.eventDate ?? item?.date;
    const normalizedDate =
      rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : rawDate
          ? /^\d{4}-\d{2}-\d{2}$/.test(String(rawDate).trim())
            ? String(rawDate).trim()
            : new Date(rawDate).toISOString().slice(0, 10)
          : '';
    return {
      id: item?.id,
      eventId: item?.eventId,
      title: item?.eventName ?? '',
      galleryType: item?.galleryType ?? '',
      description: item?.eventDescription ?? '',
      date: normalizedDate,
      image: images[0] ?? null,
      images,
      event_image: item?.event_image ?? null,
    };
  }

  /** Gallery/event images via shared upload helper (local uploads/ or S3 when configured). */
  private async uploadGalleryImageFiles(
    files: Express.Multer.File[],
  ): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      if (!file?.buffer?.length && !file?.path) {
        continue;
      }
      const uploaded = await uploadFile(file, 'events');
      urls.push(uploaded.fileUrl);
    }
    return urls;
  }

  private mapArticleResponse(item: any) {
    const id = item?.id ?? (item?._id ? String(item._id) : undefined);
    const externalUrl = item?.externalUrl === true;
    return {
      id,
      title: item?.title ?? '',
      description: externalUrl ? '' : (item?.description ?? ''),
      date:
        item?.date instanceof Date
          ? item.date.toISOString().slice(0, 10)
          : item?.date
            ? new Date(item.date).toISOString().slice(0, 10)
            : '',
      image: item?.image ?? null,
      article_image: item?.article_image ?? '',
      url: externalUrl ? (item?.url ?? '') : '',
      externalUrl,
      pdf: item?.pdf ?? null,
      article_pdf: item?.article_pdf ?? '',
      is_active: Number(item?.status) === 1 || item?.is_active === true,
    };
  }

  @Patch('profile/edit')
  @Permissions(PERMISSIONS.PROFILE_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Edit profile (unique GST + phone)',
    description:
      'Edits the logged-in vendor profile on the linked manufacturer. Blocks the update if GST number or phone already exists for another vendor. ' +
      '**gst** = GST certificate PDF URL path (or `https://…`); **gstNumber** = GSTIN; **companyLogo** = logo image URL; **pan** = PAN card document URL (**PDF** or **JPEG** file). Legacy: plain GSTIN may still be sent in **gst**.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or GST/phone already exists',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async editProfile(
    @CurrentUser() user: {
      userId: string;
      manufacturerId?: string;
      vendorId?: string;
    },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.manufacturersService.editProfile(
      user,
      updateProfileDto,
    );
    return { message: 'Profile updated successfully', data: profile };
  }

  @Get('banner/list')
  @Permissions(PERMISSIONS.BANNERS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List banners (vendor admin)',
    description:
      'Returns **this vendor’s** banners for the admin grid (ordered by sequence number): **title**, **description**, **sequenceNumber**, **is_active**, and **id**. IDs match **GET /admin/banner/:id** (vendor-scoped). For **all** active banners on the public site, use **GET /website/public/banners**.',
  })
  @ApiResponse({
    status: 200,
    description: 'Banner cards data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Banners retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              s_no: { type: 'number', example: 1 },
              id: { type: 'string' },
              title: { type: 'string' },
              sequenceNumber: { type: 'number' },
              description: { type: 'string' },
              is_active: { type: 'boolean' },
              imageSource: {
                type: 'string',
                enum: ['binary_upload', 'manual_url'],
                description: 'binary_upload = multipart file; manual_url = image URL/path',
              },
            },
          },
        },
        displayOrderMax: { type: 'number', example: 6 },
      },
    },
  })
  async listBanners(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
  ) {
    const scopedVendorId = user?.vendorId || user?.manufacturerId;
    if (!scopedVendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.listBanners(scopedVendorId);
    return { message: 'Banners retrieved successfully', data };
  }

  @Post('banner')
  @Permissions(PERMISSIONS.BANNERS_ADD)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(bannerImageMultipartFields, createBannerDiskMulterOptions()),
  )
  @ApiOperation({
    summary: 'Create banner',
    description:
      'Creates a banner for the logged-in vendor. Image file may be sent as multipart field **image**, **bannerImage**, **banner_image**, or **file** (first non-empty file wins). Otherwise send **imageUrl** (http(s) or `/uploads/...`). Server stores **imageSource**: `binary_upload` vs `manual_url` from that choice.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Primary file field name' },
        bannerImage: { type: 'string', format: 'binary' },
        banner_image: { type: 'string', format: 'binary' },
        file: { type: 'string', format: 'binary' },
        imageUrl: { type: 'string', description: 'Optional if image uploaded' },
        title: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        sequenceNumber: { type: 'number', example: 1 },
        description: { type: 'string' },
        imageSource: {
          type: 'string',
          enum: ['binary_upload', 'manual_url'],
          description:
            'Optional; server derives from whether multipart `image` or `imageUrl` was used.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid vendor',
  })
  async createBanner(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFiles() files?: Record<string, Express.Multer.File[]>,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const uploadedFile = pickBannerImageFile(files);
    const dto = plainToClass(CreateBannerDto, {
      imageUrl: body.imageUrl,
      title: body.title ?? body.heading,
      status: body.status,
      sequenceNumber:
        body.sequenceNumber ?? body.sequence ?? body.displayOrder ?? body.order,
      description: body.description ?? body.bannerDescription,
      imageSource: body.imageSource,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imageUrl = uploadedFile
      ? (await uploadFile(uploadedFile, 'banners')).fileUrl
      : dto.imageUrl;
    if (!imageUrl) {
      throw new BadRequestException('Banner image is required');
    }
    const resolvedImageSource = uploadedFile ? 'binary_upload' : 'manual_url';
    const data = await this.adminService.createBanner(
      user.vendorId,
      { ...dto, imageUrl },
      resolvedImageSource,
    );
    return { message: 'Banner created successfully', data };
  }

  @Patch(['banner/:id', 'banner/:id/edit'])
  @Permissions(PERMISSIONS.BANNERS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(bannerImageMultipartFields, createBannerDiskMulterOptions()),
  )
  @ApiOperation({
    summary: 'Edit banner',
    description:
      'Edits a banner for the logged-in vendor. New image: multipart **image**, **bannerImage**, **banner_image**, or **file**. New URL: **imageUrl**. Server sets **imageSource** only when the image changes.',
  })
  @ApiParam({ name: 'id', description: 'Banner MongoDB id (from banner list)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'sequenceNumber', 'description'],
      properties: {
        image: { type: 'string', format: 'binary' },
        bannerImage: { type: 'string', format: 'binary' },
        banner_image: { type: 'string', format: 'binary' },
        file: { type: 'string', format: 'binary' },
        imageUrl: { type: 'string', description: 'Optional if image uploaded' },
        title: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        sequenceNumber: { type: 'number', example: 1 },
        description: { type: 'string' },
        imageSource: {
          type: 'string',
          enum: ['binary_upload', 'manual_url'],
          description:
            'Optional; when `image` or `imageUrl` is sent, server updates stored image source.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error / invalid id' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async editBanner(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files?: Record<string, Express.Multer.File[]>,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const uploadedFile = pickBannerImageFile(files);

    const dto = plainToClass(EditBannerDto, {
      imageUrl: body.imageUrl,
      title: body.title ?? body.heading,
      status: body.status,
      sequenceNumber: body.sequenceNumber,
      description: body.description,
      imageSource: body.imageSource,
    });

    const errors = await validate(dto, { skipMissingProperties: true });
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    if (
      !uploadedFile &&
      dto.imageUrl === undefined &&
      dto.title === undefined &&
      dto.status === undefined &&
      dto.sequenceNumber === undefined &&
      dto.description === undefined
    ) {
      throw new BadRequestException('Provide at least one field to update');
    }

    const imageUrl = uploadedFile
      ? (await uploadFile(uploadedFile, 'banners')).fileUrl
      : dto.imageUrl;
    let imageSource: 'binary_upload' | 'manual_url' | undefined;
    if (uploadedFile) {
      imageSource = 'binary_upload';
    } else if (
      dto.imageUrl !== undefined &&
      dto.imageUrl !== null &&
      String(dto.imageUrl).trim() !== ''
    ) {
      imageSource = 'manual_url';
    }
    const data = await this.adminService.updateBanner(user.vendorId, id, {
      ...(imageUrl ? { imageUrl } : {}),
      ...(imageSource !== undefined ? { imageSource } : {}),
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.sequenceNumber !== undefined
        ? { sequenceNumber: dto.sequenceNumber }
        : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
    });
    return { message: 'Banner updated successfully', data };
  }

  @Post('events/create')
  @Permissions(PERMISSIONS.EVENTS_ADD)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'events'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname || '');
          cb(null, `event-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file?.originalname) {
          cb(null, true);
          return;
        }
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        cb(null, allowedMimes.includes(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Create event',
    description:
      'Creates an event (Admin panel). Multipart form fields: eventName, image, eventDate, eventStartTime, eventEndTime, eventLocation, eventDescription, and contact person details.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['eventName', 'eventDate'],
      properties: {
        eventName: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        eventDate: { type: 'string', example: '2026-04-08' },
        eventStartTime: { type: 'string' },
        eventEndTime: { type: 'string' },
        eventLocation: { type: 'string' },
        eventDescription: { type: 'string' },
        contactPersonName: { type: 'string' },
        contactPersonDesignation: { type: 'string' },
        contactPersonEmail: { type: 'string' },
        contactPersonPhone: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createEvent(@Body() body: any, @UploadedFile() file?: any) {
    const pick = (keys: string[]) => {
      for (const k of keys) {
        if (body?.[k] !== undefined) return body[k];
      }
      return undefined;
    };

    const dto = plainToClass(CreateEventDto, {
      eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
      eventDate: pick(['eventDate', 'date', 'event_date']),
      eventStartTime: pick(['eventStartTime', 'startTime', 'event_start_time']),
      eventEndTime: pick(['eventEndTime', 'endTime', 'event_end_time']),
      eventLocation: pick(['eventLocation', 'location', 'event_location']),
      eventDescription: pick([
        'eventDescription',
        'description',
        'event_description',
      ]),
      contactPersonName: pick([
        'contactPersonName',
        'contact_person_name',
        'contactName',
      ]),
      contactPersonDesignation: pick([
        'contactPersonDesignation',
        'contact_person_designation',
        'contactDesignation',
      ]),
      contactPersonEmail: pick([
        'contactPersonEmail',
        'contactPersonemail',
        'contact_person_email',
        'contactEmail',
      ]),
      contactPersonPhone: pick([
        'contactPersonPhone',
        'contact_person_phone',
        'contactPhone',
      ]),
      registrationLink: pick(['registrationLink', 'registration_link']),
      brochureLink: pick(['brochureLink', 'brochure_link']),
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const rawDate = String(dto.eventDate ?? '').trim();
    const eventDate = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
      ? new Date(
          `${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`,
        )
      : new Date(rawDate);
    if (Number.isNaN(eventDate.getTime())) {
      throw new BadRequestException(
        'Invalid eventDate (expected ISO date/datetime)',
      );
    }
    const eventStatus = this.parseEventStatus(
      pick(['eventStatus', 'status', 'is_active', 'active']),
    );

    const eventImage = file
      ? (await uploadFile(file, 'events')).fileUrl
      : undefined;
    const data = await this.adminService.createEvent({
      eventName: dto.eventName,
      eventDate,
      eventStartTime: dto.eventStartTime,
      eventEndTime: dto.eventEndTime,
      eventLocation: dto.eventLocation,
      eventDescription: dto.eventDescription,
      contactPersonName: dto.contactPersonName,
      contactPersonDesignation: dto.contactPersonDesignation,
      contactPersonEmail: dto.contactPersonEmail,
      contactPersonPhone: dto.contactPersonPhone,
      registrationLink: dto.registrationLink,
      brochureLink: dto.brochureLink,
      eventImage,
      ...(eventStatus !== undefined ? { eventStatus } : {}),
    });

    return { message: 'Event created successfully', data };
  }

  @Patch('events/:id/edit')
  @Permissions(PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 20 },
        { name: 'images', maxCount: 20 },
        { name: 'eventImage', maxCount: 20 },
        { name: 'event_image', maxCount: 20 },
      ],
      {
        storage: diskStorage({
          destination: join(process.cwd(), 'uploads', 'events'),
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname || '');
            cb(null, `event-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file?.originalname) {
            cb(null, true);
            return;
          }
          const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
          ];
          cb(null, allowedMimes.includes(file.mimetype));
        },
        limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  @ApiOperation({
    summary: 'Edit event',
    description:
      'Edits an event (Admin panel). Same fields as create. URL param `id` can be MongoDB _id or numeric eventId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventName: { type: 'string' },
        image: { type: 'string', format: 'binary' },
        eventDate: { type: 'string', example: '09-04-2026' },
        eventStartTime: { type: 'string' },
        eventEndTime: { type: 'string' },
        eventLocation: { type: 'string' },
        eventDescription: { type: 'string' },
        contactPersonName: { type: 'string' },
        contactPersonDesignation: { type: 'string' },
        contactPersonEmail: { type: 'string' },
        contactPersonPhone: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async editEvent(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      eventImage?: Express.Multer.File[];
      event_image?: Express.Multer.File[];
    },
  ) {
    const pick = (keys: string[]) => {
      for (const k of keys) {
        if (body?.[k] !== undefined) return body[k];
      }
      return undefined;
    };

    const dto = plainToClass(UpdateEventDto, {
      eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
      eventDate: pick(['eventDate', 'date', 'event_date']),
      eventStartTime: pick(['eventStartTime', 'startTime', 'event_start_time']),
      eventEndTime: pick(['eventEndTime', 'endTime', 'event_end_time']),
      eventLocation: pick(['eventLocation', 'location', 'event_location']),
      eventDescription: pick([
        'eventDescription',
        'description',
        'event_description',
      ]),
      contactPersonName: pick([
        'contactPersonName',
        'contact_person_name',
        'contactName',
      ]),
      contactPersonDesignation: pick([
        'contactPersonDesignation',
        'contact_person_designation',
        'contactDesignation',
      ]),
      contactPersonEmail: pick([
        'contactPersonEmail',
        'contactPersonemail',
        'contact_person_email',
        'contactEmail',
      ]),
      contactPersonPhone: pick([
        'contactPersonPhone',
        'contact_person_phone',
        'contactPhone',
      ]),
      registrationLink: pick(['registrationLink', 'registration_link']),
      brochureLink: pick(['brochureLink', 'brochure_link']),
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    let eventDate: Date | undefined = undefined;
    if (dto.eventDate !== undefined) {
      const raw = String(dto.eventDate ?? '').trim();
      eventDate = /^\d{2}-\d{2}-\d{4}$/.test(raw)
        ? new Date(`${raw.slice(6, 10)}-${raw.slice(3, 5)}-${raw.slice(0, 2)}`)
        : new Date(raw);
      if (Number.isNaN(eventDate.getTime())) {
        throw new BadRequestException(
          'Invalid eventDate (expected ISO date/datetime)',
        );
      }
    }
    const eventStatus = this.parseEventStatus(
      pick(['eventStatus', 'status', 'is_active', 'active']),
    );

    const picked =
      files?.image?.[0] ||
      files?.eventImage?.[0] ||
      files?.event_image?.[0] ||
      null;
    const eventImage = picked
      ? (await uploadFile(picked, 'events')).fileUrl
      : undefined;
    const data = await this.adminService.updateEvent(id, {
      ...(dto.eventName !== undefined ? { eventName: dto.eventName } : {}),
      ...(eventDate !== undefined ? { eventDate } : {}),
      ...(dto.eventStartTime !== undefined
        ? { eventStartTime: dto.eventStartTime }
        : {}),
      ...(dto.eventEndTime !== undefined
        ? { eventEndTime: dto.eventEndTime }
        : {}),
      ...(dto.eventLocation !== undefined
        ? { eventLocation: dto.eventLocation }
        : {}),
      ...(dto.eventDescription !== undefined
        ? { eventDescription: dto.eventDescription }
        : {}),
      ...(dto.contactPersonName !== undefined
        ? { contactPersonName: dto.contactPersonName }
        : {}),
      ...(dto.contactPersonDesignation !== undefined
        ? { contactPersonDesignation: dto.contactPersonDesignation }
        : {}),
      ...(dto.contactPersonEmail !== undefined
        ? { contactPersonEmail: dto.contactPersonEmail }
        : {}),
      ...(dto.contactPersonPhone !== undefined
        ? { contactPersonPhone: dto.contactPersonPhone }
        : {}),
      ...(dto.registrationLink !== undefined
        ? { registrationLink: dto.registrationLink }
        : {}),
      ...(dto.brochureLink !== undefined
        ? { brochureLink: dto.brochureLink }
        : {}),
      ...(eventStatus !== undefined ? { eventStatus } : {}),
      ...(eventImage ? { eventImage } : {}),
    });

    return { message: 'Event updated successfully', data };
  }

  @Post('gallery/create')
  @Permissions(PERMISSIONS.EVENTS_ADD)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 20 },
        { name: 'image[]', maxCount: 20 },
        { name: 'images', maxCount: 20 },
      ],
      adminImageMemoryMulterOptions(),
    ),
  )
  @ApiOperation({
    summary: 'Create gallery item',
    description:
      'Creates a gallery item. Fields accepted: title, description, date, galleryType, image.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'date', 'galleryType'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        date: { type: 'string', example: '2026-04-08' },
        galleryType: { type: 'string', enum: [...GALLERY_TYPES] },
        image: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Upload one or more images with field name "image"',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Gallery item created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createGallery(
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      'image[]'?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const allImages = [
      ...(files?.image ?? []),
      ...(files?.['image[]'] ?? []),
      ...(files?.images ?? []),
    ];
    const pick = (keys: string[]) => {
      for (const k of keys) {
        if (body?.[k] !== undefined) return body[k];
      }
      return undefined;
    };
    const dto = plainToClass(CreateEventDto, {
      eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
      eventDate: pick(['eventDate', 'date', 'event_date']),
      eventDescription: pick([
        'eventDescription',
        'description',
        'event_description',
      ]),
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }
    const rawDate = String(dto.eventDate ?? '').trim();
    const eventDate = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
      ? new Date(
          `${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`,
        )
      : new Date(rawDate);
    if (Number.isNaN(eventDate.getTime())) {
      throw new BadRequestException(
        'Invalid eventDate (expected ISO date/datetime)',
      );
    }
    const galleryImages = await this.uploadGalleryImageFiles(allImages);
    const galleryType = this.parseGalleryType(
      pick(['galleryType', 'type', 'category']),
      true,
    );
    const data = await this.adminService.createEvent({
      eventName: dto.eventName,
      eventDate,
      eventDescription: dto.eventDescription,
      galleryType,
      ...(galleryImages.length ? { galleryImages, eventImage: galleryImages[0] } : {}),
    });
    return {
      message: 'Gallery item created successfully',
      data: this.mapGalleryResponse(data),
    };
  }

  @Patch('gallery/:id/edit')
  @Permissions(PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 20 },
        { name: 'image[]', maxCount: 20 },
        { name: 'images', maxCount: 20 },
        { name: 'eventImage', maxCount: 20 },
        { name: 'event_image', maxCount: 20 },
      ],
      adminImageMemoryMulterOptions(),
    ),
  )
  @ApiOperation({
    summary: 'Edit gallery item',
    description:
      'Edits a gallery item by id. Fields accepted: title, description, date, galleryType, image.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        date: { type: 'string', example: '2026-04-08' },
        galleryType: { type: 'string', enum: [...GALLERY_TYPES] },
        image: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Upload one or more images with field name "image"',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Gallery item updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async editGallery(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      'image[]'?: Express.Multer.File[];
      images?: Express.Multer.File[];
      eventImage?: Express.Multer.File[];
      event_image?: Express.Multer.File[];
    },
  ) {
    const allImages = [
      ...(files?.image ?? []),
      ...(files?.['image[]'] ?? []),
      ...(files?.images ?? []),
      ...(files?.eventImage ?? []),
      ...(files?.event_image ?? []),
    ];
    const pick = (keys: string[]) => {
      for (const k of keys) {
        if (body?.[k] !== undefined) return body[k];
      }
      return undefined;
    };
    const dto = plainToClass(UpdateEventDto, {
      eventName: pick(['eventName', 'title', 'name', 'event_name', 'event_title']),
      eventDate: pick(['eventDate', 'date', 'event_date']),
      eventDescription: pick([
        'eventDescription',
        'description',
        'event_description',
      ]),
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }
    let eventDate: Date | undefined = undefined;
    if (dto.eventDate !== undefined) {
      const raw = String(dto.eventDate ?? '').trim();
      eventDate = /^\d{2}-\d{2}-\d{4}$/.test(raw)
        ? new Date(`${raw.slice(6, 10)}-${raw.slice(3, 5)}-${raw.slice(0, 2)}`)
        : new Date(raw);
      if (Number.isNaN(eventDate.getTime())) {
        throw new BadRequestException(
          'Invalid eventDate (expected ISO date/datetime)',
        );
      }
    }
    const galleryType = this.parseGalleryType(
      pick(['galleryType', 'type', 'category']),
      false,
    );
    const galleryImages = await this.uploadGalleryImageFiles(allImages);
    const data = await this.adminService.updateEvent(
      id,
      {
      ...(dto.eventName !== undefined ? { eventName: dto.eventName } : {}),
      ...(dto.eventDescription !== undefined
        ? { eventDescription: dto.eventDescription }
        : {}),
      ...(eventDate !== undefined ? { eventDate } : {}),
      ...(galleryType !== undefined ? { galleryType } : {}),
      ...(galleryImages.length
        ? { galleryImages, eventImage: galleryImages[0] }
        : {}),
      },
      'gallery',
    );
    return {
      message: 'Gallery item updated successfully',
      data: this.mapGalleryResponse(data),
    };
  }

  @Get('events/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List events (public website)',
    description:
      'Returns paginated events for the public website events page. Default: page=1, limit=10. Only active events (eventStatus=1) are returned.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (1-based). Default 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page. Default 10, max 50.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated events list',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Events retrieved successfully' },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            perPage: { type: 'number', example: 10 },
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },
          },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              s_no: { type: 'number', example: 1 },
              id: { type: 'string' },
              eventId: { type: 'number', nullable: true },
              image: { type: 'string', nullable: true },
              eventName: { type: 'string' },
              dateTime: { type: 'string', example: '2026-03-25 03:00 PM' },
              location: { type: 'string' },
              is_active: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @Public()
  async listEvents(
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const pageNum = Number.parseInt(String(pageRaw ?? '1'), 10);
    const limitNum = Number.parseInt(String(limitRaw ?? '10'), 10);
    const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const limit =
      Number.isFinite(limitNum) && limitNum > 0
        ? Math.min(limitNum, 50)
        : 10;
    const result = await this.adminService.listEventsPaginated(page, limit, {
      activeOnly: true,
    });
    return {
      message: 'Events retrieved successfully',
      pagination: result.pagination,
      data: result.data,
    };
  }

  @Get('gallery/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List gallery items (public website)',
    description:
      'Returns paginated gallery items for the public website. Default: page=1, limit=50. Only active items (eventStatus=1) are returned. No authentication required.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (1-based). Default 1.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 50,
    description: 'Items per page. Default 50, max 50.',
  })
  @ApiResponse({
    status: 200,
    description: 'Gallery list',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Gallery retrieved successfully' },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            perPage: { type: 'number', example: 50 },
            total: { type: 'number', example: 145 },
            totalPages: { type: 'number', example: 3 },
          },
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              s_no: { type: 'number', example: 1 },
              id: { type: 'string' },
              eventId: { type: 'number', nullable: true },
              title: { type: 'string' },
              galleryType: { type: 'string', enum: [...GALLERY_TYPES] },
              description: { type: 'string' },
              date: { type: 'string', example: '2026-03-25' },
              image: { type: 'string', nullable: true },
              images: {
                type: 'array',
                items: { type: 'string' },
              },
              event_image: { type: 'string', nullable: true },
              is_active: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  @Public()
  async listGallery(
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ) {
    const pageNum = Number.parseInt(String(pageRaw ?? '1'), 10);
    const limitNum = Number.parseInt(String(limitRaw ?? '50'), 10);
    const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const limit =
      Number.isFinite(limitNum) && limitNum > 0
        ? Math.min(limitNum, 50)
        : 50;
    const result = await this.adminService.listGalleryPaginated(page, limit, {
      activeOnly: true,
    });
    const data = result.data.map((r: any) => ({
      s_no: r.s_no,
      ...this.mapGalleryResponse(r),
      is_active: r.is_active,
    }));
    return {
      message: 'Gallery retrieved successfully',
      pagination: {
        ...result.pagination,
        limit: result.pagination.perPage,
      },
      data,
    };
  }

  @Get('gallery/:id')
  @Permissions(PERMISSIONS.EVENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get gallery item by id (admin)',
    description:
      'Returns one gallery item for edit/view with fields: title, description, date, image, images.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiResponse({ status: 200, description: 'Gallery item retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async getGalleryById(@Param('id') id: string) {
    const item: any = await this.adminService.getEventById(id, 'gallery');
    const data = this.mapGalleryResponse(item);
    return { message: 'Gallery item retrieved successfully', data };
  }

  @Patch('gallery/:id/status')
  @Permissions(PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set/toggle gallery status',
    description:
      'Sets gallery item status to active/inactive. If body status is omitted, backend toggles current status.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Gallery status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id/status' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async updateGalleryStatus(
    @Param('id') id: string,
    @Body() body: { status?: string },
  ) {
    const status = this.parseEventStatus(body?.status);
    const data = await this.adminService.setOrToggleEventStatus(
      id,
      status,
      'gallery',
    );
    return { message: 'Gallery status updated successfully', data };
  }

  @Post('articles/create')
  @Permissions(PERMISSIONS.EVENTS_ADD)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'articles'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname || '');
          cb(null, `article-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file?.originalname) {
          cb(null, true);
          return;
        }
        if (file.fieldname === 'pdf' || file.fieldname === 'file') {
          if (file.mimetype === 'application/pdf') {
            cb(null, true);
            return;
          }
          cb(
            new BadRequestException(
              'Only PDF files are allowed for file/pdf field',
            ),
            false,
          );
          return;
        }
        const allowedImageMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        cb(null, allowedImageMimes.includes(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  @ApiOperation({
    summary: 'Create article',
    description:
      'Creates an article with title, date, image, file/pdf (PDF), externalUrl toggle and status. If externalUrl=false, description is required and url is hidden. If externalUrl=true, url is required and description is hidden.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'date', 'image', 'pdf'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        date: { type: 'string', example: '2026-05-05' },
        externalUrl: { type: 'boolean', default: false },
        image: { type: 'string', format: 'binary' },
        file: { type: 'string', format: 'binary' },
        pdf: { type: 'string', format: 'binary' },
        url: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createArticle(
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    const title = String(body?.title ?? '').trim();
    if (!title) throw new BadRequestException('title is required');
    const rawDate = String(body?.date ?? '').trim();
    if (!rawDate) throw new BadRequestException('date is required');
    const date = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
      ? new Date(
          `${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`,
        )
      : new Date(rawDate);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date (expected ISO date/datetime)');
    }
    const description = String(body?.description ?? '').trim();
    const url = String(body?.url ?? '').trim();
    const explicitExternalUrl = this.parseExternalUrlToggle(
      this.resolveExternalUrlRaw(body),
    );
    const inferredExternalUrl =
      explicitExternalUrl ??
      (url && !description ? true : description && !url ? false : false);
    const externalUrl = inferredExternalUrl;
    const status = this.parseEventStatus(body?.status);
    const imageFile = files?.image?.[0];
    const pdfFile = files?.pdf?.[0] ?? files?.file?.[0];
    if (!imageFile) throw new BadRequestException('image is required');
    if (!pdfFile) throw new BadRequestException('pdf/file is required');
    if (externalUrl) {
      if (!url) {
        throw new BadRequestException('url is required when externalUrl is true');
      }
    } else if (!description) {
      throw new BadRequestException(
        'description is required when externalUrl is false',
      );
    }
    const imageUpload = imageFile ? await uploadFile(imageFile, 'articles') : undefined;
    const pdfUpload = pdfFile ? await uploadFile(pdfFile, 'articles') : undefined;
    const image = imageUpload?.fileUrl;
    const pdf = pdfUpload?.fileUrl;

    const data = await this.adminService.createArticle({
      title,
      description: externalUrl ? '' : description,
      date,
      image,
      pdf,
      url: externalUrl ? url : '',
      externalUrl,
      ...(status !== undefined ? { status } : {}),
    });
    return {
      message: 'Article created successfully',
      data: this.mapArticleResponse(data),
    };
  }

  @Patch('articles/:id/edit')
  @Permissions(PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'articles'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname || '');
          cb(null, `article-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file?.originalname) {
          cb(null, true);
          return;
        }
        if (file.fieldname === 'pdf' || file.fieldname === 'file') {
          if (file.mimetype === 'application/pdf') {
            cb(null, true);
            return;
          }
          cb(
            new BadRequestException(
              'Only PDF files are allowed for file/pdf field',
            ),
            false,
          );
          return;
        }
        const allowedImageMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        cb(null, allowedImageMimes.includes(file.mimetype));
      },
      limits: { fileSize: 5 * 1024 * 1024 },
      },
    ),
  )
  @ApiOperation({
    summary: 'Edit article',
    description:
      'Edits article fields: title, date, image, file/pdf (PDF), externalUrl toggle, url/description and status. If externalUrl=false, description is required and url is hidden. If externalUrl=true, url is required and description is hidden.',
  })
  @ApiParam({ name: 'id', description: 'Article MongoDB _id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        date: { type: 'string', example: '2026-05-05' },
        externalUrl: { type: 'boolean' },
        image: { type: 'string', format: 'binary' },
        file: { type: 'string', format: 'binary' },
        pdf: { type: 'string', format: 'binary' },
        url: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async editArticle(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      pdf?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    let date: Date | undefined = undefined;
    if (body?.date !== undefined && String(body.date).trim() !== '') {
      const rawDate = String(body.date).trim();
      date = /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
        ? new Date(
            `${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`,
          )
        : new Date(rawDate);
      if (Number.isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date (expected ISO date/datetime)');
      }
    }

    const status = this.parseEventStatus(body?.status);
    const explicitExternalUrl = this.parseExternalUrlToggle(
      this.resolveExternalUrlRaw(body),
    );
    const imageFile = files?.image?.[0];
    const pdfFile = files?.pdf?.[0] ?? files?.file?.[0];
    const imageUpload = imageFile ? await uploadFile(imageFile, 'articles') : undefined;
    const pdfUpload = pdfFile ? await uploadFile(pdfFile, 'articles') : undefined;
    const image = imageUpload?.fileUrl;
    const pdf = pdfUpload?.fileUrl;
    const description =
      body?.description !== undefined ? String(body.description).trim() : undefined;
    const url = body?.url !== undefined ? String(body.url).trim() : undefined;
    const inferredExternalUrl =
      explicitExternalUrl ??
      (url !== undefined && description === undefined
        ? true
        : description !== undefined && url === undefined
          ? false
          : undefined);
    const data = await this.adminService.updateArticle(id, {
      ...(body?.title !== undefined ? { title: body.title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(date !== undefined ? { date } : {}),
      ...(url !== undefined ? { url } : {}),
      ...(inferredExternalUrl !== undefined ? { externalUrl: inferredExternalUrl } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(pdf !== undefined ? { pdf } : {}),
    });
    return {
      message: 'Article updated successfully',
      data: this.mapArticleResponse(data),
    };
  }

  @Get(['articles/list', 'article/list'])
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'List articles',
    description:
      'Returns articles with title, description, date, image, url and active flag (newest first).',
  })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully' })
  async listArticles() {
    const data = (await this.adminService.listArticles()).map((a: any) => ({
      s_no: a.s_no,
      ...this.mapArticleResponse(a),
    }));
    return { message: 'Articles retrieved successfully', data };
  }

  @Get('articles/:id')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'Get article by id',
    description:
      'Returns one article for view/edit with title, description, date, image, url and active flag.',
  })
  @ApiParam({ name: 'id', description: 'Article MongoDB _id' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async getArticleById(@Param('id') id: string) {
    const data = this.mapArticleResponse(await this.adminService.getArticleById(id));
    return { message: 'Article retrieved successfully', data };
  }

  @Patch('articles/:id/status')
  @Permissions(PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set/toggle article status',
    description:
      'Sets article status to active/inactive. If body status is omitted, backend toggles current status.',
  })
  @ApiParam({ name: 'id', description: 'Article MongoDB _id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'inactive'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Article status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id/status' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async updateArticleStatus(
    @Param('id') id: string,
    @Body() body: { status?: string },
  ) {
    const status = this.parseEventStatus(body?.status);
    const data = await this.adminService.setOrToggleArticleStatus(id, status);
    return { message: 'Article status updated successfully', data };
  }

  @Delete('articles/:id/delete')
  @Permissions(PERMISSIONS.EVENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete article',
    description:
      'Deletes an article by id. This is an alias route for frontend convenience.',
  })
  @ApiParam({ name: 'id', description: 'Article MongoDB _id' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async deleteArticleAlias(@Param('id') id: string) {
    const data = await this.adminService.deleteArticle(id);
    return { message: 'Article deleted successfully', data };
  }

  @Delete('articles/:id')
  @Permissions(PERMISSIONS.EVENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete article',
    description:
      'Deletes an article by id. Same behavior as DELETE /admin/articles/:id/delete.',
  })
  @ApiParam({ name: 'id', description: 'Article MongoDB _id' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async deleteArticle(@Param('id') id: string) {
    const data = await this.adminService.deleteArticle(id);
    return { message: 'Article deleted successfully', data };
  }

  @Get('events/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get event by id (for edit/view)',
    description:
      'Fetches one event with all fields needed to pre-fill the edit form. Accepts MongoDB _id or numeric eventId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @Public()
  async getEventById(@Param('id') id: string) {
    const data = await this.adminService.getEventById(id, 'event');
    return { message: 'Event retrieved successfully', data };
  }

  @Delete('events/:id')
  @Permissions(PERMISSIONS.EVENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete event',
    description:
      'Permanently deletes an event. `id` can be MongoDB _id or numeric eventId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async deleteEvent(@Param('id') id: string) {
    const data = await this.adminService.deleteEvent(id, 'event');
    return { message: 'Event deleted successfully', data };
  }

  @Delete('gallery/:id')
  @Permissions(PERMISSIONS.EVENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete gallery item',
    description:
      'Permanently deletes a gallery item. `id` can be MongoDB _id or numeric eventId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiResponse({ status: 200, description: 'Gallery item deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async deleteGallery(@Param('id') id: string) {
    const data = await this.adminService.deleteEvent(id, 'gallery');
    return { message: 'Gallery item deleted successfully', data };
  }

  @Delete('gallery/:id/delete')
  @Permissions(PERMISSIONS.EVENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete gallery item (alias)',
    description:
      'Alias of DELETE /admin/gallery/:id for frontend convenience.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB _id OR numeric eventId' })
  @ApiResponse({ status: 200, description: 'Gallery item deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Gallery item not found' })
  async deleteGalleryAlias(@Param('id') id: string) {
    const data = await this.adminService.deleteEvent(id, 'gallery');
    return { message: 'Gallery item deleted successfully', data };
  }

  @Post('manufacturer/reply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reply to customer (email)',
    description:
      'Sends an email to the customer. Requires email, userMessage, replyMessage.',
  })
  @ApiBody({ type: ManufacturerReplyDto })
  @ApiResponse({ status: 200, description: 'Reply email sent successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async replyToCustomer(@Body() dto: ManufacturerReplyDto) {
    const data = await this.adminService.replyToCustomerViaManufacturer(dto);
    return { message: 'Reply email sent successfully', data };
  }

  @Post('contact/:id/reply')
  @Permissions(PERMISSIONS.INQUIRIES_REPLY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reply to contact message (store history)',
    description:
      'Sends reply email to the contact message email, and stores only the admin reply history linked to contact message id.',
  })
  @ApiParam({ name: 'id', description: 'Contact message MongoDB id' })
  @ApiBody({ type: ContactReplyDto })
  @ApiResponse({ status: 200, description: 'Reply sent and stored' })
  @ApiResponse({ status: 400, description: 'Validation error / invalid id' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async replyToContact(@Param('id') id: string, @Body() dto: ContactReplyDto) {
    const data = await this.adminService.sendContactReply(id, dto.replyMessage);
    return { message: 'Reply sent successfully', data };
  }

  @Get('contact/:id/replies')
  @Permissions(PERMISSIONS.INQUIRIES_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get contact reply history',
    description:
      'Returns stored admin reply history for a given contact message id.',
  })
  @ApiParam({ name: 'id', description: 'Contact message MongoDB id' })
  @ApiResponse({ status: 200, description: 'Reply history' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async getContactReplies(@Param('id') id: string) {
    const data = await this.adminService.getContactReplyHistory(id);
    return { message: 'Reply history retrieved successfully', data };
  }

  @Get('notifications')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Permissions(PERMISSIONS.PROFILE_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List admin in-app notifications',
    description:
      'Admin bell feed (`notifications` collection). Optional time-range: all, today, week, 30d, 90d. Use PATCH `.../:id/seen` to mark read (`id` = MongoDB _id).',
  })
  @ApiQuery({
    name: 'range',
    required: false,
    enum: ['all', 'today', 'week', '30d', '90d'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'seen',
    required: false,
    type: Boolean,
    description: 'Optional: true = read only, false = unread only',
  })
  @ApiResponse({
    status: 200,
    description:
      'Notifications list with pagination and root unreadCount (unread within range filter)',
  })
  async listNotifications(@Query() query: ListNotificationsQueryDto) {
    const result = await this.adminService.listNotifications(query);
    return {
      message: 'Notifications retrieved successfully',
      data: result.data,
      totalCount: result.totalCount,
      unreadCount: result.unreadCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  @Patch('notifications/seen-all')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Permissions(PERMISSIONS.PROFILE_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark all admin notifications as seen',
    description:
      'Sets seen=true on all unread rows in the admin feed. Returns markedCount.',
  })
  @ApiResponse({ status: 200, description: 'All notifications marked as seen' })
  async markAllNotificationsSeen() {
    const result = await this.adminService.markAllNotificationsSeen();
    return {
      message: 'All notifications marked as seen',
      success: result.success,
      markedCount: result.markedCount,
    };
  }

  @Patch('notifications/:id/seen')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Permissions(PERMISSIONS.PROFILE_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark an admin notification as seen' })
  @ApiParam({
    name: 'id',
    description: 'Notification MongoDB _id (24-char hex)',
    example: '674a1b2c3d4e5f6789012345',
  })
  @ApiResponse({ status: 200, description: 'Notification marked as seen' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markNotificationSeen(@Param('id') id: string) {
    const result = await this.adminService.markNotificationSeen(id);
    return {
      message: 'Notification marked as seen',
      success: result.success,
      id: result.id,
      seen: result.seen,
    };
  }

  @Post('banner/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete banner',
    description:
      'Permanently deletes a banner by id. The banner must belong to the logged-in vendor. Same pattern as **team-member/delete** (JSON body).',
  })
  @ApiBody({ type: DeleteBannerDto })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async deleteBannerPost(
    @CurrentUser() user: { vendorId: string },
    @Body() body: DeleteBannerDto,
  ) {
    return this.executeBannerDelete(user, body);
  }

  @Delete('banner/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete banner',
    description:
      'Same as **POST /admin/banner/delete** — JSON body `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteBannerDto })
  @ApiResponse({ status: 200, description: 'Banner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async deleteBannerDelete(
    @CurrentUser() user: { vendorId: string },
    @Body() body: DeleteBannerDto,
  ) {
    return this.executeBannerDelete(user, body);
  }

  private async executeBannerDelete(
    user: { vendorId: string },
    body: DeleteBannerDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.deleteBanner(user.vendorId, body.id);
    return { message: 'Banner deleted successfully', data };
  }

  @Get('banner/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get banner by id',
    description:
      'Returns one banner for the **View Banner** modal: **imageUrl**, **imageSource** (`binary_upload` vs `manual_url`), **title**, **sequenceNumber**, and **description**. Vendor-scoped.',
  })
  @ApiParam({ name: 'id', description: 'Banner MongoDB id' })
  @ApiResponse({ status: 200, description: 'Banner details' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async getBannerById(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.getBannerById(user.vendorId, id);
    return { message: 'Banner retrieved successfully', data };
  }

  @Patch('banner/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set/toggle banner status',
    description:
      'Sets a banner **status** to **active/inactive** (1/0). If body `status` is omitted, backend toggles current state. Vendor-scoped.',
  })
  @ApiParam({ name: 'id', description: 'Banner MongoDB id' })
  @ApiBody({ type: UpdateBannerStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Banner status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiResponse({ status: 400, description: 'Invalid id/status' })
  async updateBannerStatus(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
    @Body() body: UpdateBannerStatusDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.setOrToggleBannerStatus(
      user.vendorId,
      id,
      body?.status,
    );
    return { message: 'Banner status updated successfully', data };
  }

  @Post('team-member/create')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_ADD)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(teamMemberImageInterceptor)
  @ApiOperation({
    summary: 'Create team member',
    description:
      'Use **Authorize** (Bearer) as usual. Swagger sometimes drops `Authorization` on multipart uploads — then send the same JWT via **x-access-token** header or **access_token** query param. ' +
      '**Sectors** multiselect — fixed options only (GET **/admin/team-member/sector-options**): Building, Industries, Consumer Products, Facility Services. Send **sectors** as JSON array of names or ids 1–4, **sectors[]**, **sector_ids**, etc. Category fields are not accepted.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'x-access-token',
    required: false,
    description:
      'Raw JWT if Bearer header is not sent (multipart / Swagger workaround)',
  })
  @ApiQuery({
    name: 'access_token',
    required: false,
    description: 'Raw JWT query fallback for multipart / Swagger',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        designation: { type: 'string' },
        email: { type: 'string' },
        mobile: { type: 'string' },
        displayOrder: { type: 'number', minimum: 1 },
        team: {
          type: 'string',
          enum: ['administrative', 'technical', 'finance', 'marketing'],
        },
        image: { type: 'string', format: 'binary' },
        facebookUrl: { type: 'string' },
        twitterUrl: { type: 'string' },
        linkedinUrl: { type: 'string' },
        roleId: { type: 'string', description: 'Legacy single role id' },
        roleIds: {
          oneOf: [
            { type: 'array', items: { type: 'string' } },
            { type: 'string', description: 'JSON string array' },
          ],
        },
        'roleIds[]': {
          type: 'array',
          items: { type: 'string' },
          description: 'Repeated multipart fields for role ids',
        },
        sectors: {
          oneOf: [
            {
              type: 'array',
              items: {
                oneOf: [{ type: 'integer' }, { type: 'string' }],
              },
            },
            {
              type: 'string',
              description:
                'JSON array of sector names or ids, e.g. ["Building","Industries"] or [1,2]',
            },
          ],
          description:
            'Multiselect: Building, Industries, Consumer Products, Facility Services',
        },
        sector: {
          oneOf: [{ type: 'integer' }, { type: 'string' }],
          description: 'Legacy single sector id',
        },
        'sectors[]': {
          type: 'array',
          items: { type: 'integer' },
          description: 'Repeated multipart sector id fields',
        },
        sector_ids: {
          oneOf: [
            { type: 'array', items: { type: 'integer' } },
            { type: 'string' },
          ],
        },
        sectorIds: {
          type: 'string',
          description: 'JSON array string of sector ids',
        },
      },
      required: ['name', 'email', 'mobile', 'displayOrder', 'team'],
    },
  })
  @ApiResponse({ status: 201, description: 'Team member created successfully' })
  @ApiResponse({ status: 409, description: 'Email or mobile already exists' })
  async createTeamMember(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const parsedCreateDisplayOrder =
      body.displayOrder === undefined ||
      body.displayOrder === null ||
      String(body.displayOrder).trim() === ''
        ? undefined
        : Number.parseInt(String(body.displayOrder), 10);

    const normalizedRoleIds = this.normalizeTeamMemberRoleIds(body);
    if (hasExplicitCategoryIdFields(body)) {
      throw new BadRequestException(
        'Category fields are no longer accepted. Send **sectors** only (numeric ids from GET /api/sectors).',
      );
    }
    const mergedSectorIds = mergeTeamMemberSectorIdsFromFormObject(body);
    const dto = plainToClass(CreateTeamMemberDto, {
      name: body.name,
      designation: body.designation,
      email: body.email,
      mobile: body.mobile,
      displayOrder: parsedCreateDisplayOrder,
      team: body.team ?? body.teamType,
      facebookUrl: body.facebookUrl,
      twitterUrl: body.twitterUrl,
      linkedinUrl: body.linkedinUrl,
      roleId: normalizedRoleIds[0],
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file
      ? (await uploadFile(file, 'team-members')).fileUrl
      : undefined;
    const teamMember = await this.adminService.createTeamMember(user.vendorId, {
      name: dto.name,
      designation: dto.designation,
      email: dto.email,
      mobile: dto.mobile,
      displayOrder: dto.displayOrder,
      team: dto.team,
      imagePath,
      facebookUrl: dto.facebookUrl,
      twitterUrl: dto.twitterUrl,
      linkedinUrl: dto.linkedinUrl,
      roleId: dto.roleId,
      roleIds: normalizedRoleIds,
      sector_ids: mergedSectorIds,
    });

    return { message: 'Team member created successfully', data: teamMember };
  }

  @TeamMemberEditDocs()
  @Post('team-member/edit')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_UPDATE)
  async editTeamMemberPost(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.executeTeamMemberEdit(user, body, file);
  }

  @TeamMemberEditDocs()
  @Patch('team-member/edit')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_UPDATE)
  async editTeamMemberPatch(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.executeTeamMemberEdit(user, body, file);
  }

  private async executeTeamMemberEdit(
    user: { vendorId: string },
    body: any,
    file?: Express.Multer.File,
  ) {
    const parsedEditDisplayOrder =
      body.displayOrder === undefined ||
      body.displayOrder === null ||
      String(body.displayOrder).trim() === ''
        ? undefined
        : Number.parseInt(String(body.displayOrder), 10);

    const normalizedRoleIds = this.normalizeTeamMemberRoleIds(body);
    if (hasExplicitCategoryIdFields(body)) {
      throw new BadRequestException(
        'Category fields are no longer accepted. Send **sectors** only (numeric ids from GET /api/sectors).',
      );
    }
    const explicitSectors = hasExplicitTeamMemberSectorFields(body);
    const mergedSectorIds = mergeTeamMemberSectorIdsFromFormObject(body);
    const dto = plainToClass(EditTeamMemberDto, {
      id: body.id,
      name: body.name,
      designation: body.designation,
      email: body.email,
      mobile: body.mobile,
      displayOrder: parsedEditDisplayOrder,
      team: body.team ?? body.teamType,
      facebookUrl: body.facebookUrl,
      twitterUrl: body.twitterUrl,
      linkedinUrl: body.linkedinUrl,
      roleId: body.roleId,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file
      ? (await uploadFile(file, 'team-members')).fileUrl
      : undefined;
    const teamMember = await this.adminService.updateTeamMember(user?.vendorId ?? '', {
      id: dto.id,
      name: dto.name,
      designation: dto.designation,
      email: dto.email,
      mobile: dto.mobile,
      displayOrder: dto.displayOrder,
      team: dto.team,
      imagePath,
      facebookUrl: dto.facebookUrl,
      twitterUrl: dto.twitterUrl,
      linkedinUrl: dto.linkedinUrl,
      roleId: dto.roleId,
      roleIds: normalizedRoleIds,
      sector_ids: explicitSectors ? mergedSectorIds : undefined,
    });

    return { message: 'Team member updated successfully', data: teamMember };
  }

  @Post('team-member/delete')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete team member (soft delete)',
    description:
      'Sets team member **status** to **2** (removed from list). Same behaviour as partner delete. **POST** or **DELETE** with JSON body `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteTeamMemberDto })
  @ApiResponse({ status: 200, description: 'Team member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  async deleteTeamMemberPost(
    @CurrentUser() user: { vendorId: string },
    @Body() body: DeleteTeamMemberDto,
  ) {
    return this.executeTeamMemberDelete(user, body);
  }

  @Delete('team-member/delete')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete team member (soft delete)',
    description:
      'Same as POST **/admin/team-member/delete** — JSON body `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteTeamMemberDto })
  @ApiResponse({ status: 200, description: 'Team member deleted successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  async deleteTeamMemberDelete(
    @CurrentUser() user: { vendorId: string },
    @Body() body: DeleteTeamMemberDto,
  ) {
    return this.executeTeamMemberDelete(user, body);
  }

  private async executeTeamMemberDelete(
    user: { vendorId: string },
    body: DeleteTeamMemberDto,
  ) {
    const data = await this.adminService.deleteTeamMember(
      user?.vendorId ?? '',
      body.id,
    );
    return { message: 'Team member deleted successfully', data };
  }

  @Post('newsletter/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete newsletter subscriber',
    description:
      'Permanently deletes a newsletter subscriber by id (MongoDB _id). JSON body: `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteNewsletterSubscriberDto })
  @ApiResponse({ status: 200, description: 'Subscriber deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id / validation error' })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  async deleteNewsletterSubscriberPost(
    @Body() body: DeleteNewsletterSubscriberDto,
  ) {
    const data = await this.adminService.deleteNewsletterSubscriber(body.id);
    return { message: 'Subscriber deleted successfully', data };
  }

  @Delete('newsletter/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete newsletter subscriber',
    description:
      'Same as **POST /admin/newsletter/delete** — JSON body `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteNewsletterSubscriberDto })
  @ApiResponse({ status: 200, description: 'Subscriber deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id / validation error' })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  async deleteNewsletterSubscriberDelete(
    @Body() body: DeleteNewsletterSubscriberDto,
  ) {
    const data = await this.adminService.deleteNewsletterSubscriber(body.id);
    return { message: 'Subscriber deleted successfully', data };
  }

  @Post('newsletter/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set/toggle newsletter subscriber status',
    description:
      'For subscribers list toggle. If `status` is omitted, backend toggles current status. Accepts MongoDB _id or S.No as `id`.',
  })
  @ApiBody({ type: UpdateNewsletterSubscriberStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Subscriber status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid id/status' })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  async setNewsletterSubscriberStatusPost(
    @Body() body: UpdateNewsletterSubscriberStatusDto,
  ) {
    const data = await this.adminService.setOrToggleNewsletterSubscriberStatus(
      body.id,
      body.status,
    );
    return { message: 'Subscriber status updated successfully', data };
  }

  @Patch('newsletter/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set/toggle newsletter subscriber status',
    description:
      'Same as **POST /admin/newsletter/status** — JSON body `{ "id": "...", "status"?: "active|inactive" }`.',
  })
  @ApiBody({ type: UpdateNewsletterSubscriberStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Subscriber status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid id/status' })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  async setNewsletterSubscriberStatusPatch(
    @Body() body: UpdateNewsletterSubscriberStatusDto,
  ) {
    const data = await this.adminService.setOrToggleNewsletterSubscriberStatus(
      body.id,
      body.status,
    );
    return { message: 'Subscriber status updated successfully', data };
  }

  @Patch('newsletter/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set/toggle newsletter subscriber status (param)',
    description:
      'Alternative form: pass id in URL. Optional body `{ "status"?: "active|inactive" }`. If status omitted, toggles.',
  })
  @ApiParam({ name: 'id', description: 'Mongo _id or S.No (1-based)' })
  @ApiResponse({
    status: 200,
    description: 'Subscriber status updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid id/status' })
  @ApiResponse({ status: 404, description: 'Subscriber not found' })
  async setNewsletterSubscriberStatusParam(
    @Param('id') id: string,
    @Body() body: { status?: string },
  ) {
    const data = await this.adminService.setOrToggleNewsletterSubscriberStatus(
      id,
      body?.status,
    );
    return { message: 'Subscriber status updated successfully', data };
  }

  @Get('team-member/sector-options')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fixed team member sector options',
    description:
      'Returns the four allowed CMS team-member sectors for multiselect (not from GET /api/sectors): Building, Industries, Consumer Products, Facility Services.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Building' },
            },
          },
        },
      },
    },
  })
  listTeamMemberSectorOptions() {
    return this.adminService.listTeamMemberSectorOptions();
  }

  @Get('team-member/list')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List team members',
    description:
      'Returns global team members dataset for admin panel: serial number, name, designation, email, mobile, displayOrder, team, active flag, and id for actions. Excludes soft-deleted members (status 2). Sorted by displayOrder ascending.',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member list',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Team members retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              s_no: { type: 'number', example: 1 },
              id: { type: 'string' },
              name: { type: 'string' },
              designation: { type: 'string' },
              email: { type: 'string' },
              mobile: { type: 'string' },
              displayOrder: { type: 'number', example: 1 },
              team: {
                type: 'string',
                example: 'technical',
                enum: ['administrative', 'technical', 'finance', 'marketing'],
              },
              is_active: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  async listTeamMembers(
    @CurrentUser() user: { vendorId: string },
    @Query() query: ListTeamMembersQueryDto,
  ) {
    return this.executeListTeamMembers(user, query);
  }

  @Get('team-members/list')
  @Permissions(PERMISSIONS.TEAM_MEMBERS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List team members (filters + pagination)',
    description:
      'Supports filters (status, designation) and pagination (page, limit). Uses global team-members dataset and displayOrder sorting.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'active | inactive',
  })
  @ApiQuery({
    name: 'designation',
    required: false,
    description: 'Exact designation match (case-insensitive)',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Default 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Default 10' })
  async listTeamMembersPaginated(
    @CurrentUser() user: { vendorId: string },
    @Query() query: ListTeamMembersQueryDto,
  ) {
    return this.executeListTeamMembers(user, query);
  }

  private async executeListTeamMembers(
    user: { vendorId: string },
    query: ListTeamMembersQueryDto,
  ) {
    const result = await this.adminService.listTeamMembersPaginated(
      user?.vendorId ?? '',
      query,
    );
    return {
      message: 'Team members retrieved successfully',
      data: result.data,
      displayOrderMax: result.displayOrderMax,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  @Get('contact/list')
  @Permissions(PERMISSIONS.INQUIRIES_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List contact messages',
    description:
      'Returns website contact form submissions for the admin panel table: S.No, Name, Email, Phone No, plus id for actions. Newest first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact messages list',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Contact messages retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              s_no: { type: 'number', example: 1 },
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phoneNo: { type: 'string' },
              message: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async listContactMessages() {
    const data = await this.adminService.listContactMessages();
    return { message: 'Contact messages retrieved successfully', data };
  }

  @Get('contact/:id/view')
  @Permissions(PERMISSIONS.INQUIRIES_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'View contact message',
    description:
      'Returns one contact message for admin view: name, email, phone, message.',
  })
  @ApiParam({
    name: 'id',
    description: 'Contact message MongoDB id (from list)',
  })
  @ApiResponse({ status: 200, description: 'Contact message details' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async viewContactMessage(@Param('id') id: string) {
    const data = await this.adminService.getContactMessageById(id);
    return { message: 'Contact message retrieved successfully', data };
  }

  @Post('contact/delete')
  @Permissions(PERMISSIONS.INQUIRIES_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete contact message',
    description:
      'Permanently deletes a contact message by id. JSON body: `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteContactMessageDto })
  @ApiResponse({
    status: 200,
    description: 'Contact message deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid id / validation error' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async deleteContactMessagePost(@Body() body: DeleteContactMessageDto) {
    const data = await this.adminService.deleteContactMessage(body.id);
    return { message: 'Contact message deleted successfully', data };
  }

  @Delete('contact/delete')
  @Permissions(PERMISSIONS.INQUIRIES_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete contact message',
    description:
      'Same as **POST /admin/contact/delete** — JSON body `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteContactMessageDto })
  @ApiResponse({
    status: 200,
    description: 'Contact message deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid id / validation error' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async deleteContactMessageDelete(@Body() body: DeleteContactMessageDto) {
    const data = await this.adminService.deleteContactMessage(body.id);
    return { message: 'Contact message deleted successfully', data };
  }

  @Get('team-member/search/by-name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search team members by name',
    description:
      'Case-insensitive partial match on **name** (global, non-deleted team members). Response shape matches **GET /admin/team-member/list**.',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Substring to match against team member name',
    example: 'Priya',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results (may be empty array)',
  })
  @ApiResponse({ status: 400, description: 'Missing or empty name' })
  async searchTeamMembersByName(
    @CurrentUser() user: { vendorId: string },
    @Query('name') name: string,
  ) {
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new BadRequestException('Query parameter "name" is required');
    }
    const data = await this.adminService.searchTeamMembers(user?.vendorId ?? '', {
      name: trimmed,
    });
    return { message: 'Team members search completed successfully', data };
  }

  @Get('team-member/search/by-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search team members by email',
    description:
      'Case-insensitive partial match on **email** (global, non-deleted team members). Response shape matches **GET /admin/team-member/list**.',
  })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Substring to match against team member email',
    example: 'greenpro',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results (may be empty array)',
  })
  @ApiResponse({ status: 400, description: 'Missing or empty email' })
  async searchTeamMembersByEmail(
    @CurrentUser() user: { vendorId: string },
    @Query('email') email: string,
  ) {
    const trimmed = email?.trim();
    if (!trimmed) {
      throw new BadRequestException('Query parameter "email" is required');
    }
    const data = await this.adminService.searchTeamMembers(user?.vendorId ?? '', {
      email: trimmed,
    });
    return { message: 'Team members search completed successfully', data };
  }

  @Get('team-member/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search team members by name and/or email',
    description:
      'Optional **name** and **email** query params (case-insensitive partial match). At least one is required. If both are sent, both must match (**AND**). Same response shape as the team member list.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Substring to match against name',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Substring to match against email',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results (may be empty array)',
  })
  @ApiResponse({ status: 400, description: 'Neither name nor email provided' })
  async searchTeamMembers(
    @CurrentUser() user: { vendorId: string },
    @Query('name') name?: string,
    @Query('email') email?: string,
  ) {
    const data = await this.adminService.searchTeamMembers(user?.vendorId ?? '', {
      name: name?.trim() || undefined,
      email: email?.trim() || undefined,
    });
    return { message: 'Team members search completed successfully', data };
  }

  @Get('team-member/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get team member by id',
    description:
      'Returns one team member for the **View** modal: name, designation, email, mobile, displayOrder, team, status (**Active** / **Inactive**), image URL, social URLs, **sectors** (fixed: Building, Industries, Consumer Products, Facility Services). Soft-deleted excluded.',
  })
  @ApiParam({ name: 'id', description: 'Team member MongoDB id' })
  @ApiResponse({ status: 200, description: 'Team member details' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async getTeamMemberById(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
  ) {
    const data = await this.adminService.getTeamMemberById(user?.vendorId ?? '', id);
    return { message: 'Team member retrieved successfully', data };
  }

  @Patch('team-member/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle team member status',
    description:
      'Toggles team member (partner) **status**: **1** (active) ↔ **0** (inactive). Same as partner status toggle. Soft-deleted members (**2**) are not found.',
  })
  @ApiParam({ name: 'id', description: 'Team member MongoDB id' })
  @ApiResponse({
    status: 200,
    description: 'Team member status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 400, description: 'Invalid id or unexpected status' })
  async updateTeamMemberStatus(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
  ) {
    const data = await this.adminService.updateTeamMemberStatus(
      user?.vendorId ?? '',
      id,
    );
    return { message: 'Team member status updated successfully', data };
  }

  @Patch('change-password')
  @Permissions(PERMISSIONS.PROFILE_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description:
      'Updates the logged-in user password after verifying the current password.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or passwords do not match',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token or wrong current password',
  })
  async changePassword(
    @CurrentUser() user: { userId: string },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.manufacturersService.changePassword(
      user.userId,
      changePasswordDto,
    );
    return { message: 'Password changed successfully' };
  }

  @Put('manufacturers/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('manufacturer_image', {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({
    summary: 'Update manufacturer details',
    description:
      'Updates manufacturer display name (required). For **unverified** manufacturers, **gpInternalId** and **manufacturerInitial** are generated server-side from the name (multipart fields ignored if sent). For verified manufacturers, optional **gpInternalId** / **manufacturerInitial** may be supplied. Supports optional image upload.',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        manufacturerName: {
          type: 'string',
          description: 'Manufacturer name',
        },
        gpInternalId: {
          type: 'string',
          description:
            'Optional for verified manufacturers (e.g. GPGP-001 or legacy GPSC-312). Ignored when unverified (auto-generated).',
          example: 'GPGP-001',
        },
        manufacturerInitial: {
          type: 'string',
          description:
            'Optional for verified (two letters). Ignored when unverified (auto-generated).',
          example: 'GP',
        },
        manufacturer_image: {
          type: 'string',
          format: 'binary',
          description: 'Manufacturer image (optional)',
        },
      },
      required: ['manufacturerName'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Manufacturer updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or format' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateManufacturer(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateDto = plainToClass(UpdateManufacturerDto, {
      manufacturerName: body.manufacturerName,
      gpInternalId: body.gpInternalId,
      manufacturerInitial: body.manufacturerInitial,
    });

    const errors = await validate(updateDto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file
      ? (await uploadFile(file, 'manufacturers')).fileUrl
      : undefined;
    const manufacturer = await this.adminService.updateManufacturer(
      id,
      updateDto,
      imagePath,
    );
    return {
      message: 'Manufacturer updated successfully',
      data: manufacturer,
    };
  }

  @Patch('manufacturers/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle manufacturer status',
    description:
      'Toggles manufacturer status: if current status is 1, sets to 2; if 2, sets to 1',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer ID' })
  @ApiResponse({
    status: 200,
    description: 'Manufacturer status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateManufacturerStatus(@Param('id') id: string) {
    const manufacturer = await this.adminService.updateManufacturerStatus(id);
    return {
      message: 'Manufacturer status updated successfully',
      data: manufacturer,
    };
  }

  @Patch('vendors/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle vendor status',
    description:
      'Toggles vendor status: if current status is 0, sets to 1; if 1, sets to 0',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({
    status: 200,
    description: 'Vendor status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendorStatus(@Param('id') id: string) {
    const vendor = await this.adminService.updateVendorStatus(id);
    return {
      message: 'Vendor status updated successfully',
      data: vendor,
    };
  }
}
