import {
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

// Configure storage for proposal documents
const storage = diskStorage({
  destination: './uploads/payments',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `proposal-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get payments for logged-in vendor',
    description:
      'Returns a paginated list of payments for the authenticated vendor with optional search, filtering by status and payment type, and sorting.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Global search term (searches in urn_no, payment_reference_no)',
    example: 'URN-20260303142815',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
    description: 'Filter by payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
    example: 0,
    enum: [0, 1, 2, 3],
  })
  @ApiQuery({
    name: 'paymentType',
    required: false,
    type: String,
    description: 'Filter by payment type',
    example: 'registration',
    enum: ['registration', 'certification', 'renew'],
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order by created_date (default: desc)',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Payments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              paymentId: { type: 'number' },
              urnNo: { type: 'string' },
              quoteAmount: { type: 'number' },
              quoteGstAmount: { type: 'number' },
              quoteTdsAmount: { type: 'number' },
              quoteTotal: { type: 'number' },
              proposalFile: { type: 'string' },
              adminGstNo: { type: 'string' },
              vendorGstNo: { type: 'string' },
              paymentType: { type: 'string' },
              paymentMode: { type: 'string' },
              paymentReferenceNo: { type: 'string' },
              paymentStatus: { type: 'number' },
              createdDate: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            totalCount: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid query parameters' })
  async getPayments(
    @CurrentUser() user: any,
    @Query() listPaymentsDto: ListPaymentsDto,
  ) {
    try {
      if (!user?.vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      const result = await this.paymentsService.getPayments(
        listPaymentsDto,
        user.vendorId,
      );

      return {
        status: 'success',
        message: 'Payments retrieved successfully',
        ...result,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('proposal_file', {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        // Allow PNG, Word, Excel files
        const allowedMimes = [
          'image/png',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel', // .xls
        ];
        const allowedExtensions = ['.png', '.doc', '.docx', '.xls', '.xlsx'];
        const fileExt = extname(file.originalname).toLowerCase();

        if (
          allowedMimes.includes(file.mimetype) ||
          allowedExtensions.includes(fileExt)
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only PNG, Word (.doc, .docx), and Excel (.xls, .xlsx) files are allowed.',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  @ApiOperation({
    summary: 'Create payment details',
    description:
      'Creates payment details with proposal document upload. Supports PNG, Word, and Excel files.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'quoteAmount', 'quoteGstAmount', 'quoteTdsAmount', 'quoteTotal', 'adminGstNo', 'vendorGstNo'],
      properties: {
        urnNo: {
          type: 'string',
          description: 'URN number',
          example: 'URN-20260303142815',
        },
        quoteAmount: {
          type: 'number',
          description: 'Quote amount (mandatory)',
          example: 10000.00,
        },
        quoteGstAmount: {
          type: 'number',
          description: 'GST amount (mandatory)',
          example: 1800.00,
        },
        quoteTdsAmount: {
          type: 'number',
          description: 'TDS amount (mandatory)',
          example: 1000,
        },
        quoteTotal: {
          type: 'number',
          description: 'Total amount (mandatory)',
          example: 10800.00,
        },
        adminGstNo: {
          type: 'string',
          description: 'Admin GST number',
          example: '29ABCDE1234F1Z5',
        },
        vendorGstNo: {
          type: 'string',
          description: 'Vendor GST number',
          example: '27ABCDE1234F1Z5',
        },
        paymentType: {
          type: 'string',
          enum: ['registration', 'certification', 'renew'],
          description: 'Payment type',
          example: 'registration',
        },
        paymentMode: {
          type: 'string',
          enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
          description: 'Payment mode',
          example: 'online',
        },
        onlinePaymentId: {
          type: 'number',
          description: 'Online payment ID',
          example: 0,
        },
        paymentReferenceNo: {
          type: 'string',
          description: 'Payment reference number',
          example: 'REF123456',
        },
        paymentChequeDate: {
          type: 'string',
          format: 'date',
          description: 'Payment cheque date',
          example: '2026-03-15',
        },
        productsToBeCertified: {
          type: 'string',
          description: 'Products to be certified (JSON string)',
          example: '["product1", "product2"]',
        },
        proposal_file: {
          type: 'string',
          format: 'binary',
          description: 'Proposal document (PNG, Word, Excel)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Payment details created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Payment details created successfully' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            paymentId: { type: 'number' },
            urnNo: { type: 'string' },
            quoteAmount: { type: 'number' },
            quoteGstAmount: { type: 'number' },
            quoteTdsAmount: { type: 'number' },
            quoteTotal: { type: 'number' },
            proposalFile: { type: 'string' },
            paymentStatus: { type: 'number', example: 0 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid data or file format' })
  async createPayment(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() proposalFile?: Express.Multer.File,
  ) {
    try {
      if (!user?.vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      // Parse numeric fields from form data
      const createPaymentDto: CreatePaymentDto = {
        urnNo: body.urnNo,
        quoteAmount: parseFloat(body.quoteAmount),
        quoteGstAmount: parseFloat(body.quoteGstAmount),
        quoteTdsAmount: parseFloat(body.quoteTdsAmount),
        quoteTotal: parseFloat(body.quoteTotal),
        adminGstNo: body.adminGstNo,
        vendorGstNo: body.vendorGstNo,
        paymentType: body.paymentType,
        paymentMode: body.paymentMode,
        onlinePaymentId: body.onlinePaymentId ? parseInt(body.onlinePaymentId) : undefined,
        paymentReferenceNo: body.paymentReferenceNo,
        paymentChequeDate: body.paymentChequeDate,
        productsToBeCertified: body.productsToBeCertified,
      };

      // Validate mandatory fields
      if (!createPaymentDto.urnNo) {
        throw new BadRequestException('URN number is required');
      }
      if (createPaymentDto.quoteAmount === undefined || createPaymentDto.quoteAmount === null) {
        throw new BadRequestException('Quote amount is required');
      }
      if (createPaymentDto.quoteGstAmount === undefined || createPaymentDto.quoteGstAmount === null) {
        throw new BadRequestException('GST amount is required');
      }
      if (createPaymentDto.quoteTdsAmount === undefined || createPaymentDto.quoteTdsAmount === null) {
        throw new BadRequestException('TDS amount is required');
      }
      if (createPaymentDto.quoteTotal === undefined || createPaymentDto.quoteTotal === null) {
        throw new BadRequestException('Total amount is required');
      }
      if (!createPaymentDto.adminGstNo) {
        throw new BadRequestException('Admin GST number is required');
      }
      if (!createPaymentDto.vendorGstNo) {
        throw new BadRequestException('Vendor GST number is required');
      }

      const payment = await this.paymentsService.createPayment(
        createPaymentDto,
        user.vendorId,
        proposalFile,
      );

      return {
        status: 'success',
        message: 'Payment details created successfully',
        data: payment,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Patch(':paymentId')
  @ApiOperation({
    summary: 'Update payment details (and optionally update URN status + activity log)',
    description:
      'Updates payment_details for the logged-in vendor. If `urnStatus` is provided in payload, it will also update `products.urnStatus` for that URN and insert an activity log entry.',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'Payment ID (numeric)',
    example: 1,
    type: Number,
  })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Payment updated successfully' },
        data: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid paymentId or payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async updatePayment(
    @CurrentUser() user: any,
    @Param('paymentId') paymentIdParam: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    try {
      if (!user?.vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      const paymentId = Number(paymentIdParam);
      if (!Number.isFinite(paymentId) || paymentId <= 0) {
        throw new BadRequestException('Invalid paymentId');
      }

      const payment = await this.paymentsService.updatePaymentDetails(
        paymentId,
        updatePaymentDto,
        user.vendorId,
      );

      return {
        success: true,
        message: 'Payment updated successfully',
        data: payment,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
