"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
    text: string;
    /** HTML tag to render, e.g. "h2", "p" */
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
    /** Delay before the first word starts (ms) */
    startDelay?: number;
    /** Gap between each word animation (ms) */
    stagger?: number;
}

/**
 * Splits `text` into words and slides each word up from below
 * when the element scrolls into view. Fire-once.
 */
export default function WordReveal({
    text,
    as: Tag = "span",
    className,
    startDelay = 0,
    stagger = 70,
}: Props) {
    const ref  = useRef<HTMLElement>(null);
    const [go, setGo] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setGo(true); obs.unobserve(el); } },
            { threshold: 0.25 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const words = text.split(" ");

    return (
        // @ts-expect-error dynamic tag
        <Tag ref={ref} className={className} aria-label={text}>
            {words.map((word, i) => (
                <span
                    key={i}
                    style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
                >
                    <span
                        style={{
                            display:    "inline-block",
                            opacity:    go ? 1 : 0,
                            transform:  go ? "translateY(0)" : "translateY(110%)",
                            transition: [
                                `opacity   0.55s ease            ${startDelay + i * stagger}ms`,
                                `transform 0.55s cubic-bezier(0.23,1,0.32,1) ${startDelay + i * stagger}ms`,
                            ].join(", "),
                            willChange: "opacity, transform",
                            marginRight: i < words.length - 1 ? "0.28em" : 0,
                        }}
                    >
                        {word}
                    </span>
                </span>
            ))}
        </Tag>
    );
}
