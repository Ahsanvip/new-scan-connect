import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Check environment variable
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                success: false,
                error: 'DATABASE_URL environment variable is NOT defined'
            }, { status: 500 });
        }

        // 2. Test Connection
        const startTime = Date.now();
        const result = await db.testConnection();
        const duration = Date.now() - startTime;

        if (result) {
            return NextResponse.json({
                success: true,
                message: 'Database connected successfully',
                duration: `${duration}ms`,
                env_var_length: process.env.DATABASE_URL.length // Safe logging (don't show full secret)
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'Database query returned empty result'
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Debug DB Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            details: JSON.stringify(error)
        }, { status: 500 });
    }
}
