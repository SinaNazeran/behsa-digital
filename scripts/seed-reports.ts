/* The 15 report pages that shipped as code before the report catalogue moved
   into the CMS. Seed-only: `npm run db:seed` imports them once, into an empty
   `reports` table. After that the database is the source of truth and this
   file is never read by the site. */
import type { CapabilityCategory } from "../src/content/capabilities";

export const REPORT_PAGES: CapabilityCategory[] = [
  {
    id: "r-contracted-power",
    title: "گزارش بهینه‌سازی قدرت قراردادی",
    slug: "reports/contracted-power",
    href: "/reports/contracted-power",
    narrativeStage: "decision",
    icon: "contract",
    description: "قدرت قراردادی شما زیاد است یا کم؟ این گزارش با تحلیل بیشینهٔ دیماند یک سال اخیر، عدد بهینه را مشخص می‌کند.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "بیشینهٔ دیماند ثبت‌شده در یک سال اخیر، در برابر قدرت قراردادی فعلی",
          "اینکه قدرت قراردادی باید کاهش یابد یا افزایش",
          "ساعاتی که بیشترین ریسک تجاوز در آن‌ها وجود دارد",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر انرژی و مدیر مالی — این گزارش مستقیماً به یک قلم ثابت قبض مربوط است."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["درخواست تغییر قدرت قراردادی به شرکت توزیع، با عددی که پشتوانهٔ دادهٔ یک‌ساله دارد."],
      },
      {
        title: "چرا هر دو جهت خطا هزینه دارد",
        body: [
          "قدرت قراردادی بیش از نیاز، یعنی پرداخت هزینهٔ ثابت و ترانزیت برای ظرفیتی که استفاده نمی‌شود. قدرت قراردادی کمتر از نیاز، یعنی جریمهٔ تجاوز از دیماند. عدد بهینه جایی است که مجموع این دو کمینه شود.",
        ],
      },
    ],
    links: [
      { label: "گزارش: بیشینه مصرف اکتیو", slug: "reports/peak-demand" },
      { label: "راهکار: حذف جریمهٔ دیماند", slug: "solutions/demand-management" },
    ],
  },
  {
    id: "r-capacitor-design",
    title: "گزارش توان راکتیو جبرانی بانک خازنی",
    slug: "reports/capacitor-bank-design",
    href: "/reports/capacitor-bank-design",
    narrativeStage: "optimization",
    icon: "capacitor",
    description:
      "چه ظرفیتی، در چند پله، با کدام فیوز و کابل؟ این گزارش طراحی کامل بانک خازنی را از دادهٔ کنتور محاسبه می‌کند — بدون بازدید میدانی و بدون اندازه‌گیری جداگانه.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "نمودار ساعتی توان راکتیو جبرانی، تا رسیدن به ضریب توان بالای ۰٫۹۱",
          "ظرفیت کل بانک خازنی، محاسبه‌شده از همان نمودار ساعتی",
          "تعداد پله‌ها، ظرفیت هر پله و خازن ثابت در صورت نیاز",
          "جریان هر خازن، جریان فیوز و سطح مقطع کابل مناسب",
          "پیشنهاد فیوز و کابل استاندارد موجود در بازار، برای هر پله",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق کارخانه، و مشاور یا طراحی که مسئول تحویل طراحی بانک خازنی است."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["مشخصات دقیق بانک خازنی برای خرید و نصب — بدون آزمون و خطا و بدون رفت‌وبرگشت با کارفرما."],
      },
      {
        title: "چرا دادهٔ ماهانهٔ قبض کافی نیست",
        body: [
          "قبض یک عدد تجمیعی ماهانه است و پیک‌های توان راکتیو در آن دیده نمی‌شوند. بانکی که با بار میانگین طراحی شود، در ساعات کم‌باری اضافه‌جبران می‌کند و در پیک کم می‌آورد. مبنای این گزارش، پروفایل ساعتی واقعی است.",
        ],
      },
      {
        title: "حد قانونی و هدف طراحی",
        body: [
          "جریمهٔ توان راکتیو برای مشترکان دیماندی زمانی اعمال می‌شود که ضریب توان از ۰٫۹ پایین‌تر باشد. هدف طراحی در این گزارش ۰٫۹۱ در نظر گرفته شده است تا نوسانات بار، ضریب را به زیر حد مجاز نبرد.",
        ],
      },
    ],
    links: [
      { label: "گزارش: نمودار ساعتی جبران‌ساز", slug: "reports/capacitor-bank-diagnostic" },
      { label: "برای مشاوران و طراحان برق", slug: "industries/consultants" },
      { label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" },
    ],
  },
  {
    id: "r-capacitor-diagnostic",
    title: "نمودار ساعتی جبران‌ساز بانک خازنی",
    slug: "reports/capacitor-bank-diagnostic",
    href: "/reports/capacitor-bank-diagnostic",
    narrativeStage: "intelligence",
    icon: "reactive",
    description: "بانک خازنی دارید — اما آیا کار می‌کند؟ این گزارش عملکرد واقعی بانک نصب‌شده را از روی دادهٔ کنتور نشان می‌دهد.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        body: ["نمودار ساعتی جبران‌ساز، سه حالت را از هم تفکیک می‌کند:"],
        items: [
          "نمودار عمدتاً منفی — بانک خازنی اشتباه بسته شده است",
          "نمودار ترکیبی مثبت و منفی — رگولاتور یا پله‌بندی ایراد دارد",
          "نمودار عمدتاً مثبت — تعداد پله‌ها کافی نیست",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق کارخانه، پیش از تخصیص بودجه برای اصلاح بانک خازنی."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه مشکل از نصب است، از تنظیم رگولاتور، یا از ظرفیت — سه اقدام کاملاً متفاوت با سه هزینهٔ متفاوت."],
      },
      {
        title: "چرا این گزارش مهم است",
        body: [
          "نصب‌بودن بانک خازنی به‌معنای کارکردن آن نیست. بانکی با طراحی اشتباه، رگولاتور بدتنظیم یا پله‌بندی نامناسب، جریمه را حذف نمی‌کند و هزینهٔ آن پرداخت شده است.",
        ],
      },
    ],
    links: [
      { label: "گزارش: توان راکتیو جبرانی بانک خازنی", slug: "reports/capacitor-bank-design" },
      { label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" },
    ],
  },
  {
    id: "r-optimal-purchase",
    title: "گزارش خرید بهینه انرژی ماه جاری",
    slug: "reports/optimal-purchase",
    href: "/reports/optimal-purchase",
    narrativeStage: "decision",
    icon: "cart",
    description: "تا پایان ماه چقدر برق بخرید که نه جریمهٔ کسری بدهید و نه خرید مازاد روی دستتان بماند؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "پیش‌بینی مصرف روزهای باقی‌ماندهٔ ماه، بر اساس الگوی بار روزهای گذشته",
          "پیش‌بینی مصرف ماه آینده، بر اساس سابقهٔ مصرف",
          "مقدار بهینهٔ خرید، با هدف کمترین هزینهٔ نهایی با احتساب جریمه‌ها",
          "سهم برق تجدیدپذیر موردنیاز برای رعایت الزام",
          "تفکیک خرید از بورس انرژی و قراردادهای دوجانبه",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مسئول تأمین انرژی، مدیر مالی، و خرده‌فروشان برق برای مدیریت سبد."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["مقدار خرید این ماه — یک عدد، نه یک بازه."],
      },
      {
        title: "چرا برآورد کافی نیست",
        body: [
          "انحراف از مقدار خریداری‌شده از هر دو طرف هزینه دارد: کسری با نرخ تنبیهی تسویه می‌شود و مازاد هزینهٔ اضافی تحمیل می‌کند. کاهش خطای برآورد، مستقیماً هزینهٔ تأمین را کم می‌کند.",
        ],
      },
    ],
    links: [
      { label: "راهکار: الزام خرید از بازار", slug: "solutions/market-purchase" },
      { label: "گزارش: ارزیابی سهم انرژی خورشیدی", slug: "reports/solar-share" },
    ],
  },
  {
    id: "r-solar-share",
    title: "گزارش ارزیابی سهم انرژی خورشیدی",
    slug: "reports/solar-share",
    href: "/reports/solar-share",
    narrativeStage: "outcome",
    icon: "sun",
    description: "پنل خورشیدی دارید — اما سهم واقعی آن در مصرف شما چقدر است، و آیا الزام رعایت شده است؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "سهم واقعی انرژی خورشیدی در مصرف مجموعه، نه بر اساس ظرفیت اسمی پنل",
          "بررسی خودکار وضعیت انطباق با الزام تأمین برق تجدیدپذیر",
          "کسری یا مازاد تولید، به تفکیک روزانه، ماهانه و سالانه",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر انرژی مجموعه‌های مشمول الزام، و صاحبان نیروگاه خورشیدی خودمصرف."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه چه مقدار برق سبز باید خریداری شود، یا چه ظرفیتی باید اضافه شود."],
      },
      {
        title: "چرا عدد واقعی تولید اهمیت دارد",
        body: [
          "تسویهٔ مازاد یا کسری با شرکت خرده‌فروش، بر پایهٔ تولید واقعی انجام می‌شود. بدون اندازه‌گیری، این تسویه قابل بررسی نیست.",
        ],
      },
    ],
    links: [
      { label: "راهکار: الزام تأمین برق تجدیدپذیر", slug: "solutions/article-16" },
      { label: "گزارش: خرید بهینه انرژی", slug: "reports/optimal-purchase" },
    ],
  },
  {
    id: "r-load-profile",
    title: "گزارش دریافت داده‌های کنتور (پروفایل بار)",
    slug: "reports/load-profile",
    href: "/reports/load-profile",
    narrativeStage: "data",
    icon: "loadprofile",
    description: "جزئیات دقیق پارامترهای الکتریکی کنتور، در بازهٔ زمانی و با تناوب دلخواه شما.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "دیماند مصرفی",
          "انرژی مصرفی (مثبت، منفی و ترکیبی)",
          "توان و ضریب توان",
          "جریان و ولتاژ",
          "میزان تولید",
        ],
      },
      {
        title: "تناوب گزارش",
        body: ["انتخاب نوع گزارش در اختیار شماست:"],
        items: [
          "تناوب ۱۵ دقیقه‌ای یا ساعتی، برای تحلیل دقیق نوسانات",
          "گزارش روزانه، برای بررسی عملکرد هر روز",
          "گزارش ماهانه، برای تحلیل روند بلندمدت",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق و کارشناس انرژی؛ این گزارش مبنای دادهٔ بیشتر تحلیل‌های دیگر است."],
      },
    ],
    links: [
      { label: "قابلیت: پایش و تحلیل مصرف", slug: "product/capabilities/consumption-monitoring" },
      { label: "گزارش: بیشینه مصرف اکتیو", slug: "reports/peak-demand" },
    ],
  },
  {
    id: "r-peak-demand",
    title: "گزارش بیشینه مصرف اکتیو",
    slug: "reports/peak-demand",
    href: "/reports/peak-demand",
    narrativeStage: "data",
    icon: "peak",
    description: "پیک مصرف دقیقاً چه زمانی رخ داده است؟ این گزارش بیشترین توان اکتیو ثبت‌شده را با زمان دقیق وقوع نشان می‌دهد.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "ماکسیمم مصرف هر کنتور، به همراه زمان دقیق وقوع",
          "روند بیشینهٔ مصرف به‌صورت روزانه",
          "روزی که بیشترین مصرف در کل دوره در آن رخ داده است",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["بهره‌بردار و مدیر تولید؛ کسی که می‌تواند زمان راه‌اندازی تجهیزات را جابه‌جا کند."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: [
          "شناسایی تجهیز یا شیفتی که پیک را می‌سازد، و امکان جابه‌جایی آن. راه‌اندازی هم‌زمان چند تجهیز پرمصرف، شایع‌ترین علت جهش ناگهانی دیماند است.",
        ],
      },
    ],
    links: [
      { label: "گزارش: بهینه‌سازی قدرت قراردادی", slug: "reports/contracted-power" },
      { label: "راهکار: حذف جریمهٔ دیماند", slug: "solutions/demand-management" },
    ],
  },
  {
    id: "r-demand-excess",
    title: "گزارش کنتورهای دارای تجاوز از دیماند قراردادی",
    slug: "reports/demand-excess-meters",
    href: "/reports/demand-excess-meters",
    narrativeStage: "decision",
    icon: "gauge",
    description: "کدام کنتورها، در چه ساعتی، از قدرت قراردادی عبور کرده‌اند؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "کنتورها یا گروه‌هایی که در بازهٔ انتخابی از قدرت قراردادی عبور کرده‌اند",
          "ساعت وقوع تجاوز برای هر کنتور",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر انرژی مجموعه‌های چندسایتی و هلدینگ‌هایی که تعداد زیادی کنتور دارند."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه اقدام اصلاحی از کدام سایت یا کدام کنتور شروع شود."],
      },
    ],
    links: [
      { label: "قابلیت: هشدارها و مدیریت دیماند", slug: "product/capabilities/demand-management" },
      { label: "گزارش: داشبورد مدیریتی هلدینگ", slug: "reports/holding-dashboard" },
    ],
  },
  {
    id: "r-comparison",
    title: "گزارش مقایسه مصرف",
    slug: "reports/consumption-comparison",
    href: "/reports/consumption-comparison",
    narrativeStage: "data",
    icon: "compare",
    description: "مصرف شما نسبت به دورهٔ قبل چه تغییری کرده است؟ دو بازهٔ زمانی دلخواه را کنار هم ببینید.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "مصرف بازهٔ اول و مصرف بازهٔ دوم، کنار هم",
          "اختلاف مصرف دو دوره",
          "درصد تغییرات مصرف",
        ],
      },
      {
        title: "نحوهٔ استفاده",
        body: ["کافی است دو بازهٔ زمانی با مدت‌زمان یکسان انتخاب کنید تا مقایسه انجام شود."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه اقدام اصلاحی انجام‌شده اثر داشته است یا نه — سنجش نتیجه، نه گمانه‌زنی."],
      },
    ],
    links: [{ label: "قابلیت: پایش و تحلیل مصرف", slug: "product/capabilities/consumption-monitoring" }],
  },
  {
    id: "r-bill-cost",
    title: "گزارش بهای انرژی مصرفی قبض",
    slug: "reports/bill-energy-cost",
    href: "/reports/bill-energy-cost",
    narrativeStage: "outcome",
    icon: "rial",
    description: "مصرف و هزینهٔ انرژی در هر بازهٔ زمانی، یک‌جا و قابل‌تفکیک.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "محاسبهٔ بهای انرژی مصرفی در بازهٔ انتخابی",
          "شناسایی مشترکین پرمصرف",
          "پیشنهاد راهکارهای بهینه‌سازی مصرف",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر مالی و مدیر انرژی؛ این گزارش زبان مشترک بین بهره‌برداری و حسابداری است."],
      },
    ],
    links: [{ label: "قابلیت: مدیریت انرژی و هزینه", slug: "product/capabilities/energy-cost-management" }],
  },
  {
    id: "r-observability",
    title: "گزارش رویت‌پذیری",
    slug: "reports/observability",
    href: "/reports/observability",
    narrativeStage: "data",
    icon: "eye",
    description: "چه بخشی از دادهٔ مصرف شما واقعی است و چه بخشی تخمینی؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        body: [
          "مصرف واقعی و مصرف تخمینی در بازه‌های زمانی مختلف، به‌صورت نمودار و جدول.",
        ],
      },
      {
        title: "چرا این گزارش وجود دارد",
        body: [
          "دادهٔ کنتور همیشه کامل نیست؛ قطعی ارتباط و خطای خوانش باعث می‌شود بخشی از داده تخمین زده شود. هر تحلیلی که روی این داده انجام می‌شود، به‌اندازهٔ سهم دادهٔ واقعی قابل‌اتکاست.",
          "به‌جای پنهان‌کردن این موضوع، آن را اندازه می‌گیریم و نشان می‌دهیم.",
        ],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["اینکه به کدام تحلیل می‌توان اتکا کرد، و کدام کنتور نیاز به پیگیری ارتباطی دارد."],
      },
    ],
    links: [{ label: "گزارش: سلامت کنتورها", slug: "reports/meter-health" }],
  },
  {
    id: "r-meter-register",
    title: "گزارش کنتورهای هوشمند",
    slug: "reports/meter-register",
    href: "/reports/meter-register",
    narrativeStage: "data",
    icon: "pin",
    description: "مشخصات فنی، اطلاعات مشترک و وضعیت کنتورها — در قالب جدول کامل و روی نقشهٔ تعاملی.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "مشخصات فنی هر کنتور",
          "اطلاعات مشترک",
          "وضعیت کنتورها در جدول کامل",
          "نمایش کنتورها روی نقشهٔ تعاملی",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مدیر دارایی، مدیر هلدینگ و خرده‌فروش برق؛ هر مجموعه‌ای که تعداد کنتورهایش از حافظه بیشتر است."],
      },
    ],
    links: [{ label: "گزارش: سلامت کنتورها", slug: "reports/meter-health" }],
  },
  {
    id: "r-voltage-quality",
    title: "گزارش هشدار کیفیت ولتاژ",
    slug: "reports/voltage-quality",
    href: "/reports/voltage-quality",
    narrativeStage: "intelligence",
    icon: "voltage",
    description: "کدام مشترک واقعاً به استابلایزر نیاز دارد؟ پاسخ این پرسش را از روی قبض برق نمی‌توان فهمید.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "شناسایی افت ولتاژ و افزایش ولتاژ",
          "پایش نوسانات و عدم تعادل فازها",
          "نمایش مکانی کیفیت ولتاژ مشترکین روی نقشه",
          "وضعیت هر مشترک در ۲۴ ساعت اخیر",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["مهندس برق کارخانه، و خرده‌فروش یا شرکت توزیعی که باید دربارهٔ تجهیز حفاظتی تصمیم بگیرد."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: [
          "اینکه کدام زیرمجموعه‌ها در وضعیت پرخطر هستند و دقیقاً کجا اقدام اصلاحی لازم است — به‌جای نصب تجهیز برای همه.",
        ],
      },
    ],
    links: [{ label: "قابلیت: کیفیت توان", slug: "product/capabilities/power-quality" }],
  },
  {
    id: "r-meter-health",
    title: "گزارش سلامت کنتورها",
    slug: "reports/meter-health",
    href: "/reports/meter-health",
    narrativeStage: "intelligence",
    icon: "alert",
    description: "کدام کنتورهای سبد شما رفتار غیرعادی دارند؟",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "کنتورهای مشکوک به استخراج رمزارز",
          "کنتورهای خاموش یا آفلاین",
          "کنتورهای معیوب با مصرف ثابت",
          "کنتورهای با ضریب توان کمتر از حد قانونی",
          "کنتورهای دارای افزایش مصرف نسبت به سال گذشته",
        ],
      },
      {
        title: "چه کسی می‌خواند",
        body: ["خرده‌فروش برق، شرکت توزیع، و مدیر هلدینگ با تعداد زیاد کنتور."],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["فهرست اولویت‌دار برای پیگیری میدانی — کدام کنتور باید بازدید شود."],
      },
    ],
    links: [
      { label: "قابلیت: پایش سلامت کنتورها", slug: "product/capabilities/meter-health" },
      { label: "صنعت: خرده‌فروشان و توزیع برق", slug: "industries/electricity-retailers" },
    ],
  },
  {
    id: "r-holding-dashboard",
    title: "داشبورد مدیریتی هلدینگ",
    slug: "reports/holding-dashboard",
    href: "/reports/holding-dashboard",
    narrativeStage: "decision",
    icon: "holding",
    description: "چندین واحد صنعتی، کشاورزی، تجاری و نیروگاهی — همه در یک صفحه، لحظه‌به‌لحظه.",
    featureGroups: [],
    sections: [
      {
        title: "چه چیزی نشان می‌دهد",
        items: [
          "مصرف لحظه‌ای همهٔ واحدها",
          "مقایسهٔ عملکرد در بازه‌های دلخواه",
          "هشدار تجاوز از دیماند",
          "گزارش تلفیقی هزینهٔ انرژی کل هلدینگ",
        ],
      },
      {
        title: "انواع مصرف‌کننده‌ای که پشتیبانی می‌شوند",
        body: [
          "دیزل برق اضطراری، نیروگاه خورشیدی، نیروگاه گازی، کنتور گاز کارخانه، موتور آب کشاورزی، کارخانه و مهمانسرا — همه روی یک داشبورد.",
        ],
      },
      {
        title: "چه تصمیمی از آن بیرون می‌آید",
        body: ["تخصیص اولویت بین سایت‌ها، و مدیریت متمرکز جرایم به‌جای پیگیری جداگانهٔ هر زیرمجموعه."],
      },
    ],
    links: [
      { label: "راهکار: مدیریت انرژی چندسایتی", slug: "solutions/multi-site" },
      { label: "صنعت: هلدینگ‌ها", slug: "industries/holdings" },
    ],
  },
];

