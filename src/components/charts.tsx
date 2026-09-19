/* SVG chart primitives — RTL time axis: oldest values on the right, newest on the left */

/* Data palette. Built from the two brand hues separated by lightness
   rather than by adding new hues, so it survives colour-vision
   deficiency: worst-case pairwise ΔE(OKLab) is 0.162 across
   protanopia, deuteranopia and tritanopia (the previous sky-blue /
   mint / amber set fell to 0.049 under deuteranopia, i.e. the "good"
   and "bad" series were the same colour). Every entry also clears
   3:1 against white, which the old #f5a524 (2.04:1) did not.

   Four series is the hard ceiling — beyond that no colour-only
   scheme stays distinguishable; label the lines directly instead. */
export const SERIES = {
  grid: "#0062BD",   /* series 1 · grid / base load        6.03:1 */
  solar: "#FA6400",  /* series 2 · generation / solar      3.05:1 */
  deep: "#8D3605",   /* series 3 · diesel / third series   7.89:1 */
  slate: "#88929F",  /* baseline / contracted target       3.15:1 */
} as const;

/* semantic accents — at most one per chart, never as a series colour */
const OK = "#0F8F5A";     /* 4.12:1 */
const WARN = "#96650A";   /* 5.04:1 */
const OVER = "#C6423B";   /* 4.95:1 */

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

/** data[0] = oldest → rendered at the right edge (RTL) */
function toPts(data: number[], w: number, h: number, pad = 6): [number, number][] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data.map((v, i) => [
    w - pad - (i / (data.length - 1)) * (w - pad * 2),
    h - pad - ((v - min) / span) * (h - pad * 2),
  ]);
}

export function Spark({ data, color = SERIES.grid, w = 90, h = 30 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const pts = toPts(data, w, h, 3);
  const d = smoothPath(pts);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" aria-hidden="true">
      <path d={`${d} L ${pts[pts.length - 1][0]} ${h} L ${pts[0][0]} ${h} Z`} fill={color} opacity="0.12" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.4" fill={color} />
    </svg>
  );
}

