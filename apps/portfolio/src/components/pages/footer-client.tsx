"use client";

import React from 'react';
import { HiMail, HiPhone } from "react-icons/hi";
import { BsGithub, BsLinkedin, BsFacebook, BsWhatsapp, BsTwitterX, BsInstagram, BsYoutube } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { scroller } from "@/utils";
import type { FooterData } from "@repo/content";
import type { IconType } from "react-icons";

/* ── Icon registry ────────────────────────────────────────────────────────── */

const ICON_REGISTRY: Record<string, IconType> = {
    github:    BsGithub,
    linkedin:  BsLinkedin,
    facebook:  BsFacebook,
    whatsapp:  BsWhatsapp,
    twitter:   BsTwitterX,
    instagram: BsInstagram,
    youtube:   BsYoutube,
    link:      FaLink,
};

/* ── Component ────────────────────────────────────────────────────────────── */

interface Props {
    name:   string;
    footer: FooterData;
}

const FooterClient: React.FC<Props> = ({ name, footer }) => {
    const { email, phone } = footer;
    const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase();

    return (
        <footer className={"relative bg-gray-950 border-t border-white/10 mt-10 overflow-hidden"}>
            {/* Subtle glow */}
            <div
                aria-hidden="true"
                className={"pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-[0.04] blur-3xl"}
                style={{ background: "linear-gradient(to top, #4ade80, transparent)" }}
            />

            <div className={"relative max-w-6xl mx-auto px-6 pt-14 pb-8 space-y-12"}>

                {/* Top row */}
                <div className={"grid grid-cols-1 md:grid-cols-3 gap-10"}>

                    {/* Brand */}
                    <div className={"space-y-4"}>
                        <div className={"flex items-center gap-3"}>
                            <div className={"size-10 rounded-xl bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-sm font-bold text-gray-900"}>
                                {initials}
                            </div>
                            <span className={"font-bold text-white text-lg"}>{name}</span>
                        </div>
                        <p className={"text-sm text-gray-400 leading-relaxed max-w-xs"}>
                            {footer.tagline}
                        </p>
                        <a
                            href={`mailto:${email}`}
                            className={"flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition duration-300"}
                        >
                            <HiMail className={"size-4"} />
                            {email}
                        </a>
                        {phone && (
                            <a
                                href={`tel:${phone.replace(/\s/g, "")}`}
                                className={"flex items-center gap-2 text-sm text-gray-400 hover:text-white transition duration-300"}
                            >
                                <HiPhone className={"size-4"} />
                                {phone}
                            </a>
                        )}
                    </div>

                    {/* Quick nav */}
                    <div className={"space-y-4"}>
                        <h4 className={"text-xs font-semibold text-gray-500 uppercase tracking-widest"}>
                            {footer.nav.title}
                        </h4>
                        <ul className={"space-y-2.5"}>
                            {footer.nav.links.map(({ label, id }) => (
                                <li key={id}>
                                    <button
                                        type={"button"}
                                        onClick={() => scroller(id)}
                                        className={"text-sm text-gray-400 hover:text-white transition duration-300 hover:translate-x-1 inline-flex items-center gap-1.5 group"}
                                    >
                                        <span className={"size-1 rounded-full bg-green-500/50 group-hover:bg-green-400 transition duration-300"} />
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className={"space-y-4"}>
                        <h4 className={"text-xs font-semibold text-gray-500 uppercase tracking-widest"}>
                            {footer.connect.title}
                        </h4>
                        <ul className={"space-y-3"}>
                            {footer.connect.links.map(({ icon, label, href }) => {
                                const Icon = ICON_REGISTRY[icon] ?? FaLink;
                                return (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            target={"_blank"}
                                            rel={"noopener noreferrer"}
                                            aria-label={label}
                                            className={"inline-flex items-center gap-3 text-sm text-gray-400 hover:text-white transition duration-300 group"}
                                        >
                                            <span className={"size-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/10 transition duration-300"}>
                                                <Icon className={"size-4"} />
                                            </span>
                                            {label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className={"h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"} />

                {/* Bottom row */}
                <div className={"flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600"}>
                    <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
                    {footer.builtWith.length > 0 && (
                        <p className={"flex items-center gap-1.5"}>
                            Built with
                            {footer.builtWith.map(({ label, color }, i) => (
                                <React.Fragment key={label}>
                                    <span className={color}>{label}</span>
                                    {i < footer.builtWith.length - 1 && "·"}
                                </React.Fragment>
                            ))}
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
};

export default FooterClient;
