/* ── Customer logos · the «مورد اعتماد سازمان‌های پیشرو» strip under the hero ──
   Only list organisations that have given written permission to show
   their brand (docs/content-strategy.md §Trust / Proof).

   Adding a logo:
     1. put a transparent, tightly cropped SVG in public/logos/ (kebab-case
        English file name, no embedded raster, no white backdrop shape —
        the strip renders every logo in solid white)
     2. add a row here; `ratio` is the SVG viewBox width ÷ height
   `npm run check` fails if the file is missing or the ratio is off. */

export type Customer = { name: string; logo: string; ratio: number };

export const CUSTOMERS: Customer[] = [
  { name: "بانک ملی ایران", logo: "/logos/bank-melli.svg", ratio: 1.97 },
  { name: "ایران خودرو", logo: "/logos/iran-khodro.svg", ratio: 0.89 },
  { name: "بنیاد مستضعفان انقلاب اسلامی", logo: "/logos/bonyad.svg", ratio: 3.79 },
  { name: "سایپا", logo: "/logos/saipa.svg", ratio: 0.78 },
  { name: "شستا", logo: "/logos/shasta.svg", ratio: 3.12 },
  { name: "بانک سینا", logo: "/logos/bank-sina.svg", ratio: 0.76 },
  { name: "فرودگاه بین‌المللی مشهد", logo: "/logos/mashhad-airport.svg", ratio: 3.93 },
  { name: "گلرنگ", logo: "/logos/golrang.svg", ratio: 1.35 },
  { name: "بیمه سینا", logo: "/logos/sina-insurance.svg", ratio: 1.88 },
  { name: "آب و فاضلاب خراسان رضوی", logo: "/logos/abfa-khorasan.svg", ratio: 1.01 },
  { name: "افق کوروش", logo: "/logos/ofogh-koorosh.svg", ratio: 3.55 },
  { name: "بانک مهر ایران", logo: "/logos/bank-mehr.svg", ratio: 1.08 },
  { name: "مگفا", logo: "/logos/magfa.svg", ratio: 1.83 },
  { name: "فروکروم جغتای", logo: "/logos/ferrochrome-joghatai.svg", ratio: 1.32 },
  { name: "عالیس", logo: "/logos/alis.svg", ratio: 2.21 },
  { name: "نوری تازه", logo: "/logos/nouri-tazeh.svg", ratio: 3.59 },
];
