/**
 * worker.ts — Cloudflare Worker content reader
 *
 * esbuild bundles every *.md import as a plain text string at deploy time.
 * No filesystem access needed at runtime.
 *
 * md/ structure:
 *   site/       ← UI section files (hero, about, skills, contact, footer, resume)
 *   projects/   ← one file per project
 *   experience/ ← one file per role
 *   others/     ← free-form RAG-only context
 *
 * To add new content: create the .md file → add an import below → redeploy → POST /sync
 */
import matter from "gray-matter";
import {
  buildKnowledgeChunks,
  parseAbout,
  parseContact,
  parseExperience,
  parseHero,
  parseProject,
  parseResume,
  parseSkills,
  sortPublished,
} from "./parser";
import type { Experience, KnowledgeChunk, Project } from "./types";

// ── site/ imports ─────────────────────────────────────────────────────────────

import heroRaw    from "../md/site/hero.md";
import aboutRaw   from "../md/site/about.md";
import skillsRaw  from "../md/site/skills.md";
import contactRaw from "../md/site/contact.md";
import resumeRaw  from "../md/site/resume.md";

// ── projects/ imports ─────────────────────────────────────────────────────────

import cfmRaw       from "../md/projects/cfm.md";
import chattyRaw    from "../md/projects/chatty.md";
import gqlRaw       from "../md/projects/gql.md";
import messengerRaw from "../md/projects/messenger.md";
import socialRaw    from "../md/projects/social-platform.md";

// ── experience/ imports ───────────────────────────────────────────────────────
// Uncomment when you publish real experience entries:
// import myJobRaw from "../md/experience/my-job.md";

// ── others/ imports (RAG-only context) ───────────────────────────────────────
// Add a new import here whenever you add a file to md/others/

import interestsRaw  from "../md/others/interests.md";
import philosophyRaw from "../md/others/philosophy.md";
import faqRaw        from "../md/others/faq.md";
import domainRaw     from "../md/others/domain.md";

// ── Content assembly ──────────────────────────────────────────────────────────

const PROJECT_FILES: [string, string][] = [
  ["social-platform", socialRaw],
  ["cfm",             cfmRaw],
  ["messenger",       messengerRaw],
  ["gql",             gqlRaw],
  ["chatty",          chattyRaw],
];

const EXPERIENCE_FILES: [string, string][] = [
  // ["my-job", myJobRaw],
];

const OTHERS_FILES: [string, string][] = [
  ["interests",  interestsRaw],
  ["philosophy", philosophyRaw],
  ["faq",        faqRaw],
  ["domain",     domainRaw],
];

// ── Others chunk builder ──────────────────────────────────────────────────────

function buildOthersChunks(): KnowledgeChunk[] {
  return OTHERS_FILES.flatMap(([id, raw]) => {
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

// ── Public API ────────────────────────────────────────────────────────────────

export function getKnowledgeChunks(): KnowledgeChunk[] {
  const projects: Project[] = sortPublished(
    PROJECT_FILES.map(([id, raw]) => parseProject(id, raw)),
    (a, b) => a.title.localeCompare(b.title),
  );

  const experiences: Experience[] = sortPublished(
    EXPERIENCE_FILES.map(([id, raw]) => parseExperience(id, raw)),
    (a, b) => a.company.localeCompare(b.company),
  );

  return buildKnowledgeChunks({
    hero:        parseHero(heroRaw),
    about:       parseAbout(aboutRaw),
    skills:      parseSkills(skillsRaw),
    projects,
    experiences,
    contact:     parseContact(contactRaw),
    resume:      parseResume(resumeRaw),
    others:      buildOthersChunks(),
  });
}
