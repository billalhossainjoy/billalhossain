"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from "react-dom";
import Image, { StaticImageData } from "next/image";
import { AiFillCheckCircle } from "react-icons/ai";
import { FiExternalLink, FiZoomIn } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import { BsGithub } from "react-icons/bs";

type Props = {
    dateTitle: string;
    title: string;
    descriptions: string[];
    tags?: string[];
    link?: string;
    imgStatic?: StaticImageData;
    imgSrc?: string;
    imgAlt?: string;
    github?: string;
    index: number;
};

/* ── Image Preview Modal ──────────────────────────────────────── */

function ImageModal({
    imgStatic, imgSrc, alt, title, onClose,
}: {
    imgStatic?: StaticImageData;
    imgSrc?: string;
    alt: string;
    title: string;
    onClose: () => void;
}) {
    const [closing, setClosing] = useState(false);

    const close = useCallback(() => {
        setClosing(true);
        setTimeout(onClose, 250);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [close]);

    const imgStyle: React.CSSProperties = {
        maxWidth:     "min(92vw, 1100px)",
        maxHeight:    "80vh",
        width:        "auto",
        height:       "auto",
        borderRadius: "14px",
        display:      "block",
    };

    return createPortal(
        <div
            className={"fixed inset-0 z-[100] flex flex-col items-center justify-center"}
            onClick={close}
            role={"dialog"}
            aria-modal={"true"}
            aria-label={"Image preview"}
        >
            {/* Backdrop */}
            <div
                className={"absolute inset-0 bg-black/90 backdrop-blur-md"}
                style={{
                    opacity:    closing ? 0 : 1,
                    transition: "opacity 0.25s ease",
                }}
            />

            {/* Close button */}
            <button
                onClick={(e) => { e.stopPropagation(); close(); }}
                className={"absolute top-5 right-5 z-20 size-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition duration-200"}
                aria-label={"Close preview"}
            >
                <HiX className={"size-5 text-white"} />
            </button>

            {/* Image container — zoom + fade animation */}
            <div
                className={"relative z-10 mx-4 cursor-default"}
                onClick={(e) => e.stopPropagation()}
                style={{
                    opacity:    closing ? 0 : 1,
                    transform:  closing ? "scale(0.92)" : "scale(1)",
                    transition: "opacity 0.25s ease, transform 0.25s cubic-bezier(0.23,1,0.32,1)",
                    animation:  "modalIn 0.3s cubic-bezier(0.23,1,0.32,1) both",
                }}
            >
                {imgStatic ? (
                    <Image src={imgStatic} alt={alt} priority style={imgStyle} />
                ) : imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgSrc} alt={alt} style={imgStyle} />
                ) : null}

                {/* Shadow under image */}
                <div className={"absolute -inset-1 -z-10 rounded-2xl bg-black/50 blur-2xl"} />
            </div>

            {/* Title + hint */}
            <div
                className={"relative z-10 text-center mt-5 space-y-1"}
                style={{
                    opacity:    closing ? 0 : 1,
                    transform:  closing ? "translateY(8px)" : "translateY(0)",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                    animation:  "fadeUp 0.4s cubic-bezier(0.23,1,0.32,1) 0.1s both",
                }}
            >
                <p className={"text-sm text-white/80 font-medium"}>{title}</p>
                <p className={"text-xs text-white/35"}>Click outside or press Esc to close</p>
            </div>
        </div>,
        document.body,
    );
}

/* ── Parallax image hook (scroll-based) ───────────────────────── */

function useScrollParallax(factor = 0.12) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
        const update = () => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const elCenter = rect.top + rect.height / 2;
            const offset = (elCenter - viewportCenter) * factor;
            setTranslateY(offset);
        };

        const onScroll = () => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(update);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        update();
        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [factor]);

    return { containerRef, translateY };
}

/* ── 3D tilt hook (mouse tracking) ───────────────────────────── */

function useTilt(maxDeg = 7) {
    const cardRef = useRef<HTMLElement>(null);
    const rafRef  = useRef<number>(0);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        const el = cardRef.current;
        if (!el) return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            setTilt({ rotateX: -y * maxDeg, rotateY: x * maxDeg });
        });
    }, [maxDeg]);

    const onMouseLeave = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setTilt({ rotateX: 0, rotateY: 0 });
    }, []);

    return { cardRef, tilt, onMouseMove, onMouseLeave };
}

/* ── Project Card ─────────────────────────────────────────────── */

