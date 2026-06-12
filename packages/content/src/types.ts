// ── Content types (map 1:1 to markdown frontmatter fields) ───────────────────

export type Project = {
  id: string;
  title: string;
  dateTitle: string;
  descriptions: string[];
  tags: string[];
  link?: string;
  imgUrl: string;
  imgAlt: string;
  github?: string;
  order: number;
  published: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  logoUrl?: string;
  points: string[];
  tags: string[];
  order: number;
  published: boolean;
};

export type GalleryItem = {
  id: string;
  imgUrl: string;
  imgAlt: string;
  caption: string;
  category: string;
  order: number;
  published: boolean;
};

export type SkillCategory = {
  id: string;
  label: string;
  skills: string[];
};

export type Stat = {
  target: number;
  suffix: string;
  label: string;
};

export type About = {
  description: string;
  stats: Stat[];
};

export type Hero = {
  name: string;
  title: string;
  subtitle: string;
  badge: string;
  available: boolean;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type ResumeEducation = {
  institution: string;
  degree:      string;
  period:      string;
  location:    string;
  gpa:         string;
};

export type ResumeCertification = {
  title:  string;
  issuer: string;
  year:   string;
};

export type ResumeLanguage = {
  name:  string;
  level: string;
};

export type ResumeData = {
  pdfUrl:         string;
  education:      ResumeEducation[];
  certifications: ResumeCertification[];
  languages:      ResumeLanguage[];
};

export type FooterNavLink = {
  label: string;
  id:    string;
};

export type FooterConnectLink = {
  icon:  string;
  label: string;
  href:  string;
};

export type FooterData = {
  email:   string;
  phone:   string;
  tagline: string;
  nav: {
    title: string;
    links: FooterNavLink[];
  };
  connect: {
    title: string;
    links: FooterConnectLink[];
  };
  builtWith: { label: string; color: string }[];
};

export type ContactCardItem = {
  icon:        string;   // icon identifier: email | linkedin | github | facebook | etc.
  label:       string;
  value:       string;
  href:        string;
  description: string;
  color:       string;
  external:    boolean;
};

export type ContactData = {
  email:            string;
  phone:            string;
  website:          string;
  heading:          string;
  subheading:       string;
  description:      string;
  available:        boolean;
  availabilityText: string;
  ctaHeading:       string;
  ctaBody:          string;
  ctaButton:        string;
  cards:            ContactCardItem[];
};

// ── RAG type ─────────────────────────────────────────────────────────────────

export type KnowledgeChunk = {
  id: string;
  content: string;
  metadata: {
    category: "about" | "skills" | "project" | "experience" | "contact";
    title?: string;
    tags?: string[];
  };
};
