import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

/**
 * Unified QR Entry Point: /qr/[code]
 * Routes to either activation or scanner flow based on code status
 */
export default async function QRPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    try {
        const codeData = await db.getCodeStatus(upperCode);

        if (!codeData) {
            // Invalid code - redirect to error page
            redirect(`/?error=invalid_code`);
        }

        // If code is active, redirect to scanner flow
        if (codeData.used && codeData.is_active) {
            redirect(`/scan/${upperCode}`);
        }

        // If code is inactive, redirect to activation flow
        redirect(`/activate?code=${upperCode}`);
    } catch (error) {
        // Re-throw Next.js redirect errors (they use throw internally)
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }

        console.error('Error processing QR code:', error);
        redirect(`/?error=server_error`);
    }
}
