import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { matchActiveProducts } from '../../product-registration/constants/active-product.filter';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import { SpocAllocationRepository } from '../../spoc-allocation/repository/spoc-allocation.repository';
import {
  mergeEmailLists,
  parseEmailList,
} from '../utils/notification-recipient-groups.util';

export type UrnLifecycleBusinessRecipients = {
  manufacturerEmail?: string;
  spocEmails: string[];
  teamLeadEmails: string[];
  /** Primary To — manufacturer when present, else first SPOC/TL. */
  to?: string;
  /** Deduped CC excluding `to` (legacy single-message shape). */
  cc: string[];
  /**
   * Every unique recipient that must receive the business email as To
   * (manufacturer + SPOC + Team Leads), case-insensitively deduped.
   */
  allUniqueEmails: string[];
};

/**
 * Resolves manufacturer + URN-scoped active SPOC + Team Lead emails for
 * URN initial approve / registration reject business mail.
 */
@Injectable()
export class UrnLifecycleRecipientResolver {
  private readonly logger = new Logger(UrnLifecycleRecipientResolver.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly spocAllocationRepository: SpocAllocationRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Team Leads from NOTIFICATION_CC_TEAM_LEADS (same env key as
   * resolveCcGroups('TEAM_LEADS')), without merging always-admin ops CC into
   * the vendor business email.
   */
  resolveTeamLeadEmails(): string[] {
    return parseEmailList(
      this.configService.get<string>('NOTIFICATION_CC_TEAM_LEADS'),
    );
  }

  async resolveSpocEmailsForUrn(urnNo: string): Promise<string[]> {
    const trimmedUrn = String(urnNo ?? '').trim();
    if (!trimmedUrn) {
      return [];
    }

    const products = await this.productModel
      .find(matchActiveProducts({ urnNo: trimmedUrn }))
      .select('productId')
      .lean()
      .exec();

    const productIds = [
      ...new Set(
        (products ?? [])
          .map((p) => Number(p.productId))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    ];

    if (productIds.length === 0) {
      return [];
    }

    const allocations =
      await this.spocAllocationRepository.findActiveAllocationsByProductIds(
        productIds,
      );

    const spocIdKeys = [
      ...new Set(
        (allocations ?? [])
          .map((row) => String(row.spocId ?? '').trim())
          .filter((id) => Types.ObjectId.isValid(id)),
      ),
    ];

    if (spocIdKeys.length === 0) {
      return [];
    }

    const emails: string[] = [];
    for (const id of spocIdKeys) {
      const member = await this.spocAllocationRepository.findTeamMemberById(
        new Types.ObjectId(id),
      );
      const email = String(member?.email ?? '')
        .trim()
        .toLowerCase();
      if (email) {
        emails.push(email);
      }
    }

    return mergeEmailLists([emails]);
  }

  /**
   * Build To + CC for URN approve/reject business email.
   * Dedupes SPOC ∩ Team Lead and excludes manufacturer from CC via mergeEmailLists.
   */
  async resolveBusinessRecipients(params: {
    urnNo: string;
    manufacturerEmail?: string | null;
  }): Promise<UrnLifecycleBusinessRecipients> {
    const manufacturerEmail =
      String(params.manufacturerEmail ?? '')
        .trim()
        .toLowerCase() || undefined;

    let spocEmails: string[] = [];
    try {
      spocEmails = await this.resolveSpocEmailsForUrn(params.urnNo);
    } catch (error) {
      this.logger.warn(
        `[resolveBusinessRecipients] SPOC lookup failed for ${params.urnNo}: ${(error as Error)?.message || error}`,
      );
      spocEmails = [];
    }

    const teamLeadEmails = this.resolveTeamLeadEmails();
    const sideRecipients = mergeEmailLists([spocEmails, teamLeadEmails]);
    const allUniqueEmails = mergeEmailLists([
      manufacturerEmail ? [manufacturerEmail] : [],
      sideRecipients,
    ]);

    if (manufacturerEmail) {
      return {
        manufacturerEmail,
        spocEmails,
        teamLeadEmails,
        to: manufacturerEmail,
        cc: mergeEmailLists([sideRecipients], manufacturerEmail),
        allUniqueEmails,
      };
    }

    if (sideRecipients.length === 0) {
      return {
        manufacturerEmail: undefined,
        spocEmails,
        teamLeadEmails,
        to: undefined,
        cc: [],
        allUniqueEmails: [],
      };
    }

    const [to, ...rest] = sideRecipients;
    return {
      manufacturerEmail: undefined,
      spocEmails,
      teamLeadEmails,
      to,
      cc: mergeEmailLists([rest], to),
      allUniqueEmails,
    };
  }
}
