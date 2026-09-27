import Link from "next/link";
import type { AnchorHTMLAttributes, Ref } from "react";

/* Internal paths → next/link (client navigation + prefetch);
   external, tel:, mailto:, in-page (#id), new-tab and download links →
   plain <a> (a prefetch of a file would fetch the whole file). */
export function SmartLink({
  href = "",
  ref,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string; ref?: Ref<HTMLAnchorElement> }) {
  const internal = href.startsWith("/") && !href.startsWith("//") && rest.target !== "_blank" && rest.download === undefined;
  if (internal) return <Link href={href} ref={ref} {...rest} />;
  return <a href={href} ref={ref} {...rest} />;
}
