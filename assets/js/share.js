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
        return JSON.parse(json);
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

