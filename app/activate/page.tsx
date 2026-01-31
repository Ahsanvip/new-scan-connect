'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { validatePakistanPhone, PAKISTAN_CITIES } from '@/lib/utils';

function ActivatePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code') || '';

    const [formData, setFormData] = useState({
        ownerName: '',
        whatsapp: '',
        address: '',
        carRegistration: '',
        carModel: '',
        city: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);

    const handlePhoneChange = (value: string) => {
        setFormData({ ...formData, whatsapp: value });
        const validation = validatePakistanPhone(value);
        setPhoneValid(validation.valid);
        if (!validation.valid && value.length > 5) {
            setErrors({ ...errors, whatsapp: validation.error || '' });
        } else {
            const newErrors = { ...errors };
            delete newErrors.whatsapp;
            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        // Validate all fields
        const newErrors: Record<string, string> = {};

        if (!formData.ownerName.trim()) {
            newErrors.ownerName = 'Owner name is required';
        }

        const phoneValidation = validatePakistanPhone(formData.whatsapp);
        if (!phoneValidation.valid) {
            newErrors.whatsapp = phoneValidation.error || 'Invalid phone number';
        }

        if (!formData.carRegistration.trim()) {
            newErrors.carRegistration = 'Car registration is required';
        }

        if (!formData.carModel.trim()) {
            newErrors.carModel = 'Car model is required';
        }

        if (!formData.city) {
            newErrors.city = 'Please select a city';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code.toUpperCase(),
                    ...formData,
                    whatsapp: phoneValidation.formatted,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                router.push(`/success?code=${code}`);
            } else {
                setErrors({ submit: data.error || 'Activation failed' });
                setIsSubmitting(false);
            }
        } catch (error) {
            setErrors({ submit: 'Network error. Please try again.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-8">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Activate Your QR Code</h1>
                    <p className="text-gray-600">Code: <span className="font-mono font-semibold text-emerald-600">{code}</span></p>
                </div>

                {/* Activation Form */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Owner Name */}
                        <div>
                            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                                Owner Name *
                            </label>
                            <input
                                type="text"
                                id="ownerName"
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                                placeholder="Muhammad Ali"
                            />
                            {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp Number *
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    id="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${phoneValid ? 'border-green-500' : 'border-gray-300'
                                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900`}
                                    placeholder="+92 300 1234567"
                                />
                                {phoneValid && (
                                    <div className="absolute right-3 top-3.5 text-green-500">✓</div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Format: +923001234567 or 03001234567</p>
                            {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                                placeholder="Street address (optional)"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                            </label>
                            <select
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                            >
                                <option value="">Select your city</option>
                                {PAKISTAN_CITIES.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        {/* Car Registration */}
                        <div>
                            <label htmlFor="carRegistration" className="block text-sm font-medium text-gray-700 mb-2">
                                Car Registration Number *
                            </label>
                            <input
                                type="text"
                                id="carRegistration"
                                value={formData.carRegistration}
                                onChange={(e) => setFormData({ ...formData, carRegistration: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-mono text-gray-900"
                                placeholder="ABC-123"
                            />
                            {errors.carRegistration && <p className="text-red-500 text-sm mt-1">{errors.carRegistration}</p>}
                        </div>

                        {/* Car Model */}
                        <div>
                            <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-2">
                                Car Model *
                            </label>
                            <input
                                type="text"
                                id="carModel"
                                value={formData.carModel}
                                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900"
                                placeholder="Toyota Corolla 2020"
                            />
                            {errors.carModel && <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>}
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Activating...
                                </span>
                            ) : (
                                'Activate QR Code'
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Footer */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <p className="text-sm text-blue-800">
                        <span className="font-semibold">💡 Note:</span> Your WhatsApp number will remain private.
                        Only people who scan your QR code can contact you, without seeing your number.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ActivatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mb-4">
                        <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <ActivatePageContent />
        </Suspense>
    );
}
