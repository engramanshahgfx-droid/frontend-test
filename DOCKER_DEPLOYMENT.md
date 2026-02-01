# 🐳 Tilalr Frontend - Docker Deployment Guide

## دليل نشر Tilalr Frontend باستخدام Docker

راجع الملف الشامل في مشروع Backend:
`tilalr-backend/DOCKER_DEPLOYMENT.md`

---

## 🚀 البدء السريع

### تشغيل محلي

```bash
# نسخ ملف البيئة
cp .env.docker.example .env

# تعديل المتغيرات
nano .env

# بناء وتشغيل
docker-compose up -d
```

### تشغيل للإنتاج

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 متغيرات البيئة المطلوبة

| المتغير | الوصف | مثال |
|---------|-------|------|
| `NEXT_PUBLIC_API_URL` | رابط API | `https://api.tilalr.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | مفتاح Stripe | `pk_live_xxx` |
| `NEXT_PUBLIC_FIREBASE_*` | إعدادات Firebase | - |

---

## 📝 أوامر مفيدة

```bash
# عرض السجلات
docker-compose logs -f

# إعادة البناء
docker-compose build --no-cache

# إيقاف
docker-compose down
```
