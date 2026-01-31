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

    // Verify code status (all logic without JSX)
    let isActive = false;

    try {
        const codeData = await db.getCodeStatus(upperCode);

        if (!codeData) {
            // Invalid code - redirect to activation (maybe it needs to be activated)
            redirect(`/activate?code=${upperCode}`);
        }

        if (!codeData.used || !codeData.is_active) {
            // Code not activated yet - redirect to activation
            redirect(`/activate?code=${upperCode}`);
        }

        // Code is valid and active
        isActive = true;
    } catch (error) {
        // Re-throw Next.js redirect errors (they use throw internally)
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }

        console.error('Error verifying code:', error);
        // If database is not configured or error occurs, redirect to activation
        // This allows the app to work even before database setup
        redirect(`/activate?code=${upperCode}`);
    }

    // Return JSX outside try/catch
    if (!isActive) {
        redirect(`/activate?code=${upperCode}`);
    }

    return <ScanPageClient code={upperCode} />;
}
