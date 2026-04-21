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
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
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
import type { Request } from 'express';

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
        '**POST** or **PATCH** — same handler. Multipart form: **id** (team member from list), name, designation, email, mobile, optional **image** (270×400px recommended), social URLs. Same JWT workarounds as create (**x-access-token** / **access_token**) if Bearer is dropped on multipart.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiHeader({
      name: 'x-access-token',
      required: false,
      description: 'Raw JWT if Bearer header is not sent (multipart / Swagger workaround)',
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
          image: { type: 'string', format: 'binary' },
          facebookUrl: { type: 'string' },
          twitterUrl: { type: 'string' },
          linkedinUrl: { type: 'string' },
        },
        required: ['id', 'name', 'email', 'mobile'],
      },
    }),
    ApiResponse({ status: 200, description: 'Team member updated successfully' }),
    ApiResponse({ status: 404, description: 'Team member not found' }),
    ApiResponse({ status: 409, description: 'Email or phone already exists for another member' }),
  );
}

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly manufacturersService: ManufacturersService,
  ) {}

  @Patch('profile/edit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Edit profile (unique GST + phone)',
    description:
      'Edits the logged-in vendor profile. Blocks the update if GST number or phone number already exists for another vendor.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or GST/phone already exists',
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async editProfile(
    @CurrentUser() user: { userId: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.manufacturersService.editProfile(
      user.userId,
      updateProfileDto,
    );
    return { message: 'Profile updated successfully', data: profile };
  }

  @Get('banner/list')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({
    summary: 'List banners',
    description:
      'Returns active banners for website display (newest first): **imageUrl**, **heading**, **description** (full text — use CSS **line-clamp: 3** in the card), **is_active**, **targetUrl**, and **id**.',
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
              imageUrl: { type: 'string' },
              targetUrl: { type: 'string' },
              heading: { type: 'string' },
              description: { type: 'string' },
              is_active: { type: 'boolean' },
            },
          },
        },
      },
    },
  })
  async listBanners(@Req() req: Request) {
    const data = await this.adminService.listPublicBanners();

    const origin = `${req.protocol}://${req.get('host')}`;
    const normalizeImageUrl = (raw: unknown) => {
      const v = (raw ?? '').toString().trim();
      if (!v) return v;
      if (/^https?:\/\//i.test(v)) return v;
      if (v.startsWith('/uploads/')) return `${origin}${v}`;
      if (v.startsWith('uploads/')) return `${origin}/${v}`;
      return v; // keep as-is (legacy values)
    };

    const normalized = data.map((b) => ({
      ...b,
      imageUrl: normalizeImageUrl(b.imageUrl),
    }));
    return { message: 'Banners retrieved successfully', data: normalized };
  }

  @Post('banner')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'banners'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname || '');
          cb(null, `banner-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file?.originalname) {
          cb(null, true);
          return;
        }
        // Accept any image/* mimetype (some browsers report webp as image/x-webp etc.)
        cb(null, typeof file.mimetype === 'string' && file.mimetype.startsWith('image/'));
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Create banner',
    description:
      'Creates a banner for the logged-in vendor. Multipart form: image (binary), optional targetUrl, heading, description. (imageUrl string is also accepted for backward compatibility).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['heading', 'description'],
      properties: {
        image: { type: 'string', format: 'binary' },
        imageUrl: { type: 'string', description: 'Optional if image is uploaded' },
        targetUrl: { type: 'string', description: 'Optional' },
        heading: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Banner created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid vendor' })
  async createBanner(
    @CurrentUser() user: { vendorId: string },
    @Req() req: Request,
    @Body() body: any,
    @UploadedFile() file?: any,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const dto = plainToClass(CreateBannerDto, {
      imageUrl: body.imageUrl,
      targetUrl: body.targetUrl,
      heading: body.heading,
      description: body.description,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imageUrl = file ? `/uploads/banners/${file.filename}` : dto.imageUrl;
    if (!imageUrl) {
      throw new BadRequestException('Banner image is required');
    }

    const data = await this.adminService.createBanner(user.vendorId, {
      ...dto,
      imageUrl,
    });
    const origin = `${req.protocol}://${req.get('host')}`;
    const normalized = {
      ...data,
      imageUrl:
        typeof data?.imageUrl === 'string' && data.imageUrl.startsWith('/uploads/')
          ? `${origin}${data.imageUrl}`
          : data.imageUrl,
    };
    return { message: 'Banner created successfully', data: normalized };
  }

  @Patch(['banner/:id', 'banner/:id/edit'])
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'banners'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname || '');
          cb(null, `banner-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file?.originalname) {
          cb(null, true);
          return;
        }
        // Accept any image/* mimetype (some browsers report webp as image/x-webp etc.)
        cb(null, typeof file.mimetype === 'string' && file.mimetype.startsWith('image/'));
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({
    summary: 'Edit banner',
    description:
      'Edits a banner for the logged-in vendor. Multipart form: optional image (binary), optional targetUrl, required heading + description.',
  })
  @ApiParam({ name: 'id', description: 'Banner MongoDB id (from banner list)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['heading', 'description'],
      properties: {
        image: { type: 'string', format: 'binary' },
        imageUrl: { type: 'string', description: 'Optional if image is uploaded' },
        targetUrl: { type: 'string', description: 'Optional' },
        heading: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Banner updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error / invalid id' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async editBanner(
    @CurrentUser() user: { vendorId: string },
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: any,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const dto = plainToClass(EditBannerDto, {
      imageUrl: body.imageUrl,
      targetUrl: body.targetUrl,
      heading: body.heading,
      description: body.description,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    // In edit: image is optional. If neither `image` (binary) nor `imageUrl` is provided,
    // we keep the existing imageUrl stored in DB.
    const imageUrl = file ? `/uploads/banners/${file.filename}` : dto.imageUrl;

    const data = await this.adminService.updateBanner(user.vendorId, id, {
      ...(imageUrl ? { imageUrl } : {}),
      targetUrl: dto.targetUrl,
      heading: dto.heading,
      description: dto.description,
    });
    const origin = `${req.protocol}://${req.get('host')}`;
    const normalized = {
      ...data,
      imageUrl:
        typeof data?.imageUrl === 'string' && data.imageUrl.startsWith('/uploads/')
          ? `${origin}${data.imageUrl}`
          : data.imageUrl,
    };
    return { message: 'Banner updated successfully', data: normalized };
  }

  @Post('events/create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'events'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
  async createEvent(
    @Body() body: any,
    @UploadedFile() file?: any,
  ) {
    const dto = plainToClass(CreateEventDto, {
      eventName: body.eventName,
      eventDate: body.eventDate,
      eventStartTime: body.eventStartTime,
      eventEndTime: body.eventEndTime,
      eventLocation: body.eventLocation,
      eventDescription: body.eventDescription,
      contactPersonName: body.contactPersonName,
      contactPersonDesignation: body.contactPersonDesignation,
      contactPersonEmail: body.contactPersonEmail,
      contactPersonPhone: body.contactPersonPhone,
      registrationLink: body.registrationLink,
      brochureLink: body.brochureLink,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const rawDate = String(dto.eventDate ?? '').trim();
    const eventDate =
      /^\d{2}-\d{2}-\d{4}$/.test(rawDate)
        ? new Date(
            `${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`,
          )
        : new Date(rawDate);
    if (Number.isNaN(eventDate.getTime())) {
      throw new BadRequestException('Invalid eventDate (expected ISO date/datetime)');
    }

    const eventImage = file ? `/uploads/events/${file.filename}` : undefined;
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
    });

    return { message: 'Event created successfully', data };
  }

  @Patch('events/:id/edit')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'eventImage', maxCount: 1 },
        { name: 'event_image', maxCount: 1 },
      ],
      {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'events'),
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
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
      eventName: pick(['eventName', 'name', 'event_name']),
      eventDate: pick(['eventDate', 'date', 'event_date']),
      eventStartTime: pick(['eventStartTime', 'startTime', 'event_start_time']),
      eventEndTime: pick(['eventEndTime', 'endTime', 'event_end_time']),
      eventLocation: pick(['eventLocation', 'location', 'event_location']),
      eventDescription: pick(['eventDescription', 'description', 'event_description']),
      contactPersonName: pick(['contactPersonName', 'contact_person_name', 'contactName']),
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
      contactPersonPhone: pick(['contactPersonPhone', 'contact_person_phone', 'contactPhone']),
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
      eventDate =
        /^\d{2}-\d{2}-\d{4}$/.test(raw)
          ? new Date(`${raw.slice(6, 10)}-${raw.slice(3, 5)}-${raw.slice(0, 2)}`)
          : new Date(raw);
      if (Number.isNaN(eventDate.getTime())) {
        throw new BadRequestException('Invalid eventDate (expected ISO date/datetime)');
      }
    }

    const picked =
      files?.image?.[0] || files?.eventImage?.[0] || files?.event_image?.[0] || null;
    const eventImage = picked ? `/uploads/events/${picked.filename}` : undefined;
    const data = await this.adminService.updateEvent(id, {
      ...(dto.eventName !== undefined ? { eventName: dto.eventName } : {}),
      ...(eventDate !== undefined ? { eventDate } : {}),
      ...(dto.eventStartTime !== undefined ? { eventStartTime: dto.eventStartTime } : {}),
      ...(dto.eventEndTime !== undefined ? { eventEndTime: dto.eventEndTime } : {}),
      ...(dto.eventLocation !== undefined ? { eventLocation: dto.eventLocation } : {}),
      ...(dto.eventDescription !== undefined ? { eventDescription: dto.eventDescription } : {}),
      ...(dto.contactPersonName !== undefined ? { contactPersonName: dto.contactPersonName } : {}),
      ...(dto.contactPersonDesignation !== undefined
        ? { contactPersonDesignation: dto.contactPersonDesignation }
        : {}),
      ...(dto.contactPersonEmail !== undefined ? { contactPersonEmail: dto.contactPersonEmail } : {}),
      ...(dto.contactPersonPhone !== undefined ? { contactPersonPhone: dto.contactPersonPhone } : {}),
      ...(dto.registrationLink !== undefined ? { registrationLink: dto.registrationLink } : {}),
      ...(dto.brochureLink !== undefined ? { brochureLink: dto.brochureLink } : {}),
      ...(eventImage ? { eventImage } : {}),
    });

    return { message: 'Event updated successfully', data };
  }

  @Get('events/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List events',
    description:
      'Returns events for the Events table: image, event name, date & time, location, active flag, and id for actions. Newest first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Events list',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Events retrieved successfully' },
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
  async listEvents() {
    const data = await this.adminService.listEvents();
    return { message: 'Events retrieved successfully', data };
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
    const data = await this.adminService.getEventById(id);
    return { message: 'Event retrieved successfully', data };
  }

  @Delete('events/:id')
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
    const data = await this.adminService.deleteEvent(id);
    return { message: 'Event deleted successfully', data };
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List notifications',
    description:
      'Returns notification list for admin panel with optional time-range filter: all, today, week, 30d, 90d.',
  })
  @ApiQuery({ name: 'range', required: false, enum: ['all', 'today', 'week', '30d', '90d'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async listNotifications(@Query() query: ListNotificationsQueryDto) {
    const result = await this.adminService.listNotifications(query);
    return {
      message: 'Notifications retrieved successfully',
      data: result.data,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
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
    description: 'Same as **POST /admin/banner/delete** — JSON body `{ "id": "..." }`.',
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
      'Returns one banner for the **View Banner** modal: **imageUrl** (image link shown as URL in the UI), **heading**, and **banner description**. Vendor-scoped.',
  })
  @ApiParam({ name: 'id', description: 'Banner MongoDB id' })
  @ApiResponse({ status: 200, description: 'Banner details' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async getBannerById(
    @CurrentUser() user: { vendorId: string },
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.getBannerById(user.vendorId, id);
    const origin = `${req.protocol}://${req.get('host')}`;
    const normalized = {
      ...data,
      imageUrl:
        typeof data?.imageUrl === 'string' && data.imageUrl.startsWith('/uploads/')
          ? `${origin}${data.imageUrl}`
          : data.imageUrl,
    };
    return { message: 'Banner retrieved successfully', data: normalized };
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
  @ApiResponse({ status: 200, description: 'Banner status updated successfully' })
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
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(teamMemberImageInterceptor)
  @ApiOperation({
    summary: 'Create team member',
    description:
      'Use **Authorize** (Bearer) as usual. Swagger sometimes drops `Authorization` on multipart uploads — then send the same JWT via **x-access-token** header or **access_token** query param.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'x-access-token',
    required: false,
    description: 'Raw JWT if Bearer header is not sent (multipart / Swagger workaround)',
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
        image: { type: 'string', format: 'binary' },
        facebookUrl: { type: 'string' },
        twitterUrl: { type: 'string' },
        linkedinUrl: { type: 'string' },
      },
      required: ['name', 'email', 'mobile'],
    },
  })
  @ApiResponse({ status: 201, description: 'Team member created successfully' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  async createTeamMember(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFile() file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const dto = plainToClass(CreateTeamMemberDto, {
      name: body.name,
      designation: body.designation,
      email: body.email,
      mobile: body.mobile,
      facebookUrl: body.facebookUrl,
      twitterUrl: body.twitterUrl,
      linkedinUrl: body.linkedinUrl,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file ? `/uploads/team-members/${file.filename}` : undefined;
    const teamMember = await this.adminService.createTeamMember(user.vendorId, {
      name: dto.name,
      designation: dto.designation,
      email: dto.email,
      mobile: dto.mobile,
      imagePath,
      facebookUrl: dto.facebookUrl,
      twitterUrl: dto.twitterUrl,
      linkedinUrl: dto.linkedinUrl,
    });

    return { message: 'Team member created successfully', data: teamMember };
  }

  @TeamMemberEditDocs()
  @Post('team-member/edit')
  async editTeamMemberPost(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFile() file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
  ) {
    return this.executeTeamMemberEdit(user, body, file);
  }

  @TeamMemberEditDocs()
  @Patch('team-member/edit')
  async editTeamMemberPatch(
    @CurrentUser() user: { vendorId: string },
    @Body() body: any,
    @UploadedFile() file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
  ) {
    return this.executeTeamMemberEdit(user, body, file);
  }

  private async executeTeamMemberEdit(
    user: { vendorId: string },
    body: any,
    file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const dto = plainToClass(EditTeamMemberDto, {
      id: body.id,
      name: body.name,
      designation: body.designation,
      email: body.email,
      mobile: body.mobile,
      facebookUrl: body.facebookUrl,
      twitterUrl: body.twitterUrl,
      linkedinUrl: body.linkedinUrl,
    });

    const errors = await validate(dto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file ? `/uploads/team-members/${file.filename}` : undefined;
    const teamMember = await this.adminService.updateTeamMember(user.vendorId, {
      id: dto.id,
      name: dto.name,
      designation: dto.designation,
      email: dto.email,
      mobile: dto.mobile,
      imagePath,
      facebookUrl: dto.facebookUrl,
      twitterUrl: dto.twitterUrl,
      linkedinUrl: dto.linkedinUrl,
    });

    return { message: 'Team member updated successfully', data: teamMember };
  }

  @Post('team-member/delete')
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete team member (soft delete)',
    description: 'Same as POST **/admin/team-member/delete** — JSON body `{ "id": "..." }`.',
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
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.deleteTeamMember(user.vendorId, body.id);
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
  async deleteNewsletterSubscriberPost(@Body() body: DeleteNewsletterSubscriberDto) {
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
  @ApiResponse({ status: 200, description: 'Subscriber status updated successfully' })
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
  @ApiResponse({ status: 200, description: 'Subscriber status updated successfully' })
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
  @ApiResponse({ status: 200, description: 'Subscriber status updated successfully' })
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

  @Get('team-member/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List team members',
    description:
      'Returns team members for the logged-in vendor: serial number, name, designation, email, mobile, active flag, and id for actions. Excludes soft-deleted members (status 2). Newest first.',
  })
  @ApiResponse({
    status: 200,
    description: 'Team member list',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Team members retrieved successfully' },
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List team members (filters + pagination)',
    description:
      'Supports filters (status, designation) and pagination (page, limit). Vendor-scoped.',
  })
  @ApiQuery({ name: 'status', required: false, description: 'active | inactive' })
  @ApiQuery({ name: 'designation', required: false, description: 'Exact designation match (case-insensitive)' })
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
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const result = await this.adminService.listTeamMembersPaginated(
      user.vendorId,
      query,
    );
    return {
      message: 'Team members retrieved successfully',
      data: result.data,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }

  @Get('contact/list')
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'View contact message',
    description:
      'Returns one contact message for admin view: name, email, phone, message.',
  })
  @ApiParam({ name: 'id', description: 'Contact message MongoDB id (from list)' })
  @ApiResponse({ status: 200, description: 'Contact message details' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async viewContactMessage(@Param('id') id: string) {
    const data = await this.adminService.getContactMessageById(id);
    return { message: 'Contact message retrieved successfully', data };
  }

  @Post('contact/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete contact message',
    description:
      'Permanently deletes a contact message by id. JSON body: `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteContactMessageDto })
  @ApiResponse({ status: 200, description: 'Contact message deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid id / validation error' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async deleteContactMessagePost(@Body() body: DeleteContactMessageDto) {
    const data = await this.adminService.deleteContactMessage(body.id);
    return { message: 'Contact message deleted successfully', data };
  }

  @Delete('contact/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete contact message',
    description:
      'Same as **POST /admin/contact/delete** — JSON body `{ "id": "..." }`.',
  })
  @ApiBody({ type: DeleteContactMessageDto })
  @ApiResponse({ status: 200, description: 'Contact message deleted successfully' })
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
      'Case-insensitive partial match on **name** (same vendor, non-deleted partners). Response shape matches **GET /admin/team-member/list**.',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Substring to match against team member name',
    example: 'Priya',
  })
  @ApiResponse({ status: 200, description: 'Search results (may be empty array)' })
  @ApiResponse({ status: 400, description: 'Missing or empty name' })
  async searchTeamMembersByName(
    @CurrentUser() user: { vendorId: string },
    @Query('name') name: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new BadRequestException('Query parameter "name" is required');
    }
    const data = await this.adminService.searchTeamMembers(user.vendorId, { name: trimmed });
    return { message: 'Team members search completed successfully', data };
  }

  @Get('team-member/search/by-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search team members by email',
    description:
      'Case-insensitive partial match on **email** (same vendor, non-deleted partners). Response shape matches **GET /admin/team-member/list**.',
  })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Substring to match against team member email',
    example: 'greenpro',
  })
  @ApiResponse({ status: 200, description: 'Search results (may be empty array)' })
  @ApiResponse({ status: 400, description: 'Missing or empty email' })
  async searchTeamMembersByEmail(
    @CurrentUser() user: { vendorId: string },
    @Query('email') email: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const trimmed = email?.trim();
    if (!trimmed) {
      throw new BadRequestException('Query parameter "email" is required');
    }
    const data = await this.adminService.searchTeamMembers(user.vendorId, { email: trimmed });
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
  @ApiResponse({ status: 200, description: 'Search results (may be empty array)' })
  @ApiResponse({ status: 400, description: 'Neither name nor email provided' })
  async searchTeamMembers(
    @CurrentUser() user: { vendorId: string },
    @Query('name') name?: string,
    @Query('email') email?: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.searchTeamMembers(user.vendorId, {
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
      'Returns one team member for the **View** modal: name, designation, email, mobile, status (**Active** / **Inactive**), image URL, Facebook / Twitter / LinkedIn URLs. Same vendor only; soft-deleted excluded.',
  })
  @ApiParam({ name: 'id', description: 'Team member MongoDB id' })
  @ApiResponse({ status: 200, description: 'Team member details' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 400, description: 'Invalid id' })
  async getTeamMemberById(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.getTeamMemberById(user.vendorId, id);
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
  @ApiResponse({ status: 200, description: 'Team member status updated successfully' })
  @ApiResponse({ status: 404, description: 'Team member not found' })
  @ApiResponse({ status: 400, description: 'Invalid id or unexpected status' })
  async updateTeamMemberStatus(
    @CurrentUser() user: { vendorId: string },
    @Param('id') id: string,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.adminService.updateTeamMemberStatus(user.vendorId, id);
    return { message: 'Team member status updated successfully', data };
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change password',
    description:
      'Updates the logged-in user password after verifying the current password.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or passwords do not match' })
  @ApiResponse({ status: 401, description: 'Invalid token or wrong current password' })
  async changePassword(
    @CurrentUser() user: { userId: string },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.manufacturersService.changePassword(user.userId, changePasswordDto);
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
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
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
      'Updates manufacturer details including name, GP internal ID, and initial. Supports optional image upload.',
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
          description: 'GP Internal ID (format: 3-5 uppercase letters + "-" + 3 digits, e.g., GPSC-312)',
          example: 'GPSC-312',
        },
        manufacturerInitial: {
          type: 'string',
          description: 'Manufacturer initial',
        },
        manufacturer_image: {
          type: 'string',
          format: 'binary',
          description: 'Manufacturer image (optional)',
        },
      },
      required: ['manufacturerName', 'gpInternalId', 'manufacturerInitial'],
    },
  })
  @ApiResponse({ status: 200, description: 'Manufacturer updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or format' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateManufacturer(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
  ) {
    const updateDto = plainToClass(UpdateManufacturerDto, {
      manufacturerName: body.manufacturerName,
      gpInternalId: body.gpInternalId,
      manufacturerInitial: body.manufacturerInitial,
    });

    const errors = await validate(updateDto);
    if (errors.length > 0) {
      const errorMessages = errors.map((error) => Object.values(error.constraints || {})).flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file ? `/uploads/manufacturers/${file.filename}` : undefined;
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
    description: 'Toggles manufacturer status: if current status is 1, sets to 2; if 2, sets to 1',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer ID' })
  @ApiResponse({ status: 200, description: 'Manufacturer status updated successfully' })
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
    description: 'Toggles vendor status: if current status is 0, sets to 1; if 1, sets to 0',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendorStatus(@Param('id') id: string) {
    const vendor = await this.adminService.updateVendorStatus(id);
    return {
      message: 'Vendor status updated successfully',
      data: vendor,
    };
  }
}
