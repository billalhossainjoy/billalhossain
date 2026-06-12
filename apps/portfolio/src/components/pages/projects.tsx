import React from 'react';
import ProjectCard from "@/components/project";
import ScrollReveal from "@/components/scroll-reveal";
import WordReveal from "@/components/word-reveal";
import { getProjects } from "@/lib/content";

export default function Projects() {
  const projects = getProjects();

  return (
    <section className={"pt-24 pb-16 px-6"} id="projects">
      <div className={"max-w-6xl mx-auto space-y-16"}>
        {/* Header */}
        <div className={"text-center space-y-4"}>
          <ScrollReveal from={"bottom"}>
            <p className={"font-serif bg-gradient-to-r text-lg from-green-400 to-green-700 inline-block text-transparent bg-clip-text tracking-wide uppercase"}>
              Portfolio
            </p>
          </ScrollReveal>
          <WordReveal
            text={"Featured Projects"}
            as={"h2"}
            className={"text-4xl md:text-5xl font-bold"}
            stagger={80}
          />
          <ScrollReveal from={"bottom"} delay={300}>
            <p className={"text-lg text-gray-400 max-w-2xl mx-auto"}>
              A selection of work showcasing what I&apos;ve built — from full-stack platforms to real-time applications.
            </p>
          </ScrollReveal>
        </div>

        {/* Project grid — each card slides in from the side on scroll */}
        <div className={"flex flex-col gap-8"}>
          {projects.map((project, index) => {
            // Odd index = image on right → text enters from right, image from left
            const from = index % 2 === 0 ? "left" : "right";
            return (
              <ScrollReveal key={project.id} from={from} delay={index * 60}>
                <ProjectCard
                  index={index}
                  dateTitle={project.dateTitle}
                  title={project.title}
                  descriptions={project.descriptions}
                  tags={project.tags}
                  link={project.link}
                  imgSrc={project.imgUrl}
                  imgAlt={project.imgAlt}
                  github={project.github}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
