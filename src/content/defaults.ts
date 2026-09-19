import type { SiteSettings } from "@/db/schema";

/* Fallback values — used by the seed and whenever a settings field is empty. */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "بهسا دیجیتال",
  tagline: "سامانه هوشمند مدیریت انرژی",
  defaultDescription: "بهسا دیجیتال — سامانه هوشمند پایش، تحلیل و بهینه‌سازی مصرف انرژی برای صنایع، سازمان‌ها و هلدینگ‌ها",
  phoneDisplay: "+98 51 35412240 - 1",
  phoneHref: "tel:+985135412240",
  email: "info@bst.co.ir",
  address: "مشهد - شهرک صنعتی توس - فاز یک - انتهای بلوار صنعت - پلاک ۳۷۰",
  workingHours: "شنبه تا چهارشنبه — ساعات ۷ تا ۱۵:۳۰",
  baleUrl: "https://ble.ir/behsa_digital",
  panelUrl: "https://panel.behsa-digital.ir/login",
  footerAbout: "پایش دقیق، تحلیل هوشمند و تصمیم‌گیری بهتر برای مدیریت انرژی صنایع، سازمان‌ها و هلدینگ‌ها.",
  defaultOgMediaId: null,
};
