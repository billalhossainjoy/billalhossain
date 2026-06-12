import { getContact, getHero, getResume } from "@/lib/content";
import { siteUrl } from "@/utils";
import ResumeActions from "./resume-actions";

export const dynamic = "force-dynamic";

export default function ResumePage() {
    const hero    = getHero();
    const contact = getContact();
    const resume  = getResume();

    const pdfUrl    = resume.pdfUrl;
    const base      = siteUrl(contact.website);
    const pageUrl   = `${base}/resume`;
    const directPdf = `${base}${pdfUrl}`;
    const initials  = hero.name.split(" ").map((w: string) => w[0]).join("");

    return (
        <div className="min-h-screen bg-[#0d0d0f] flex flex-col">

            {/* ── Navbar ───────────────────────────────────────────────── */}
            <header className="no-print sticky top-0 z-50 border-b border-white/8 bg-[#0d0d0f]/95 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">

                    {/* Left — back + identity */}
                    <div className="flex items-center gap-4 min-w-0">
                        <a
                            href="/"
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition shrink-0"
                            aria-label="Back to portfolio"
                        >
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Portfolio
                        </a>

                        <div className="h-4 w-px bg-white/10 shrink-0" />

                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-7 rounded-md bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-[11px] font-bold text-gray-900 shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate leading-none">{hero.name}</p>
                                <p className="text-[11px] text-gray-500 truncate leading-none mt-0.5">{hero.title}</p>
                            </div>
                        </div>

                        {/* Resume badge */}
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 shrink-0">
                            <svg className="size-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V8l-6-6H7zm5 0v5a1 1 0 001 1h5M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            </svg>
                            resume.pdf
                        </span>
                    </div>

                    {/* Right — actions */}
                    <ResumeActions pdfUrl={pdfUrl} pageUrl={pageUrl} directPdf={directPdf} />
                </div>
            </header>

            {/* ── Viewer area ───────────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center px-4 py-8">

                {/* Public URL pill */}
                <div className="no-print mb-5 flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/8 bg-white/3 text-xs text-gray-500">
                    <svg className="size-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Public PDF:</span>
                    <a
                        href={directPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 hover:underline transition truncate max-w-xs sm:max-w-none"
                    >
                        {directPdf}
                    </a>
                </div>

                {/* PDF card */}
                <div className="relative w-full max-w-5xl">
                    {/* Glow behind the PDF */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-2xl opacity-20 blur-2xl pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at center, #4ade80 0%, transparent 70%)" }}
                    />

                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 ring-1 ring-white/5">
                        {/* Toolbar strip above iframe */}
                        <div className="no-print flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/8">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-full bg-red-500/60" />
                                <div className="size-3 rounded-full bg-yellow-500/60" />
                                <div className="size-3 rounded-full bg-green-500/60" />
                            </div>
                            <span className="text-xs text-gray-600 font-mono">{hero.name.toLowerCase().replace(" ", "_")}_resume.pdf</span>
                            <div className="w-16" />
                        </div>

                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                            className="w-full bg-white"
                            style={{ height: "calc(100vh - 200px)", minHeight: "640px" }}
                            title={`${hero.name} — Resume`}
                        />
                    </div>
                </div>

                {/* Footer hint */}
                <p className="no-print mt-6 text-xs text-gray-600 text-center">
                    Use the <span className="text-gray-400">Download PDF</span> button to save a local copy ·{" "}
                    <a href={pageUrl} className="text-green-500/70 hover:text-green-400 transition">
                        {pageUrl}
                    </a>
                </p>
            </main>
        </div>
    );
}
