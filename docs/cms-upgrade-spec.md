# CMS Upgrade Specification

## 1. Mission

CMS فعلی وب‌سایت را به یک سیستم مدیریت محتوای **منطقی، قابل‌استفاده، توسعه‌پذیر، امن و مناسب کاربر غیرفنی** ارتقا بده؛ به‌گونه‌ای که مدیر سایت بتواند بخش‌های منطقی و قابل‌تغییر وب‌سایت را بدون ویرایش مستقیم کد مدیریت کند.

هدف صرفاً اضافه‌کردن چند input یا چند قابلیت پراکنده به پنل مدیریت نیست.

هدف نهایی:

```text
Non-technical Admin
        ↓
Simple CMS UI
        ↓
Validated Content Model
        ↓
Stable API / Data Layer
        ↓
Reusable Frontend Components
        ↓
Responsive / Accessible / Consistent Website
```

سیستم باید **flexible but constrained** باشد:

* محتوای قابل‌تغییر باید dynamic باشد.
* طراحی و architecture نباید آزادانه توسط کاربر خراب شود.
* CMS نباید به یک page-builder بی‌قاعده تبدیل شود.
* تغییر محتوای CMS نباید برای تغییرات معمول نیازمند تغییر frontend code باشد.
* flexibility نباید به قیمت کاهش maintainability، security، accessibility، performance یا UI/UX تمام شود.

---

# 2. Core Engineering Principles

این اصول در تمام implementation لازم‌الاجرا هستند:

1. **Repository is the source of truth.**
2. قبل از تصمیم‌های معماری مهم، implementation واقعی پروژه را بررسی کن.
3. از architecture و componentهای سالم موجود تا حد امکان استفاده کن.
4. از rewrite غیرضروری جلوگیری کن.
5. hard-coded business content را در موارد منطقی به data-driven content تبدیل کن.
6. content و presentation را از یکدیگر جدا نگه دار.
7. CMS را content-driven طراحی کن، نه style-driven.
8. از over-engineering جلوگیری کن.
9. backwards compatibility را تا حد امکان حفظ کن.
10. هر تغییر باید دلیل فنی، product، UX، security یا maintainability داشته باشد.
11. چیزی را که قابل بررسی یا تست است حدس نزن.
12. هیچ قابلیت یا تستی را complete یا verified اعلام نکن مگر اینکه واقعاً انجام شده باشد.

---

# 3. Repository Discovery

قبل از implementation، ساختار واقعی repository را بررسی کن.

حداقل موارد زیر را شناسایی کن:

* framework و runtime
* frontend architecture
* backend architecture
* CMS/admin architecture
* database و schema
* ORM یا data-access layer
* APIها
* routing
* authentication
* authorization
* media/file handling
* component architecture
* styling/design system
* responsive breakpoints
* SEO implementation
* validation
* caching
* testing infrastructure
* build/lint/typecheck configuration
* existing deployment-related constraints در صورت مرتبط بودن

همچنین مشخص کن:

* چه محتوایی اکنون hard-coded است؟
* چه محتوایی اکنون dynamic است؟
* CMS فعلی دقیقاً چه قابلیت‌هایی دارد؟
* چه componentهایی reusable هستند؟
* چه بخش‌هایی coupling نامناسب بین content و presentation دارند؟
* چه refactorهایی برای این task واقعاً ضروری هستند؟

---

# 4. Current-State Inventory

قبل از implementation، current state را به‌صورت دقیق درک کن:

```text
Current CMS capabilities
Current hard-coded content
Current dynamic content
Current data models
Current APIs
Current reusable components
Current page structures
Current media flow
Current validation
Current security boundaries
Current tests
Current relevant technical debt
```

سپس gap بین وضعیت فعلی و وضعیت موردنیاز را مشخص کن.

از روی specification به‌تنهایی معماری جدید اختراع نکن؛ ابتدا implementation موجود را بفهم.

---

# 5. Desired CMS Architecture

معماری نهایی باید تا حد امکان به الگوی زیر نزدیک باشد:

```text
CMS Content
      ↓
Validation
      ↓
Domain / Content Model
      ↓
API / Data Layer
      ↓
Reusable Frontend Components
      ↓
Responsive UI
```

CMS باید:

* predictable
* maintainable
* extensible
* validated
* secure
* easy to use

باشد.

همچنین:

