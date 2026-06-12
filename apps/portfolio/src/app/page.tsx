import React, { Suspense } from 'react';

// Always re-render on every request so markdown file edits appear immediately
// without restarting the dev server.
export const dynamic = 'force-dynamic';
import Header from "@/components/pages/header";
import Hero from "@/components/pages/hero";
import About from "@/components/pages/about";
import Skills from "@/components/pages/skills";
import ExperienceSection from "@/components/pages/experience";
import Projects from "@/components/pages/projects";
import Gallery from "@/components/pages/gallery";
import Contact from "@/components/pages/contact";
import Footer from "@/components/pages/footer";
import BottomEffect from "@/components/bottomEffect";
import ChatWidget from "@/components/chat-widget";
import DevSyncPanel from "@/components/dev-sync-panel";

export default function Home() {
    return (
        <div className={"relative"}>
            <Header />
            <Hero />
            <About />
            <Skills />
            <Suspense>
                <ExperienceSection />
            </Suspense>
            <Suspense fallback={<div className={"py-40 text-center text-gray-500"}>Loading projects…</div>}>
                <Projects />
            </Suspense>
            <Suspense>
                <Gallery />
            </Suspense>
            <Contact />
            <Footer />
            <BottomEffect />
            <ChatWidget />
            {process.env.NODE_ENV === "development" && <DevSyncPanel />}
        </div>
    );
}