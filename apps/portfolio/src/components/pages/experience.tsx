import { getExperiences } from "@/lib/content";
import ExperienceClient from "./experience-client";

export default function ExperienceSection() {
  const items = getExperiences();
  if (items.length === 0) return null;
  return <ExperienceClient items={items} />;
}