/* Report catalogue: five categories, grouped by the decision a manager has
   to make (see «کاتالوگ گزارش‌های بهسا»). Keyed by the report id in
   seed-reports.ts; order within a category is the order listed here. */
export const REPORT_CATEGORIES = [
  { slug: "cost", name: "هزینه و قدرت قراردادی", question: "چرا قبض برق این‌قدر است؟", icon: "rial",
    reports: ["r-contracted-power", "r-peak-demand", "r-demand-excess", "r-bill-cost"] },
  { slug: "power-quality", name: "کیفیت توان و بانک خازنی", question: "جریمهٔ راکتیو و افت ولتاژ از کجاست؟", icon: "capacitor",
    reports: ["r-capacitor-design", "r-capacitor-diagnostic", "r-voltage-quality"] },
  { slug: "procurement", name: "خرید انرژی و تجدیدپذیر", question: "چقدر برق بخریم و آیا الزام رعایت شده است؟", icon: "cart",
    reports: ["r-optimal-purchase", "r-solar-share"] },
  { slug: "monitoring", name: "پایش و دادهٔ مصرف", question: "بار ما چه الگویی دارد؟", icon: "monitor",
    reports: ["r-load-profile", "r-comparison", "r-observability"] },
  { slug: "meters", name: "کنتورها و مجموعه‌های چندسایتی", question: "کدام سایت و کدام کنتور اولویت دارد؟", icon: "holding",
    reports: ["r-meter-register", "r-meter-health", "r-holding-dashboard"] },
];

