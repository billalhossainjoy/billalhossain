export const scroller = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/**
 * Returns the canonical site URL.
 * Priority: NEXT_PUBLIC_SITE_URL env var → contact.website fallback → hard default.
 * Set NEXT_PUBLIC_SITE_URL in .env.local (dev) or your hosting platform (prod).
 */
export function siteUrl(contactWebsite = ""): string {
  return (
    process.env["NEXT_PUBLIC_SITE_URL"] ||
    contactWebsite ||
    "https://billalhossain.dev"
  );
}