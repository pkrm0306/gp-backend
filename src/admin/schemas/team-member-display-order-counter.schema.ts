import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamMemberDisplayOrderCounterDocument =
  TeamMemberDisplayOrderCounter & Document;

/** Singleton counter key for team-member display-order high-water. */
export const TEAM_MEMBER_DISPLAY_ORDER_COUNTER_KEY =
  'team_member_display_order';

/**
 * Tracks the highest display order ever assigned/deleted so blank create
 * gets highWater+1 without scanning soft-deleted junk rows.
 */
@Schema({ collection: 'team_member_display_order_counter' })
export class TeamMemberDisplayOrderCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  highWater: number;
}

export const TeamMemberDisplayOrderCounterSchema =
  SchemaFactory.createForClass(TeamMemberDisplayOrderCounter);
