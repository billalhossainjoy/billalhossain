import { getContact, getHero, getSkills } from "@/lib/content";
import { siteUrl } from "@/utils";

export default function JsonLd() {
  const hero    = getHero();
  const contact = getContact();
  const skills  = getSkills();

  const sameAs     = contact.cards.filter((c) => c.external && c.href).map((c) => c.href);
  const knowsAbout = skills.flatMap((cat) => cat.skills);

  const schema = {
    "@context": "https://schema.org",
    "@type":    "Person",
    name:       hero.name,
    url:        siteUrl(contact.website),
    jobTitle:   hero.title,
    description: hero.subtitle,
    email:      contact.email,
    telephone:  contact.phone || undefined,
    sameAs,
    knowsAbout,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