/* from each page’s «چه کسی می‌خواند» section */
export const REPORT_AUDIENCE: Record<string, string[]> = {
  "r-contracted-power": ["energy-manager", "finance"],
  "r-peak-demand": ["operator"],
  "r-demand-excess": ["energy-manager", "holding"],
  "r-bill-cost": ["finance", "energy-manager"],
  "r-capacitor-design": ["electrical-engineer", "consultant"],
  "r-capacitor-diagnostic": ["electrical-engineer"],
  "r-voltage-quality": ["electrical-engineer", "retailer"],
  "r-optimal-purchase": ["energy-manager", "finance", "retailer"],
  "r-solar-share": ["energy-manager"],
  "r-load-profile": ["electrical-engineer", "energy-manager"],
  "r-comparison": ["energy-manager"],
  "r-observability": ["energy-manager", "electrical-engineer"],
  "r-meter-register": ["holding", "retailer"],
  "r-meter-health": ["retailer", "holding"],
  "r-holding-dashboard": ["holding"],
};

/* short menu label and one-line question of each report, as they stood in
   the hand-written menu before the catalogue moved into the CMS */
export const REPORT_MENU: Record<string, { label: string; question: string }> = {
  "/reports/contracted-power": { label: "بهینه‌سازی قدرت قراردادی", question: "قدرت قراردادی شما زیاد است یا کم؟" },
  "/reports/capacitor-bank-design": { label: "توان راکتیو جبرانی بانک خازنی", question: "ظرفیت، پله‌بندی، فیوز و کابل" },
  "/reports/capacitor-bank-diagnostic": { label: "نمودار ساعتی جبران‌ساز", question: "بانک خازنی موجود درست کار می‌کند؟" },
  "/reports/optimal-purchase": { label: "خرید بهینه انرژی ماه جاری", question: "چقدر برق بخریم تا جریمه نشویم؟" },
  "/reports/solar-share": { label: "ارزیابی سهم انرژی خورشیدی", question: "سهم واقعی خورشید و الزام ماده ۱۶" },
  "/reports/load-profile": { label: "پروفایل بار و دادهٔ کنتور", question: "پارامترهای الکتریکی در بازهٔ دلخواه" },
  "/reports/peak-demand": { label: "بیشینه مصرف اکتیو", question: "پیک مصرف دقیقاً کی رخ داده است؟" },
  "/reports/demand-excess-meters": { label: "کنتورهای دارای تجاوز از دیماند", question: "کدام کنتور، در چه ساعتی" },
  "/reports/consumption-comparison": { label: "مقایسه مصرف دو بازه", question: "مصرف نسبت به دورهٔ قبل چه تغییری کرد؟" },
  "/reports/bill-energy-cost": { label: "بهای انرژی مصرفی قبض", question: "مصرف و هزینه در هر بازه" },
  "/reports/observability": { label: "رویت‌پذیری دادهٔ کنتور", question: "چه بخشی از داده واقعی است، چه بخشی تخمینی؟" },
  "/reports/meter-register": { label: "کنتورهای هوشمند", question: "مشخصات کنتورها در جدول و روی نقشه" },
  "/reports/voltage-quality": { label: "هشدار کیفیت ولتاژ", question: "کدام مشترک به استابلایزر نیاز دارد؟" },
  "/reports/meter-health": { label: "سلامت کنتورها", question: "کنتور خاموش، معیوب یا مصرف مشکوک" },
  "/reports/holding-dashboard": { label: "داشبورد مدیریتی هلدینگ", question: "همهٔ زیرمجموعه‌ها در یک صفحه" },
};
