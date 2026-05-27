import { Injectable, Logger } from '@nestjs/common';
import { LifecycleNotificationService } from '../lifecycle-notification.service';

/**
 * Fire-and-forget admin feed when process / product documents are uploaded.
 */
@Injectable()
export class ProductDocumentUploadNotificationHelper {
  private readonly logger = new Logger(
    ProductDocumentUploadNotificationHelper.name,
  );

  constructor(
    private readonly lifecycleNotification: LifecycleNotificationService,
  ) {}

  notifyAfterDocumentsUploaded(
    manufacturerId: string,
    uploadedFileCount: number,
    urnNo?: string,
  ): void {
    if (!manufacturerId?.trim() || uploadedFileCount <= 0) {
      return;
    }
    this.lifecycleNotification
      .notifyDocumentUploaded({
        manufacturerId: manufacturerId.trim(),
        urnNo: urnNo?.trim(),
      })
      .catch((err) =>
        this.logger.warn(
          `[notifyAfterDocumentsUploaded] failed for manufacturer ${manufacturerId}: ${
            (err as Error)?.message
          }`,
        ),
      );
  }
}
