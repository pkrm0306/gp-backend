"use strict";
/**
 * Manufacturer initials + internal ID (gpInternalId) helpers.
 * Initials: **3-letter** uppercase candidates from the manufacturer name.
 * New internal IDs: `GPSC-<suffix>` (000–999 zero-padded, then 1000–9999).
 * Legacy stored ids remain `GP<INI>-###` and are never rewritten.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeManufacturerName = normalizeManufacturerName;
exports.tokenizeManufacturerName = tokenizeManufacturerName;
exports.generateInitial = generateInitial;
exports.parseGpscNumericSuffix = parseGpscNumericSuffix;
exports.parseGpInternalNumericSuffix = parseGpInternalNumericSuffix;
exports.generateInternalId = generateInternalId;
exports.internalIdMatchesInitial = internalIdMatchesInitial;
const LETTER = /[A-Za-z]/;
function letterChar(ch) {
    if (!ch || !LETTER.test(ch))
        return null;
    return ch.toUpperCase();
}
/** Letters only from a token (digits/punctuation stripped). */
function lettersOnly(token) {
    let out = '';
    for (const ch of String(token ?? '')) {
        const L = letterChar(ch);
        if (L)
            out += L;
    }
    return out;
}
/** Collapse whitespace; trim. */
function normalizeManufacturerName(name) {
    return String(name ?? '')
        .trim()
        .replace(/\s+/g, ' ');
}
/**
 * Split display name into word tokens (letters/digits grouped; skip pure punctuation).
 */
function tokenizeManufacturerName(normalizedName) {
    const s = normalizeManufacturerName(normalizedName);
    if (!s)
        return [];
    return s.match(/[A-Za-z0-9]+/g) ?? [];
}
function pushTriple(out, a, b, c) {
    if (!a || !b || !c)
        return;
    const triple = `${a}${b}${c}`;
    if (triple.length === 3 && !out.includes(triple)) {
        out.push(triple);
    }
}
/**
 * Ordered **3-letter** uppercase candidates from the manufacturer name.
 *
 * Primary rules:
 * - 3+ words → first letter of each of the first three words
 *   (e.g. "Miraki Tech Limited" → **MTL**)
 * - 2 words → first letter of word1 + first two letters of word2
 *   (e.g. "Amazon Tech" → **ATE**)
 * - 1 word → first three letters of that word
 *   (e.g. "Greenpro" → **GRE**)
 *
 * Further candidates vary later letters so uniqueness can be allocated.
 */
function generateInitial(manufacturerName) {
    const name = normalizeManufacturerName(manufacturerName);
    const words = tokenizeManufacturerName(name)
        .map(lettersOnly)
        .filter((w) => w.length > 0);
    const out = [];
    if (words.length === 0) {
        return out;
    }
    if (words.length >= 3) {
        const w1 = words[0];
        const w2 = words[1];
        const w3 = words[2];
        // Primary: Miraki Tech Limited → MTL
        pushTriple(out, w1[0], w2[0], w3[0]);
        // Vary 3rd letter through remaining words' first letters
        for (let wi = 3; wi < words.length; wi++) {
            pushTriple(out, w1[0], w2[0], words[wi][0]);
        }
        // Then through letters of word3, word2, word1
        for (let i = 1; i < w3.length; i++) {
            pushTriple(out, w1[0], w2[0], w3[i]);
        }
        for (let i = 1; i < w2.length; i++) {
            pushTriple(out, w1[0], w2[i], w3[0]);
        }
        for (let i = 1; i < w1.length; i++) {
            pushTriple(out, w1[i], w2[0], w3[0]);
        }
    }
    else if (words.length === 2) {
        const w1 = words[0];
        const w2 = words[1];
        // Primary: Amazon Tech → ATE (A + Te)
        if (w2.length >= 2) {
            pushTriple(out, w1[0], w2[0], w2[1]);
        }
        // Alt: first two of word1 + first of word2
        if (w1.length >= 2) {
            pushTriple(out, w1[0], w1[1], w2[0]);
        }
        // More from word2 letters
        for (let i = 2; i < w2.length; i++) {
            pushTriple(out, w1[0], w2[0], w2[i]);
        }
        for (let i = 1; i < w2.length; i++) {
            for (let j = i + 1; j < w2.length; j++) {
                pushTriple(out, w1[0], w2[i], w2[j]);
            }
        }
        for (let i = 1; i < w1.length; i++) {
            for (let j = i + 1; j < w1.length; j++) {
                pushTriple(out, w1[0], w1[i], w1[j]);
            }
            if (w2.length >= 1) {
                pushTriple(out, w1[0], w1[i], w2[0]);
            }
        }
    }
    else {
        const w = words[0];
        // Primary: first three letters
        if (w.length >= 3) {
            pushTriple(out, w[0], w[1], w[2]);
        }
        // Other triples from the word
        for (let i = 0; i < w.length; i++) {
            for (let j = i + 1; j < w.length; j++) {
                for (let k = j + 1; k < w.length; k++) {
                    pushTriple(out, w[i], w[j], w[k]);
                }
            }
        }
        // Short words: pad with later alphabet letters after using available letters
        if (w.length === 1) {
            for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
                const b = String.fromCharCode(code);
                for (let code2 = 'A'.charCodeAt(0); code2 <= 'Z'.charCodeAt(0); code2++) {
                    pushTriple(out, w[0], b, String.fromCharCode(code2));
                }
            }
        }
        else if (w.length === 2) {
            for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
                pushTriple(out, w[0], w[1], String.fromCharCode(code));
            }
        }
    }
    // Final uniqueness pool: fix first two of primary (or first available) and cycle 3rd A–Z,
    // then fix first + cycle 2nd/3rd — enough candidates for pickUniqueInitial.
    const base = out[0];
    if (base) {
        for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
            pushTriple(out, base[0], base[1], String.fromCharCode(code));
        }
        for (let code = 'A'.charCodeAt(0); code <= 'Z'.charCodeAt(0); code++) {
            pushTriple(out, base[0], String.fromCharCode(code), base[2]);
        }
    }
    else {
        const c1 = words[0][0];
        for (let code2 = 'A'.charCodeAt(0); code2 <= 'Z'.charCodeAt(0); code2++) {
            for (let code3 = 'A'.charCodeAt(0); code3 <= 'Z'.charCodeAt(0); code3++) {
                pushTriple(out, c1, String.fromCharCode(code2), String.fromCharCode(code3));
            }
        }
    }
    return out;
}
/**
 * Numeric suffix from a **GPSC-** manufacturer id only (`GPSC-000` … `GPSC-9999`).
 * Legacy `GPXX-###` ids are ignored so the GPSC sequence stays consecutive.
 */
