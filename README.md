<div align="center">

  <img src="public/behsa-horizontal-rtl.png" alt="لوگوی بهسا دیجیتال" width="280" />

  <h1>پلتفرم سازمانی بهسا دیجیتال (Behsa Digital)</h1>

  <p>
    <strong>وب‌سایت رسمی و سامانه مدیریت محتوای اختصاصی (Native Headless CMS)</strong>
    <br />
    توسعه‌یافته بر پایه نسل جدید معماری Next.js 16 (App Router)، React 19، Tailwind CSS 4 و PostgreSQL
  </p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js" alt="Next.js 16" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" /></a>
    <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=flat-square&logo=drizzle&logoColor=black" alt="Drizzle ORM" /></a>
    <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-16+-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" /></a>
  </p>

</div>

---

## 📖 درباره پروژه

پروژه **بهسا دیجیتال** دربرگیرنده وب‌سایت مدرن شرکتی، معرفی خدمات تحول دیجیتال و بانکداری مدرن به همراه یک **سامانه مدیریت محتوای اختصاصی (CMS)** یکپارچه است. 

در این معماری، کلیه نیازهای تجاری سامانه اعم از مدیریت منوها، سکشن‌های لندینگ، مقالات بلاگ، نظرات مشتریان، پرسش‌های متداول، بهینه‌سازی موتورهای جستجو (SEO) و ذخیره‌سازی رسانه بهصورت درون‌برنامه‌ای (In-App) و بدون وابستگی به فریم‌ورک‌ها یا CMSهای سنگین خارجی پیاده‌سازی شده است.

---

## ✨ ویژگی‌های کلیدی

- **معماری مدرن Next.js 16 (App Router):** بهره‌گیری از React Server Components (RSC)، Server Actions و کش بهینهٔ `unstable_cache` با برچسب‌گذاری تگ‌ها جهت به‌روزرسانی آنی محتوا.
- **پنل مدیریت محتوای بومی (`/admin`):**
  - مدیریت منوهای سلسله‌مراتبی و زیرمنوها.
  - ویرایش بخش‌های بصری صفحه اصلی (Hero، پلتفرم، چالش‌ها، امکانات و دستاوردها).
  - سیستم انتشار مقالات به همراه مدیریت پیش‌نویس، زمان‌بندی انتشار و پیش‌نمایش زنده (`Preview Mode`).
  - مدیریت مشتریان سازمانی، نظرات، پرسش‌های متداول و تعاریف سئو.
- **احراز هویت مستقل و امن:**
  - ثبت نشست‌ها درون دیتابیس با کوکی‌های امن `httpOnly`.
  - هش قدرتمند کلمات عبور با `bcryptjs`.
  - سیستم محدودسازی تلاش‌های ناموفق ورود (Rate Limiting) بر پایه IP کلاینت.
- **ذخیره‌سازی اتمیک رسانه‌ها (Media Storage):** نگهداری مستقیم تصاویر در PostgreSQL (`bytea`)؛ بدین ترتیب تهیه یک نسخه پشتیبان از پایگاه داده برابر است با نسخه پشتیبان ۱۰۰٪ کامل از کل سایت و رسانه‌ها.
- **سئوی جامع سازمانی (Enterprise SEO):**
  - پیاده‌سازی متادیتاهای داینامیک، Canonical URL و تصاویر Open Graph.
  - تولید خودکار و لحظه‌ای `sitemap.xml`، `robots.txt` و `manifest.webmanifest`.
  - فید اختصاصی مقالات در قالب استاندارد RSS (`/articles/feed.xml`).
  - داده‌های ساختاریافته JSON-LD برای سازمان، مقالات، خدمات و پرسش‌ها.
- **رابط کاربری و پویانمایی:**
  - استایل‌دهی ماژولار و سبک با **Tailwind CSS 4**.
  - تعاملات بصری و انیمیشن‌های پیشرفته با **GSAP**.
  - میزبانی محلی فونت‌های استاندارد فارسی (`Estedad` و `Vazirmatn`).

---

## 🛠 پشته فناوری (Tech Stack)

