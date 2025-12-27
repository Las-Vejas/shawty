import UAParser from 'ua-parser-js';

export interface ClickData {
    link_id: string;
    ip_address: string;
    country?: string;
    city?: string;
    device: string;
    os: string;
    browser: string;
    user_agent: string;
    referrer?: string;
}

export function parseUserAgent(userAgent: string): { device: string; os: string; browser: string } {
    const parser = new (UAParser as any)(userAgent);
    const result = parser.getResult();
    
    return {
        device: result.device.type || 'desktop',
        os: result.os.name || 'Unknown',
        browser: result.browser.name || 'Unknown'
    };
}

export async function getLocationFromIP(ip: string): Promise<{ country?: string; city?: string }> {
    try {
        // Using ipapi.co free API (1000 requests/day)
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!response.ok) return {};
        
        const data = await response.json();
        return {
            country: data.country_name || undefined,
            city: data.city || undefined
        };
    } catch (error) {
        console.error('Failed to get location:', error);
        return {};
    }
}

export function getClientIP(request: Request): string {

    const headers = request.headers;
    
    return (
        headers.get('cf-connecting-ip') || 
        headers.get('x-real-ip') || 
        headers.get('x-forwarded-for')?.split(',')[0].trim() || 
        '0.0.0.0'
    );
}