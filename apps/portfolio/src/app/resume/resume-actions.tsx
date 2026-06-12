"use client";

import { useState } from "react";

interface Props {
    pdfUrl:    string;
    pageUrl:   string;
    directPdf: string;
}

export default function ResumeActions({ pdfUrl, pageUrl, directPdf }: Props) {
    const [copied, setCopied] = useState(false);

    async function handleCopyLink() {
        await navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }

    return (
        <div className="flex items-center gap-2 shrink-0">

            {/* Copy link */}
            <button
                onClick={handleCopyLink}
                title="Copy link to this page"
                className={`hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    copied
                        ? "border-green-500/40 bg-green-500/10 text-green-400"
                        : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
            >
                {copied ? (
                    <>
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Share
                    </>
                )}
            </button>

            {/* Open in new tab */}
            <a
                href={directPdf}
                target="_blank"
                rel="noopener noreferrer"
                title="Open PDF in new tab"
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition"
            >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="hidden sm:inline">Open</span>
            </a>

            {/* Download — primary CTA */}
            <a
                href={pdfUrl}
                download
                title="Download resume PDF"
                className="flex items-center gap-2 h-8 px-4 rounded-lg text-xs font-semibold bg-green-500 hover:bg-green-400 active:bg-green-600 text-gray-900 transition shadow-md shadow-green-500/20 hover:shadow-green-400/30"
            >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
            </a>
        </div>
    );
}
