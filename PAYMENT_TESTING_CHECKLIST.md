# 🎯 NDC Payment Flow - Quick Testing Checklist

## Before You Start
- [ ] Backend running: `php artisan serve` (port 8000)
- [ ] Frontend running: `npm run dev` (port 3000)
- [ ] Browser console open (F12) to see debug logs
- [ ] Admin panel ready: `http://127.0.0.1:8000/admin`

---

## Test Scenario: Complete Booking to Payment

### 1. Booking Flow (Frontend)
**🔗 URL:** `http://localhost:3000/en/ndc-flights`

- [ ] Page loads with gold theme
- [ ] Search flights form visible
- [ ] Can fill: Origin, Destination, Date, Passengers
- [ ] Click "Search" (simulated results show)
- [ ] Select a flight option
- [ ] Click "Continue" to bundle selection
- [ ] Select a cabin class
- [ ] Click "Confirm Selection" → redirects to `/en/ndc-flights/booking`

### 2. Passenger Information (Frontend)
**🔗 URL:** `http://localhost:3000/en/ndc-flights/booking`

- [ ] Booking summary shows selected flight
- [ ] Form fields: First Name, Last Name, Email, Phone, DOB, Passport
- [ ] Enter passenger details:
  ```
  First Name: Test
  Last Name: User
  Email: test@example.com
  Phone: +966501234567
  DOB: 1990-01-01
  Passport: A123456789
  ```
- [ ] Click "Continue to Payment" → redirects to `/en/ndc-flights/pay`
- [ ] Check console: `localStorage` has `passengers` key

### 3. Payment Page (Frontend)
**🔗 URL:** `http://localhost:3000/en/ndc-flights/pay`

**Visual Checks:**
- [ ] Gold theme styling applied
- [ ] "TilalRimal" logo visible at top
- [ ] Right sidebar shows booking summary:
  - Flight route (e.g., "JED → LHR")
  - Departure date and time
  - Cabin class
  - **Total Amount (SAR)**
- [ ] Moyasar payment form visible
- [ ] **NO "Powered by Moyasar" text at bottom** ✅ (should be hidden)
- [ ] **NO "Test Mode Enabled" warning** ✅ (should be hidden)
- [ ] Hold timer showing countdown (e.g., "15:30 remaining")

**Payment Form Fields:**
- [ ] Card Number field visible
- [ ] Expiry Date field visible
- [ ] CVV field visible
- [ ] Cardholder Name field visible
- [ ] Payment method tabs (Credit Card, MADA, STC Pay)
- [ ] "Pay" button enabled

**Console Checks** (F12 → Console):
- [ ] ✅ `💳 Starting Moyasar initialization for amount: 1282`
- [ ] ✅ `✅ Script loaded, window.Moyasar = true`
- [ ] ✅ `🎯 Calling Moyasar.init()...`
- [ ] ✅ `✅ Moyasar.init() successful`
- [ ] **NO errors** (no "Callback URL is invalid" or red errors)

### 4. Complete Payment (Moyasar)
**Test Card:** `4111111111111111`

- [ ] Click Card Number field
- [ ] Enter: `4111 1111 1111 1111`
- [ ] Click Expiry field
- [ ] Enter: `12/28` (any future date)
- [ ] Click CVV field  
- [ ] Enter: `123`
- [ ] Click Cardholder Name field
- [ ] Enter: `Test User`
- [ ] Click "Pay" button
- [ ] Moyasar form processes (might show loading)
- [ ] Form submits successfully

**Console Output Expected:**
- [ ] ✅ `✅ Payment completed: {id, amount, status, ...}`
- [ ] ✅ `📋 Stored booking confirmation data`
- [ ] ✅ `✅ Confirmation response: {success: true, ...}`

### 5. Confirmation Page (Frontend)
**🔗 URL:** `http://localhost:3000/en/ndc-flights/confirmation?order_ref=...&payment_id=...`

**Should See:**
- [ ] Success icon / green checkmark
- [ ] "Booking Confirmed!" heading
- [ ] **Order Reference:** Shows order ID (e.g., `ORD-123456`)
- [ ] **PNR:** Shows airline confirmation (e.g., `AIRLINE-ABC1000`)
- [ ] **Ticket Number:** Displays ticket (e.g., `AIRLINE-ABC1000`)
- [ ] **Flight Details:** Route, dates, times
- [ ] **Passenger Info:** Name with assigned ticket number
- [ ] **Total Paid:** Shows amount in SAR
- [ ] "Print Ticket" button enabled
- [ ] "Return Home" button enabled

**Console Checks:**
- [ ] No errors
- [ ] `localStorage` has `bookingConfirmation` with ticket data

---

## Admin Dashboard Verification

**🔗 URL:** `http://127.0.0.1:8000/admin`

### Login
- [ ] Username: `superadmin@tilalr.com`
- [ ] Password: `superadmin123`
- [ ] Click "Login"
- [ ] Dashboard loads with navigation menu

