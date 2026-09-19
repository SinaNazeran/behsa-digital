/* Link validation shared by the CMS actions and the check script.
   Kept free of server-only imports so it can be unit-checked. */

/* Links an editor may enter. Anything else — javascript:, data:,
   vbscript: — is rejected at the trust boundary, never rendered. */
/* `\/(?!\/)` also rejects protocol-relative "//evil.com", which looks
   internal in a form field but navigates off-site. */
const HREF_RE = /^(?:\/(?!\/)[^\s"'<>]*|https?:\/\/[^\s"'<>]+|mailto:[^\s"'<>]+|tel:\+?[\d\s()-]+|#[\w-]*)$/;

/** empty is allowed (optional link); everything else must be a safe shape */
export const isSafeHref = (v: string) => v === "" || HREF_RE.test(v);
