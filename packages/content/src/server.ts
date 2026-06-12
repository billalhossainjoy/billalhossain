/**
 * server.ts — Node.js content reader
 *
 * Uses `fs` to read markdown files at runtime. Only call this from
 * server-side code (Next.js server components, API routes, scripts).
 * import.meta.url resolves to this file's location so the md/ directory
 * is always found regardless of where the consuming app's cwd is.
 *
 * md/ structure:
 *   site/        ← UI section files (hero, about, skills, contact, footer, resume)
 *   projects/    ← one file per project
 *   experience/  ← one file per role
 *   gallery/     ← one file per image
 *   others/      ← free-form RAG-only context (not shown in portfolio UI)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  buildKnowledgeChunks,
  parseAbout,
  parseContact,
  parseExperience,
  parseFooter,
  parseGalleryItem,
  parseHero,
  parseProject,
  parseResume,
  parseSkills,
  sortPublished,
} from "./parser";
import type {
  About, ContactData, Experience, FooterData, GalleryItem,
  Hero, KnowledgeChunk, Project, ResumeData, SkillCategory,
} from "./types";

const MD_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "md");

// ── Low-level helpers ─────────────────────────────────────────────────────────

function readDir(subDir: string): { id: string; raw: string }[] {
  const dir = path.join(MD_DIR, subDir);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({
        id:  f.replace(/\.md$/, ""),
        raw: fs.readFileSync(path.join(dir, f), "utf8"),
      }));
  } catch {
    return [];
  }
}

function readFile(filePath: string): string {
  try {
    return fs.readFileSync(path.join(MD_DIR, filePath), "utf8");
  } catch {
    return "";
  }
}

// ── Site section readers (site/ subfolder) ────────────────────────────────────

export function getHero():    Hero         { return parseHero(readFile("site/hero.md"));       }
export function getAbout():   About        { return parseAbout(readFile("site/about.md"));     }
export function getSkills():  SkillCategory[] { return parseSkills(readFile("site/skills.md")); }
export function getContact(): ContactData  { return parseContact(readFile("site/contact.md")); }
export function getFooter():  FooterData   { return parseFooter(readFile("site/footer.md"));   }
export function getResume():  ResumeData   { return parseResume(readFile("site/resume.md"));   }

// ── Collection readers ────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  const items = readDir("projects").map(({ id, raw }) => parseProject(id, raw));
  return sortPublished(items, (a, b) => a.title.localeCompare(b.title));
}

export function getExperiences(): Experience[] {
  const items = readDir("experience").map(({ id, raw }) => parseExperience(id, raw));
  return sortPublished(items, (a, b) => a.company.localeCompare(b.company));
}

export function getGalleryItems(): GalleryItem[] {
  const items = readDir("gallery").map(({ id, raw }) => parseGalleryItem(id, raw));
  return sortPublished(items, (a, b) => a.id.localeCompare(b.id));
}

// ── Others: free-form RAG context (others/ subfolder) ────────────────────────
// Each file's markdown body is used as a knowledge chunk.
// Frontmatter supports: title (string), skip (boolean).

export function getOthersChunks(): KnowledgeChunk[] {
  return readDir("others").flatMap(({ id, raw }) => {
    const { data, content } = matter(raw);
    if (data["skip"] === true) return [];
    const text = content.trim();
    if (!text) return [];
    return [{
      id:       `other-${id}`,
      content:  text,
      metadata: {
        category: "about" as const,
        title:    typeof data["title"] === "string" ? data["title"] : id,
      },
    }];
  });
}

// ── Knowledge chunks (all sources combined) ───────────────────────────────────

export function getKnowledgeChunks(): KnowledgeChunk[] {
  return buildKnowledgeChunks({
    hero:        getHero(),
    about:       getAbout(),
    skills:      getSkills(),
    projects:    getProjects(),
    experiences: getExperiences(),
    contact:     getContact(),
    resume:      getResume(),
    others:      getOthersChunks(),
  });
}