* user نباید به raw HTML یا raw CSS دسترسی غیرضروری داشته باشد.
* user نباید بتواند با تغییر content layout را خراب کند.
* user نباید مسئول تصمیم‌های design-system-level باشد.

---

# 6. Navigation / Navbar Management

Navigation باید از حالت hard-coded خارج شود، در صورتی که architecture فعلی اجازه می‌دهد.

مدیر باید بتواند:

* آیتم اضافه کند.
* آیتم حذف کند.
* عنوان آیتم را تغییر دهد.
* URL را تغییر دهد.
* ترتیب آیتم‌ها را تغییر دهد.
* آیتم را فعال/غیرفعال کند.
* internal یا external بودن لینک را مدیریت کند.
* در صورت وجود dropdown/submenu، ساختار آن را مدیریت کند.
* در صورت نیاز link target مناسب را تنظیم کند.

پیاده‌سازی باید با موارد زیر سازگار باشد:

* desktop navigation
* mobile navigation
* active states
* keyboard navigation
* accessibility
* responsive behavior

تعداد آیتم‌ها نباید بی‌دلیل hard-coded باشد.

---

# 7. Page Content Management

صفحات مختلف سایت باید تا حد ممکن برای contentهای منطقی قابل مدیریت شوند.

در صورت وجود نیاز واقعی، CMS باید امکان مدیریت موارد زیر را فراهم کند:

* page title
* subtitle
* headingها
* description
* rich text
* images
* links
* CTAها
* section content
* visibility
* ordering
* SEO metadata

presentation logic نباید صرفاً برای افزایش flexibility به CMS منتقل شود.

---

# 8. Hero Section Management

Hero باید از CMS قابل مدیریت باشد.

## Video

مدیر باید بتواند:

* video را تغییر دهد.
* video را فعال/غیرفعال کند.
* source را تغییر دهد.
* poster/fallback را در صورت وجود تغییر دهد.

## Images

مدیر باید بتواند:

* desktop image را تغییر دهد.
* mobile image را تغییر دهد.
* fallback image را تغییر دهد.

## Text

مدیر باید بتواند:

* title را تغییر دهد.
* subtitle را تغییر دهد.
* description را تغییر دهد.
* CTA label را تغییر دهد.
* CTA URL را تغییر دهد.
* CTA را فعال/غیرفعال کند.

## Fallback behavior

منطق مناسب باید مشابه این باشد:

```text
Desktop:
Video → fallback image

Mobile:
Mobile image

Video unavailable:
Fallback image

Optional content missing:
Layout remains valid
```

پیاده‌سازی نباید باعث موارد زیر شود:

* broken layout
* overlap
* overflow
* invalid visual hierarchy
* unacceptable layout shift
* broken mobile experience

---

# 9. «مخاطبان بهسا در صنعت و انرژی»

این بخش باید از حالت hard-coded خارج شود.

مدیر باید بتواند:

* شرکت اضافه کند.
* شرکت حذف کند.
* نام شرکت را ویرایش کند.
* ترتیب شرکت‌ها را تغییر دهد.
* شرکت را فعال/غیرفعال کند.
* در صورت وجود logo، logo را تغییر دهد.

ساختار باید collection-based و extensible باشد.

---

# 10. Homepage Section Management

Sectionهای مناسب صفحه اصلی را dynamic کن.

حداقل sectionهای زیر را بررسی و در صورت سازگاری با architecture پیاده‌سازی کن:

* «چالش مشترک صنایع»
* «راهکارها»
* «امکانات سامانه»
* سایر sectionهایی که ماهیت business/content قابل‌تغییر دارند

برای sectionهای مناسب، مدیر باید بتواند:

* section را فعال/غیرفعال کند.
* title را تغییر دهد.
* description را تغییر دهد.
* item اضافه کند.
* item حذف کند.
* item را ویرایش کند.
* ترتیب itemها را تغییر دهد.
* image/icon را تغییر دهد.
* CTA را تغییر دهد.
* لینک را تغییر دهد.

اگر section دارای Card یا collection است:

**تعداد Cardها و itemها نباید در frontend به‌صورت hard-coded تعیین شود.**

---

# 11. Additional Logical CMS Capabilities

پس از تحلیل repository، سایر بخش‌هایی را که واقعاً از نظر business logic و معماری منطقی است قابل مدیریت شوند شناسایی کن.

موارد احتمالی:

* Footer
* contact information
* address
* phone
* email
* social links
* FAQ
* testimonials
* statistics
* banners
* logos
* reusable CTAها
* site-wide text
* SEO metadata
* Open Graph metadata
* social preview image

اما هر قابلیت اضافی باید حداقل یکی از این اهداف را داشته باشد:

* کاهش hard-coded content
* کاهش dependency به developer
* افزایش business flexibility
* افزایش admin usability
* افزایش maintainability

Feature صرفاً برای بزرگ‌تر کردن CMS اضافه نکن.

---

# 12. Content vs Presentation Boundary

مرز زیر را حفظ کن.

## منطقی برای CMS

* title
* subtitle
* text
* image
* video
* link
* CTA
* button label
* card content
* company
* order
* visibility
* business metadata
* SEO metadata

## معمولاً غیرمناسب برای CMS

* arbitrary CSS
* raw HTML
* arbitrary spacing
* arbitrary typography values
* arbitrary breakpoints
* component internals
* design tokens
* accessibility-critical behavior
* layout rules
* animation internals

CMS باید **flexible enough for business** و **constrained enough for engineering** باشد.

---

# 13. CMS UX

پنل مدیریت برای کاربر غیرفنی طراحی می‌شود.

بنابراین:

* terminology باید واضح باشد.
* labelها انسانی و قابل‌فهم باشند.
* فیلدهای ضروری و اختیاری مشخص باشند.
* فرم‌ها به بخش‌های منطقی تقسیم شوند.
* validation واضح باشد.
* خطاها actionable باشند.
* loading state مناسب باشد.
* save state مشخص باشد.
* empty state مناسب باشد.
* success state مناسب باشد.
* destructive actions confirmation داشته باشند.
* upload UX مناسب باشد.
* ordering UX ساده باشد.
* اطلاعات فنی غیرضروری از کاربر پنهان شود.

در صورت سازگاری با architecture موجود، preview یا draft/publish behavior را بررسی کن؛ اما فقط در صورت ارزش واقعی و بدون ایجاد complexity ناموجه.

---

# 14. Data Model

مدل داده باید:

* reusable
* maintainable
* extensible
* validated
* consistent

باشد.

برای collectionها در صورت نیاز می‌توان الگوهایی مانند این را در نظر گرفت:

```text
id
title
description
image
link
order
isActive
createdAt
updatedAt
```

اما schema نهایی باید از architecture واقعی repository پیروی کند.

از این موارد جلوگیری کن:

* duplication غیرضروری
* over-normalization
* over-modeling
* entityهای بدون کاربرد
* abstractionهای بی‌دلیل

---

# 15. Validation

تمام ورودی‌های CMS را untrusted input در نظر بگیر.

در لایه‌های مناسب validation ایجاد کن:

```text
UI validation
+
Server/API validation
+
Persistence constraints
```

موارد مرتبط را بررسی کن:

* required fields
* length limits
* URL validation
* file type
* file size
* media constraints
* enum constraints
* ordering
* duplicate conflicts
* sanitization
* malicious input

---

# 16. Security

سیستم CMS نباید با content نامعتبر یا دسترسی غیرمجاز آسیب‌پذیر شود.

بررسی کن:

* authentication
* authorization
* roles/permissions
* server-side validation
* XSS prevention
* HTML sanitization
* URL safety
* upload security
* privileged mutations
* access control
* API security

هیچ trust boundary موجود را برای ساده‌ترشدن implementation دور نزن.

---

# 17. Frontend Component Architecture

در صورت نیاز componentها را refactor کن تا:

* data از CMS دریافت شود.
* content و presentation جدا باشند.
* componentها reusable باقی بمانند.
* hard-coded assumptions کاهش یابد.
* dynamic collections پشتیبانی شوند.
* componentها در شرایط ناقص بودن data نیز پایدار بمانند.

معماری مطلوب:

```text
CMS Data
   ↓
Validated Model
   ↓
Reusable Components
   ↓
Responsive Presentation
```

اما از abstraction غیرضروری جلوگیری کن.

---

# 18. Responsive Requirements

محتوای dynamic باید در این حالت‌ها درست نمایش داده شود:

* mobile
* tablet
* desktop
* narrow viewport
* wide viewport

و با داده‌های زیر نیز:

* title کوتاه
* title طولانی
* text کوتاه
* text طولانی
* zero items
* one item
* many items
* image با نسبت متفاوت
* missing image
* missing video
* missing optional content
* disabled section

