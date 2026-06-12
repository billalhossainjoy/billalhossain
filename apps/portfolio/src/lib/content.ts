/**
 * Portfolio-specific content wrapper.
 *
 * Calls `unstable_noStore()` on every read so Next.js never caches the
 * markdown file output — changes appear immediately on every refresh.
 */
import { unstable_noStore as noStore } from "next/cache";
import {
  getAbout        as _getAbout,
  getContact      as _getContact,
  getExperiences  as _getExperiences,
  getFooter       as _getFooter,
  getGalleryItems as _getGalleryItems,
  getHero         as _getHero,
  getProjects     as _getProjects,
  getResume       as _getResume,
  getSkills       as _getSkills,
} from "@repo/content/server";

export type { About, ContactCardItem, ContactData, Experience, FooterData, FooterConnectLink, FooterNavLink, GalleryItem, Hero, Project, ResumeData, SkillCategory, Stat } from "@repo/content";

export function getHero()         { noStore(); return _getHero();         }
export function getAbout()        { noStore(); return _getAbout();        }
export function getSkills()       { noStore(); return _getSkills();       }
export function getProjects()     { noStore(); return _getProjects();     }
export function getExperiences()  { noStore(); return _getExperiences();  }
export function getGalleryItems() { noStore(); return _getGalleryItems(); }
export function getContact()      { noStore(); return _getContact();      }
export function getFooter()       { noStore(); return _getFooter();       }
export function getResume()       { noStore(); return _getResume();       }
