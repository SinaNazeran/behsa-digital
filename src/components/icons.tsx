import type { ReactNode, SVGProps } from "react";

/* Custom stroke icon set — technical / engineering language, 24×24 grid */

const P: Record<string, ReactNode> = {
  bolt: <path d="M13 2 5.5 13.2h5L9.5 22 17 10.8h-5L13 2Z" />,
  gauge: (<><path d="M4 15a8 8 0 0 1 16 0" /><path d="M12 15 15.5 9.5" /><path d="M4 19h16" /></>),
  capacitor: (<><path d="M2 12h7M15 12h7" /><path d="M9 6v12M15 6v12" /></>),
  peak: (<><path d="m3 19 5.5-8 3 4 3.5-6 6 10H3Z" /><path d="M3 19h18" /></>),
  eyeoff: (<><path d="M10.6 5.3A9.6 9.6 0 0 1 12 5.2c4.5 0 7.9 3.1 9.5 6.8-0.6 1.4-1.5 2.7-2.6 3.8M6.2 6.9C4.4 8.2 3 9.9 2.5 12c1.6 3.7 5 6.8 9.5 6.8 1.4 0 2.7-.3 3.9-.8" /><path d="m3 3 18 18" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>),
  eye: (<><path d="M2.5 12c1.6-3.7 5-6.8 9.5-6.8s7.9 3.1 9.5 6.8c-1.6 3.7-5 6.8-9.5 6.8s-7.9-3.1-9.5-6.8Z" /><circle cx="12" cy="12" r="3" /></>),
  monitor: (<><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="m6 11 2.5-2.5L11 11l2.5-3.5L18 11" /><path d="M8.5 20.5h7" /></>),
  analyze: (<><path d="M3.5 3.5v17h17" /><path d="m7 13 3.5-3.5 2.5 2.5 4.5-5" /><circle cx="17.5" cy="7" r="1" /></>),
  forecast: (<><path d="M3.5 19.5h17" /><path d="m4 15 4-4 3 2.5L16 8" strokeDasharray="0" /><path d="M16 8l2-2m0 0h-3.4M18 6v3.4" /></>),
  optimize: (<><path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h13M20.5 17h-.5" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="19" cy="17" r="2" /></>),
  cart: (<><path d="M3 4h2.5l2 11h10l2-8H7" /><circle cx="9" cy="19.5" r="1.6" /><circle cx="16.5" cy="19.5" r="1.6" /><path d="m11.5 8.5-1.3 2h2l-1.3 2" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9 6.7 6.7M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>),
  wave: <path d="M2.5 12c1.6-4.5 3.2-7 4.8-7s3.2 2.5 4.7 7 3.1 7 4.7 7 3.2-2.5 4.8-7" />,
  holding: (<><path d="M3 20.5h18" /><rect x="4" y="11" width="7" height="9.5" /><rect x="13" y="4" width="7" height="16.5" /><path d="M6.5 14h2M6.5 17h2M15.5 7.5h2M15.5 11h2M15.5 14.5h2" /></>),
  rial: (<><circle cx="12" cy="12" r="8.5" /><path d="M8 9.5c2.5-1.5 5.5-1.5 8 0M8 12c2.5-1.5 5.5-1.5 8 0M12 12v4.5" /></>),
  realtime: (<><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5M12 3a9 9 0 0 1 9 9" /><path d="M12 17.5A5.5 5.5 0 0 1 6.5 12M12 21a9 9 0 0 1-9-9" /></>),
  loadprofile: (<><path d="M3 18h3v-4h3.5V9h3.5v4H16V6h3" /><path d="M3 21h18" /></>),
  compare: (<><path d="M7 20V9M12 20V4M17 20v-7" /><path d="M4 5.5 7 3l3 2.5" /></>),
  demand: (<><path d="M4 16a8 8 0 0 1 16 0" /><path d="M12 16l4.5-3" /><path d="M12 3.5V5.5M4.5 7.5 6 8.8M19.5 7.5 18 8.8" /><path d="M3 19.5h18" /></>),
  contract: (<><path d="M6 2.5h9L19 6.5v15H6v-19Z" /><path d="M14.5 2.5v4.5H19" /><path d="m9.5 14 1.8 1.8 3.4-3.6" /><path d="M9 18.5h6.5" /></>),
  reactive: (<><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M18 3v4h-4" /><circle cx="12" cy="12" r="2.5" /></>),
  purchase: (<><path d="M5.5 8h13l-1 13h-11L5.5 8Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /><path d="m12.6 12-1.2 1.8h2l-1.2 1.8" /></>),
  solar: (<><path d="m5 8 1.5 12h11L19 8H5Z" /><path d="M9 20l1-12M14 20l-1-12M4 14h16M12 4.5V2.8M8.5 5.2 7.3 4M15.5 5.2l1.2-1.2" /></>),
  voltage: (<><path d="M2.5 7h5l2 10 2.5-14 2 9 1.5-5h6" /></>),
  board: (<><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="5" rx="1.5" /><rect x="13" y="10" width="8" height="11" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /></>),
  factory: (<><path d="M3 20.5V9l5 3V9l5 3V4.5h8v16H3Z" /><path d="M7 17h2M12 17h2M17 17h2M18.5 7.5h-2" /></>),
  org: (<><rect x="5" y="3" width="14" height="17.5" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10.5 20.5v-3h3v3" /></>),
  plant: (<><path d="M5 20.5 7 9h4l2 11.5M15.5 20.5l1-6h3l1 6" /><path d="M3 20.5h18" /><path d="M9 5.5C7.5 5 7.5 3.5 8.5 2.5M12 5.5c-1-.5-1-1.7-.3-2.7" /></>),
  retail: (<><path d="M4 9.5 5.5 4h13L20 9.5" /><path d="M4 9.5a2.7 2.7 0 0 0 5.4 0 2.6 2.6 0 0 0 5.2 0 2.7 2.7 0 0 0 5.4 0" /><path d="M5 12v8.5h14V12" /><path d="M9.5 20.5v-5h5v5" /></>),
  consultant: (<><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" /></>),
  save: (<><circle cx="12" cy="13.5" r="7.5" /><path d="M12 10v7M9.5 14.5 12 17l2.5-2.5" /><path d="M8.5 4.5 12 2.5l3.5 2" /></>),
  shield: (<><path d="M12 2.5 19.5 5.5v6c0 4.5-3 8.5-7.5 10-4.5-1.5-7.5-5.5-7.5-10v-6L12 2.5Z" /><path d="m9 11.5 2 2 4-4" /></>),
  speed: (<><circle cx="12" cy="13" r="7.5" /><path d="M12 13V9.5" /><path d="M12 2.5v2M9 3l.5 1.5" /></>),
  precision: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>),
  central: (<><circle cx="12" cy="12" r="3" /><circle cx="4.5" cy="5" r="1.8" /><circle cx="19.5" cy="5" r="1.8" /><circle cx="4.5" cy="19" r="1.8" /><circle cx="19.5" cy="19" r="1.8" /><path d="m6 6.3 3.8 3.4M18 6.3l-3.8 3.4M6 17.7l3.8-3.4M18 17.7l-3.8-3.4" /></>),
  data: (<><ellipse cx="12" cy="5.5" rx="8" ry="3" /><path d="M4 5.5V18c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5" /><path d="M4 11.8c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>),
  tech: (<><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="10" y="10" width="4" height="4" /><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" /></>),
  decision: (<><path d="M12 3v6" /><path d="M12 9c0 3-5 4-5 8v4M12 9c0 3 5 4 5 8v4" /><circle cx="12" cy="3.5" r="1.5" /><circle cx="7" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /></>),
  alert: (<><path d="M12 3.5 22 20H2L12 3.5Z" /><path d="M12 10v4" /><circle cx="12" cy="17" r="0.4" fill="currentColor" /></>),
  check: (<><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.4 2.4 4.6-4.8" /></>),
  info: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.4" fill="currentColor" /></>),
  chart: (<><path d="M4 4v16h16" /><path d="M8 16v-5M12 16V7M16 16v-8" /></>),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  phone: <path d="M5 3.5h4l1.5 4.5-2.2 1.6a12 12 0 0 0 6.1 6.1l1.6-2.2 4.5 1.5v4c0 .6-.5 1.1-1.1 1-8.4-.8-14.6-7-15.4-15.4-.1-.6.4-1.1 1-1.1Z" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>),
  pin: (<><path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5Z" /><circle cx="12" cy="9.8" r="2.5" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M8 2.5V7M16 2.5V7M3.5 10.5h17" /></>),
  search: (<><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>),
  arrowL: <path d="M20 12H4m0 0 6-6m-6 6 6 6" />,
  arrowR: <path d="M4 12h16m0 0-6-6m6 6-6 6" />,
  linkedin: (<><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" /><path d="M8 10.5V17M8 7.2v.3M12 17v-3.8c0-1.5 1-2.4 2.2-2.4S16 11.7 16 13.2V17" /></>),
  telegram: (<><path d="m21 4.5-18 7 5 1.8M21 4.5l-2.5 15-7.5-5.2M21 4.5 8 13.3v4.5l2.7-3" /></>),
  instagram: (<><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.5" fill="currentColor" /></>),
  xsocial: <path d="M4 4l16 16M20 4 4 20" />,
  bale: (
    <>
      <path d="M3.6 2.12C2.52 2.16 2 2.72 2 3.1V12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C9.8 2 7.76 2.71 6.15 3.89L3.6 2.12Z" />
      <path d="m7.2 12 3.4 3.4 5.8-5.8" />
    </>
  ),
  baleSolid: (
    <g stroke="none" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.595 2.125C2.524 2.158 2 2.72 2 3.095V12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C9.8 2 7.76 2.71 6.15 3.89L3.595 2.125ZM16.44 7.46C15.936 7.447 15.449 7.627 15.076 7.962L10.651 12.397L8.924 10.662C8.178 9.988 7.042 10.026 6.34 10.732C5.638 11.437 5.674 12.574 6.41 13.25L9.273 16.536C10.034 17.297 11.269 17.297 12.03 16.536L17.84 10.728C18.57 9.998 18.57 8.81 17.84 8.08C17.45 7.69 16.94 7.47 16.44 7.46Z" />
    </g>
  ),
  doc: (<><path d="M6 2.5h9L19 6.5v15H6v-19Z" /><path d="M14.5 2.5v4.5H19" /><path d="M9 12h6M9 15.5h6" /></>),
  send: <path d="m3.5 11 17-7.5L14 20.5l-3-6.5-7.5-3Z M11 14l9.5-10.5" />,
  play: <path d="M8.5 5.5v13l10.5-6.5L8.5 5.5Z" />,
  pause: <path d="M9 5.5v13M15 5.5v13" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  leaf: (<><path d="M4 20C4 11 11 4 20 4c0 9-7 16-16 16Z" /><path d="M4 20c4-6 8-10 14-14" /></>),
  login: (<><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="m14 17-5-5 5-5" /><path d="M9 12h12" /></>),
  external: (<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></>),
};

export type IconName = keyof typeof P & string;

/** every icon an editor may choose from (constrained enum for CMS input) */
export const ICON_NAMES = Object.keys(P) as IconName[];
export const isIconName = (v: string): v is IconName => Object.hasOwn(P, v);

export function Icon({
  name,
  size = 22,
  sw = 1.7,
  className,
  ...rest
}: { name: IconName; size?: number; sw?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {P[name] ?? P.bolt}
    </svg>
  );
}

/* Brand logo mark — lightning fused with a data node */
export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="41" height="41" rx="10" fill="#0062BD" />
      <rect x="1.5" y="1.5" width="41" height="41" rx="10" stroke="#023D79" strokeOpacity="0.4" />
      <path d="M24.5 7 12.5 23.5h7L18 37l13.5-17h-7.5L24.5 7Z" fill="#FD9264" />
      <circle cx="33" cy="33" r="2.2" fill="#E2EEFD" />
    </svg>
  );
}
