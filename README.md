# Antigravity QR - Vehicle Emergency Contact System 🚗

A production-ready, WhatsApp-first emergency contact system for vehicles in Pakistan. Built with Next.js, Neon PostgreSQL, and optimized for low-bandwidth environments.

## 🌟 Features

- **Unified QR Routing**: Single entry point automatically routes to activation or scanner flow
- **Pakistan-Optimized**: Phone number validation for +92/03xx formats, major cities list
- **Hybrid Notifications**: WhatsApp API → SMS → wa.me link fallbacks
- **Privacy-First**: Phone numbers never exposed in frontend or URLs
- **Rate Limiting**: Built-in protection against spam (5 requests per 15 min)
- **Mobile-First Design**: Beautiful, responsive UI with glassmorphism and gradients
- **No App Required**: 100% web-based solution

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database account ([neon.tech](https://neon.tech))
- Optional: WhatsApp Business API credentials
- Optional: Pakistani SMS Gateway API key

### Installation

1. **Clone and install dependencies:**
```bash
cd C:\Users\DELL\.gemini\antigravity\scratch\antigravity-qr
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example file
copy .env.example .env.local

# Edit .env.local with your actual values
```

Required variables:
```env
DATABASE_URL=your_neon_database_connection_string
ENCRYPTION_KEY=your_32_character_encryption_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional API variables (system works without these):
```env
WA_API_KEY=your_whatsapp_api_key
WA_API_URL=your_whatsapp_api_endpoint
SMS_GATEWAY_KEY=your_sms_gateway_key
SMS_GATEWAY_URL=your_sms_gateway_endpoint
```

3. **Set up the database:**
```bash
# Connect to your Neon database and run the schema
# You can use the Neon web console or psql
psql your_neon_database_url -f lib/schema.sql
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
antigravity-qr/
├── app/
│   ├── api/
│   │   ├── activate/route.ts      # Vehicle activation endpoint
│   │   ├── check/[code]/route.ts  # Code status check
│   │   └── notify/[code]/route.ts # Notification delivery
│   ├── activate/page.tsx          # Activation form
│   ├── qr/[code]/page.tsx         # Unified QR handler
│   ├── scan/[code]/page.tsx       # Scanner flow
│   ├── success/page.tsx           # Success confirmation
│   └── page.tsx                   # Landing page
├── lib/
│   ├── db.ts                      # Neon database client
│   ├── utils.ts                   # Utility functions
│   └── schema.sql                 # Database schema
├── services/
│   └── notifier.ts                # Hybrid notification service
└── .env.example                   # Environment template
```

## 🔄 User Flow

### 1. Activation Flow (New Vehicle)
```
Scan QR → /qr/CODE → Check DB → Redirect to /activate?code=CODE
→ Fill form (name, phone, address, car details)
→ Submit → Update DB → /success
```

### 2. Scanner Flow (Active Vehicle)
```
Scan QR → /qr/CODE → Check DB → Redirect to /scan/CODE
→ Select reason + optional location
→ Notify → Hybrid notification (API/SMS/Link)
→ Show result with fallback if needed
```

## 🗄️ Database Schema

The system uses four main tables:

- **`activation_codes`**: Pre-generated QR codes with activation status
- **`vehicles`**: Vehicle and owner information (encrypted phone numbers)
- **`notifications`**: Log of all notifications sent
- **`rate_limits`**: IP-based rate limiting

See `lib/schema.sql` for the complete schema.

## 🔔 Notification System

The hybrid notification service tries methods in this order:

1. **WhatsApp Business API** (if `WA_API_KEY` is set)
2. **SMS Gateway** (if `SMS_GATEWAY_KEY` is set)
3. **wa.me Link Fallback** (always works)

The system gracefully handles failures and provides appropriate UI feedback.

### Integrating SMS Gateway

To integrate a Pakistani SMS provider (Veo, ShortCode, CreativeSms):

1. Update `services/notifier.ts` in the `sendViaSMS()` method
2. Add your provider's API endpoint and authentication
3. Set environment variables

Example for a generic provider:
```typescript
private async sendViaSMS(phone: string, message: string) {
  const response = await fetch(process.env.SMS_GATEWAY_URL!, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SMS_GATEWAY_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: phone,
      message: message,
      from: 'Antigravity'
    })
  });
  return { success: response.ok };
}
```

## 🎨 Customization

### Adding More Cities
Edit `lib/utils.ts` and add to the `PAKISTAN_CITIES` array.

### Adding Notification Reasons
Edit `lib/utils.ts` and add to the `NOTIFICATION_REASONS` array with icon and label.

### Changing Colors/Theme
Update Tailwind classes in components. The current theme uses:
- Primary: Emerald/Green (`emerald-500`, `green-600`)
- Secondary: Blue (`blue-500`, `blue-600`)
- Gradients: `from-emerald-500 to-blue-600`

## 📱 Mobile Optimization

The entire application is mobile-first with:
- Touch-friendly buttons (min 44px tap targets)
- Responsive breakpoints (`sm:`, `md:`, `lg:`)
- Glassmorphism effects (`backdrop-blur-lg`)
- Optimized for 375px viewports (iPhone SE)

## 🔒 Security Features

- **Phone Privacy**: Numbers stored encrypted, never exposed
- **Rate Limiting**: 5 requests per IP per 15 minutes
- **HTTPS Only**: Enforce in production
- **Input Validation**: Server-side validation on all endpoints
- **SQL Injection Protection**: Using parameterized queries

## 🚢 Deployment

### Recommended Setup

- **Frontend**: Vercel (automatic deployment from GitHub)
- **Database**: Neon (serverless PostgreSQL)
- **Domain**: antigravity.pk (or your preferred domain)

### Deployment Steps

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy!**

## 📊 Testing

### Manual Testing Checklist

- [ ] Scan new QR code → Should redirect to activation
- [ ] Fill activation form → Should create vehicle record
- [ ] Scan same QR → Should redirect to scanner flow
- [ ] Select reason and notify → Should receive notification or fallback link
- [ ] Try 6 consecutive notifications → Should rate limit after 5

### Test Codes

The schema includes test codes:
- `TEST123`
- `DEMO456`
- `PKR789`

Access them at: `http://localhost:3000/qr/TEST123`

## 🐛 Troubleshooting

**"Invalid activation code" error:**
- Ensure database is set up and test codes are inserted
- Check `DATABASE_URL` in `.env.local`

**"Module not found @neondatabase/serverless":**
- Run `npm install @neondatabase/serverless`

**Phone validation fails:**
- Use format: +923001234567 or 03001234567
- Ensure 10 digits after country code

**Notifications not working:**
- Check if API keys are set (optional)
- System will fallback to wa.me links automatically
- Check browser console for errors

## 📝 License

Proprietary - © 2026 Antigravity QR

## 🤝 Support

For issues, questions, or feature requests, contact your development team.

---

**Built with ❤️ for Pakistan 🇵🇰**
