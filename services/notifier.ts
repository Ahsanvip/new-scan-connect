/**
 * Hybrid Notification Service for Antigravity QR System
 * Supports WhatsApp API, SMS, and graceful fallback to wa.me links
 */

interface NotificationResult {
    success: boolean;
    method: 'whatsapp_api' | 'sms' | 'link';
    fallback_url?: string;
    error?: string;
}

export class NotificationService {
    /**
     * Main notification sending method with hybrid logic
     */
    async send(
        phoneNumber: string,
        message: string,
        options: { reason?: string; coords?: string } = {}
    ): Promise<NotificationResult> {
        // Priority 1: WhatsApp Business API
        if (process.env.WA_API_KEY && process.env.WA_API_URL) {
            const result = await this.sendViaWhatsAppAPI(phoneNumber, message);
            if (result.success) {
                return { success: true, method: 'whatsapp_api' };
            }
        }

        // Priority 2: Local SMS Gateway (Pakistan providers)
        if (process.env.SMS_GATEWAY_KEY && process.env.SMS_GATEWAY_URL) {
            const result = await this.sendViaSMS(phoneNumber, message);
            if (result.success) {
                return { success: true, method: 'sms' };
            }
        }

        // Priority 3: Fallback to wa.me link
        const fallbackUrl = this.generateWhatsAppLink(phoneNumber, message);
        return {
            success: false,
            method: 'link',
            fallback_url: fallbackUrl,
        };
    }

    /**
     * Send via WhatsApp Business API
     */
    private async sendViaWhatsAppAPI(phone: string, message: string): Promise<{ success: boolean }> {
        try {
            const response = await fetch(process.env.WA_API_URL!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.WA_API_KEY}`,
                },
                body: JSON.stringify({
                    to: phone,
                    type: 'text',
                    text: { body: message },
                }),
            });

            if (response.ok) {
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('WhatsApp API error:', error);
            return { success: false };
        }
    }

    /**
     * Send via SMS Gateway (Pakistani providers)
     * Placeholder implementation - integrate with actual provider
     */
    private async sendViaSMS(phone: string, message: string): Promise<{ success: boolean }> {
        try {
            // TODO: Integrate with actual SMS provider (Veo, ShortCode, CreativeSms)
            // Example implementation:
            const response = await fetch(process.env.SMS_GATEWAY_URL!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SMS_GATEWAY_KEY}`,
                },
                body: JSON.stringify({
                    to: phone,
                    message: message,
                }),
            });

            if (response.ok) {
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('SMS Gateway error:', error);
            return { success: false };
        }
    }

    /**
     * Generate wa.me link for manual WhatsApp messaging
     */
    private generateWhatsAppLink(phone: string, message: string): string {
        // Ensure phone is in international format (remove + if present)
        const cleanPhone = phone.replace(/\+/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }

    /**
     * Format notification message for vehicle owner
     */
    formatMessage(reason: string, vehicleInfo: { carModel: string; carRegistration: string }): string {
        const messages: Record<string, string> = {
            'wrong_parking': `🚗 Someone scanned your QR code!\n\n*Reason:* Wrong Parking\n*Vehicle:* ${vehicleInfo.carModel} (${vehicleInfo.carRegistration})\n\nPlease check your vehicle location.`,
            'emergency': `🚨 EMERGENCY ALERT!\n\n*Vehicle:* ${vehicleInfo.carModel} (${vehicleInfo.carRegistration})\n\nSomeone needs to contact you urgently about your vehicle.`,
            'accident': `⚠️ Vehicle Incident Alert\n\n*Reason:* Accident Reported\n*Vehicle:* ${vehicleInfo.carModel} (${vehicleInfo.carRegistration})\n\nPlease contact immediately.`,
            'blocking': `🚧 Your vehicle is blocking\n\n*Vehicle:* ${vehicleInfo.carModel} (${vehicleInfo.carRegistration})\n\nKindly move your vehicle.`,
            'other': `📱 Someone scanned your vehicle QR code\n\n*Vehicle:* ${vehicleInfo.carModel} (${vehicleInfo.carRegistration})\n\nPlease check.`,
        };

        return messages[reason] || messages['other'];
    }

    /**
     * Get current notification mode for UI display
     */
    getNotificationMode(): 'api' | 'sms' | 'link' {
        if (process.env.WA_API_KEY && process.env.WA_API_URL) {
            return 'api';
        }
        if (process.env.SMS_GATEWAY_KEY && process.env.SMS_GATEWAY_URL) {
            return 'sms';
        }
        return 'link';
    }
}

export const notificationService = new NotificationService();
