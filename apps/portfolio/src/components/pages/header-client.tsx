"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { scroller } from "@/utils";
import { HiMenu, HiX } from "react-icons/hi";
import { twMerge } from "tailwind-merge";

const NAV_ITEMS = [
    { label: "Home",       id: "public"     },
    { label: "About",      id: "about"      },
    { label: "Skills",     id: "skills"     },
    // { label: "Experience", id: "experience" },
    { label: "Projects",   id: "projects"   },
    { label: "Contact",    id: "contact"    },
] as const;

const Header: React.FC<{ name: string; initials: string; email: string }> = ({ name, initials, email }) => {
    const [active, setActive] = useState<string>("public");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    /* Detect scroll for background opacity change */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Track which section is in view */
    useEffect(() => {
        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );
        NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current?.observe(el);
        });
        return () => observerRef.current?.disconnect();
    }, []);

    /* Lock body scroll when mobile menu is open */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const handleNav = (id: string) => {
        scroller(id);
        setMenuOpen(false);
    };

    return (
        <>
            <header
                className={twMerge(
                    "sticky top-0 z-50 w-full transition-all duration-300",
                    scrolled
                        ? "bg-gray-900/80 backdrop-blur-md border-b border-white/8 shadow-lg shadow-black/20"
                        : "bg-transparent"
                )}
            >
                <div className={"max-w-7xl mx-auto px-5 h-16 flex items-center justify-between"}>

                    {/* Logo / Name */}
                    <button
                        type={"button"}
                        onClick={() => handleNav("public")}
                        className={"flex items-center gap-2 group"}
                        aria-label={"Go to top"}
                    >
                        <span className={"size-8 rounded-lg bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-sm font-bold text-gray-900 group-hover:scale-105 transition duration-300"}>
                            {initials}
                        </span>
                        <span className={"hidden sm:block font-semibold text-white/90 group-hover:text-white transition duration-300"}>
                            {name}
                        </span>
                    </button>

                    {/* Desktop pill nav */}
                    <nav aria-label={"Primary"} className={"hidden md:flex gap-1 p-1 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm"}>
                        {NAV_ITEMS.map(({ label, id }) => (
                            <button
                                key={id}
                                type={"button"}
                                onClick={() => handleNav(id)}
                                className={twMerge(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                    active === id
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                        <Link
                            href={"/resume"}
                            className={"px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 text-white/60 hover:text-white hover:bg-white/10"}
                        >
                            Resume
                        </Link>
                    </nav>

                    {/* Right side: hire me + hamburger */}
                    <div className={"flex items-center gap-3"}>
                        <a
                            href={`mailto:${email}`}
                            className={"hidden sm:inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-green-500 hover:bg-green-400 text-gray-900 font-semibold text-sm transition duration-300"}
                        >
                            <span className={"relative flex h-2 w-2"}>
                                <span className={"animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-900 opacity-60"}></span>
                                <span className={"relative inline-flex rounded-full h-2 w-2 bg-gray-900"}></span>
                            </span>
                            Hire Me
                        </a>

                        {/* Hamburger — mobile only */}
                        <button
                            type={"button"}
                            className={"md:hidden flex items-center justify-center size-9 rounded-lg border border-white/15 hover:bg-white/10 transition duration-300"}
                            onClick={() => setMenuOpen((o) => !o)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            {menuOpen ? <HiX className={"size-5"} /> : <HiMenu className={"size-5"} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer overlay */}
            {menuOpen && (
                <div
                    className={"fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 md:hidden"}
                    role={"dialog"}
                    aria-modal={"true"}
                    aria-label={"Mobile navigation"}
                >
                    {NAV_ITEMS.map(({ label, id }) => (
                        <button
                            key={id}
                            type={"button"}
                            onClick={() => handleNav(id)}
                            className={twMerge(
                                "text-2xl font-semibold transition duration-300",
                                active === id ? "text-green-400" : "text-white/70 hover:text-white"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                    <Link
                        href={"/resume"}
                        onClick={() => setMenuOpen(false)}
                        className={"text-2xl font-semibold text-white/70 hover:text-white transition duration-300"}
                    >
                        Resume
                    </Link>
                    <a
                        href={`mailto:${email}`}
                        className={"mt-4 inline-flex items-center gap-2 px-8 h-12 rounded-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold text-base transition duration-300"}
                        onClick={() => setMenuOpen(false)}
                    >
                        Hire Me
                    </a>
                </div>
            )}
        </>
    );
};

export default Header;