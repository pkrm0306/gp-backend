"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANNER_VIDEO_MAX_DURATION_SECONDS = void 0;
exports.extractClientVideoDurationSeconds = extractClientVideoDurationSeconds;
exports.assertBannerVideoDurationWithinLimit = assertBannerVideoDurationWithinLimit;
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var path_1 = require("path");
var common_1 = require("@nestjs/common");
exports.BANNER_VIDEO_MAX_DURATION_SECONDS = 60;
var VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
function parseDurationValue(raw) {
    var value = Array.isArray(raw) ? raw[0] : raw;
    if (value === undefined || value === null || value === '')
        return null;
    var n = Number.parseFloat(String(value).trim());
    if (!Number.isFinite(n) || n <= 0)
        return null;
    return n;
}
/** Read duration the admin UI sends with the multipart form. */
function extractClientVideoDurationSeconds(body) {
    if (!body || typeof body !== 'object')
        return null;
    for (var _i = 0, _a = [
        'videoDurationSeconds',
        'video_duration_seconds',
        'videoDuration',
        'video_duration',
    ]; _i < _a.length; _i++) {
        var key = _a[_i];
        var parsed = parseDurationValue(body[key]);
        if (parsed != null)
            return parsed;
    }
    return null;
}
function readVideoBuffer(file) {
    if (file.buffer && file.buffer.length > 0)
        return file.buffer;
    if (file.path) {
        try {
            return (0, fs_1.readFileSync)(file.path);
        }
        catch (_a) {
            return null;
        }
    }
    return null;
}
function tryFfprobeDurationSeconds(filePath) {
    try {
        var out = (0, child_process_1.execFileSync)('ffprobe', [
            '-v',
            'error',
            '-show_entries',
            'format=duration',
            '-of',
            'default=noprint_wrappers=1:nokey=1',
            filePath,
        ], { encoding: 'utf8', timeout: 15000 });
        var n = Number.parseFloat(String(out).trim());
        return Number.isFinite(n) && n > 0 ? n : null;
    }
    catch (_a) {
        return null;
    }
}
function parseMvhdDuration(buf, contentStart) {
    if (contentStart >= buf.length)
        return null;
    var version = buf[contentStart];
    if (version === 0) {
        if (contentStart + 20 > buf.length)
            return null;
        var timescale = buf.readUInt32BE(contentStart + 12);
        var duration = buf.readUInt32BE(contentStart + 16);
        if (!timescale)
            return null;
        return duration / timescale;
    }
    if (version === 1) {
        if (contentStart + 32 > buf.length)
            return null;
        var timescale = buf.readUInt32BE(contentStart + 20);
        var durationHi = buf.readUInt32BE(contentStart + 24);
        var durationLo = buf.readUInt32BE(contentStart + 28);
        var duration = durationHi * Math.pow(2, 32) + durationLo;
        if (!timescale)
            return null;
        return duration / timescale;
    }
    return null;
}
function tryBinaryDurationSeconds(file) {
    var buf = readVideoBuffer(file);
    if (!(buf === null || buf === void 0 ? void 0 : buf.length)) {
        if (file.path)
            return tryFfprobeDurationSeconds(file.path);
        return null;
    }
    for (var pos = buf.indexOf('mvhd'); pos >= 0; pos = buf.indexOf('mvhd', pos + 4)) {
        var duration = parseMvhdDuration(buf, pos + 4);
        if (duration != null && duration > 0 && duration < 24 * 3600)
            return duration;
    }
    for (var pos = buf.indexOf('mdhd'); pos >= 0; pos = buf.indexOf('mdhd', pos + 4)) {
        var duration = parseMvhdDuration(buf, pos + 4);
        if (duration != null && duration > 0 && duration < 24 * 3600)
            return duration;
    }
    if (file.path)
        return tryFfprobeDurationSeconds(file.path);
    return null;
}
function isLikelyVideoUpload(file) {
    var _a;
    var mime = String((_a = file.mimetype) !== null && _a !== void 0 ? _a : '').toLowerCase();
    if (mime.startsWith('video/'))
        return true;
    var ext = (0, path_1.extname)(file.originalname || '').toLowerCase();
    return VIDEO_EXTENSIONS.has(ext);
}
function rejectIfOverLimit(duration) {
    if (duration > exports.BANNER_VIDEO_MAX_DURATION_SECONDS + 0.5) {
        throw new common_1.BadRequestException("Banner video must be ".concat(exports.BANNER_VIDEO_MAX_DURATION_SECONDS, " seconds or less."));
    }
}
/**
 * Validates banner video duration for admin uploads.
 * - Trusts browser-measured `videoDurationSeconds` from the form (primary).
 * - Falls back to server binary/ffprobe parsing when available.
 * - Does NOT block the upload when duration cannot be read server-side; the
 *   admin UI already validates length before submit.
 */
function assertBannerVideoDurationWithinLimit(file, body) {
    if (!isLikelyVideoUpload(file)) {
        throw new common_1.BadRequestException('Banner video must be an MP4, WebM, or MOV file.');
    }
    var clientDuration = extractClientVideoDurationSeconds(body);
    if (clientDuration != null) {
        rejectIfOverLimit(clientDuration);
        return;
    }
    var serverDuration = tryBinaryDurationSeconds(file);
    if (serverDuration != null) {
        rejectIfOverLimit(serverDuration);
        return;
    }
    // Client already enforced <= 60s in the picker; allow upload when duration
    // metadata is missing from both the form and the file container.
}
