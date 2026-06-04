import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrnMergeAuditDocument = UrnMergeAudit & Document;

@Schema({ collection: 'urn_merges', timestamps: false })
export class UrnMergeAudit {
  @Prop({ required: true })
  sourceUrnNo: string;

  @Prop({ required: true })
  targetUrnNo: string;

  @Prop({ type: Types.ObjectId, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ type: [Number], required: true, default: [] })
  movedProductIds: number[];

  @Prop({ type: [String], required: true, default: [] })
  movedEoiNos: string[];

  @Prop({ type: [String], required: true, default: [] })
  urnSectionsRekeyed: string[];

  @Prop({ type: [String], required: true, default: [] })
  urnSectionsSkipped: string[];

  @Prop({ required: true })
  urnLevelStrategy: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  mergedBy: Types.ObjectId;

  @Prop({ required: true })
  mergedAt: Date;
}

export const UrnMergeAuditSchema = SchemaFactory.createForClass(UrnMergeAudit);
UrnMergeAuditSchema.index({ targetUrnNo: 1, mergedAt: -1 });
UrnMergeAuditSchema.index({ sourceUrnNo: 1, mergedAt: -1 });