| لایه / کاربرد | فناوری انتخابی | مزایا و دلایل انتخاب |
|---|---|---|
| **فریم‌ورک اصلی** | Next.js 16 (App Router) + React 19 | سئوی قدرتمند، رندرینگ سمت سرور (SSR) و استریمینگ سریع |
| **زبان برنامه‌نویسی** | TypeScript 5 | ایمنی نوع‌داده‌ها (Type Safety) در سراسر فرانت‌اند و بک‌اند |
| **طراحی و استایل** | Tailwind CSS 4 + GSAP | توکن‌های استاندارد طراحی، پرفورمنس بالا و انیمیشن‌های روان |
| **پایگاه داده و ORM** | PostgreSQL + Drizzle ORM | بدون موتور سنگین باینری، تایپ‌سیف، مایگریشن‌های شفاف SQL |
| **اعتبارسنجی داده‌ها** | Zod 4 | اعتبارسنجی ورودی فرم‌ها و اکشن‌های سرور |
| **کانتینرسازی** | Docker (Multi-stage Node 22-Alpine) | بیلد سبک Standalone مناسب برای دیپلوی در سرورهای ابری |

---

## 📂 ساختار پوشه‌ها و کدهای پروژه

```text
behsa-digital/
├── public/                 # فایل‌های استاتیک، لوگوها، آیکون‌ها و ویدئوهای عمومی
├── scripts/                # اسکریپت‌های مدیریت دیتابیس و مدیریت اولیه ادمین
│   ├── migrate.ts          # اجرای مایگریشن‌های Drizzle
│   ├── seed.ts             # مقداردهی محتوای اولیه سایت در دیتابیس
│   └── create-admin.ts     # ایجاد یا تغییر رمز کاربر مدیر پنل
├── drizzle/                # فایل‌های SQL مایگریشن‌ها و اسنپ‌شات‌های اسکیما
├── src/
│   ├── app/
│   │   ├── (site)/         # صفحات عمومی سایت (صفحه اصلی، درباره ما، مقالات و...)
│   │   ├── admin/          # پنل اختصاصی مدیریت محتوا (/admin) و Server Actions
│   │   ├── api/            # روت‌های API، مدیریت پیش‌نمایش و فیدها
│   │   ├── sitemap.ts      # تولید نقشه سایت داینامیک
│   │   └── robots.ts       # قوانین خزنده‌ها
│   ├── components/         # کامپوننت‌های بصری، ناوبری، ویرایشگرها و هیرو
│   ├── content/            # تعاریف ثابت، مدل سکشن‌ها و دیتای پیش‌فرض
│   ├── db/                 # اتصال به PostgreSQL و تعاریف اسکیمای Drizzle
│   ├── lib/                # توابع کمکی احراز هویت، خواندن محتوا و سئو
│   └── styles/             # فونت‌ها و فایل‌های CSS پایه
├── .env.example            # الگوی متغیرهای محیطی موردنیاز
├── Dockerfile              # داکرفایل چندمرحله‌ای برای بیلد پروداکشن
├── next.config.ts          # تنظیمات Next.js، ریدایرکت‌ها و هدرهای امنیتی
└── package.json            # وابستگی‌ها و اسکریپت‌های پروژه
```

---

## 🚀 راه‌اندازی سریع در محیط توسعه (Local Setup)

### پیش‌نیازها
- **Node.js:** نسخه `20.9` یا بالاتر
- **npm:** نسخه `10` یا بالاتر
- **PostgreSQL:** پایگاه داده آماده به کار (محلی یا Docker)

### ۱. کلون کردن مخزن
```bash
git clone https://github.com/SinaNazeran/behsa-digital.git
cd behsa-digital
```

### ۲. نصب پکیج‌ها
```bash
npm install
```

### ۳. تنظیم متغیرهای محیطی
یک نسخه از فایل نمونه `.env.example` با نام `.env` بسازید و مقادیر مربوط به دیتابیس خود را تنظیم فرمایید:

```bash
cp .env.example .env
```

نمونه مقادیر فایل `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/behsa_digital
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NOINDEX=false
ADMIN_EMAIL=admin@behsa.ir
ADMIN_PASSWORD=
ADMIN_NAME=مدیر سیستم
```

### ۴. آماده‌سازی پایگاه داده و بارگذاری داده‌های اولیه
جدول‌های دیتابیس را ایجاد کرده و محتوای پایهٔ سایت را در آن درج کنید:

```bash
# اجرای مایگریشن‌ها
npm run db:migrate

# انتقال داده‌های محتوایی اولیه (این دستور ایمن و Idempotent است)
npm run db:seed
```

### ۵. ساخت نخستین مدیر پنل CMS
با مشخص کردن رمز عبور دلخواه، حساب کاربری مدیر را ایجاد کنید:

