const SHARE_FIELDS = [
    'id',
    'type',
    'name',
    'description',
    'code',
    'message',
    'hint',
    'image',
    'url',
    'difficulty',
    'options',
    'customUrl',
    'directory',
    'nextLock',
    'timestamp'
];

const FALLBACK_BASE = 'https://escapify.io/';

/** Origen del sitio (mismo host que la página). Vacío fuera del navegador. */
function getSiteOrigin() {
    if (typeof window !== 'undefined' && window.location && window.location.origin) {
        return window.location.origin;
    }
    return '';
}

/**
 * Solo rutas del mismo sitio (evita open redirect / phishing en ?data=).
 * Devuelve pathname+search+hash o cadena vacía si no es seguro.
 */
function sanitizeUrlField(value, origin) {
    if (value === undefined || value === null) return '';
    const t = String(value).trim();
    if (!t) return '';
    if (!origin) {
        return t.startsWith('/') && !t.startsWith('//') ? t : '';
    }
    try {
        const u = new URL(t, origin);
        if (!['http:', 'https:'].includes(u.protocol)) return '';
        if (u.origin !== new URL(origin).origin) return '';
        return u.pathname + u.search + u.hash;
    } catch {
        return '';
    }
}

/** Imágenes: rutas relativas seguras o URL absoluta solo mismo origin. */
function sanitizeImageField(value, origin) {
    if (value === undefined || value === null) return '';
    const t = String(value).trim();
    if (!t) return '';
    if (t.startsWith('/') && !t.startsWith('//')) {
        return t.length > 2000 ? t.slice(0, 2000) : t;
    }
    if (!origin) return '';
    try {
        const u = new URL(t, origin);
        if (!['http:', 'https:'].includes(u.protocol)) return '';
        if (u.origin !== new URL(origin).origin) return '';
        return u.toString();
    } catch {
        return '';
    }
}

/** Limpia datos decodificados desde ?data= (payload puede ser manipulado). */
function sanitizeDecodedLockData(data) {
    if (!data || typeof data !== 'object') return data;
    const origin = getSiteOrigin();
    const out = { ...data };
    if (out.url != null) out.url = sanitizeUrlField(out.url, origin);
    if (out.customUrl != null) out.customUrl = sanitizeUrlField(out.customUrl, origin);
    if (out.image != null) out.image = sanitizeImageField(out.image, origin);
    ['url', 'customUrl', 'image'].forEach((k) => {
        if (out[k] === '') delete out[k];
    });
    return out;
}

function sanitizeLockData(lockData = {}) {
    const sanitized = {};

    SHARE_FIELDS.forEach(field => {
        if (lockData[field] !== undefined && lockData[field] !== null && lockData[field] !== '') {
            sanitized[field] = lockData[field];
        }
    });

    if (lockData.hints) {
        sanitized.hints = lockData.hints;
    }

    const origin = getSiteOrigin();
    if (sanitized.url != null) sanitized.url = sanitizeUrlField(String(sanitized.url), origin);
    if (sanitized.customUrl != null) sanitized.customUrl = sanitizeUrlField(String(sanitized.customUrl), origin);
    if (sanitized.image != null) sanitized.image = sanitizeImageField(String(sanitized.image), origin);
    ['url', 'customUrl', 'image'].forEach((k) => {
        if (sanitized[k] === '') delete sanitized[k];
    });

    return sanitized;
}

function encodeString(str) {
    try {
        if (typeof TextEncoder !== 'undefined') {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(str);
            let binary = '';
            bytes.forEach(byte => {
                binary += String.fromCharCode(byte);
            });
            return btoa(binary);
        }
        return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
        console.error('Error codificando cadena:', error);
        return null;
    }
}

function decodeString(base64) {
    try {
        if (!base64) return null;
        if (typeof TextDecoder !== 'undefined') {
            const binary = atob(base64);
            const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
            const decoder = new TextDecoder();
            return decoder.decode(bytes);
        }
        return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
        console.error('Error decodificando cadena:', error);
        return null;
    }
}

export function encodeLockData(lockData = {}) {
    const sanitized = sanitizeLockData(lockData);
    const json = JSON.stringify(sanitized);
    return encodeString(json);
}

export function decodeLockData(payload) {
    const json = decodeString(payload);
    if (!json) return null;

    try {
        const data = JSON.parse(json);
        return sanitizeDecodedLockData(data);
    } catch (error) {
        console.error('Error interpretando el candado compartido:', error);
        return null;
    }
}

function getPreviewBaseUrl() {
    if (typeof window === 'undefined' || !window.location) {
        return `${FALLBACK_BASE}preview.html`;
    }

    const base = new URL('preview.html', window.location.href);
    base.search = '';
    base.hash = '';
    return base.toString();
}

export function buildShareUrlFromPayload(payload) {
    if (!payload) return null;
    const baseUrl = getPreviewBaseUrl();
    const url = new URL(baseUrl);
    url.searchParams.set('data', payload);
    return url.toString();
}

export function ensureSharePayload(lockData = {}) {
    if (lockData.sharePayload) return lockData.sharePayload;
    return encodeLockData(lockData);
}

export function buildShareUrl(lockData = {}) {
    const payload = ensureSharePayload(lockData);
    return buildShareUrlFromPayload(payload);
}

export function appendSharePayload(lockData = {}) {
    const payload = ensureSharePayload(lockData);
    if (payload) {
        lockData.sharePayload = payload;
    }
    return lockData;
}