### View Booking
- [ ] Click **"Flight Bookings"** or similar in menu
- [ ] Click **"NDC Bookings"** or **"NDC Orders"**
- [ ] List page loads showing all bookings
- [ ] Your test booking appears in the list with:
  - [ ] ✅ **Order Reference** (matches confirmation page)
  - [ ] ✅ **PNR** (matches confirmation page)
  - [ ] ✅ **Status Badge: "TICKETED"** (green color)
  - [ ] ✅ **Created Date** (today)
  - [ ] ✅ **Amount** (matches payment amount in SAR)

### View Booking Details
- [ ] Click on the booking row
- [ ] Detail page opens showing:
  - [ ] Order reference
  - [ ] PNR and status
  - [ ] **Passengers section:** Shows passenger name
  - [ ] **Ticket Number** assigned to passenger
  - [ ] **Payment Information:**
    - [ ] Moyasar Payment ID (matches console)
    - [ ] Amount paid
    - [ ] Status: "paid" or "completed"
  - [ ] **Flight Details:** Full flight information
  - [ ] **Booking Timeline:** Status history

---

## Database Verification (Optional)

### Check MySQL Records

**Connect to Database:**
```sql
USE your_database_name;
```

**Check Orders Table:**
```sql
SELECT order_reference, airline_pnr, booking_status, total_amount 
FROM ndc_orders 
ORDER BY created_at DESC 
LIMIT 1;
```
**Expected Output:**
| order_reference | airline_pnr | booking_status | total_amount |
|---|---|---|---|
| ORD-XXXXXX | AIRLINE-XXXXXX | TICKETED | 1282 |

**Check Passengers Table:**
```sql
SELECT first_name, last_name, ticket_number 
FROM ndc_passengers 
WHERE ndc_order_id = (SELECT id FROM ndc_orders ORDER BY created_at DESC LIMIT 1);
```
**Expected Output:**
| first_name | last_name | ticket_number |
|---|---|---|
| Test | User | AIRLINE-XXXXXX |

**Check Payments Table:**
```sql
SELECT moyasar_payment_id, amount, status 
FROM ndc_payments 
WHERE ndc_order_id = (SELECT id FROM ndc_orders ORDER BY created_at DESC LIMIT 1);
```
**Expected Output:**
| moyasar_payment_id | amount | status |
|---|---|---|
| pay_XXXXXX | 1282 | paid |

---

## 🔴 If Something Goes Wrong

### Error: "Callback URL is invalid"
- **Status:** ✅ FIXED
- **Solution:** This error has been removed. If you see it, clear browser cache and reload.

### Error: "Moyasar form blank"
- **Check:** Browser dev tools → Network tab
- **Look for:** Moyasar script loading (should see 200 OK)
- **Try:** Hard refresh (Ctrl+Shift+R)

### Payment success but no confirmation
- **Check:** Backend logs: `storage/logs/laravel.log`
- **Look for:** Error messages around confirmBooking
- **Fix:** Ensure `API_BASE` in pay/page.jsx matches your backend URL

### Booking not in admin dashboard
- **Check:** Admin panel → NDC Bookings → Refresh page
- **Try:** Log out and back in
- **Check:** Database directly with SQL query above
- **Debug:** Look at Laravel logs for database errors

### Ticket numbers not showing
- **Check:** Did confirmation endpoint return `success: true`?
- **Verify:** `ndc_passengers` table has `ticket_number` populated
- **Try:** Clear localStorage and redo payment flow

---

## ✅ Success Criteria

**All of these should be TRUE:**

- [ ] ✅ Payment page loads without errors
- [ ] ✅ No "Powered by Moyasar" text visible
- [ ] ✅ No "Test Mode Enabled" warning visible
- [ ] ✅ Moyasar form accepts test card
- [ ] ✅ Console shows "Payment completed" message
- [ ] ✅ Confirmation endpoint returns success
- [ ] ✅ Confirmation page shows all details
- [ ] ✅ Admin dashboard shows booking with TICKETED status
- [ ] ✅ Ticket numbers visible in admin
- [ ] ✅ Database has all records with correct status

---

## 📱 Test Cards for Moyasar

| Scenario | Card Number | Result |
|----------|-------------|--------|
| **Success** | 4111111111111111 | ✅ Payment succeeds |
| **Decline** | 4000000000000002 | ❌ Payment fails |
| **AMEX** | 3782822463100005 | ✅ Works (use 4 digit CVV) |
| MADA | Variable | Use MADA payment method |
| **Expiry** | Any future date | |
| **CVV** | Any 3-4 digits | |

---

## 🎯 Summary

When this checklist is 100% complete with all boxes checked ✅, you have:

✅ End-to-end payment flow working
✅ Clean, branded payment page
✅ Secure payment processing
✅ Database persistence
✅ Admin dashboard visibility
✅ Professional confirmation flow

**System Status: Production Ready** 🚀

---

**Need help?** Check the logs in:
- Frontend: Browser DevTools (F12 → Console)
- Backend: `storage/logs/laravel.log`
- Database: Can query directly with MySQL client

**Last Updated:** March 4, 2026
