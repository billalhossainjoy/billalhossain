import {
    FaReact, FaNodeJs, FaDocker, FaLinux, FaCloudflare, FaGitAlt, FaAws,
} from "react-icons/fa";
import { TbBrandNextjs, TbBrandAzure } from "react-icons/tb";
import { VscCode } from "react-icons/vsc";
import {
    SiNestjs, SiPrisma, SiMongodb, SiExpress, SiApollographql,
    SiExpo, SiReactquery, SiPusher, SiSocketdotio, SiCloudinary,
    SiArduino, SiShadcnui, SiNginx, SiJest, SiVitest, SiRedis, SiGithubactions, SiRedux, SiAppwrite,
    SiHono, SiSqlite, SiOpenai, SiSupabase,
} from "react-icons/si";
import { GrGraphQl } from "react-icons/gr";
import { DiPostgresql } from "react-icons/di";
import { BiLogoTypescript, BiLogoTailwindCss } from "react-icons/bi";
import type { IconType } from "react-icons";

export interface SkillIconOptions {
    label: string;
    icon: IconType;
    background: string;
    color?: string;
    url: string;
}

/**
 * Flat registry: skill name → icon/color/url.
 * The skill categories and their order come from packages/content/md/skills.md.
 * To add a new skill: add it to skills.md AND add an entry here.
 */
export const SKILL_REGISTRY: Record<string, Omit<SkillIconOptions, "label">> = {
    // ── Frontend ──────────────────────────────────────────────────────────────
    "React":        { icon: FaReact,           background: "#61DBFB",                  url: "https://react.dev/"                       },
    "Next.js":      { icon: TbBrandNextjs,     background: "#404040", color: "#ffffff", url: "https://nextjs.org/"                      },
    "TypeScript":   { icon: BiLogoTypescript,  background: "#3178C6",                  url: "https://www.typescriptlang.org/"           },
    "Tailwind CSS": { icon: BiLogoTailwindCss, background: "#06B6D4",                  url: "https://tailwindcss.com/"                  },
    "React Query":  { icon: SiReactquery,      background: "#FF4154",                  url: "https://tanstack.com/query/latest"         },
    "Shadcn UI":    { icon: SiShadcnui,        background: "#404040", color: "#ffffff", url: "https://ui.shadcn.com/"                   },
    "Redux":        { icon: SiRedux,           background: "#764ABC", color: "#ffffff", url: "https://redux.js.org/"                    },
    "Expo":         { icon: SiExpo,            background: "#404040", color: "#ffffff", url: "https://expo.dev/"                        },
    "Jest":         { icon: SiJest,            background: "#C21325", color: "#ffffff", url: "https://jestjs.io/"                       },
    "Vitest":       { icon: SiVitest,         background: "#6E9F18", color: "#ffffff", url: "https://vitest.dev/"                      },

    // ── Backend ───────────────────────────────────────────────────────────────
    "Node.js":        { icon: FaNodeJs,        background: "#339933",                  url: "https://nodejs.org/"                      },
    "NestJS":         { icon: SiNestjs,        background: "#E0234E",                  url: "https://nestjs.com/"                      },
    "Express.js":     { icon: SiExpress,       background: "#404040", color: "#ffffff", url: "https://expressjs.com/"                   },
    "Hono":           { icon: SiHono,          background: "#E36002", color: "#ffffff", url: "https://hono.dev/"                        },
    "GraphQL":        { icon: GrGraphQl,       background: "#E10098",                  url: "https://graphql.org/"                     },
    "Apollo GraphQL": { icon: SiApollographql, background: "#311C87", color: "#ffffff", url: "https://www.apollographql.com/"           },
    "Prisma":         { icon: SiPrisma,        background: "#5A67D8", color: "#ffffff", url: "https://www.prisma.io/"                   },
    "Socket.io":      { icon: SiSocketdotio,   background: "#404040", color: "#ffffff", url: "https://socket.io/"                       },
    "Appwrite":       { icon: SiAppwrite,      background: "#F02E65", color: "#ffffff", url: "https://appwrite.io/"                     },
    "Supabase":       { icon: SiSupabase,      background: "#3ECF8E", color: "#ffffff", url: "https://supabase.com/"                    },

    // ── Databases ─────────────────────────────────────────────────────────────
    "PostgreSQL": { icon: DiPostgresql, background: "#336791", color: "#ffffff", url: "https://www.postgresql.org/"  },
    "MongoDB":    { icon: SiMongodb,    background: "#47A248",                  url: "https://www.mongodb.com/"      },
    "Redis":      { icon: SiRedis,      background: "#DC382D", color: "#ffffff", url: "https://redis.io/"            },
    "SQLite":     { icon: SiSqlite,     background: "#003B57", color: "#ffffff", url: "https://www.sqlite.org/"      },

    // ── DevOps ────────────────────────────────────────────────────────────────
    "AWS":            { icon: FaAws,           background: "#FF9900", color: "#000000", url: "https://aws.amazon.com/"               },
    "Azure":          { icon: TbBrandAzure,    background: "#0078D4", color: "#ffffff", url: "https://azure.microsoft.com/"          },
    "Docker":         { icon: FaDocker,        background: "#2496ED",                  url: "https://www.docker.com/"               },
    "Nginx":          { icon: SiNginx,         background: "#009639", color: "#ffffff", url: "https://www.nginx.com/"                },
    "Cloudflare":     { icon: FaCloudflare,    background: "#F38020",                  url: "https://www.cloudflare.com/"           },
    "GitHub Actions": { icon: SiGithubactions, background: "#2088FF", color: "#ffffff", url: "https://github.com/features/actions"   },
    "Linux":          { icon: FaLinux,         background: "#FCC624",                  url: "https://www.linux.org/"                },

    // ── Others ────────────────────────────────────────────────────────────────
    "Cursor":     { icon: VscCode,      background: "#7C3AED", color: "#ffffff", url: "https://cursor.sh/"                 },
    "Codex":      { icon: SiOpenai,     background: "#412991", color: "#ffffff", url: "https://openai.com/blog/openai-codex"},
    "Git":        { icon: FaGitAlt,     background: "#F05032",                  url: "https://git-scm.com/"               },
    "Cloudinary": { icon: SiCloudinary, background: "#3448C5", color: "#ffffff", url: "https://cloudinary.com/"            },
    "Pusher":     { icon: SiPusher,     background: "#0D99FF", color: "#ffffff", url: "https://pusher.com/"                },
    "Arduino":    { icon: SiArduino,    background: "#00979D", color: "#ffffff", url: "https://www.arduino.cc/"            },
};

/** Resolve a list of skill names into full SkillIconOptions (unknown names are skipped). */
export function resolveSkills(names: string[]): SkillIconOptions[] {
    return names.flatMap((name) => {
        const entry = SKILL_REGISTRY[name];
        return entry ? [{ label: name, ...entry }] : [];
    });
}
