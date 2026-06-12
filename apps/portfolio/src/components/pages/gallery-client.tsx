"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/lib/content";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiZoomIn } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

/* ── Lightbox ──────────────────────────────────────────────────── */

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft")  onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  return createPortal(
    <div
      className={"fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-[fadeIn_200ms_ease]"}
      onClick={onClose}
      role={"dialog"}
      aria-modal={"true"}
    >
      {/* Close */}
      <button onClick={onClose} className={"absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"} aria-label={"Close"}>
        <HiX className={"size-5 text-white"} />
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className={"absolute left-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"} aria-label={"Previous"}>
          <HiChevronLeft className={"size-6 text-white"} />
        </button>
      )}

      {/* Image */}
      <div className={"relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-4"} onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imgUrl}
          alt={item.imgAlt || item.caption}
          className={"max-h-[78vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"}
        />
        {item.caption && (
          <p className={"text-sm text-gray-300 text-center max-w-lg"}>{item.caption}</p>
        )}
        <p className={"text-xs text-gray-500"}>{index + 1} / {items.length}</p>
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className={"absolute right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"} aria-label={"Next"}>
          <HiChevronRight className={"size-6 text-white"} />
        </button>
      )}
    </div>,
    document.body,
  );
}

/* ── Gallery Client ────────────────────────────────────────────── */

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    return ["all", ...cats];
  }, [items]);

  const filtered = useMemo(
    () => activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory),
    [items, activeCategory],
  );

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  }, [filtered.length]);
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));
  }, [filtered.length]);

  return (
    <>
      {lightboxIndex !== null && (
        <Lightbox items={filtered} index={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}

      <section id={"gallery"} className={"pt-24 pb-8 px-6"}>
        <div className={"max-w-6xl mx-auto space-y-12"}>
          {/* Header */}
          <div className={"text-center space-y-4"}>
            <p className={"font-serif bg-gradient-to-r text-lg from-green-400 to-green-700 inline-block text-transparent bg-clip-text tracking-wide uppercase"}>
              Gallery
            </p>
            <h2 className={"text-4xl md:text-5xl font-bold"}>Visual Showcase</h2>
            <p className={"text-lg text-gray-400 max-w-2xl mx-auto"}>
              Screenshots, designs and moments from my work.
            </p>
          </div>

          {/* Category filter */}
          {categories.length > 2 && (
            <div className={"flex justify-center"}>
              <div className={"inline-flex gap-1 p-1 rounded-xl border border-white/10 bg-white/5 flex-wrap justify-center"}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={twMerge(
                      "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-300",
                      activeCategory === cat
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {items.length === 0 && (
            <div className={"rounded-2xl border border-dashed border-white/10 py-20 text-center text-gray-500"}>
              <p className={"text-lg"}>No images yet.</p>
              <p className={"text-sm mt-1"}>Add images from the admin panel to see them here.</p>
            </div>
          )}

          {/* Masonry-style grid */}
          {filtered.length > 0 && (
          <div className={"columns-2 sm:columns-3 md:columns-4 gap-3 space-y-3"}>
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className={"group relative break-inside-avoid rounded-xl overflow-hidden border border-white/8 cursor-zoom-in hover:border-white/20 transition-all duration-300"}
                onClick={() => openLightbox(idx)}
                role={"button"}
                tabIndex={0}
                aria-label={`View ${item.imgAlt || item.caption || "gallery image"}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(idx); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imgUrl}
                  alt={item.imgAlt || item.caption}
                  className={"w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"}
                  loading={"lazy"}
                />

                {/* Hover overlay */}
                <div className={"absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"}>
                  <div className={"size-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center"}>
                    <FiZoomIn className={"size-5 text-white"} />
                  </div>
                  {item.caption && (
                    <p className={"text-xs text-white/80 px-4 text-center line-clamp-2"}>{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
