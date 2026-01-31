import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ActivatePageClient from './ActivatePageClient';

/**
 * Server component wrapper to validate code exists before showing activation form
 */
export default async function ActivatePage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>;
}) {
    const params = await searchParams;
    const code = params.code?.toUpperCase() || '';

    // If no code provided, show error
    if (!code) {
        redirect('/?error=missing_code');
    }

    try {
        // Check if code exists in database
        const codeData = await db.getCodeStatus(code);

        if (!codeData) {
            // Code doesn't exist - show invalid code error
            redirect(`/?error=invalid_code&code=${code}`);
        }

        if (codeData.used && codeData.is_active) {
            // Code already activated - redirect to scanner
            redirect(`/scan/${code}`);
        }

        // Code exists and is not activated - show activation form
        return <ActivatePageClient code={code} />;
    } catch (error) {
        // Re-throw Next.js redirect errors
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }

        console.error('Error checking code:', error);
        // If database not configured, allow activation anyway
        return <ActivatePageClient code={code} />;
    }
}
