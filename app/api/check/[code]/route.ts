import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/check/[code]
 * Check if an activation code is active or inactive
 */
export async function GET(
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

        const codeData = await db.getCodeStatus(code.toUpperCase());

        if (!codeData) {
            return NextResponse.json(
                { error: 'Invalid activation code' },
                { status: 404 }
            );
        }

        // If code is used and active, direct to scanner flow
        if (codeData.used && codeData.is_active) {
            return NextResponse.json({
                status: 'active',
                target: `/scan/${code}`,
            });
        }

        // If code is not used, direct to activation flow
        return NextResponse.json({
            status: 'inactive',
            target: `/activate?code=${code}`,
        });
    } catch (error) {
        console.error('Error checking code:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
