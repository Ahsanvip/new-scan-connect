'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessPageContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get('code') || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8 flex items-center justify-center">
            <div className="max-w-lg mx-auto">
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
                    {/* Success Icon */}
                    <div className="inline-block p-5 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">QR Code Activated! 🎉</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Your vehicle is now protected with emergency contact access.
                    </p>

                    {/* Code Display */}
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl mb-6">
                        <p className="text-sm text-emerald-700 font-medium mb-1">Activation Code</p>
                        <p className="text-2xl font-mono font-bold text-emerald-600">{code}</p>
                    </div>

                    {/* What's Next */}
                    <div className="text-left space-y-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">What happens next?</h2>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">🚗</span>
                                <div>
                                    <p className="font-medium text-gray-900">Place your QR code</p>
                                    <p className="text-sm text-gray-600">Display it visibly in your vehicle window</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">📱</span>
                                <div>
                                    <p className="font-medium text-gray-900">Receive notifications</p>
                                    <p className="text-sm text-gray-600">Get instant WhatsApp alerts when someone scans</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-2xl mr-3">🔒</span>
                                <div>
                                    <p className="font-medium text-gray-900">Stay private</p>
                                    <p className="text-sm text-gray-600">Your number remains hidden from public view</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                        >
                            Return to Home
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="block w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                        >
                            Print QR Code
                        </button>
                    </div>

                    {/* Privacy Note */}
                    <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-xs text-blue-700">
                            💡 Your information is encrypted and secure. Only authorized scanners can contact you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
                        <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}
