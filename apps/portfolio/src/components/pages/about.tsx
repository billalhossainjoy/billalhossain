import { getAbout } from "@/lib/content";
import AboutClient from "./about-client";

export default function About() {
    const { description, stats } = getAbout();
    return <AboutClient description={description} stats={stats} />;
}
