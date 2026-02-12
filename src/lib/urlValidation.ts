import { PUBLIC_URL } from '$env/static/public';

// Get the hostname from PUBLIC_URL to block self-referencing links
export const getHostname = (url: string): string | null => {
    try {
        return new URL(url).hostname.toLowerCase();
    } catch {
        return null;
    }
};

export const BLOCKED_HOSTNAMES = [
    getHostname(PUBLIC_URL), // e.g., shawty.app
    'shawty.app',
    'shawty.app',
].filter(Boolean) as string[];

// Validate that URL doesn't point to our own domain (prevents loops)
export const validateUrlNotSelfReferencing = (url: string): boolean => {
    const hostname = getHostname(url);
    if (!hostname) return false;
    
    // Check if hostname matches any blocked hostname
    return !BLOCKED_HOSTNAMES.some(blocked => 
        hostname === blocked || hostname.endsWith(`.${blocked}`)
    );
};

// Validate and normalize URL
export const validateAndNormalizeUrl = (url: string): { valid: boolean; normalizedUrl?: string; error?: string } => {
    if (!url || url.trim() === '') {
        return { valid: false, error: 'URL cannot be empty' };
    }

    let normalizedUrl = url;

    // Add https:// if no protocol is specified
    if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = 'https://' + normalizedUrl;
    }

    // Validate URL format
    try {
        new URL(normalizedUrl);
    } catch {
        return { valid: false, error: 'Invalid URL format' };
    }

    return { valid: true, normalizedUrl };
};
