"use client";

import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
    children: React.ReactNode;
    from?: "left" | "right" | "bottom";
    delay?: number;
    className?: string;
}

const HIDDEN: Record<string, string> = {
    left:   "translateX(-52px) scale(0.97)",
    right:  "translateX(52px)  scale(0.97)",
    bottom: "translateY(48px)  scale(0.97)",
};

export default function ScrollReveal({ children, from = "bottom", delay = 0, className }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={twMerge("w-full", className)}
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translate(0,0) scale(1)" : HIDDEN[from],
                filter:     visible ? "blur(0px)" : "blur(6px)",
                transition: [
                    `opacity   0.75s ease            ${delay}ms`,
                    `transform 0.75s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
                    `filter    0.75s ease            ${delay}ms`,
                ].join(", "),
                willChange: "opacity, transform, filter",
            }}
        >
            {children}
        </div>
    );
}
