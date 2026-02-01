# Booking & Dummy Payment Integration (Frontend)

This documents how the frontend integrates with the backend booking/payment APIs.

## Environment
Add to `.env.local` at project root:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Flow
1. User opens a service/product detail page.
2. `BookingForm` component submits booking to `/api/create-booking` (server route in Next.js) which forwards to the backend.
3. On success, frontend calls `/api/process-payment` which triggers a **dummy** payment flow on the backend and returns the result.
4. If payment is `paid`, the booking status on backend becomes `confirmed`.

## Components
- `components/BookingForm.jsx` – a simple client component that demonstrates booking & dummy payment.

## Notes
- For production, set `NEXT_PUBLIC_BACKEND_URL` to your backend's base URL.
- The `simulate` flag can be passed to `/api/process-payment` for deterministic success/failure while testing.
