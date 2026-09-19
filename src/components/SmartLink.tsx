import Link from "next/link";
import type { AnchorHTMLAttributes, Ref } from "react";

/* Internal paths → next/link (client navigation + prefetch);
   external, tel:, mailto:, in-page (#id) and new-tab links → plain <a>. */
export function SmartLink({
  href = "",
  ref,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string; ref?: Ref<HTMLAnchorElement> }) {
  const internal = href.startsWith("/") && !href.startsWith("//") && rest.target !== "_blank";
  if (internal) return <Link href={href} ref={ref} {...rest} />;
  return <a href={href} ref={ref} {...rest} />;
}
