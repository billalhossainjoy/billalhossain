import React from 'react';
import Image from "next/image";
import { BsArrowDown } from "react-icons/bs";
import tech from "@/assets/images/tech.jpg";
import { links } from "@/components/links";
import { getHero } from "@/lib/content";

const d = (ms: number): React.CSSProperties => ({
    animationDelay:    `${ms}ms`,
    animationFillMode: "both",
});

const Hero = async () => {
    const hero = getHero();

    return (
        <section
            id="public"
            className={"relative min-h-[90vh] w-full flex items-center overflow-hidden"}
        >
            {/* ── Background blobs ─────────────────────────────────────── */}
            <div aria-hidden="true" className={"pointer-events-none absolute inset-0 -z-10 overflow-hidden"}>
                <div
                    className={"absolute -top-32 -left-40 w-[600px] h-[600px] rounded-full animate-blob opacity-[0.13]"}
                    style={{ background: "radial-gradient(circle at center, #4ade80, transparent 65%)", animationDuration: "9s" }}
                />
                <div
                    className={"absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full animate-blob opacity-[0.09]"}
                    style={{ background: "radial-gradient(circle at center, #22d3ee, transparent 65%)", animationDuration: "13s", animationDelay: "-5s" }}
                />
                <div
                    className={"absolute -bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-[0.05] blur-3xl"}
                    style={{ background: "radial-gradient(ellipse at center, #4ade80, transparent 70%)" }}
                />
            </div>

            {/* ── Content ──────────────────────────────────────────────── */}
            <div className={"max-w-7xl mx-auto px-6 py-20 w-full flex justify-between items-center flex-col-reverse lg:flex-row gap-12 lg:gap-16"}>

                {/* Left — text */}
                <div className={"flex flex-col justify-center items-start gap-7 lg:max-w-xl w-full"}>

                    {/* Availability badge */}
                    {hero.available && (
                        <span
                            className={"inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full border border-green-500/40 bg-green-500/10 text-green-400 animate-fade-down"}
                            style={d(0)}
                        >
                            <span className={"relative flex h-2 w-2"}>
                                <span className={"animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"} />
                                <span className={"relative inline-flex rounded-full h-2 w-2 bg-green-500"} />
                            </span>
                            {hero.badge}
                        </span>
                    )}

                    {/* Headline */}
                    <h1 className={"font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight"}>
                        <span className={"block overflow-hidden pb-1"}>
                            <span className={"block animate-fade-up"} style={d(80)}>
                                Hi, I&apos;m
                            </span>
                        </span>
                        <span className={"block overflow-hidden pb-1"}>
                            <span className={"block animate-fade-up bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-transparent bg-clip-text"} style={d(180)}>
                                {hero.name}
                            </span>
                        </span>
                        <span className={"block overflow-hidden pb-1"}>
                            <span className={"block animate-fade-up text-white/75 text-3xl sm:text-4xl md:text-5xl"} style={d(280)}>
                                {hero.title}
                            </span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className={"text-white/50 text-base md:text-lg leading-relaxed max-w-lg animate-fade-up"} style={d(380)}>
                        {hero.subtitle}
                    </p>

                    {/* CTAs */}
                    <div className={"flex gap-3 flex-wrap animate-fade-up"} style={d(480)}>
                        <a
                            href={"#projects"}
                            className={"inline-flex items-center gap-2 border border-white/15 hover:border-green-500/50 hover:bg-green-500/5 px-6 h-12 rounded-xl font-semibold text-sm transition duration-300"}
                        >
                            {hero.ctaPrimary}
                            <BsArrowDown className={"text-white animate-bounce"} />
                        </a>
                        <a
                            href={"#contact"}
                            className={"inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-gray-900 h-12 px-6 rounded-xl font-bold text-sm transition duration-300 shadow-lg shadow-green-500/25"}
                        >
                            <span>👋</span>
                            {hero.ctaSecondary}
                        </a>
                    </div>
                </div>

                {/* Right — photo + socials */}
                <div className={"flex flex-col items-center gap-5 animate-scale-in shrink-0"} style={d(150)}>
                    <div className={"relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96"}>
                        <div className={"absolute -inset-4 rounded-3xl blur-2xl bg-green-500/20 animate-glow"} />
                        <div
                            className={"absolute -inset-[3px] rounded-[18px]"}
                            style={{ background: "conic-gradient(from 0deg, #4ade80, #22d3ee 50%, #4ade80)", animation: "spin 5s linear infinite", opacity: 0.75 }}
                        />
                        <div className={"absolute inset-0 rounded-2xl overflow-hidden"}>
                            <Image
                                src={tech}
                                alt={`${hero.name} — ${hero.title}`}
                                fill
                                sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px"
                                className={"object-cover"}
                                priority
                            />
                            <div className={"absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] rounded-2xl"} />
                        </div>
                    </div>

                    {/* Social links */}
                    <ul className={"flex gap-3 justify-center"}>
                        {links.map(({ label, icon: Icon, link }, i) => (
                            <li key={label} className={"animate-fade-up"} style={d(560 + i * 70)}>
                                <a
                                    href={link}
                                    target={"_blank"}
                                    rel={"noopener noreferrer"}
                                    aria-label={label}
                                    title={label}
                                    className={"flex items-center justify-center size-10 rounded-full border border-white/10 hover:border-green-500/40 hover:bg-green-500/10 transition duration-300"}
                                >
                                    <Icon className={"size-[18px]"} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
        </section>
    );
};

export default Hero;
