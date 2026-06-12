"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
    const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

    useEffect(() => {
        // Start fading after 1.1s
        const t1 = setTimeout(() => setPhase("fading"), 1100);
        // Remove from DOM after fade completes
        const t2 = setTimeout(() => setPhase("gone"),   1700);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    if (phase === "gone") return null;

    return (
        <div
            aria-hidden="true"
            style={{
                position:   "fixed",
                inset:      0,
                zIndex:     9999,
                display:    "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "20px",
                background: "#030712",          // same as bg-gray-950
                opacity:    phase === "fading" ? 0 : 1,
                transition: "opacity 0.6s ease",
                pointerEvents: phase === "fading" ? "none" : "all",
            }}
        >
            {/* Logo mark */}
            <div style={{
                width: 64, height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #4ade80, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#030712",
                animation: "loaderPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>
                BH
            </div>

            {/* Progress bar */}
            <div style={{
                width: 120,
                height: 2,
                borderRadius: 99,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    background: "linear-gradient(90deg,#4ade80,#22d3ee)",
                    animation: "loaderBar 1s ease-out both",
                }} />
            </div>

            <style>{`
                @keyframes loaderPop {
                    from { opacity:0; transform: scale(0.7) rotate(-10deg); }
                    to   { opacity:1; transform: scale(1) rotate(0deg); }
                }
                @keyframes loaderBar {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
            `}</style>
        </div>
    );
}