هیچ حالت CMS نباید باعث شود:

* horizontal overflow
* text collision
* broken grid
* overlap
* visual hierarchy failure
* broken typography
* inaccessible controls

ایجاد شود.

---

# 19. UI/UX Requirements

در frontend:

* visual hierarchy حفظ شود.
* spacing consistent باشد.
* typography consistent باشد.
* interaction states صحیح باشند.
* focus states وجود داشته باشند.
* mobile usability حفظ شود.
* accessibility رعایت شود.
* loading/empty/error states مناسب باشند.

Design موجود را بدون دلیل بازطراحی نکن.

هر visual change باید دارای دلیل واقعی باشد.

---

# 20. Performance

تغییرات CMS نباید باعث performance regression غیرضروری شوند.

بررسی کن:

* image optimization
* video loading
* lazy loading
* caching
* unnecessary API requests
* data fetching
* rerendering
* bundle impact
* asset size

Hero media باید با دقت بررسی شود.

---

# 21. SEO

در صورت وجود architecture مناسب، امکان مدیریت موارد منطقی SEO را فراهم کن:

* page title
* meta description
* canonical
* Open Graph
* social preview image

اما:

* routing موجود را بدون ضرورت تغییر نده.
* SEO structure را خراب نکن.
* user input نباید metadata نامعتبر تولید کند.

---

# 22. No Unnecessary Rewrite

این specification اجازه rewrite کامل application را نمی‌دهد.

بدون نیاز واقعی:

* framework را تغییر نده.
* database را تعویض نکن.
* architecture سالم را بازنویسی نکن.
* dependencyهای غیرضروری اضافه نکن.
* component سالم را بازنویسی نکن.
* API contract سالم را نشکن.
* routeهای موجود را تغییر نده.

Refactor فقط زمانی مجاز است که برای یکی از این موارد ضروری باشد:

```text
required for CMS
required for correctness
required for security
required for maintainability
required for testability
required to remove harmful coupling
```

---

# 23. Existing Functionality Preservation

تمام functionality موجود باید حفظ شود مگر اینکه requirement جدید صراحتاً نیازمند تغییر آن باشد.

حداقل موارد زیر بررسی شوند:

* routes
* navigation
* page rendering
* existing content
* authentication
* authorization
* APIs
* media
* forms
* SEO
* responsiveness

---

# 24. Scope Control

در طول implementation این معیار را استفاده کن:

```text
Does this change directly improve:
- CMS flexibility
- admin usability
- correctness
- maintainability
- security
- responsive behavior
- performance
- required UX
```

اگر پاسخ منفی است، آن تغییر خارج از scope است؛ مگر اینکه برای اجرای صحیح task ضروری باشد.

---

# 25. Verification Requirements

Verification باید **evidence-based** باشد.

صرفاً گفتن «بررسی شد» کافی نیست.

در صورت وجود command یا infrastructure مناسب، موارد زیر را اجرا کن:

* typecheck
* lint
* unit tests
* integration tests
* build
* API tests
* CMS CRUD validation
* responsive validation
* edge-case validation

فقط تست‌هایی را گزارش کن که واقعاً اجرا شده‌اند.

---

# 26. CMS Acceptance Criteria

کار زمانی complete محسوب می‌شود که:

* Admin can edit navigation.
* Admin can add navigation items.
* Admin can remove navigation items.
* Admin can reorder navigation items.
* Admin can edit page content.
* Admin can edit Hero video.
* Admin can edit Hero images.
* Admin can edit Hero text.
* Admin can edit Hero CTA.
* Admin can add companies.
* Admin can remove companies.
* Admin can edit companies.
* Admin can reorder companies.
* Admin can manage relevant homepage sections.
* Admin can add/remove/edit/reorder dynamic section items.
* Dynamic collection sizes are not hard-coded in frontend code.

---

# 27. Frontend Acceptance Criteria

* Dynamic content renders correctly.
* Existing pages remain functional.
* Existing routes remain functional.
* Responsive behavior remains correct.
* Long content does not break layout.
* Missing optional content does not break layout.
* Empty collections have valid behavior.
* Media fallback works.
* Mobile behavior remains correct.
* Accessibility is not regressed.
* Existing visual identity is preserved unless an improvement is required.

---

# 28. Engineering Acceptance Criteria

