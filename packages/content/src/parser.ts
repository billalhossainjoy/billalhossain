import matter from "gray-matter";
import type { About, ContactCardItem, ContactData, Experience, FooterData, GalleryItem, Hero, KnowledgeChunk, Project, ResumeData, Stat, SkillCategory } from "./types";

// ── Frontmatter coercion helpers ──────────────────────────────────────────────

export const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

export const num = (v: unknown, fallback = 0): number =>
  typeof v === "number" ? v : fallback;

export const bool = (v: unknown, fallback = true): boolean =>
  typeof v === "boolean" ? v : fallback;

export const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

// ── Sort helper ───────────────────────────────────────────────────────────────

export function sortPublished<T extends { published: boolean; order: number }>(
  items: T[],
  secondary: (a: T, b: T) => number,
): T[] {
  return items
    .filter((i) => i.published)
    .sort((a, b) => a.order - b.order || secondary(a, b));
}

// ── Per-type parsers (each takes a raw .md string) ────────────────────────────

export function parseAbout(raw: string): About {
  const { data } = matter(raw);

  const rawStats = Array.isArray(data["stats"]) ? data["stats"] : [];
  const stats: Stat[] = rawStats.map((s: unknown) => {
    const item = s as Record<string, unknown>;
    return {
      target: num(item["target"], 0),
      suffix: str(item["suffix"], "+"),
      label:  str(item["label"],  ""),
    };
  });

  return {
    description: str(data["description"]),
    stats,
  };
}

export function parseResume(raw: string): ResumeData {
  const { data } = matter(raw);

  const education = (Array.isArray(data["education"]) ? data["education"] : []).map((e: unknown) => {
    const item = e as Record<string, unknown>;
    return {
      institution: str(item["institution"], ""),
      degree:      str(item["degree"],      ""),
      period:      str(item["period"],      ""),
      location:    str(item["location"],    ""),
      gpa:         str(item["gpa"],         ""),
    };
  });

  const certifications = (Array.isArray(data["certifications"]) ? data["certifications"] : []).map((c: unknown) => {
    const item = c as Record<string, unknown>;
    return {
      title:  str(item["title"],  ""),
      issuer: str(item["issuer"], ""),
      year:   str(item["year"],   ""),
    };
  });

  const languages = (Array.isArray(data["languages"]) ? data["languages"] : []).map((l: unknown) => {
    const item = l as Record<string, unknown>;
    return {
      name:  str(item["name"],  ""),
      level: str(item["level"], ""),
    };
  });

  return {
    pdfUrl: str(data["pdfUrl"], "/Resume.pdf"),
    education,
    certifications,
    languages,
  };
}

export function parseFooter(raw: string): FooterData {
  const { data } = matter(raw);

  const nav     = (data["nav"]     as Record<string, unknown>) ?? {};
  const connect = (data["connect"] as Record<string, unknown>) ?? {};

  const navLinks = Array.isArray(nav["links"]) ? (nav["links"] as Record<string, unknown>[]).map((l) => ({
    label: str(l["label"], ""),
    id:    str(l["id"],    ""),
  })) : [];

  const connectLinks = Array.isArray(connect["links"]) ? (connect["links"] as Record<string, unknown>[]).map((l) => ({
    icon:  str(l["icon"],  "link"),
    label: str(l["label"], ""),
    href:  str(l["href"],  "#"),
  })) : [];

  const rawBuilt = Array.isArray(data["builtWith"]) ? (data["builtWith"] as Record<string, unknown>[]) : [];
  const builtWith = rawBuilt.map((b) => ({
    label: str(b["label"], ""),
    color: str(b["color"], "text-gray-400"),
  }));

  return {
    email:   str(data["email"],   ""),
    phone:   str(data["phone"],   ""),
    tagline: str(data["tagline"], ""),
    nav:     { title: str(nav["title"],     "Navigation"), links: navLinks     },
    connect: { title: str(connect["title"], "Connect"),    links: connectLinks },
    builtWith,
  };
}

export function parseContact(raw: string): ContactData {
  const { data } = matter(raw);

  const rawCards = Array.isArray(data["cards"]) ? data["cards"] : [];
  const cards: ContactCardItem[] = rawCards.map((c: unknown) => {
    const card = c as Record<string, unknown>;
    return {
      icon:        str(card["icon"],        "link"),
      label:       str(card["label"],       ""),
      value:       str(card["value"],       ""),
      href:        str(card["href"],        "#"),
      description: str(card["description"], ""),
      color:       str(card["color"],       "#ffffff"),
      external:    bool(card["external"],   false),
    };
  });

  return {
    email:            str(data["email"],            ""),
    phone:            str(data["phone"],            ""),
    website:          str(data["website"],          ""),
    heading:          str(data["heading"],          "Get In Touch"),
    subheading:       str(data["subheading"],       "Let's Work Together"),
    description:      str(data["description"],      ""),
    available:        bool(data["available"],        true),
    availabilityText: str(data["availabilityText"], "Available for new opportunities"),
    ctaHeading:       str(data["ctaHeading"],       "Ready to start?"),
    ctaBody:          str(data["ctaBody"],          ""),
    ctaButton:        str(data["ctaButton"],        "Send Me an Email"),
    cards,
  };
}

export function parseSkills(raw: string): SkillCategory[] {
  const { data } = matter(raw);
  const rawCats = Array.isArray(data["categories"]) ? data["categories"] : [];
  return rawCats.map((c: unknown) => {
    const cat = c as Record<string, unknown>;
    return {
      id:     str(cat["id"],    ""),
      label:  str(cat["label"], ""),
      skills: arr(cat["skills"]),
    };
  });
}

