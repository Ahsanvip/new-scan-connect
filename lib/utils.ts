/**
 * Utility functions for the Antigravity QR system
 */

/**
 * Validate Pakistan phone number formats
 * Accepts: +92XXXXXXXXXX, 92XXXXXXXXXX, 03XXXXXXXXX
 */
export function validatePakistanPhone(phone: string): { valid: boolean; formatted?: string; error?: string } {
    // Remove all spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Pattern 1: +92XXXXXXXXXX (11 digits after +92)
    const pattern1 = /^\+92(\d{10})$/;
    // Pattern 2: 92XXXXXXXXXX (10 digits after 92)
    const pattern2 = /^92(\d{10})$/;
    // Pattern 3: 03XXXXXXXXX (11 digits starting with 03)
    const pattern3 = /^(03\d{9})$/;

    let match;

    if ((match = cleaned.match(pattern1))) {
        return { valid: true, formatted: `+92${match[1]}` };
    }

    if ((match = cleaned.match(pattern2))) {
        return { valid: true, formatted: `+92${match[1]}` };
    }

    if ((match = cleaned.match(pattern3))) {
        // Convert 03XXXXXXXXX to +923XXXXXXXXX
        return { valid: true, formatted: `+92${match[1].substring(1)}` };
    }

    return {
        valid: false,
        error: 'Invalid Pakistan phone number. Use format: +923XXXXXXXXX or 03XXXXXXXXX',
    };
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
    // Check common headers used by proxies
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback (Next.js development)
    return '127.0.0.1';
}

/**
 * Format activation code for display
 */
export function formatActivationCode(code: string): string {
    return code.toUpperCase().trim();
}

/**
 * List of major Pakistani cities
 */
export const PAKISTAN_CITIES = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Bahawalpur',
    'Sargodha',
    'Abbottabad',
    'Sukkur',
    'Larkana',
    'Mardan',
    'Mingora',
    'Other',
];

/**
 * Notification reasons
 */
export const NOTIFICATION_REASONS = [
    { value: 'wrong_parking', label: 'Wrong Parking', icon: '🚗' },
    { value: 'blocking', label: 'Blocking Road/Entrance', icon: '🚧' },
    { value: 'emergency', label: 'Emergency', icon: '🚨' },
    { value: 'accident', label: 'Accident', icon: '⚠️' },
    { value: 'lights_on', label: 'Lights Are On', icon: '💡' },
    { value: 'door_open', label: 'Door/Window Open', icon: '🚪' },
    { value: 'other', label: 'Other Reason', icon: '📱' },
];
