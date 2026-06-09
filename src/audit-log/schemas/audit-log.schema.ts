import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({
  collection: 'audit_log',
  timestamps: false,
})
export class AuditLog {
  @Prop({ type: Date, required: true, index: true })
  occurred_at: Date;

  /** Technical / stable code (e.g. PAYMENT_UPDATED). */
  @Prop({ required: true, index: true })
  action: string;

  @Prop({ required: true, enum: ['success', 'failure'], index: true })
  outcome: string;

  /** User-facing bucket: category | sector | product | certification | auth | other */
  @Prop({ index: true })
  module?: string;

  /** User-facing verb: create | update | delete | approve | reject | login */
  @Prop({ index: true })
  action_type?: string;

  @Prop()
  entity_name?: string;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  performed_by?: {
    user_id?: string;
    name?: string;
    email?: string;
  };

  @Prop({ type: Object })
  old_values?: Record<string, unknown>;

  @Prop({ type: Object })
  new_values?: Record<string, unknown>;

  @Prop()
  http_method?: string;

  @Prop()
  route?: string;

  @Prop()
  status_code?: number;

  @Prop({ type: Object })
  actor?: {
    user_id?: string;
    role?: string;
    vendor_id?: string;
    manufacturer_id?: string;
  };

  @Prop({ type: Object })
  resource?: {
    type?: string;
    id?: string;
    urn_no?: string;
  };

  @Prop({ type: Object })
  request?: {
    correlation_id?: string;
    ip?: string;
    user_agent?: string;
  };

  @Prop({ type: Object })
  changes?: Record<string, unknown>;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ occurred_at: -1 });
AuditLogSchema.index({ action: 1, occurred_at: -1 });
AuditLogSchema.index({ module: 1, occurred_at: -1 });
AuditLogSchema.index({ action_type: 1, occurred_at: -1 });
AuditLogSchema.index({ 'actor.user_id': 1, occurred_at: -1 });
AuditLogSchema.index({ 'performed_by.user_id': 1, occurred_at: -1 });
AuditLogSchema.index({ 'resource.type': 1, 'resource.id': 1, occurred_at: -1 });
AuditLogSchema.index({ 'resource.urn_no': 1, occurred_at: -1 });
AuditLogSchema.index(
  { 'metadata.audit_event_id': 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      'metadata.audit_event_id': { $type: 'string' },
    },
  },
);

const AUDIT_IMMUTABLE_ERROR =
  'Audit logs are append-only and cannot be modified';

function rejectAuditMutation(next: (error?: Error) => void) {
  next(new Error(AUDIT_IMMUTABLE_ERROR));
}

AuditLogSchema.pre('save', function (next) {
  if (!this.isNew) {
    next(new Error(AUDIT_IMMUTABLE_ERROR));
    return;
  }
  next();
});
AuditLogSchema.pre('updateOne', rejectAuditMutation);
AuditLogSchema.pre('updateMany', rejectAuditMutation);
AuditLogSchema.pre('findOneAndUpdate', rejectAuditMutation);
AuditLogSchema.pre('replaceOne', rejectAuditMutation);
AuditLogSchema.pre('findOneAndReplace', rejectAuditMutation);
AuditLogSchema.pre('deleteOne', rejectAuditMutation);
AuditLogSchema.pre('deleteMany', rejectAuditMutation);
AuditLogSchema.pre('findOneAndDelete', rejectAuditMutation);
AuditLogSchema.pre(
  'bulkWrite',
  function (next, ops: Array<Record<string, unknown>>) {
    const hasMutation = ops.some((op) =>
      ['updateOne', 'updateMany', 'replaceOne', 'deleteOne', 'deleteMany'].some(
        (operation) => Object.prototype.hasOwnProperty.call(op, operation),
      ),
    );
    if (hasMutation) {
      next(new Error(AUDIT_IMMUTABLE_ERROR));
      return;
    }
    next();
  },
);