function parseGpscNumericSuffix(gpInternalId) {
    const id = String(gpInternalId ?? '').trim().toUpperCase();
    const m = /^GPSC-(\d{1,4})$/.exec(id);
    if (!m) {
        return null;
    }
    const v = Number.parseInt(m[1], 10);
    if (!Number.isFinite(v) || v < 0 || v > 9999) {
        return null;
    }
    return v;
}
/**
 * Numeric suffix after the last `-` in a `GP..` internal id: **1–999** (three-digit form)
 * or **1000–9999** (four-digit form). Returns `null` if not parseable.
 * Prefer {@link parseGpscNumericSuffix} when allocating new GPSC ids.
 */
function parseGpInternalNumericSuffix(gpInternalId) {
    const gpsc = parseGpscNumericSuffix(gpInternalId);
    if (gpsc != null) {
        return gpsc;
    }
    const id = String(gpInternalId ?? '').trim().toUpperCase();
    const m = /-(\d{3,4})$/.exec(id);
    if (!m) {
        return null;
    }
    const digits = m[1];
    const v = parseInt(digits, 10);
    if (!Number.isFinite(v)) {
        return null;
    }
    if (digits.length === 3) {
        if (v >= 1 && v <= 999) {
            return v;
        }
        return null;
    }
    if (digits.length === 4) {
        if (v >= 1000 && v <= 9999) {
            return v;
        }
        if (v >= 1 && v <= 999) {
            return v;
        }
        return null;
    }
    return null;
}
/**
 * Builds `GPSC-<suffix>` for newly verified manufacturers.
 * Initials are stored separately and are not part of this id.
 */
function generateInternalId(_manufacturerInitial, suffixNumber) {
    if (!Number.isInteger(suffixNumber)) {
        throw new Error('generateInternalId: suffixNumber must be an integer from 0 to 9999');
    }
    if (suffixNumber >= 0 && suffixNumber <= 999) {
        const n = String(suffixNumber).padStart(3, '0');
        return `GPSC-${n}`;
    }
    if (suffixNumber >= 1000 && suffixNumber <= 9999) {
        return `GPSC-${suffixNumber}`;
    }
    throw new Error('generateInternalId: suffixNumber must be between 0 and 9999 (use 000–999 then 1000–9999)');
}
/** True if existing stored id is already a canonical GPSC id. */
function internalIdMatchesInitial(gpInternalId, _manufacturerInitial) {
    const id = String(gpInternalId ?? '').trim().toUpperCase();
    const re = /^GPSC-(?:\d{3}|[1-9]\d{3})$/;
    if (!re.test(id)) {
        return false;
    }
    const n = parseGpscNumericSuffix(id);
    if (n == null) {
        return false;
    }
    return id === generateInternalId('SC', n);
}
