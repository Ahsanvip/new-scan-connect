import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validatePakistanPhone } from '@/lib/utils';

/**
 * POST /api/activate
 * Activate a QR code and register vehicle
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, ownerName, whatsapp, address, carRegistration, carModel, city } = body;

        // Validate required fields
        if (!code || !ownerName || !whatsapp || !carRegistration || !carModel || !city) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        // Validate phone number
        const phoneValidation = validatePakistanPhone(whatsapp);
        if (!phoneValidation.valid) {
            return NextResponse.json(
                { error: phoneValidation.error },
                { status: 400 }
            );
        }

        // Check if code exists and is available
        const codeData = await db.getCodeStatus(code.toUpperCase());
        if (!codeData) {
            return NextResponse.json(
                { error: 'Invalid activation code' },
                { status: 404 }
            );
        }

        if (codeData.used) {
            return NextResponse.json(
                { error: 'This code has already been activated' },
                { status: 400 }
            );
        }

        // Activate the code and create vehicle record
        const result = await db.activateCode(code.toUpperCase(), {
            whatsapp: phoneValidation.formatted!,
            ownerName,
            address,
            carRegistration: carRegistration.toUpperCase(),
            carModel,
            city,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'QR code activated successfully',
                vehicleId: result.vehicleId,
            });
        } else {
            return NextResponse.json(
                { error: result.error || 'Activation failed' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error activating code:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
