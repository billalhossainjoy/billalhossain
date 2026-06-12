"use client";

import React, { useEffect, useRef, useState } from 'react';
import WordReveal from "@/components/word-reveal";
import ScrollReveal from "@/components/scroll-reveal";
import type { Stat } from "@repo/content";

/* Animated divider line */
function DrawLine() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className={"relative h-px bg-white/5 w-full max-w-xs mx-auto overflow-hidden"}>
            <div
                className={"absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 via-teal-400 to-transparent rounded-full"}
                style={{
                    width:      visible ? "100%" : "0%",
                    opacity:    visible ? 1 : 0,
                    transition: "width 1s cubic-bezier(0.23,1,0.32,1) 200ms, opacity 0.4s ease 200ms",
                }}
            />
        </div>
    );
}

/* 3D flip-up stat card with counter */
function StatCard({ target, suffix, label, delay }: {
    target: number; suffix: string; label: string; delay: number;
}) {
    const [count, setCount] = useState(0);
    const ref     = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                obs.unobserve(el);

                const steps = 84; // ~1.4s at 60fps
                let step = 0;
                const timer = setInterval(() => {
                    step++;
                    const progress = 1 - Math.pow(1 - step / steps, 3);
                    setCount(Math.round(progress * target));
                    if (step >= steps) clearInterval(timer);
                }, 1000 / 60);
            }
        }, { threshold: 0.5 });

        obs.observe(el);
        return () => obs.disconnect();
    }, [target]);

    return (
        <div
            ref={ref}
            className={"animate-flip-up flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-8 px-4 text-center hover:border-green-500/40 hover:bg-green-500/5 transition duration-300 cursor-default"}
            style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
        >
            <span className={"text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text tabular-nums"}>
                {count}{suffix}
            </span>
            <span className={"text-sm text-gray-400 font-medium"}>{label}</span>
        </div>
    );
}

const About: React.FC<{ description: string; stats: Stat[] }> = ({ description, stats }) => {
    return (
        <section id={"about"} className={"pt-24 px-6"}>
            <div className={"max-w-7xl mx-auto space-y-14"}>

                {/* Bio block */}
                <div className={"space-y-6 md:w-2/3 mx-auto text-center"}>
                    <WordReveal
                        text={"About Me"}
                        as={"h2"}
                        className={"text-4xl font-bold"}
                    />

                    <DrawLine />

                    <ScrollReveal from={"bottom"} delay={250}>
                        <p className={"text-lg text-gray-400 leading-8"}>
                            {description}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Stats — 3D flip-in with stagger */}
                <div className={"grid grid-cols-2 md:grid-cols-4 gap-5"}>
                    {stats.map(({ target, suffix, label }, i) => (
                        <StatCard
                            key={label}
                            target={target}
                            suffix={suffix}
                            label={label}
                            delay={i * 110}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
