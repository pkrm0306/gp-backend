import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import type { Express } from 'express';

export const BANNER_VIDEO_MAX_DURATION_SECONDS = 60;

const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);

function parseDurationValue(raw: unknown): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === undefined || value === null || value === '') return null;
  const n = Number.parseFloat(String(value).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Read duration the admin UI sends with the multipart form. */
export function extractClientVideoDurationSeconds(
  body?: Record<string, unknown> | null,
): number | null {
  if (!body || typeof body !== 'object') return null;
  for (const key of [
    'videoDurationSeconds',
    'video_duration_seconds',
    'videoDuration',
    'video_duration',
  ]) {
    const parsed = parseDurationValue(body[key]);
    if (parsed != null) return parsed;
  }
  return null;
}

function readVideoBuffer(file: Express.Multer.File): Buffer | null {
  if (file.buffer && file.buffer.length > 0) return file.buffer;
  if (file.path) {
    try {
      return readFileSync(file.path);
    } catch {
      return null;
    }
  }
  return null;
}

function tryFfprobeDurationSeconds(filePath: string): number | null {
  try {
    const out = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        filePath,
      ],
      { encoding: 'utf8', timeout: 15000 },
    );
    const n = Number.parseFloat(String(out).trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

function parseMvhdDuration(buf: Buffer, contentStart: number): number | null {
  if (contentStart >= buf.length) return null;
  const version = buf[contentStart];
  if (version === 0) {
    if (contentStart + 20 > buf.length) return null;
    const timescale = buf.readUInt32BE(contentStart + 12);
    const duration = buf.readUInt32BE(contentStart + 16);
    if (!timescale) return null;
    return duration / timescale;
  }
  if (version === 1) {
    if (contentStart + 32 > buf.length) return null;
    const timescale = buf.readUInt32BE(contentStart + 20);
    const durationHi = buf.readUInt32BE(contentStart + 24);
    const durationLo = buf.readUInt32BE(contentStart + 28);
    const duration = durationHi * 2 ** 32 + durationLo;
    if (!timescale) return null;
    return duration / timescale;
  }
  return null;
}

function tryBinaryDurationSeconds(file: Express.Multer.File): number | null {
  const buf = readVideoBuffer(file);
  if (!buf?.length) {
    if (file.path) return tryFfprobeDurationSeconds(file.path);
    return null;
  }

  for (let pos = buf.indexOf('mvhd'); pos >= 0; pos = buf.indexOf('mvhd', pos + 4)) {
    const duration = parseMvhdDuration(buf, pos + 4);
    if (duration != null && duration > 0 && duration < 24 * 3600) return duration;
  }

  for (let pos = buf.indexOf('mdhd'); pos >= 0; pos = buf.indexOf('mdhd', pos + 4)) {
    const duration = parseMvhdDuration(buf, pos + 4);
    if (duration != null && duration > 0 && duration < 24 * 3600) return duration;
  }

  if (file.path) return tryFfprobeDurationSeconds(file.path);
  return null;
}

function isLikelyVideoUpload(file: Express.Multer.File): boolean {
  const mime = String(file.mimetype ?? '').toLowerCase();
  if (mime.startsWith('video/')) return true;
  const ext = extname(file.originalname || '').toLowerCase();
  return VIDEO_EXTENSIONS.has(ext);
}

function rejectIfOverLimit(duration: number): void {
  if (duration > BANNER_VIDEO_MAX_DURATION_SECONDS + 0.5) {
    throw new BadRequestException(
      `Banner video must be ${BANNER_VIDEO_MAX_DURATION_SECONDS} seconds or less.`,
    );
  }
}

/**
 * Validates banner video duration for admin uploads.
 * - Trusts browser-measured `videoDurationSeconds` from the form (primary).
 * - Falls back to server binary/ffprobe parsing when available.
 * - Does NOT block the upload when duration cannot be read server-side; the
 *   admin UI already validates length before submit.
 */
export function assertBannerVideoDurationWithinLimit(
  file: Express.Multer.File,
  body?: Record<string, unknown> | null,
): void {
  if (!isLikelyVideoUpload(file)) {
    throw new BadRequestException(
      'Banner video must be an MP4, WebM, or MOV file.',
    );
  }

  const clientDuration = extractClientVideoDurationSeconds(body);
  if (clientDuration != null) {
    rejectIfOverLimit(clientDuration);
    return;
  }

  const serverDuration = tryBinaryDurationSeconds(file);
  if (serverDuration != null) {
    rejectIfOverLimit(serverDuration);
    return;
  }

  // Client already enforced <= 60s in the picker; allow upload when duration
  // metadata is missing from both the form and the file container.
}