const ProjectCard: React.FC<Props> = ({
    index, dateTitle, title, link, descriptions, tags, imgStatic, imgSrc, imgAlt, github,
}) => {
    const hasImage = !!(imgStatic || imgSrc);
    const reverse  = index % 2 !== 0;
    const alt      = imgAlt ?? `Screenshot of ${title}`;

    const [preview, setPreview] = useState(false);
    const closePreview = useCallback(() => setPreview(false), []);

    const { containerRef, translateY } = useScrollParallax(0.1);
    const { cardRef, tilt, onMouseMove, onMouseLeave } = useTilt(6);

    return (
        <>
            {preview && hasImage && (
                <ImageModal imgStatic={imgStatic} imgSrc={imgSrc} alt={alt} title={title} onClose={closePreview} />
            )}

            <article
                ref={cardRef as React.RefObject<HTMLElement>}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{
                    perspective: "1200px",
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                    transition: tilt.rotateX === 0 && tilt.rotateY === 0
                        ? "transform 0.6s cubic-bezier(0.23,1,0.32,1)"
                        : "transform 0.1s ease-out",
                    willChange: "transform",
                }}
                className={"group rounded-2xl border border-white/8 bg-gradient-to-br from-gray-900 to-gray-900/50 overflow-hidden hover:border-white/20 hover:shadow-2xl hover:shadow-green-500/8 transition-shadow duration-500"}
            >
                <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}>

                    {/* Image side with scroll parallax */}
                    {hasImage && (
                        <div
                            className={"relative w-full lg:w-1/2 overflow-hidden bg-gray-800 cursor-zoom-in"}
                            ref={containerRef}
                            onClick={(e) => {
                                setPreview(true);
                                // Prevent browser from scrolling the focused element into view
                                (e.currentTarget as HTMLElement).blur();
                            }}
                            role={"button"}
                            tabIndex={-1}
                            aria-label={`Preview image for ${title}`}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setPreview(true); }}
                        >
                            <div className={"aspect-[16/10] lg:aspect-auto lg:h-full relative"}>
                                {/* Image translates on scroll — slightly oversize (scale 1.15) so edges don't show */}
                                <div
                                    className={"absolute inset-0"}
                                    style={{
                                        transform: `translateY(${translateY}px) scale(1.15)`,
                                        transition: "transform 0.05s linear",
                                        willChange: "transform",
                                    }}
                                >
                                    {imgStatic ? (
                                        <Image
                                            src={imgStatic}
                                            alt={alt}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className={"object-cover"}
                                        />
                                    ) : imgSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={imgSrc}
                                            alt={alt}
                                            className={"absolute inset-0 w-full h-full object-cover"}
                                        />
                                    ) : null}
                                </div>

                                {/* Gradient overlay */}
                                <div className={"absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-gray-900/30 pointer-events-none"} />

                                {/* Zoom hint */}
                                <div className={"absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"}>
                                    <div className={"size-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"}>
                                        <FiZoomIn className={"size-5 text-white"} />
                                    </div>
                                </div>
                            </div>

                            {/* Year badge */}
                            <div className={"absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-semibold text-green-400"}>
                                {dateTitle}
                            </div>
                        </div>
                    )}

                    {/* Content side — counter-translates slightly for depth */}
                    <div
                        className={"w-full lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center space-y-5"}
                        style={{
                            transform: `translateX(${-tilt.rotateY * 0.8}px) translateY(${tilt.rotateX * 0.8}px)`,
                            transition: tilt.rotateX === 0 && tilt.rotateY === 0
                                ? "transform 0.6s cubic-bezier(0.23,1,0.32,1)"
                                : "transform 0.1s ease-out",
                        }}
                    >
                        <div className={"space-y-2"}>
                            <span className={"text-xs font-mono text-green-500/70 tracking-widest"}>
                                PROJECT {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className={"text-2xl md:text-3xl font-bold leading-tight group-hover:text-green-400 transition duration-300"}>
                                {title}
                            </h3>
                        </div>

                        {tags && tags.length > 0 && (
                            <div className={"flex flex-wrap gap-2"}>
                                {tags.map((tag) => (
                                    <span key={tag} className={"text-xs px-2.5 py-1 rounded-md border border-white/8 bg-white/5 text-gray-400 font-medium"}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className={"flex flex-col gap-2.5"}>
                            {descriptions.map((d, i) => (
                                <div key={i} className={"flex gap-3 text-sm text-gray-300 leading-relaxed"}>
                                    <AiFillCheckCircle className={"size-4 shrink-0 mt-0.5 text-green-500/80"} />
                                    <span>{d}</span>
                                </div>
                            ))}
                        </div>

                        <div className={"flex gap-3 flex-wrap pt-1"}>
                            {link && (
                                <a target={"_blank"} rel={"noopener noreferrer"} href={link}
                                    className={"inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-400 text-gray-900 font-semibold text-sm transition duration-300"}>
                                    Live Demo <FiExternalLink className={"size-3.5"} />
                                </a>
                            )}
                            {github && (
                                <a target={"_blank"} rel={"noopener noreferrer"} href={github}
                                    className={"inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-medium text-sm transition duration-300"}>
                                    <BsGithub className={"size-4"} /> Source Code
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
};

export default ProjectCard;
