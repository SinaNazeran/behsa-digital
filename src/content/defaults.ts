import type { SiteSettings } from "@/db/schema";

/* Fallback values — used by the seed and whenever a settings field is empty. */
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "بهسا دیجیتال",
  tagline: "محاسبهٔ اقلام جریمه‌پذیر قبض برق، پیش از صدور قبض",
  defaultDescription: "بهسا دیجیتال از دادهٔ کنتور هوشمند، اقلام جریمه‌پذیر قبض برق صنعتی — دیماند، ضریب توان و کسری خرید — را پیش از صدور قبض محاسبه می‌کند و هشدار می‌دهد.",
  phoneDisplay: "+98 51 35412240 - 1",
  phoneHref: "tel:+985135412240",
  email: "info@bst.co.ir",
  address: "مشهد - شهرک صنعتی توس - فاز یک - انتهای بلوار صنعت - پلاک ۳۷۰",
  workingHours: "شنبه تا چهارشنبه — ساعات ۷ تا ۱۵:۳۰",
  baleUrl: "https://ble.ir/behsa_digital",
  panelUrl: "https://panel.behsa-digital.ir/login",
  footerAbout: "از دادهٔ کنتور هوشمندی که همین حالا دارید، اقلام جریمه‌پذیر قبض برق را پیش از صدور قبض محاسبه می‌کنیم.",
  defaultOgMediaId: null,
};
