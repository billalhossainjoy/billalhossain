"use client";

import React, { useState, useEffect, useRef } from 'react';
import { resolveSkills, type SkillIconOptions } from "@/components/icons";
import { twMerge } from "tailwind-merge";
import WordReveal from "@/components/word-reveal";
import type { SkillCategory } from "@repo/content";

/* ── helpers ────────────────────────────────────────────────────────────── */

const hexToRgba = (hex: string, opacity: number) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/* ── skill card ─────────────────────────────────────────────────────────── */

const SkillCard: React.FC<SkillIconOptions> = ({ label, icon: Icon, background, color, url }) => {
    const iconColor  = color ?? background;
    const bgTint     = hexToRgba(background, 0.12);
    const hoverGlow  = hexToRgba(background, 0.25);
    const borderTint = hexToRgba(background, 0.35);

    return (
        <a
            href={url}
            target={"_blank"}
            rel={"noopener noreferrer"}
            aria-label={`Learn more about ${label}`}
            className={"group relative flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"}
            style={{ background: bgTint, borderColor: borderTint }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background  = hoverGlow;
                (e.currentTarget as HTMLElement).style.boxShadow   = `0 0 20px ${hexToRgba(background, 0.2)}`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background  = bgTint;
                (e.currentTarget as HTMLElement).style.boxShadow   = "none";
            }}
        >
            <div
                className={"flex items-center justify-center size-12 rounded-xl"}
                style={{ background: hexToRgba(background, 0.2) }}
            >
                <Icon className={"size-6 transition duration-300 group-hover:scale-110"} style={{ color: iconColor }} />
            </div>
            <span className={"text-sm font-medium text-gray-300 group-hover:text-white transition duration-300 text-center leading-tight"}>
                {label}
            </span>
        </a>
    );
};

/* ── main ────────────────────────────────────────────────────────────────── */

const SkillsClient: React.FC<{ categories: SkillCategory[] }> = ({ categories }) => {
    const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
    const [animKey,  setAnimKey]  = useState(0);
    const headerRef               = useRef<HTMLDivElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); }
        }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const handleTabChange = (id: string) => {
        setActiveId(id);
        setAnimKey((k) => k + 1);
    };

    const activeCategory = categories.find((c) => c.id === activeId);
    const currentItems   = resolveSkills(activeCategory?.skills ?? []);

    return (
        <section id={"skills"} className={"pt-24 pb-8 px-4 sm:px-6"}>
            <div className={"max-w-5xl mx-auto space-y-8 sm:space-y-12"}>

                {/* Header */}
                <div
                    ref={headerRef}
                    className={"text-center space-y-4 transition-all duration-700"}
                    style={{
                        opacity:   headerVisible ? 1 : 0,
                        transform: headerVisible ? "translateY(0)" : "translateY(32px)",
                    }}
                >
                    <p className={"font-serif bg-gradient-to-r text-2xl sm:text-3xl from-green-400 to-green-700 inline-block text-transparent bg-clip-text"}>
                        Skills
                    </p>
                    <WordReveal text={"Libraries & Frameworks"} as={"h2"} className={"text-3xl sm:text-4xl md:text-5xl font-bold"} stagger={60} />
                    <p className={"text-base sm:text-lg text-gray-400"}>Tools and technologies I work with day to day.</p>
                </div>

                {/* Tab bar */}
                <div
                    className={"flex justify-center transition-all duration-700"}
                    style={{
                        opacity:         headerVisible ? 1 : 0,
                        transform:       headerVisible ? "translateY(0)" : "translateY(20px)",
                        transitionDelay: "200ms",
                    }}
                >
                    <div className={"flex gap-1 p-1 rounded-xl border border-white/10 bg-white/5 overflow-x-auto max-w-full scrollbar-hide"}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type={"button"}
                                onClick={() => handleTabChange(cat.id)}
                                className={twMerge(
                                    "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap shrink-0",
                                    activeId === cat.id
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {cat.label}
                                <span className={twMerge(
                                    "ml-1.5 sm:ml-2 text-xs px-1.5 py-0.5 rounded-full",
                                    activeId === cat.id
                                        ? "bg-gray-900/20 text-gray-700"
                                        : "bg-white/10 text-white/50"
                                )}>
                                    {cat.skills.length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div
                    key={animKey}
                    className={"grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3"}
                    style={{ animation: "fadeIn 0.25s ease both" }}
                >
                    {currentItems.map((skill, i) => (
                        <div
                            key={skill.label}
                            className={"animate-flip-up"}
                            style={{ animationDelay: `${i * 35}ms`, animationFillMode: "both" }}
                        >
                            <SkillCard {...skill} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsClient;
