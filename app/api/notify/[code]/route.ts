import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notificationService } from '@/services/notifier';
import { getClientIp } from '@/lib/utils';

/**
 * POST /api/notify/[code]
 * Send notification to vehicle owner
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        if (!code) {
            return NextResponse.json(
                { error: 'Activation code is required' },
                { status: 400 }
            );
        }

        // Get request body
        const body = await request.json();
        const { reason, scanner_coords } = body;

        if (!reason) {
            return NextResponse.json(
                { error: 'Reason is required' },
                { status: 400 }
            );
        }

        // Rate limiting
        const clientIp = getClientIp(request);
        const rateLimit = await db.checkRateLimit(
            clientIp,
            parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
            parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000')
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    retry_after: '15 minutes',
                },
                { status: 429 }
            );
        }

        // Get vehicle information
        const vehicle = await db.getVehicleByCode(code.toUpperCase());

        if (!vehicle) {
            return NextResponse.json(
                { error: 'Vehicle not found for this code' },
                { status: 404 }
            );
        }

        // Format notification message
        const message = notificationService.formatMessage(reason, {
            carModel: vehicle.car_model,
            carRegistration: vehicle.car_registration,
        });

        // Send notification via hybrid service
        const result = await notificationService.send(
            vehicle.whatsapp,
            message,
            { reason, coords: scanner_coords }
        );

        // Log the notification
        await db.logNotification(
            vehicle.id,
            result.method,
            reason,
            scanner_coords
        );

        // Return appropriate response
        if (result.success) {
            return NextResponse.json({
                success: true,
                method: result.method,
                message: 'Owner notified successfully',
            });
        } else {
            // Return fallback wa.me link
            return NextResponse.json({
                success: false,
                method: result.method,
                fallback_url: result.fallback_url,
                message: 'Using manual notification',
            });
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
