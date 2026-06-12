// Types are safe to import in any environment (no fs, no static md imports).
// For runtime content access use:
//   import { ... } from "@repo/content/server"   → Node.js / Next.js
//   import { ... } from "@repo/content/worker"   → Cloudflare Workers
export type { About, ContactCardItem, ContactData, Experience, FooterData, FooterNavLink, FooterConnectLink, GalleryItem, Hero, KnowledgeChunk, Project, ResumeData, ResumeCertification, ResumeEducation, ResumeLanguage, SkillCategory, Stat } from "./types";
