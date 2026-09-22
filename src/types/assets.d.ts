/* Turbopack returns a URL for an asset import (see `turbopackModuleType` in
   next.config docs). Only used to preload the two Arabic font subsets — the
   @font-face rules themselves still live in src/styles/fonts.css. */
declare module "*.woff2" {
  const src: string;
  export default src;
}
