import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';

export interface LogActivityInput {
  vendor_id: string | Types.ObjectId;
  manufacturer_id: string | Types.ObjectId;
  urn_no: string;
  activities_id: number;
  activity: string;
  activity_status: number;
  sub_activities_id?: number;
  responsibility: string;
  next_responsibility?: string;
  next_acitivities_id?: number;
  next_activity?: string;
  status?: number;
}

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  /**
   * Safely convert string to ObjectId with validation
   */
  private toObjectId(id: string | Types.ObjectId, fieldName: string): Types.ObjectId {
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
    }
    return new Types.ObjectId(id);
  }

  /**
   * Log an activity
   * Automatically sets created_at and updated_at timestamps
   */
  async logActivity(data: LogActivityInput): Promise<ActivityLogDocument> {
    try {
      // Convert IDs to ObjectId
      const vendorObjectId = this.toObjectId(data.vendor_id, 'vendor_id');
      const manufacturerObjectId = this.toObjectId(data.manufacturer_id, 'manufacturer_id');

      // Prepare activity log data
      const activityLogData = {
        vendor_id: vendorObjectId,
        manufacturer_id: manufacturerObjectId,
        urn_no: data.urn_no,
        activities_id: data.activities_id,
        activity: data.activity,
        activity_status: data.activity_status,
        sub_activities_id: data.sub_activities_id,
        responsibility: data.responsibility,
        next_responsibility: data.next_responsibility,
        next_acitivities_id: data.next_acitivities_id,
        next_activity: data.next_activity,
        status: data.status ?? 1,
        // created_at and updated_at will be automatically set by Mongoose timestamps
      };

      const activityLog = new this.activityLogModel(activityLogData);
      const savedActivityLog = await activityLog.save();

      return savedActivityLog;
    } catch (error: any) {
      console.error('[Activity Log] Error logging activity:', error);
      console.error('[Activity Log] Error stack:', error.stack);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Failed to log activity. Please check the logs for details.',
      );
    }
  }

  /**
   * Get all activity logs for a specific URN
   * Sorted by created_at ascending for timeline display
   */
  async getActivityLogsByUrn(urnNo: string): Promise<ActivityLogDocument[]> {
    try {
      const activityLogs = await this.activityLogModel
        .find({ urn_no: urnNo })
        .sort({ created_at: 1 }) // Ascending order for timeline
        .exec();

      return activityLogs;
    } catch (error: any) {
      console.error('[Activity Log] Error getting activity logs by URN:', error);
      console.error('[Activity Log] Error stack:', error.stack);

      throw new InternalServerErrorException(
        error.message || 'Failed to get activity logs. Please check the logs for details.',
      );
    }
  }
}