```bash
# در لینوکس / مک / گیت‌بش:
ADMIN_PASSWORD="رمز_عبور_دلخواه" npm run admin:create

# در پاورشل (PowerShell):
$env:ADMIN_PASSWORD="رمز_عبور_دلخواه"; npm run admin:create
```

### ۶. اجرای سرور توسعه
```bash
npm run dev
```

سامانه در آدرس‌های زیر در دسترس شما خواهد بود:
- وب‌سایت اصلی: [http://localhost:3000](http://localhost:3000)
- پنل مدیریت محتوا: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📜 اسکریپت‌های خط فرمان (NPM Scripts)

| دستور | توضیح عملیات |
|---|---|
| `npm run dev` | اجرای پروژه در حالت توسعه با Turbopack |
| `npm run build` | کامپایل و بیلد پروداکشن پروژه |
| `npm run start` | اجرای نسخه بیلدشده پروداکشن |
| `npm run typecheck` | بررسی و اعتبارسنجی کدهای تایپ‌اسکریپت بدون خروجی (`tsc --noEmit`) |
| `npm run check` | اعتبارسنجی یکپارچگی مدل محتوا و لینک‌ها (بدون نیاز به DB) |
| `npm run db:generate` | ساخت فایل‌های جدید مایگریشن Drizzle بر اساس تغییرات اسکیما |
| `npm run db:migrate` | اعمال مایگریشن‌ها بر روی پایگاه داده هدف |
| `npm run db:seed` | همگام‌سازی محتوای پایه با جداول دیتابیس |
| `npm run admin:create` | ثبت یا بازنشانی کلمه عبور مدیر پنل |

---

## 🐳 استقرار در محیط عملیاتی (Production Deployment)

### روش اول: استفاده از Docker (پیشنهادی)

پروژه دارای یک `Dockerfile` چندمرحله‌ای سبک بر پایه `node:22-alpine` است:

```bash
# ۱. ساخت ایمیج
docker build -t behsa-digital-web .

# ۲. اجرای کانتینر
docker run -d \
  -p 3000:3000 \
  --name behsa-web \
  -e DATABASE_URL="postgresql://user:pass@db-host:5432/behsa_db" \
  -e NEXT_PUBLIC_SITE_URL="https://behsa.ir" \
  behsa-digital-web
```

### روش دوم: استقرار مستقیم (Standalone)

```bash
npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
cd .next/standalone
node server.js
```

> [!TIP]
> **پیکربندی Nginx Reverse Proxy:** هنگام استقرار در پشت سرورهای Nginx یا Cloudflare، حتماً هدر `X-Forwarded-For` را بهدرستی تنظیم کنید؛ زیرا مکانیزم جلوگیری از حملات Brute-force در ورود به پنل ادمین، کلاینت را از روی این هدر شناسایی می‌کند.
> برای محیط‌های تستی (Staging)، مقدار `SITE_NOINDEX=true` را در متغیرهای محیطی قرار دهید تا ربات‌های جستجوگر آن را ایندکس نکنند.

---

## 🔒 امنیت و محافظت از داده‌ها

- **عدم افشای اسرار:** کلیه فایل‌های محلی حاوی کلیدها و پسوردها (`.env`) در `.gitignore` مهار شده و هرگز وارد مخزن نمی‌شوند.
- **هدرهای امنیتی مدرن:** تنظیم پیش‌فرض هدرهای امنیتی شامل `Content-Security-Policy`، `X-Frame-Options: SAMEORIGIN`، `X-Content-Type-Options: nosniff` و `HSTS`.
- **ایزوله‌سازی دسترسی پنل:** مسیر `/admin` با هدر `X-Robots-Tag: noindex, nofollow` بهطور کامل از دید موتورهای جستجو مسدود است.

---

## 🤝 مشارکت و توسعه

توسعه‌دهندگان برای ثبت تغییرات، لطفاً استانداردهای زیر را رعایت نمایند:
1. پیش از ارسال Commit، از صحت تایپ‌ها و تست‌ها مطمئن شوید: `npm run typecheck` و `npm run check`.
2. کامیت‌ها را با پیام‌های استاندارد و معنادار (بر اساس Conventional Commits) ثبت نمایید.
3. در صورت ایجاد فیلدهای جدید در دیتابیس، مایگریشن آن را با `npm run db:generate` تولید و تست کنید.

---

<div align="center">
  <sub>طراحی و توسعه برای شرکت بهسا دیجیتال • کلیه حقوق محفوظ است © ۲۰۲۶</sub>
</div>
