"use client";

import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
    const blobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId: number;
        let cx = window.innerWidth  / 2;
        let cy = window.innerHeight / 2;
        let tx = cx, ty = cy;

        const onMove = (e: MouseEvent) => {
            tx = e.clientX;
            ty = e.clientY;
        };

        const tick = () => {
            // Lerp for smooth lag
            cx += (tx - cx) * 0.07;
            cy += (ty - cy) * 0.07;

            if (blobRef.current) {
                blobRef.current.style.transform =
                    `translate(${cx - 300}px, ${cy - 300}px)`;
            }
            rafId = requestAnimationFrame(tick);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
                overflow: "hidden",
            }}
        >
            <div
                ref={blobRef}
                style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width:  600,
                    height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(74,222,128,0.035) 0%, transparent 70%)",
                    willChange: "transform",
                }}
            />
        </div>
    );
}
