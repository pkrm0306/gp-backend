import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '../../common/redis/redis.service';
import { ZohoSyncJob } from '../interfaces/zoho-sync-job.interface';
import {
  ZohoSyncLog,
  ZohoSyncLogDocument,
} from '../schemas/zoho-sync-log.schema';

@Injectable()
export class ZohoSyncQueueService {
  private readonly logger = new Logger(ZohoSyncQueueService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectModel(ZohoSyncLog.name)
    private readonly syncLogModel: Model<ZohoSyncLogDocument>,
  ) {}

  async enqueue(job: ZohoSyncJob): Promise<{ jobId: string }> {
    const log = await this.syncLogModel.create({
      operation: job.type,
      status: 'queued',
      requestPayload: job.payload,
      attempts: job.attempts ?? 0,
    });

    const jobId = String(log._id);
    const key = this.redisService.buildKey('zoho', 'jobs', jobId);
    await this.redisService.set(
      key,
      {
        ...job,
        jobId,
        runAt: job.runAt?.toISOString(),
        queuedAt: new Date().toISOString(),
      },
      60 * 60 * 24,
    );

    this.logger.log(`Queued Zoho sync job ${job.type} (${jobId})`);
    return { jobId };
  }

  async markFailed(jobId: string, error: Error): Promise<void> {
    await this.syncLogModel
      .findByIdAndUpdate(jobId, {
        $set: {
          status: 'failed',
          errorMessage: error.message,
        },
        $inc: { attempts: 1 },
      })
      .exec();
  }

  async markProcessed(
    jobId: string,
    responsePayload?: Record<string, unknown>,
  ): Promise<void> {
    await this.syncLogModel
      .findByIdAndUpdate(jobId, {
        $set: {
          status: 'success',
          responsePayload,
        },
        $inc: { attempts: 1 },
      })
      .exec();
  }
}