* Validation exists where required.
* Authorization remains intact.
* Security boundaries remain intact.
* No unnecessary architecture rewrite occurred.
* Performance regressions are avoided.
* SEO is preserved.
* Code remains maintainable.
* Dynamic content is actually sourced from CMS.
* CMS changes do not require frontend code changes for ordinary content edits.
* No unrelated functionality was changed.

---

# 29. Edge-Case Matrix

حداقل موارد زیر را بررسی کن:

```text
0 items
1 item
Many items

Empty title
Very long title

Empty description
Very long description

Missing image
Different image ratio

Missing video
Unavailable media

Disabled section
Deleted item
Reordered item

Mobile
Tablet
Desktop

Existing database/content
Fresh database/content
```

هر موردی را که infrastructure پروژه اجازه می‌دهد، واقعاً تست کن.

---

# 30. Failure Handling

اگر در implementation با مشکل مواجه شدی:

1. مشکل را در context واقعی repository شناسایی کن.
2. root cause را مشخص کن.
3. کم‌خطرترین راه‌حل صحیح را انتخاب کن.
4. تغییر لازم را اعمال کن.
5. verification مربوطه را دوباره اجرا کن.

از workaround موقتی که debt جدید ایجاد می‌کند پرهیز کن.

اگر requirementی با architecture فعلی ناسازگار است، آن ناسازگاری را پنهان نکن.

---

# 31. Decision Policy

وقتی چند implementation معتبر وجود دارد:

1. existing architecture را در اولویت قرار بده.
2. کم‌پیچیده‌ترین solution صحیح را انتخاب کن.
3. coupling بین content و presentation را کاهش بده.
4. maintainability را حفظ کن.
5. extensibility منطقی را در نظر بگیر.
6. over-engineering نکن.
7. backwards compatibility را حفظ کن.
8. تصمیم معماری را بر اساس repository evidence بگیر.

برای تصمیم‌های عادی خودت تصمیم بگیر و execution را بی‌دلیل متوقف نکن.

فقط زمانی نیاز به clarification وجود دارد که نبودن آن واقعاً به implementationهای اساسی و ناسازگار منجر شود.

---

# 32. Truthfulness Contract

هیچ‌وقت:

* implementation انجام‌نشده را انجام‌شده اعلام نکن.
* تست اجرا نشده را passed اعلام نکن.
* فایل تغییر نکرده را changed اعلام نکن.
* feature ناقص را complete اعلام نکن.
* assumption را fact معرفی نکن.
* failure را پنهان نکن.

برای موارد verifyنشده از وضعیت واضح استفاده کن:

```text
Not verified
```

---

# 33. Final Technical Report

پس از اتمام کار، گزارش نهایی باید دقیقاً بر اساس implementation واقعی باشد.

گزارش شامل:

## Implemented

قابلیت‌هایی که واقعاً پیاده‌سازی شده‌اند.

## Architecture

توضیح مختصر data flow:

```text
CMS
↓
Data Model
↓
API / Data Layer
↓
Frontend
```

## Files Changed

فایل‌های مهم و نقش هرکدام.

## Database / Schema Changes

migration یا schema changeهای واقعی.

## API Changes

endpoint یا contractهای واقعی.

## CMS Changes

قابلیت‌های جدید admin.

## Frontend Changes

componentها و sectionهای dynamic شده.

## Security / Validation

کنترل‌های واقعی اضافه‌شده.

## Testing

فقط verificationهای واقعاً اجراشده، همراه با نتیجه.

مثال:

```text
Typecheck: PASS
Lint: PASS
Build: PASS
Unit tests: PASS
Integration tests: PASS
```

در صورت شکست:

```text
Build: FAIL
Reason: ...
```

## Known Limitations

فقط محدودیت‌های واقعی.

## Remaining Work

فقط کارهایی که واقعاً باقی مانده‌اند.

---

# 34. Final Success Condition

این project زمانی موفق است که:

> یک کاربر غیرفنی بتواند بخش‌های منطقی و قابل‌تغییر وب‌سایت را از طریق CMS مدیریت کند، بدون اینکه برای تغییرات معمول نیاز به ویرایش کد داشته باشد؛ و این flexibility باعث خراب‌شدن UI/UX، responsive behavior، accessibility، security، SEO، performance یا architecture نشود.

CMS باید:

**Flexible enough for business**

و هم‌زمان:

**Constrained enough for engineering**

باشد.
