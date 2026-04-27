import { Request } from 'express';
import {
  AUDIT_ACTION_TYPE,
  AUDIT_MODULE,
  AuditActionType,
  AuditModule,
  FriendlyAuditFields,
} from './audit-friendlies';
import { AUDIT_SENSITIVE_BODY_KEYS } from './audit-privacy';

function bodyObj(req: Request): Record<string, unknown> | undefined {
  const b = req.body;
  if (!b || typeof b !== 'object' || Array.isArray(b)) {
    return undefined;
  }
  return b as Record<string, unknown>;
}

export function firstStringField(
  body: Record<string, unknown> | undefined,
  keys: string[],
  maxLen = 200,
): string | undefined {
  if (!body) {
    return undefined;
  }
  for (const k of keys) {
    const v = body[k];
    if (typeof v === 'string' && v.trim()) {
      const t = v.trim();
      return t.length > maxLen ? t.slice(0, maxLen) : t;
    }
  }
  return undefined;
}

/** Shallow snapshot: strings (trimmed), numbers, booleans, null — no nested objects. */
export function safeBodySnapshot(
  body: Record<string, unknown> | undefined,
  stringMax = 500,
): Record<string, unknown> | undefined {
  if (!body) {
    return undefined;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (AUDIT_SENSITIVE_BODY_KEYS.has(k)) {
      continue;
    }
    if (typeof v === 'string') {
      out[k] = v.length > stringMax ? v.slice(0, stringMax) : v;
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v;
    } else if (v === null) {
      out[k] = null;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function methodDefaultActionType(method: string): AuditActionType {
  const m = method.toUpperCase();
  if (m === 'POST') {
    return AUDIT_ACTION_TYPE.CREATE;
  }
  if (m === 'DELETE') {
    return AUDIT_ACTION_TYPE.DELETE;
  }
  return AUDIT_ACTION_TYPE.UPDATE;
}

function isProductFamilyPath(p: string): boolean {
  return (
    p.startsWith('/product-design') ||
    p.startsWith('/product-performance') ||
    p.startsWith('/product-registration') ||
    p.startsWith('/products') ||
    p.startsWith('/api/admin/products') ||
    p.startsWith('/raw-materials-hazardous-products') ||
    p.startsWith('/process-comments') ||
    p.startsWith('/process-')
  );
}

function urnFromBody(
  body: Record<string, unknown> | undefined,
): string | undefined {
  return firstStringField(body, ['urn_no', 'urnNo', 'urn']);
}

/**
 * Maps HTTP context to user-facing audit fields. Always returns a consistent shape.
 */
export function buildPerformedBy(
  user: Record<string, unknown> | undefined,
  actor:
    | {
        user_id?: string;
        role?: string;
        vendor_id?: string;
        manufacturer_id?: string;
      }
    | undefined,
  pathNorm: string,
  body: Record<string, unknown> | undefined,
): { user_id?: string; name?: string; email?: string } | undefined {
  if (user && typeof user === 'object') {
    const uid =
      user['userId'] !== undefined ? String(user['userId']) : actor?.user_id;
    const name =
      user['name'] !== undefined
        ? String(user['name']).slice(0, 200)
        : undefined;
    const email =
      user['email'] !== undefined
        ? String(user['email']).slice(0, 200)
        : undefined;
    if (uid || name || email) {
      return {
        user_id: uid,
        name: name || undefined,
        email: email || undefined,
      };
    }
  }
  if (actor?.user_id) {
    return { user_id: actor.user_id };
  }
  if (
    pathNorm.endsWith('/auth/login') &&
    body &&
    typeof body['email'] === 'string'
  ) {
    const e = body['email'].trim();
    if (e) {
      return { email: e.slice(0, 200) };
    }
  }
  return undefined;
}

export function mapFriendlyAudit(
  method: string,
  pathNorm: string,
  req: Request,
  outcome: 'success' | 'failure',
): FriendlyAuditFields {
  const m = method.toUpperCase();
  const body = bodyObj(req);
  const snap = safeBodySnapshot(body);

  if (m === 'POST' && pathNorm.endsWith('/auth/login')) {
    return {
      module: AUDIT_MODULE.AUTH,
      action_type: AUDIT_ACTION_TYPE.LOGIN,
      description:
        outcome === 'success' ? 'Signed in successfully' : 'Sign-in failed',
      entity_name: firstStringField(body, ['email']),
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/auth/refresh')) {
    return {
      module: AUDIT_MODULE.AUTH,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Access token refreshed',
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/auth/register-vendor')) {
    return {
      module: AUDIT_MODULE.AUTH,
      action_type: AUDIT_ACTION_TYPE.CREATE,
      description: 'Vendor registration submitted',
      entity_name: firstStringField(body, ['email', 'companyName']),
      new_values: snap,
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/auth/verify-otp')) {
    return {
      module: AUDIT_MODULE.AUTH,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Email verification (OTP)',
      entity_name: firstStringField(body, ['email']),
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/auth/forgot-password')) {
    return {
      module: AUDIT_MODULE.AUTH,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Password reset requested',
      entity_name: firstStringField(body, ['email']),
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/addcategory')) {
    return {
      module: AUDIT_MODULE.CATEGORY,
      action_type: AUDIT_ACTION_TYPE.CREATE,
      description: 'Category created',
      entity_name: firstStringField(body, ['category_name']),
      new_values: snap,
    };
  }

  if (m === 'PATCH' && /^\/categories\/[^/]+\/status$/.test(pathNorm)) {
    return {
      module: AUDIT_MODULE.CATEGORY,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Category status updated',
      entity_name: firstStringField(body, ['category_name']),
      new_values: snap,
    };
  }

  if (
    (m === 'PATCH' || m === 'PUT') &&
    /^\/categories\/[^/]+$/.test(pathNorm)
  ) {
    return {
      module: AUDIT_MODULE.CATEGORY,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Category updated',
      entity_name: firstStringField(body, ['category_name']),
      new_values: snap,
    };
  }

  if (m === 'DELETE' && /^\/categories\/[^/]+$/.test(pathNorm)) {
    const id = pathNorm.split('/').pop();
    return {
      module: AUDIT_MODULE.CATEGORY,
      action_type: AUDIT_ACTION_TYPE.DELETE,
      description: 'Category deleted',
      entity_name: id,
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/uploadcategoryimage')) {
    return {
      module: AUDIT_MODULE.CATEGORY,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Category image uploaded',
    };
  }

  if (m === 'POST' && pathNorm === '/api/sectors') {
    return {
      module: AUDIT_MODULE.SECTOR,
      action_type: AUDIT_ACTION_TYPE.CREATE,
      description: 'Sector created',
      entity_name: firstStringField(body, ['name']),
      new_values: snap,
    };
  }

  if (
    (m === 'PATCH' || m === 'PUT') &&
    /^\/api\/sectors\/[^/]+$/.test(pathNorm) &&
    !pathNorm.endsWith('/export')
  ) {
    return {
      module: AUDIT_MODULE.SECTOR,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Sector updated',
      entity_name: firstStringField(body, ['name']),
      new_values: snap,
    };
  }

  if (m === 'DELETE' && /^\/api\/sectors\/[^/]+$/.test(pathNorm)) {
    const id = pathNorm.split('/').pop();
    return {
      module: AUDIT_MODULE.SECTOR,
      action_type: AUDIT_ACTION_TYPE.DELETE,
      description: 'Sector deleted',
      entity_name: id,
    };
  }

  if (m === 'PATCH' && pathNorm.endsWith('/api/admin/products/urn-status')) {
    const urn = firstStringField(body, ['urnNo']);
    const typeStr = body?.['updateStatusType'];
    const toVal = body?.['updateStatusTo'];
    const toNum =
      typeof toVal === 'number'
        ? toVal
        : typeof toVal === 'string' && toVal.trim() !== ''
          ? Number(toVal)
          : NaN;
    const isUrnReject = typeStr === 'urn_status' && toNum === 4;
    return {
      module: AUDIT_MODULE.CERTIFICATION,
      action_type: isUrnReject
        ? AUDIT_ACTION_TYPE.REJECT
        : AUDIT_ACTION_TYPE.APPROVE,
      description: isUrnReject
        ? 'Certification / URN rejected'
        : 'Certification / URN status advanced',
      entity_name: urn,
      new_values:
        typeof typeStr === 'string' || !Number.isNaN(toNum)
          ? {
              ...(typeof typeStr === 'string'
                ? { updateStatusType: typeStr }
                : {}),
              ...(!Number.isNaN(toNum) ? { updateStatusTo: toNum } : {}),
            }
          : undefined,
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/payments')) {
    return {
      module: AUDIT_MODULE.CERTIFICATION,
      action_type: AUDIT_ACTION_TYPE.CREATE,
      description: 'Payment record created',
      entity_name: urnFromBody(body) ?? firstStringField(body, ['urnNo']),
      new_values: snap,
    };
  }

  if (m === 'PATCH' && /^\/payments\/[^/]+$/.test(pathNorm)) {
    const urn = pathNorm.split('/').pop();
    return {
      module: AUDIT_MODULE.CERTIFICATION,
      action_type: AUDIT_ACTION_TYPE.UPDATE,
      description: 'Payment record updated',
      entity_name: urn ? decodeURIComponent(urn) : undefined,
      new_values: snap,
    };
  }

  if (m === 'POST' && pathNorm.endsWith('/activity-log')) {
    return {
      module: AUDIT_MODULE.CERTIFICATION,
      action_type: AUDIT_ACTION_TYPE.CREATE,
      description: 'Certification activity logged',
      entity_name: urnFromBody(body),
      new_values: snap,
    };
  }

  if (isProductFamilyPath(pathNorm)) {
    const at = methodDefaultActionType(m);
    const urn = urnFromBody(body);
    let description: string;
    if (at === AUDIT_ACTION_TYPE.CREATE) {
      description = 'Product / process data created';
    } else if (at === AUDIT_ACTION_TYPE.DELETE) {
      description = 'Product / process data deleted';
    } else {
      description = 'Product / process data updated';
    }
    return {
      module: AUDIT_MODULE.PRODUCT,
      action_type: at,
      description,
      entity_name: urn,
      new_values: snap,
    };
  }

  const at = methodDefaultActionType(m);
  const mod: AuditModule = AUDIT_MODULE.OTHER;
  const description = `${m} ${pathNorm}`.slice(0, 200);
  return {
    module: mod,
    action_type: at,
    description,
    entity_name: urnFromBody(body),
  };
}
