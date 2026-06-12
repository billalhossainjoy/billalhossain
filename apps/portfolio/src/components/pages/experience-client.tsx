"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Experience } from "@/lib/content";
import { HiOfficeBuilding, HiCheckCircle } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import WordReveal from "@/components/word-reveal";
import ScrollReveal from "@/components/scroll-reveal";

/* ── single timeline card ────────────────────────────────────────── */

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const from = index % 2 === 0 ? "left" : "right";
  const initial = from === "left" ? "translateX(-48px) scale(0.97)" : "translateX(48px) scale(0.97)";

  return (
    <div ref={ref} className={"relative"}>
      {/* Timeline dot */}
      <div className={"hidden lg:flex absolute left-1/2 -translate-x-1/2 top-8 z-10 flex-col items-center"}>
        <div className={twMerge(
          "size-4 rounded-full border-2 border-green-500 transition-all duration-500",
          visible ? "bg-green-500 shadow-lg shadow-green-500/40" : "bg-gray-900",
        )} />
      </div>

      {/* Card — alternates left/right on desktop */}
      <div
        className={twMerge(
          "lg:w-[46%]",
          index % 2 === 0 ? "lg:mr-auto lg:pr-8" : "lg:ml-auto lg:pl-8",
        )}
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translate(0,0) scale(1)" : initial,
          filter:     visible ? "blur(0px)" : "blur(5px)",
          transition: `opacity 0.7s ease ${index * 80}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 80}ms, filter 0.7s ease ${index * 80}ms`,
          willChange: "opacity, transform, filter",
        }}
      >
        <div className={"rounded-2xl border border-white/10 bg-white/5 hover:border-green-500/30 hover:bg-white/8 transition duration-300 p-6 space-y-4"}>

          {/* Header */}
          <div className={"flex items-start gap-4"}>
            {/* Logo */}
            {exp.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={exp.logoUrl} alt={exp.company}
                className={"size-12 shrink-0 rounded-xl object-cover border border-white/10"} />
            ) : (
              <div className={"size-12 shrink-0 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"}>
                <HiOfficeBuilding className={"size-6 text-green-400"} />
              </div>
            )}

            <div className={"flex-1 min-w-0"}>
              <div className={"flex items-center gap-2 flex-wrap"}>
                <h3 className={"font-bold text-lg text-white leading-tight"}>{exp.role}</h3>
                <span className={"text-xs px-2 py-0.5 rounded-full border border-green-500/25 bg-green-500/10 text-green-400"}>{exp.type}</span>
              </div>
              <p className={"text-green-400 font-medium text-sm"}>{exp.company}</p>
              <p className={"text-gray-500 text-xs mt-0.5"}>{exp.startDate} – {exp.endDate} · {exp.location}</p>
            </div>
          </div>

          {/* Points */}
          {exp.points.length > 0 && (
            <ul className={"space-y-2"}>
              {exp.points.map((pt, i) => (
                <li key={i} className={"flex gap-2.5 text-sm text-gray-300 leading-relaxed"}>
                  <HiCheckCircle className={"size-4 shrink-0 mt-0.5 text-green-500/70"} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Tags */}
          {exp.tags.length > 0 && (
            <div className={"flex flex-wrap gap-1.5 pt-1"}>
              {exp.tags.map(tag => (
                <span key={tag} className={"text-xs px-2.5 py-1 rounded-md border border-white/8 bg-white/5 text-gray-400"}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── section ─────────────────────────────────────────────────────── */

export default function ExperienceClient({ items }: { items: Experience[] }) {
  return (
    <section id={"experience"} className={"pt-24 pb-8 px-6"}>
      <div className={"max-w-5xl mx-auto space-y-16"}>

        {/* Header */}
        <div className={"text-center space-y-4"}>
          <ScrollReveal from={"bottom"}>
            <p className={"font-serif bg-gradient-to-r text-lg from-green-400 to-green-700 inline-block text-transparent bg-clip-text tracking-wide uppercase"}>
              Career
            </p>
          </ScrollReveal>
          <WordReveal
            text={"Work Experience"}
            as={"h2"}
            className={"text-4xl md:text-5xl font-bold"}
            stagger={80}
          />
          <ScrollReveal from={"bottom"} delay={250}>
            <p className={"text-lg text-gray-400 max-w-xl mx-auto"}>
              Companies and projects I&apos;ve contributed to throughout my career.
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <div className={"relative space-y-8"}>
          {/* Vertical spine — desktop only */}
          <div className={"hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500/30 to-transparent"} />

          {items.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
