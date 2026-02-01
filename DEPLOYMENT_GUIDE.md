# Deployment Guide

## Frontend (frontend.tilalr.com) - Vercel Deployment

### Pre-Deployment Checklist
- [x] `.env.local` updated with production API URL
- [x] `.env.production` created with production settings
- [x] `vercel.json` configured for Next.js
- [x] `next.config.mjs` includes production image domains

### Steps to Deploy on Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure for production deployment"
   git push origin main
   ```

2. **Connect Vercel to GitHub Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub (frontend-test repository)

3. **Configure Environment Variables in Vercel**
   Go to **Settings > Environment Variables** and add:
   ```
   NEXT_PUBLIC_API_URL = https://test.tilalr.com/api
   NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY = pk_test_RkhX8tYa6szipY7w5ZQF33pz5YZAbxa42qqGbmJh
   NEXT_PUBLIC_MOYASAR_TEST_MODE = true
   ```

4. **Configure Custom Domain**
   - Go to **Settings > Domains**
   - Add: `frontend.tilalr.com`
   - Follow Vercel instructions to configure DNS in Hostinger:
     - Add CNAME record: `frontend` → `cname.vercel-dns.com`
     - OR add A record pointing to Vercel IPs

5. **Deploy**
   - Click "Deploy" or push to trigger auto-deploy

---

## Backend (test.tilalr.com) - Hostinger Direct Upload

### Pre-Deployment Checklist
- [x] `.env` updated for production
- [x] `.env.production` created as reference
- [x] CORS configured for frontend.tilalr.com
- [x] Sanctum stateful domains configured

### Files to Upload

Upload these folders/files to `/public_html/test/` on Hostinger:

```
app/
bootstrap/
config/
database/
public/
resources/
routes/
storage/
vendor/
artisan
composer.json
composer.lock
.env (use .env.production content)
```

### Steps to Deploy on Hostinger

1. **Prepare .env for Production**
   - Copy content from `.env.production` to `.env`
   - Verify database credentials match Hostinger MySQL

2. **Upload Files via FTP or File Manager**
   - Connect via FTP (FileZilla) or use Hostinger File Manager
   - Upload to subdomain folder: `/public_html/test/` or the correct subdomain directory

3. **Configure Hostinger Subdomain**
   - In Hostinger panel → Domains → Subdomains
   - Ensure `test.tilalr.com` points to the correct directory
   - Document root should point to `public` folder

4. **Set Permissions**
   ```bash
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
   ```

5. **Run Artisan Commands (via SSH or terminal in Hostinger)**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan migrate --force
   ```

6. **Verify .htaccess** (in public/ folder)
   Ensure it exists and has proper rewrite rules for Laravel.

---

## DNS Configuration (Hostinger)

### For frontend.tilalr.com (Vercel)
Add in DNS Zone:
```
Type: CNAME
Name: frontend
Value: cname.vercel-dns.com
TTL: 3600
```

### For test.tilalr.com (Direct Hostinger)
This should already be configured if subdomain is created in Hostinger panel.

---

## Post-Deployment Testing

1. **Test Backend API**
   - Open: https://test.tilalr.com/api/health (or any test endpoint)
   - Verify JSON response

2. **Test Frontend**
   - Open: https://frontend.tilalr.com
   - Test login/registration
   - Test API calls work without CORS errors

3. **Check Browser Console**
   - No CORS errors
   - API calls returning proper responses

---

## Troubleshooting

### CORS Errors
- Verify `frontend.tilalr.com` is in backend's `config/cors.php`
- Clear config cache: `php artisan config:clear`

### API Not Working
- Check `.env` values are correct
- Verify database connection
- Check storage permissions

### SSL Issues
- Ensure both domains have SSL certificates
- Hostinger usually provides free SSL via Let's Encrypt