export function AreaLine({
  data, color = SERIES.grid, height = 220, yLabels = [], unit = "",
}: { data: number[]; color?: string; height?: number; yLabels?: string[]; unit?: string }) {
  const w = 640;
  const h = height;
  const pts = toPts(data, w, h - 26, 10);
  const d = smoothPath(pts);
  const last = pts[pts.length - 1];
  const gid = `g-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="نمودار مصرف ۳۰ روز اخیر">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="8" x2={w - 8} y1={(h - 26) * t + 4} y2={(h - 26) * t + 4} stroke="currentColor" strokeOpacity="0.09" strokeDasharray="3 5" />
      ))}
      {yLabels.map((l, i) => (
        <text key={l} x={w - 10} y={(h - 26) * ((i + 1) / 4) + 8} fontSize="10.5" fill="currentColor" opacity="0.55" textAnchor="end" fontFamily="Vazirmatn">
          {l}
        </text>
      ))}
      <path d={`${d} L ${last[0]} ${h - 26} L ${pts[0][0]} ${h - 26} Z`} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" className="chart-line" style={{ ["--dash" as string]: 1600 }} />
      <circle cx={last[0]} cy={last[1]} r="4.5" fill={color} stroke="var(--color-surface)" strokeWidth="2" />
      <circle cx={last[0]} cy={last[1]} r="9" fill={color} opacity="0.18" className="blink" />
      <text x={last[0] + 14} y={last[1] - 10} fontSize="12" fill={color} fontFamily="Vazirmatn" fontWeight="700">{unit}</text>
    </svg>
  );
}

export function DemandBars({ data, threshold = 90, labels }: { data: number[]; threshold?: number; labels?: [string, string] }) {
  const w = 640;
  const h = 190;
  const max = 100;
  const bw = (w - 30) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="نمودار روزانه دیماند">
      <line x1="8" x2={w - 8} y1={h - 34 - (threshold / max) * (h - 48)} y2={h - 34 - (threshold / max) * (h - 48)} stroke={WARN} strokeDasharray="5 5" strokeWidth="1.5" />
      <text x={w - 10} y={h - 40 - (threshold / max) * (h - 48)} fontSize="10.5" fill={WARN} textAnchor="end" fontFamily="Vazirmatn">
        آستانه هشدار ۹۰٪
      </text>
      {data.map((v, i) => {
        const bh = (v / max) * (h - 48);
        const x = w - 14 - (i + 1) * bw + bw * 0.18;
        const over = v >= threshold;
        return (
          <g key={i}>
            <rect
              x={x} y={h - 34 - bh} width={bw * 0.64} height={bh} rx="3"
              fill={over ? OVER : i === data.length - 1 ? SERIES.grid : SERIES.slate}
              className="bar-grow"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <title>{`${v}٪ از دیماند قراردادی`}</title>
            </rect>
          </g>
        );
      })}
      {labels && (
        <>
          <text x={w - 12} y={h - 14} fontSize="11" fill="currentColor" opacity="0.5" textAnchor="end" fontFamily="Vazirmatn">{labels[0]}</text>
          <text x="12" y={h - 14} fontSize="11" fill="currentColor" opacity="0.5" textAnchor="start" fontFamily="Vazirmatn">{labels[1]}</text>
        </>
      )}
    </svg>
  );
}

export function PowerGauge({ value = 0.94 }: { value?: number }) {
  const v = Math.min(Math.max(value, 0), 1);
  const cx = 100, cy = 92, r = 72;
  const arc = (from: number, to: number) => {
    const a0 = Math.PI * (1 + from), a1 = Math.PI * (1 + to);
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };
  const needleAngle = -180 + v * 180;
  return (
    <svg viewBox="0 0 200 110" className="w-full h-auto" role="img" aria-label={`ضریب توان ${value}`}>
      {/* zones run at full opacity — the old 0.85 knocked each one below the 3:1 floor */}
      <path d={arc(0, 0.55)} stroke={OVER} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d={arc(0.58, 0.78)} stroke={WARN} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d={arc(0.81, 1)} stroke={OK} strokeWidth="11" strokeLinecap="round" fill="none" />
      {[0, 0.5, 1].map((t) => (
        <text key={t} x={cx + (r + 14) * Math.cos(Math.PI * (1 + t))} y={cy + (r + 14) * Math.sin(Math.PI * (1 + t)) + 4} fontSize="10" fill="currentColor" opacity="0.55" textAnchor="middle" fontFamily="Vazirmatn">
          {t === 0 ? "۰" : t === 0.5 ? "۰٫۵" : "۱"}
        </text>
      ))}
      <g className="gauge-needle" style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
        <line x1={cx} y1={cy} x2={cx} y2={cy - r + 16} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r="6" fill="currentColor" />
      <text x={cx} y={cy - 22} fontSize="21" fontWeight="800" fill="currentColor" textAnchor="middle" fontFamily="Estedad">۰٫۹۴</text>
    </svg>
  );
}

export function Donut({ segments, centerTop, centerBottom }: { segments: { v: number; c: string }[]; centerTop: string; centerBottom: string }) {
  const r = 54, C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 150 150" className="w-full h-auto" role="img" aria-label="سهم منابع انرژی">
      <circle cx="75" cy="75" r={r} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="16" />
      {segments.map((s, i) => {
        const len = (s.v / 100) * C;
        const el = (
          <circle key={i} cx="75" cy="75" r={r} fill="none" stroke={s.c} strokeWidth="16"
            strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} transform="rotate(-90 75 75)" strokeLinecap="butt" />
        );
        acc += len;
        return el;
      })}
      <text x="75" y="71" fontSize="21" fontWeight="800" fill="currentColor" textAnchor="middle" fontFamily="Estedad">{centerTop}</text>
      <text x="75" y="90" fontSize="10.5" fill="currentColor" opacity="0.65" textAnchor="middle" fontFamily="Vazirmatn">{centerBottom}</text>
    </svg>
  );
}

/* Generated thumbnail for article cards — data-viz instead of stock photos */
export function Thumb({ chart, cat, accent = SERIES.grid }: { chart: "line" | "bars" | "donut" | "area"; cat: string; accent?: string }) {
  const seed = cat.length * 7 + cat.charCodeAt(0);
  const data = Array.from({ length: 12 }, (_, i) => 30 + Math.abs(Math.sin(seed + i * 1.7)) * 55 + (i % 3) * 6);
  return (
    <div className="relative overflow-hidden bg-navy grid-dark" dir="ltr">
      <svg viewBox="0 0 400 220" className="w-full h-auto block" aria-hidden="true">
        <defs>
          <linearGradient id={`tg-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {chart === "bars" ? (
          data.map((v, i) => (
            <rect key={i} x={20 + i * 31} y={190 - v * 1.7} width="19" height={v * 1.7} rx="3" fill={accent} opacity={0.35 + (i / data.length) * 0.65} />
          ))
        ) : chart === "donut" ? (
          <>
            <circle cx="200" cy="110" r="62" fill="none" stroke="#3C4855" strokeWidth="22" />
            <circle cx="200" cy="110" r="62" fill="none" stroke={accent} strokeWidth="22" strokeDasharray="245 144" transform="rotate(-90 200 110)" />
            <circle cx="200" cy="110" r="62" fill="none" stroke="#23AC6F" strokeWidth="22" strokeDasharray="78 311" strokeDashoffset="-245" transform="rotate(-90 200 110)" />
          </>
        ) : (
          (() => {
            const pts: [number, number][] = data.map((v, i) => [20 + (i / (data.length - 1)) * 360, 195 - v * 1.75]);
            const d = smoothPath(pts);
            return (
              <>
                {chart === "area" && <path d={`${d} L 380 200 L 20 200 Z`} fill={`url(#tg-${seed})`} />}
                <path d={d} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill={accent} />
              </>
            );
          })()
        )}
      </svg>
      <div dir="rtl" className="absolute top-3 right-3 rounded-xs bg-navy2/90 border border-navyline px-2.5 py-1 text-[11px] font-semibold text-neutral-200">
        {cat}
      </div>
    </div>
  );
}
