# 💳 Moyasar Payment Integration Guide

## 📋 Overview

This guide covers the complete Moyasar payment integration for the Tilal Rimal booking system.

**Moyasar** is a Saudi Arabia payment gateway that supports:
- ✅ Credit Cards (Visa, Mastercard)
- ✅ Mada (Saudi debit cards)
- ✅ Apple Pay
- ✅ STC Pay

---

## 🔑 API Keys Configuration

### Where to Get Your Keys

1. **Create Account**: Go to [https://moyasar.com](https://moyasar.com) and sign up
2. **Dashboard**: After login, go to **Settings → API Keys**
3. **Keys**: You'll get:
   - **Publishable Key** (`pk_test_...` or `pk_live_...`) - Used in frontend
   - **Secret Key** (`sk_test_...` or `sk_live_...`) - Used in backend

### Test vs Live Mode

| Environment | Publishable Key Prefix | Secret Key Prefix |
|-------------|------------------------|-------------------|
| **Test/Sandbox** | `pk_test_` | `sk_test_` |
| **Production/Live** | `pk_live_` | `sk_live_` |

---

## ⚙️ Environment Setup

### Backend (.env) - Laravel

Add these to your `c:\xampp\htdocs\tilrimal-backend\.env`:

```env
# ================================
# MOYASAR PAYMENT CONFIGURATION
# ================================

# For TESTING (current default)
MOYASAR_PUBLISHABLE_KEY=pk_test_vcFUHJDBwiyRu4Bd3hFuPpThb6Zf2eMn8wGzxHJ
MOYASAR_SECRET_KEY=sk_test_vcFUHJDBwiyRu4Bd3hFuPpThb6Zf2eMn8wGzxHJ
MOYASAR_TEST_MODE=true

# For PRODUCTION (when going live - replace with your real keys)
# MOYASAR_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
# MOYASAR_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
# MOYASAR_TEST_MODE=false

# Default payment gateway
PAYMENT_GATEWAY=moyasar
```

### Frontend (.env.local) - Next.js

The frontend uses the publishable key from the backend API response. No additional config needed!

---

## 🧪 Test Cards (Sandbox Mode)

Use these cards when testing with `pk_test_` keys:

### Successful Payments

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| **Visa** | 4111 1111 1111 1111 | 123 | Any future date |
| **Mastercard** | 5555 5555 5555 4444 | 123 | Any future date |
| **Mada** | 4464 0400 0000 0007 | 123 | Any future date |
| **Amex** | 3434 3434 3434 343 | 1234 | Any future date |

### 3D Secure Test
- All test cards will pass 3D Secure verification automatically

### Failed Payment Test
- CVV `041` → Simulates "Insufficient Funds" (Error code 41)

---

## 🔄 Payment Flow

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   User selects  │      │   Backend API    │      │    Moyasar      │
│   Moyasar       │──────│  /payments/init  │──────│    Servers      │
│   gateway       │      │                  │      │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
         │                        │                        │
         │   1. Click Pay         │                        │
         │────────────────────────►                        │
         │                        │                        │
         │   2. Return Moyasar    │                        │
         │      Config            │                        │
         ◄────────────────────────│                        │
         │                        │                        │
         │   3. Load Moyasar.js   │                        │
         │      Form              │                        │
         │                        │                        │
         │   4. User enters       │                        │
         │      card details      │                        │
         │────────────────────────────────────────────────►
         │                        │                        │
         │   5. Payment processed │                        │
         │      via webhook       │                        │
         │                        ◄────────────────────────│
         │                        │                        │
         │   6. Show success      │                        │
         ◄────────────────────────│                        │
```

---

## 📁 Files Modified

### Backend (Laravel)

| File | Purpose |
|------|---------|
| `config/services.php` | Moyasar configuration |
| `app/Http/Controllers/Api/PaymentController.php` | Payment processing |
| `.env` | API keys storage |

### Frontend (Next.js)

| File | Purpose |
|------|---------|
| `app/[lang]/payment/page.jsx` | Payment form with Moyasar SDK |

---

## 🚀 Going Live Checklist

Before switching to production:

- [ ] Create Moyasar business account (requires business verification)
- [ ] Complete KYC (Know Your Customer) verification
- [ ] Replace `pk_test_` with `pk_live_` key
- [ ] Replace `sk_test_` with `sk_live_` key
- [ ] Set `MOYASAR_TEST_MODE=false`
- [ ] Configure webhook URLs in Moyasar dashboard
- [ ] Test with real card (small amount)
- [ ] Enable SSL/HTTPS on your domain

---

## 🔔 Webhook Configuration

### Moyasar Dashboard Settings

1. Go to **Settings → Webhooks** in Moyasar dashboard
2. Add webhook URL: `https://your-domain.com/api/payments/webhook/moyasar`
3. Select events: `payment.paid`, `payment.failed`

### Backend Webhook Handler

The webhook is already configured in:
```
Route: POST /api/payments/webhook/moyasar
Controller: PaymentController@moyasarWebhook
```

---

## 🛠 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API Key" | Check `MOYASAR_PUBLISHABLE_KEY` in `.env` |
| Form not loading | Check if Moyasar.js is loaded (browser console) |
| Payment stuck | Check Laravel logs: `storage/logs/laravel.log` |
| Webhook not working | Verify webhook URL in Moyasar dashboard |

### Debug Mode

Enable debug logging in Laravel:
```php
Log::info('Moyasar payment initiated', $request->all());
```

---

## 📞 Support

- **Moyasar Support**: support@moyasar.com
- **Moyasar Docs**: https://moyasar.com/docs
- **Help Desk**: https://help.moyasar.com

---

## 📜 Terms & Conditions

When using Moyasar, you agree to:

1. **PCI-DSS Compliance**: Card data is handled by Moyasar (PCI Level 1)
2. **Refund Policy**: Refunds processed within 5-7 business days
3. **Transaction Fees**: Check your Moyasar contract for fees
4. **Settlement**: Funds settled to your bank account per agreement
5. **Chargebacks**: You're responsible for disputing chargebacks

---

## ✅ Quick Test

1. Start backend: `cd tilrimal-backend && php artisan serve`
2. Start frontend: `cd tilrimal-frontend && npm run dev`
3. Create a booking at: http://localhost:3000/ar
4. Go to payment page
5. Select "Moyasar" gateway
6. Use test card: `4111 1111 1111 1111`
7. CVV: `123`, Expiry: Any future date
8. Payment should succeed! ✅

---

**Last Updated**: January 2026
**Version**: 1.0
