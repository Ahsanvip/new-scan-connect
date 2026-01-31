'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { NOTIFICATION_REASONS } from '@/lib/utils';

export default function ScanPage() {
    const params = useParams();
    const code = params.code as string;

    const [selectedReason, setSelectedReason] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        method?: string;
        fallback_url?: string;
        message?: string;
    } | null>(null);
    const [useLocation, setUseLocation] = useState(false);
    const [coords, setCoords] = useState<string>('');

    const handleLocationToggle = () => {
        if (!useLocation) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCoords(`${position.coords.latitude},${position.coords.longitude}`);
                        setUseLocation(true);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        alert('Could not get your location. Continuing without location.');
                    }
                );
            }
        } else {
            setUseLocation(false);
            setCoords('');
        }
    };

    const handleNotify = async () => {
        if (!selectedReason) {
            alert('Please select a reason');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/notify/${code}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reason: selectedReason,
                    custom_message: customMessage,
                    scanner_coords: useLocation ? coords : undefined,
                }),
            });

            const data = await response.json();

            if (response.status === 429) {
                setResult({
                    success: false,
                    message: 'Too many requests. Please try again later (15 min cooldown).',
                });
            } else {
                setResult(data);
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'Network error. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 py-8">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Vehicle Owner</h1>
                    <p className="text-gray-600">Select a reason to notify the owner</p>
                </div>

                {!result ? (
                    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-6 space-y-6">
                        {/* Reason Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Why are you contacting the owner? *
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {NOTIFICATION_REASONS.map((reason) => (
                                    <button
                                        key={reason.value}
                                        type="button"
                                        onClick={() => setSelectedReason(reason.value)}
                                        className={`flex items-center p-4 rounded-xl border-2 transition-all ${selectedReason === reason.value
                                                ? 'border-emerald-500 bg-emerald-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-2xl mr-3">{reason.icon}</span>
                                        <span className={`font-medium ${selectedReason === reason.value ? 'text-emerald-700' : 'text-gray-700'
                                            }`}>
                                            {reason.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optional Custom Message */}
                        {selectedReason === 'other' && (
                            <div>
                                <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Message (Optional)
                                </label>
                                <textarea
                                    id="customMessage"
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                                    placeholder="Add any additional details..."
                                />
                            </div>
                        )}

                        {/* Location Toggle */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center">
                                <span className="text-xl mr-2">📍</span>
                                <span className="text-sm font-medium text-gray-700">Share my location</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLocationToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useLocation ? 'bg-emerald-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useLocation ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Notify Button */}
                        <button
                            onClick={handleNotify}
                            disabled={isSubmitting || !selectedReason}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Notifying Owner...
                                </span>
                            ) : (
                                '💬 Notify Owner'
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-6">
                        {result.success ? (
                            <div className="text-center space-y-4">
                                <div className="inline-block p-4 bg-green-100 rounded-full mb-2">
                                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Owner Notified!</h2>
                                <p className="text-gray-600">
                                    {result.method === 'whatsapp_api' && '✅ Notification sent via WhatsApp Business API'}
                                    {result.method === 'sms' && '✅ Notification sent via SMS'}
                                </p>
                                <p className="text-sm text-gray-500">The vehicle owner has been informed.</p>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="inline-block p-4 bg-blue-100 rounded-full mb-2">
                                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {result.message || 'Tap to Message Owner'}
                                </h2>
                                {result.fallback_url && (
                                    <>
                                        <p className="text-gray-600">Click the button below to notify via WhatsApp</p>
                                        <a
                                            href={result.fallback_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                                        >
                                            <span className="flex items-center">
                                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                Open WhatsApp
                                            </span>
                                        </a>
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                                            <p className="text-xs text-blue-700">
                                                💡 <strong>Standard Mode:</strong> Using manual WhatsApp link
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setResult(null)}
                            className="w-full mt-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                        >
                            Send Another Notification
                        </button>
                    </div>
                )}

                {/* Info Footer */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <p className="text-sm text-yellow-800">
                        <span className="font-semibold">⚠️ Important:</span> Please use this service responsibly.
                        The owner will receive your selected notification reason.
                    </p>
                </div>
            </div>
        </div>
    );
}
