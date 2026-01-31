'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qrCode, setQrCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for error parameters
  const error = searchParams.get('error');
  const errorCode = searchParams.get('code');

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrCode.trim()) {
      setIsSubmitting(true);
      router.push(`/qr/${qrCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="inline-block p-6 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl mb-8 shadow-xl">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Antigravity QR
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Vehicle Emergency Contact System for Pakistan
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Get WhatsApp notifications when someone needs to contact you about your vehicle.
            No app required. Privacy-first. Pakistan-optimized.
          </p>

          {/* Error Messages */}
          {error && (
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                      {error === 'invalid_code' && 'Invalid QR Code'}
                      {error === 'missing_code' && 'QR Code Required'}
                      {error === 'server_error' && 'Server Error'}
                    </h3>
                    <p className="text-sm text-red-700">
                      {error === 'invalid_code' && (
                        <>
                          The code <span className="font-mono font-bold">{errorCode || 'provided'}</span> doesn't exist in our system. Please check your code and try again.
                        </>
                      )}
                      {error === 'missing_code' && 'Please enter your QR code below to continue.'}
                      {error === 'server_error' && 'Unable to connect to the database. Please try again later.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Input Form */}
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleActivate} className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
              <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Enter Your QR Code
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="qrCode"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="e.g., TEST123"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-900 font-mono uppercase"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!qrCode.trim() || isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? '...' : 'Go →'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-left">
                Or scan your QR code to be directed automatically
              </p>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="#features"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border border-gray-200"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Privacy Protected
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No App Required
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Instant WhatsApp Alerts
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Activate Your Code</h3>
              <p className="text-gray-600">
                Register your vehicle details and WhatsApp number. Your QR code becomes active instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Display QR Code</h3>
              <p className="text-gray-600">
                Place the QR code sticker on your vehicle's windshield where it's easily visible.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Notified</h3>
              <p className="text-gray-600">
                Receive instant WhatsApp notifications when someone needs to contact you about your vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Antigravity?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start p-4 bg-white/70 backdrop-blur-lg rounded-xl border border-gray-200">
              <span className="text-3xl mr-4">🔒</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Complete Privacy</h4>
                <p className="text-sm text-gray-600">Your phone number never appears publicly. Only authorized messages reach you.</p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-white/70 backdrop-blur-lg rounded-xl border border-gray-200">
              <span className="text-3xl mr-4">⚡</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Instant Notifications</h4>
                <p className="text-sm text-gray-600">Get WhatsApp alerts in real-time when someone scans your QR code.</p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-white/70 backdrop-blur-lg rounded-xl border border-gray-200">
              <span className="text-3xl mr-4">📱</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">No App Needed</h4>
                <p className="text-sm text-gray-600">Works directly in the browser. Scanners don't need any app either.</p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-white/70 backdrop-blur-lg rounded-xl border border-gray-200">
              <span className="text-3xl mr-4">🇵🇰</span>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Built for Pakistan</h4>
                <p className="text-sm text-gray-600">Optimized for Pakistani phone numbers and low-bandwidth connections.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <p className="text-sm">© 2026 Antigravity QR. Privacy-first vehicle contact system for Pakistan.</p>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
