import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProcessComments,
  ProcessCommentsDocument,
} from './schemas/process-comments.schema';
import { CreateProcessCommentsDto } from './dto/create-process-comments.dto';
import { SequenceHelper } from '../product-registration/helpers/sequence.helper';

@Injectable()
export class ProcessCommentsService {
  constructor(
    @InjectModel(ProcessComments.name)
    private processCommentsModel: Model<ProcessCommentsDocument>,
    private sequenceHelper: SequenceHelper,
  ) {}

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(
    id: string | Types.ObjectId,
    fieldName: string,
  ): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  /**
   * Create or update process comments
   * Uses upsert to update existing record or create new one based on urnNo and vendorId
   */
  async upsertProcessComments(
    createProcessCommentsDto: CreateProcessCommentsDto,
    vendorId: string,
  ): Promise<ProcessCommentsDocument> {
    try {
      // Convert vendorId to ObjectId
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      // Get current date
      const now = new Date();

      // Check if record exists
      const existingRecord = await this.processCommentsModel
        .findOne({
          urnNo: createProcessCommentsDto.urnNo,
          vendorId: vendorObjectId,
        })
        .exec();

      let processCommentsId: number;

      if (existingRecord) {
        // Update existing record
        processCommentsId = existingRecord.processCommentsId;

        // Build update object with only provided fields
        const updateData: any = {
          updatedDate: now,
        };

        // Only update fields that are provided in DTO
        if (createProcessCommentsDto.productDesign !== undefined) {
          updateData.productDesign = createProcessCommentsDto.productDesign;
        }
        if (createProcessCommentsDto.productPerformance !== undefined) {
          updateData.productPerformance =
            createProcessCommentsDto.productPerformance;
        }
        if (createProcessCommentsDto.manfacturingProcess !== undefined) {
          updateData.manfacturingProcess =
            createProcessCommentsDto.manfacturingProcess;
        }
        if (createProcessCommentsDto.wasteManagement !== undefined) {
          updateData.wasteManagement = createProcessCommentsDto.wasteManagement;
        }
        if (createProcessCommentsDto.lifeCycleApproach !== undefined) {
          updateData.lifeCycleApproach =
            createProcessCommentsDto.lifeCycleApproach;
        }
        if (createProcessCommentsDto.productStewardship !== undefined) {
          updateData.productStewardship =
            createProcessCommentsDto.productStewardship;
        }
        if (createProcessCommentsDto.productInnovation !== undefined) {
          updateData.productInnovation =
            createProcessCommentsDto.productInnovation;
        }
        if (createProcessCommentsDto.rawMaterials31 !== undefined) {
          updateData.rawMaterials31 = createProcessCommentsDto.rawMaterials31;
        }
        if (createProcessCommentsDto.rawMaterials32 !== undefined) {
          updateData.rawMaterials32 = createProcessCommentsDto.rawMaterials32;
        }
        if (createProcessCommentsDto.rawMaterials33 !== undefined) {
          updateData.rawMaterials33 = createProcessCommentsDto.rawMaterials33;
        }
        if (createProcessCommentsDto.rawMaterials34 !== undefined) {
          updateData.rawMaterials34 = createProcessCommentsDto.rawMaterials34;
        }
        if (createProcessCommentsDto.rawMaterials35 !== undefined) {
          updateData.rawMaterials35 = createProcessCommentsDto.rawMaterials35;
        }
        if (createProcessCommentsDto.rawMaterials36 !== undefined) {
          updateData.rawMaterials36 = createProcessCommentsDto.rawMaterials36;
        }
        if (createProcessCommentsDto.rawMaterials37 !== undefined) {
          updateData.rawMaterials37 = createProcessCommentsDto.rawMaterials37;
        }
        if (createProcessCommentsDto.rawMaterials38 !== undefined) {
          updateData.rawMaterials38 = createProcessCommentsDto.rawMaterials38;
        }
        if (createProcessCommentsDto.rawMaterials39 !== undefined) {
          updateData.rawMaterials39 = createProcessCommentsDto.rawMaterials39;
        }
        if (createProcessCommentsDto.rawMaterials310 !== undefined) {
          updateData.rawMaterials310 = createProcessCommentsDto.rawMaterials310;
        }
        if (createProcessCommentsDto.rawMaterials311 !== undefined) {
          updateData.rawMaterials311 = createProcessCommentsDto.rawMaterials311;
        }
        if (createProcessCommentsDto.rawMaterials312 !== undefined) {
          updateData.rawMaterials312 = createProcessCommentsDto.rawMaterials312;
        }
        if (createProcessCommentsDto.rawMaterials313 !== undefined) {
          updateData.rawMaterials313 = createProcessCommentsDto.rawMaterials313;
        }
        if (createProcessCommentsDto.rawMaterials314 !== undefined) {
          updateData.rawMaterials314 = createProcessCommentsDto.rawMaterials314;
        }
        if (createProcessCommentsDto.rawMaterials315 !== undefined) {
          updateData.rawMaterials315 = createProcessCommentsDto.rawMaterials315;
        }

        const updatedRecord = await this.processCommentsModel
          .findOneAndUpdate(
            {
              urnNo: createProcessCommentsDto.urnNo,
              vendorId: vendorObjectId,
            },
            { $set: updateData },
            { new: true },
          )
          .exec();

        if (!updatedRecord) {
          throw new InternalServerErrorException(
            'Failed to update process comments',
          );
        }

        return updatedRecord;
      } else {
        // Create new record
        processCommentsId = await this.sequenceHelper.getProcessCommentsId();

        const processCommentsData = {
          processCommentsId,
          urnNo: createProcessCommentsDto.urnNo,
          vendorId: vendorObjectId,
          productDesign: createProcessCommentsDto.productDesign || '',
          productPerformance: createProcessCommentsDto.productPerformance || '',
          manfacturingProcess:
            createProcessCommentsDto.manfacturingProcess || '',
          wasteManagement: createProcessCommentsDto.wasteManagement || '',
          lifeCycleApproach: createProcessCommentsDto.lifeCycleApproach || '',
          productStewardship: createProcessCommentsDto.productStewardship || '',
          productInnovation: createProcessCommentsDto.productInnovation || '',
          rawMaterials31: createProcessCommentsDto.rawMaterials31 || '',
          rawMaterials32: createProcessCommentsDto.rawMaterials32 || '',
          rawMaterials33: createProcessCommentsDto.rawMaterials33 || '',
          rawMaterials34: createProcessCommentsDto.rawMaterials34 || '',
          rawMaterials35: createProcessCommentsDto.rawMaterials35 || '',
          rawMaterials36: createProcessCommentsDto.rawMaterials36 || '',
          rawMaterials37: createProcessCommentsDto.rawMaterials37 || '',
          rawMaterials38: createProcessCommentsDto.rawMaterials38 || '',
          rawMaterials39: createProcessCommentsDto.rawMaterials39 || '',
          rawMaterials310: createProcessCommentsDto.rawMaterials310 || '',
          rawMaterials311: createProcessCommentsDto.rawMaterials311 || '',
          rawMaterials312: createProcessCommentsDto.rawMaterials312 || '',
          rawMaterials313: createProcessCommentsDto.rawMaterials313 || '',
          rawMaterials314: createProcessCommentsDto.rawMaterials314 || '',
          rawMaterials315: createProcessCommentsDto.rawMaterials315 || '',
          updatedDate: now,
        };

        const newRecord = new this.processCommentsModel(processCommentsData);
        return await newRecord.save();
      }
    } catch (error: any) {
      console.error('[Process Comments] Upsert error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to save process comments.',
      );
    }
  }

  /**
   * Get process comments by URN and vendor ID
   */
  async getByUrnAndVendor(
    urnNo: string,
    vendorId: string,
  ): Promise<ProcessCommentsDocument | null> {
    try {
      const vendorObjectId = this.toObjectId(vendorId, 'vendorId');

      return await this.processCommentsModel
        .findOne({
          urnNo,
          vendorId: vendorObjectId,
        })
        .exec();
    } catch (error: any) {
      console.error('[Process Comments] Get error:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to get process comments.',
      );
    }
  }
}
