import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlantMergeAuditDocument = PlantMergeAudit & Document;

@Schema({ collection: 'plant_merges', timestamps: false })
export class PlantMergeAudit {
  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  sourcePlantIds: Types.ObjectId[];

  @Prop({ type: [Number], required: true, default: [] })
  sourceProductPlantIds: number[];

  /** Within-EOI absorb merge target plant (optional for URN-level copy). */
  @Prop({ type: Types.ObjectId })
  targetPlantId?: Types.ObjectId;

  @Prop()
  targetProductPlantId?: number;

  /** Source product (URN-level copy) or product owning merged plants (within-EOI). */
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  /** Target product for URN-level plant copy. */
  @Prop({ type: Types.ObjectId })
  targetProductId?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], default: [] })
  copiedPlantIds?: Types.ObjectId[];

  @Prop({ type: [Number], default: [] })
  copiedProductPlantIds?: number[];

  @Prop({ required: true })
  productIdNumeric: number;

  @Prop({ required: true })
  eoiNo: string;

  @Prop({ required: true })
  urnNo: string;

  /** URN-level plant merge target (optional for within-EOI merges). */
  @Prop()
  targetUrnNo?: string;

  @Prop()
  targetEoiNo?: string;

  @Prop({ type: Types.ObjectId, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ type: [String], required: true, default: [] })
  manufacturingUnitsRemoved: string[];

  @Prop({ type: [String], required: true, default: [] })
  manufacturingUnitsSkipped: string[];

  @Prop({ required: true })
  plantCountBefore: number;

  @Prop({ required: true })
  plantCountAfter: number;

  @Prop({ required: true })
  mergeStrategy: string;

  @Prop({ required: true, default: 'completed' })
  mergeStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  mergedBy: Types.ObjectId;

  @Prop({ required: true })
  mergedAt: Date;
}

export const PlantMergeAuditSchema = SchemaFactory.createForClass(PlantMergeAudit);
PlantMergeAuditSchema.index({ urnNo: 1, mergedAt: -1 });
PlantMergeAuditSchema.index({ eoiNo: 1, mergedAt: -1 });
PlantMergeAuditSchema.index({ productId: 1, mergedAt: -1 });
PlantMergeAuditSchema.index(
  { urnNo: 1, eoiNo: 1, targetUrnNo: 1, targetEoiNo: 1 },
  { name: 'plant_merge_urn_pair_unique' },
);