export function parseHero(raw: string): Hero {
  const { data } = matter(raw);
  return {
    name:         str(data["name"],         "Billal Hossain"),
    title:        str(data["title"],        "Full-Stack Developer"),
    subtitle:     str(data["subtitle"],     ""),
    badge:        str(data["badge"],        "Available for new projects"),
    available:    bool(data["available"],   true),
    ctaPrimary:   str(data["ctaPrimary"],   "Explore My Work"),
    ctaSecondary: str(data["ctaSecondary"], "Let's Connect"),
  };
}

export function parseProject(id: string, raw: string): Project {
  const { data } = matter(raw);
  return {
    id,
    title:        str(data["title"]),
    dateTitle:    str(data["dateTitle"]),
    descriptions: arr(data["descriptions"]),
    tags:         arr(data["tags"]),
    link:         str(data["link"]) || undefined,
    imgUrl:       str(data["imgUrl"]),
    imgAlt:       str(data["imgAlt"]),
    github:       str(data["github"]) || undefined,
    order:        num(data["order"]),
    published:    bool(data["published"]),
  };
}

export function parseExperience(id: string, raw: string): Experience {
  const { data } = matter(raw);
  return {
    id,
    company:   str(data["company"]),
    role:      str(data["role"]),
    type:      str(data["type"], "Full-time"),
    startDate: str(data["startDate"]),
    endDate:   str(data["endDate"], "Present"),
    location:  str(data["location"], "Remote"),
    logoUrl:   str(data["logoUrl"]) || undefined,
    points:    arr(data["points"]),
    tags:      arr(data["tags"]),
    order:     num(data["order"]),
    published: bool(data["published"]),
  };
}

export function parseGalleryItem(id: string, raw: string): GalleryItem {
  const { data } = matter(raw);
  return {
    id,
    imgUrl:    str(data["imgUrl"]),
    imgAlt:    str(data["imgAlt"]),
    caption:   str(data["caption"]),
    category:  str(data["category"], "general"),
    order:     num(data["order"]),
    published: bool(data["published"]),
  };
}

// ── RAG chunk builder ─────────────────────────────────────────────────────────

export interface AllContent {
  hero:        Hero;
  about:       About;
  skills:      SkillCategory[];
  projects:    Project[];
  experiences: Experience[];
  contact:     ContactData;
  resume:      ResumeData;
  others:      KnowledgeChunk[];   // pre-built chunks from others/ folder
}

export function buildKnowledgeChunks(data: AllContent): KnowledgeChunk[] {
  const { hero, about, skills, projects, experiences, contact, resume, others } = data;
  const chunks: KnowledgeChunk[] = [];

  // ── About + hero (who Billal is) ──────────────────────────────────────────
  const statsText = about.stats.map((s) => `${s.label}: ${s.target}${s.suffix}`).join(", ");
  chunks.push({
    id: "about-billal",
    content: [
      `${hero.name} is a ${hero.title} based in Bangladesh.`,
      about.description,
      statsText ? `Key stats — ${statsText}.` : "",
      hero.available ? `${hero.badge}.` : "Currently not available for new projects.",
    ].filter(Boolean).join(" "),
    metadata: { category: "about", title: `About ${hero.name}` },
  });

  // ── Skills (one chunk per category, from skills.md) ───────────────────────
  for (const cat of skills) {
    if (cat.skills.length === 0) continue;
    chunks.push({
      id: `skills-${cat.id}`,
      content: `${hero.name}'s ${cat.label} skills include: ${cat.skills.join(", ")}.`,
      metadata: { category: "skills", title: `${cat.label} Skills`, tags: cat.skills },
    });
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  for (const p of projects) {
    chunks.push({
      id: `project-${p.id}`,
      content: [
        `Project: ${p.title} (${p.dateTitle})`,
        `Tech stack: ${p.tags.join(", ")}`,
        ...p.descriptions,
        p.link   ? `Live demo: ${p.link}`     : "",
        p.github ? `Source code: ${p.github}` : "",
      ].filter(Boolean).join("\n"),
      metadata: { category: "project", title: p.title, tags: p.tags },
    });
  }

  // ── Experience ────────────────────────────────────────────────────────────
  for (const e of experiences) {
    chunks.push({
      id: `experience-${e.id}`,
      content: [
        `${e.role} at ${e.company} (${e.startDate} – ${e.endDate})`,
        `Type: ${e.type}, Location: ${e.location}`,
        ...e.points,
      ].join("\n"),
      metadata: { category: "experience", title: `${e.role} at ${e.company}`, tags: e.tags },
    });
  }

  // ── Contact (all cards from contact.md) ───────────────────────────────────
  const resumePageUrl = contact.website
    ? `${contact.website.replace(/\/$/, "")}/resume`
    : "/resume";
  const resumePdfUrl = contact.website
    ? `${contact.website.replace(/\/$/, "")}${resume.pdfUrl}`
    : resume.pdfUrl;

  const contactLines = [
    `How to contact ${hero.name}:`,
    contact.email    ? `Email: ${contact.email}`                          : "",
    contact.phone    ? `Phone / WhatsApp: ${contact.phone}`               : "",
    ...contact.cards.map((c) => `${c.label}: ${c.href}  (${c.value})`),
    `Resume / CV page: ${resumePageUrl}`,
    `Direct PDF download: ${resumePdfUrl}`,
  ].filter(Boolean);

  chunks.push({
    id: "contact-billal",
    content: contactLines.join("\n"),
    metadata: { category: "contact", title: "Contact Information" },
  });

  // Others: free-form context chunks (already pre-built)
  chunks.push(...others);

  return chunks;
}
