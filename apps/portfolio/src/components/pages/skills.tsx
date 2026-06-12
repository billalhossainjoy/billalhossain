import { getSkills } from "@/lib/content";
import SkillsClient from "./skills-client";

export default function Skills() {
    const categories = getSkills();
    return <SkillsClient categories={categories} />;
}
