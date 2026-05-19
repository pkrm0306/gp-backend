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
  UploadedFiles,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ListPaymentsDto } from './dto/list-payments.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VendorProposalApprovalDto } from './dto/vendor-proposal-approval.dto';
import { certificationMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';

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
    description:
      'Global search term (searches in urn_no, payment_reference_no)',
    example: 'URN-20260303142815',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
    description:
      'Filter by payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query parameters',
  })
  async getPayments(
    @CurrentUser() user: any,
    @Query() listPaymentsDto: ListPaymentsDto,
  ) {
    try {
      const vendorId = user?.manufacturerId || user?.vendorId;
      if (!vendorId) {
        throw new BadRequestException(
          'Vendor organization ID not found in token',
        );
      }

      const result = await this.paymentsService.getPayments(
        listPaymentsDto,
        vendorId,
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
    FileInterceptor('proposal_file', certificationMultipartMemoryMulterOptions()),
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
      required: [
        'urnNo',
        'quoteAmount',
        'quoteGstAmount',
        'quoteTdsAmount',
        'quoteTotal',
      ],
      properties: {
        urnNo: {
          type: 'string',
          description: 'URN number',
          example: 'URN-20260303142815',
        },
        quoteAmount: {
          type: 'number',
          description: 'Quote amount (mandatory)',
          example: 10000.0,
        },
        quoteGstAmount: {
          type: 'number',
          description: 'GST amount (mandatory)',
          example: 1800.0,
        },
        quoteTdsAmount: {
          type: 'number',
          description: 'TDS amount (mandatory)',
          example: 1000,
        },
        quoteTotal: {
          type: 'number',
          description: 'Total amount (mandatory)',
          example: 10800.0,
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
        message: {
          type: 'string',
          example: 'Payment details created successfully',
        },
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
      const actorId = user?.manufacturerId || user?.vendorId;
      if (!actorId) {
        throw new BadRequestException(
          'Vendor organization ID not found in token',
        );
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
        onlinePaymentId: body.onlinePaymentId
          ? parseInt(body.onlinePaymentId)
          : undefined,
        paymentReferenceNo: body.paymentReferenceNo,
        paymentChequeDate: body.paymentChequeDate,
        productsToBeCertified: body.productsToBeCertified,
      };

      // Validate mandatory fields
      if (!createPaymentDto.urnNo) {
        throw new BadRequestException('URN number is required');
      }
      if (
        createPaymentDto.quoteAmount === undefined ||
        createPaymentDto.quoteAmount === null
      ) {
        throw new BadRequestException('Quote amount is required');
      }
      if (
        createPaymentDto.quoteGstAmount === undefined ||
        createPaymentDto.quoteGstAmount === null
      ) {
        throw new BadRequestException('GST amount is required');
      }
      if (
        createPaymentDto.quoteTdsAmount === undefined ||
        createPaymentDto.quoteTdsAmount === null
      ) {
        throw new BadRequestException('TDS amount is required');
      }
      if (
        createPaymentDto.quoteTotal === undefined ||
        createPaymentDto.quoteTotal === null
      ) {
        throw new BadRequestException('Total amount is required');
      }
      const payment = await this.paymentsService.createPayment(
        createPaymentDto,
        actorId,
        proposalFile,
        String(user?.role || user?.type || ''),
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

  @Patch(':urnNo/vendor-proposal-approval')
  @ApiOperation({
    summary: 'Vendor approve or reject registration fee proposal (vendor portal only)',
    description:
      '**Vendor/partner login only** — not for admin or staff tokens. ' +
      'Sets vendorProposalApprovalStatus to 1 (approve) or 2 (reject). ' +
      'Admins manage proposals via POST/PATCH /payments with proposal_file.',
  })
  @ApiParam({
    name: 'urnNo',
    example: 'URN-20260514165917',
  })
  @ApiBody({ type: VendorProposalApprovalDto })
  @ApiResponse({ status: 200, description: 'Proposal approval updated' })
  async setVendorProposalApproval(
    @CurrentUser() user: any,
    @Param('urnNo') urnNoParam: string,
    @Body() dto: VendorProposalApprovalDto,
  ) {
    const role = String(user?.role || user?.type || '').toLowerCase();
    if (role === 'admin' || role === 'staff') {
      throw new ForbiddenException(
        'This endpoint is for the vendor portal only. Sign in as the vendor for this URN, or use admin POST/PATCH /payments to upload or revise the proposal.',
      );
    }

    const vendorId = user?.manufacturerId || user?.vendorId;
    if (!vendorId) {
      throw new BadRequestException(
        'Vendor organization ID not found in token. Use a vendor or partner account.',
      );
    }
    const urnNo = String(urnNoParam ?? '').trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }

    const data = await this.paymentsService.setVendorProposalApproval(
      urnNo,
      vendorId,
      dto,
      role,
    );

    return {
      success: true,
      message: 'Proposal approval updated',
      data,
    };
  }

  @Patch(':urnNo')
  @ApiOperation({
    summary:
      'Update payment details by URN (and optionally update URN status + activity log)',
    description:
      'Updates payment_details for the logged-in vendor. If `urnStatus` is provided in payload, it will also update `products.urnStatus` for that URN and insert an activity log entry.',
  })
  @ApiParam({
    name: 'urnNo',
    description: 'URN number',
    example: 'URN-20260409142354',
    type: String,
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cheque_or_dd_file', maxCount: 1 },
        { name: 'tds_file', maxCount: 1 },
        { name: 'proposal_file', maxCount: 1 },
      ],
      certificationMultipartMemoryMulterOptions(),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        proposal_file: {
          type: 'string',
          format: 'binary',
          description:
            'Admin only — revised proposal document (resets vendor approval to pending)',
        },
        quoteAmount: { type: 'number', example: 10000.0 },
        quoteGstAmount: { type: 'number', example: 1800.0 },
        quoteTdsAmount: { type: 'number', example: 1000.0 },
        quoteTotal: { type: 'number', example: 10800.0 },
        adminGstNo: { type: 'string', example: '29ABCDE1234F1Z9' },
        vendorGstNo: { type: 'string', example: '27ABCDE1234F1Z9' },
        paymentType: {
          type: 'string',
          enum: ['registration', 'certification', 'renew'],
          example: 'registration',
        },
        paymentMode: {
          type: 'string',
          enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
          example: 'cheque_or_dd',
        },
        onlinePaymentId: { type: 'number', example: 0 },
        paymentReferenceNo: { type: 'string', example: 'REF123456' },
        paymentChequeDate: { type: 'string', format: 'date-time', example: '2026-03-06T00:00:00.000Z' },
        productsToBeCertified: { type: 'string', example: '["product1","product2"]' },
        paymentStatus: { type: 'number', enum: [0, 1, 2, 3], example: 0 },
        paymentRejectionRemarks: {
          type: 'string',
          description:
            'Required when admin sets paymentStatus to 3 (reject submitted payment)',
          example: 'Cheque image is unclear. Please upload a readable copy.',
          maxLength: 500,
        },
        urnStatus: { type: 'number', enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], example: 1 },
        cheque_or_dd_file: {
          type: 'string',
          format: 'binary',
          description: 'Required when paymentMode is cheque_or_dd',
        },
        tds_file: {
          type: 'string',
          format: 'binary',
          description: 'Required when paymentMode is cheque_or_dd',
        },
      },
    },
  })
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
  @ApiResponse({ status: 400, description: 'Invalid urnNo or payload' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async updatePayment(
    @CurrentUser() user: any,
    @Param('urnNo') urnNoParam: string,
    @Body() body: any,
    @UploadedFiles()
    files?: {
      cheque_or_dd_file?: Express.Multer.File[];
      tds_file?: Express.Multer.File[];
      proposal_file?: Express.Multer.File[];
    },
  ) {
    try {
      const urnNo = String(urnNoParam ?? '').trim();
      if (!urnNo) {
        throw new BadRequestException('Invalid urnNo');
      }

      const updatePaymentDto: UpdatePaymentDto = {
        urnNo: body.urnNo,
        quoteAmount: body.quoteAmount !== undefined ? parseFloat(body.quoteAmount) : undefined,
        quoteGstAmount: body.quoteGstAmount !== undefined ? parseFloat(body.quoteGstAmount) : undefined,
        quoteTdsAmount: body.quoteTdsAmount !== undefined ? parseFloat(body.quoteTdsAmount) : undefined,
        quoteTotal: body.quoteTotal !== undefined ? parseFloat(body.quoteTotal) : undefined,
        adminGstNo: body.adminGstNo,
        vendorGstNo: body.vendorGstNo,
        paymentType: body.paymentType,
        paymentMode: body.paymentMode,
        onlinePaymentId:
          body.onlinePaymentId !== undefined ? parseInt(body.onlinePaymentId, 10) : undefined,
        paymentReferenceNo: body.paymentReferenceNo,
        paymentChequeDate: body.paymentChequeDate,
        productsToBeCertified: body.productsToBeCertified,
        paymentStatus:
          body.paymentStatus !== undefined ? parseInt(body.paymentStatus, 10) : undefined,
        paymentRejectionRemarks:
          body.paymentRejectionRemarks !== undefined &&
          body.paymentRejectionRemarks !== null
            ? String(body.paymentRejectionRemarks)
            : body.payment_rejection_remarks !== undefined &&
                body.payment_rejection_remarks !== null
              ? String(body.payment_rejection_remarks)
              : undefined,
        urnStatus: body.urnStatus !== undefined ? parseInt(body.urnStatus, 10) : undefined,
      };

      const chequeOrDdFile = files?.cheque_or_dd_file?.[0];
      const tdsFile = files?.tds_file?.[0];
      const proposalFile = files?.proposal_file?.[0];
      const vendorId = user?.manufacturerId || user?.vendorId;

      const payment = await this.paymentsService.updatePaymentDetailsByUrn(
        urnNo,
        updatePaymentDto,
        vendorId,
        chequeOrDdFile,
        tdsFile,
        proposalFile,
        user?.role || user?.type,
      );

      const message =
        updatePaymentDto.paymentStatus === 3
          ? 'Payment rejected'
          : updatePaymentDto.paymentStatus === 2
            ? 'Payment approved'
            : 'Payment updated successfully';

      return {
        success: true,
        message,
        data: payment,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
