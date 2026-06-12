"use client";

import React from 'react';
import { HiMail, HiExternalLink } from "react-icons/hi";
import { BsGithub, BsLinkedin, BsFacebook, BsTwitterX, BsInstagram, BsYoutube, BsWhatsapp } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import ScrollReveal from "@/components/scroll-reveal";
import WordReveal from "@/components/word-reveal";
import type { IconType } from "react-icons";
import type { ContactCardItem, ContactData } from "@repo/content";

/* ── Icon registry ────────────────────────────────────────────────────────── */

const ICON_REGISTRY: Record<string, IconType> = {
    email:     HiMail,
    linkedin:  BsLinkedin,
    github:    BsGithub,
    facebook:  BsFacebook,
    whatsapp:  BsWhatsapp,
    twitter:   BsTwitterX,
    instagram: BsInstagram,
    youtube:   BsYoutube,
    link:      FaLink,
};

/* ── Card ─────────────────────────────────────────────────────────────────── */

function Card({ card, index }: { card: ContactCardItem; index: number }) {
    const Icon = ICON_REGISTRY[card.icon] ?? FaLink;
    const { label, value, href, description, color, external } = card;

    return (
        <ScrollReveal from={index % 2 === 0 ? "left" : "right"} delay={index * 80}>
            <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={"group flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/8 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5"}
            >
                <div
                    className={"size-12 shrink-0 rounded-xl flex items-center justify-center transition duration-300 group-hover:scale-105"}
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                    <Icon className={"size-6"} style={{ color }} />
                </div>
                <div className={"flex-1 min-w-0"}>
                    <div className={"flex items-center gap-2"}>
                        <span className={"text-xs font-semibold text-gray-500 uppercase tracking-wider"}>{label}</span>
                        {external && <HiExternalLink className={"size-3 text-gray-600 group-hover:text-gray-400 transition"} />}
                    </div>
                    <p className={"text-sm font-semibold text-white truncate mt-0.5"}>{value}</p>
                    <p className={"text-xs text-gray-500 mt-1"}>{description}</p>
                </div>
            </a>
        </ScrollReveal>
    );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export default function ContactClient({ data }: { data: ContactData }) {
    const { email, heading, subheading, description, available, availabilityText,
            ctaHeading, ctaBody, ctaButton, cards } = data;

    return (
        <section id={"contact"} className={"pt-24 pb-16 px-6"}>
            <div className={"max-w-5xl mx-auto space-y-14"}>

                {/* Header */}
                <div className={"text-center space-y-5"}>
                    <ScrollReveal from={"bottom"}>
                        <p className={"font-serif bg-gradient-to-r text-lg from-green-400 to-green-700 inline-block text-transparent bg-clip-text tracking-wide uppercase"}>
                            {heading}
                        </p>
                    </ScrollReveal>
                    <WordReveal text={subheading} as={"h2"} className={"text-4xl md:text-5xl font-bold"} stagger={75} />
                    <ScrollReveal from={"bottom"} delay={250}>
                        <p className={"text-lg text-gray-400 max-w-xl mx-auto leading-relaxed"}>{description}</p>
                    </ScrollReveal>
                </div>

                {/* Availability badge */}
                {available && (
                    <ScrollReveal from={"bottom"} delay={100}>
                        <div className={"flex justify-center"}>
                            <div className={"inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-green-500/25 bg-green-500/8"}>
                                <span className={"relative flex h-2.5 w-2.5"}>
                                    <span className={"animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"} />
                                    <span className={"relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"} />
                                </span>
                                <span className={"text-sm text-green-400 font-medium"}>{availabilityText}</span>
                            </div>
                        </div>
                    </ScrollReveal>
                )}

                {/* Primary CTA */}
                <ScrollReveal from={"bottom"} delay={150}>
                    <div className={"relative overflow-hidden rounded-3xl p-px"}>
                        <div
                            className={"absolute inset-0 rounded-3xl"}
                            style={{ background: "conic-gradient(from 0deg, #4ade80, #22d3ee, #818cf8, #4ade80)", animation: "spin 6s linear infinite", opacity: 0.5 }}
                        />
                        <div className={"relative rounded-3xl bg-gray-900 p-8 md:p-12 text-center space-y-6"}>
                            <h3 className={"text-2xl md:text-3xl font-bold"}>{ctaHeading}</h3>
                            <p className={"text-gray-400 max-w-md mx-auto"}>{ctaBody}</p>
                            <a
                                href={`mailto:${email}`}
                                className={"inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-gray-900 font-bold px-8 py-4 rounded-xl transition duration-300 shadow-xl shadow-green-500/20 text-base"}
                            >
                                <HiMail className={"size-5"} />
                                {ctaButton}
                            </a>
                            <p className={"text-xs text-gray-600"}>{email}</p>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Cards grid */}
                <div>
                    <ScrollReveal from={"bottom"}>
                        <p className={"text-center text-sm text-gray-500 mb-6 uppercase tracking-wider font-medium"}>
                            Or find me on
                        </p>
                    </ScrollReveal>
                    <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
                        {cards.map((card, i) => (
                            <Card key={card.label} card={card} index={i} />
                        ))}
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </section>
    );
}
