import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ScanPageClient from './ScanPageClient';

/**
 * Server component wrapper to verify vehicle is active
 */
export default async function ScanPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;
    const upperCode = code.toUpperCase();

    try {
        // Check if vehicle exists and is active
        const codeData = await db.getCodeStatus(upperCode);

        if (!codeData) {
            // Invalid code
            redirect(`/?error=invalid_code`);
        }

        if (!codeData.used || !codeData.is_active) {
            // Code not activated yet - redirect to activation
            redirect(`/activate?code=${upperCode}`);
        }

        // Code is valid and active - show scanner flow
        return <ScanPageClient code={upperCode} />;
    } catch (error) {
        console.error('Error verifying code:', error);
        redirect(`/?error=server_error`);
    }
}
