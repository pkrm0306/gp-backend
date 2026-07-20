import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { EmailService } from '../../common/services/email.service';
import { SpocAllocationRepository } from '../repository/spoc-allocation.repository';

export type SpocAllocationEmailKind = 'assign' | 'reassign';

/**
 * SPOC allocation email notifications.
 * Sends only after a successful DB write; dedupes via history.emailNotifiedAt.
 */
@Injectable()
export class SpocAllocationEmailService {
  private readonly logger = new Logger(SpocAllocationEmailService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly repository: SpocAllocationRepository,
  ) {}

  /**
   * Fire-and-forget notify after assign/reassign succeeds.
   * No email when recipient is missing or the history slot was already claimed.
   */
  notifyAfterSuccess(params: {
    historyId: Types.ObjectId;
    kind: SpocAllocationEmailKind;
    spocEmail?: string | null;
    spocName?: string | null;
    urn: string;
    productName: string;
    vendorName: string;
  }): void {
    const to = String(params.spocEmail ?? '').trim();
    if (!to) {
      this.logger.warn(
        `Skipping SPOC ${params.kind} email: no recipient email (history ${params.historyId})`,
      );
      return;
    }

    this.emailService.sendInBackground(async () => {
      const claimed = await this.repository.claimHistoryEmailSlot(
        params.historyId,
      );
      if (!claimed) {
        this.logger.warn(
          `Skipping duplicate SPOC ${params.kind} email for history ${params.historyId}`,
        );
        return;
      }
      return this.emailService.sendSpocAllocationEmail(to, {
        kind: params.kind,
        spocName: params.spocName ?? undefined,
        urn: params.urn,
        productName: params.productName,
        vendorName: params.vendorName,
      });
    });
  }
}
