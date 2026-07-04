export interface Project {
  title: string;
  year: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    title: "NURP Research Project",
    year: "2022",
    description:
      "Data analysis project from the Neuroscience Undergraduate Research Program: exploring and visualizing research data in Jupyter notebooks.",
    tech: ["Python", "Jupyter", "Data analysis"],
    github: "https://github.com/doctor-ra/NURP",
    featured: true,
  },
  {
    title: "Equation Calculator",
    year: "2021",
    description:
      "A Python tool for computing common scientific and everyday equations from a simple interface.",
    tech: ["Python"],
    github: "https://github.com/doctor-ra/calculator",
    featured: true,
  },
  {
    title: "Aniverse",
    year: "2020",
    description:
      "Team project from a web development bootcamp — a site for exploring anime, built with front-end fundamentals.",
    tech: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/doctor-ra/aniverse",
  },
  {
    title: "This website",
    year: "2026",
    description:
      "The site you're reading — statically generated, near-zero JavaScript, deployed from this repo.",
    tech: ["Astro", "Tailwind CSS", "GitHub Actions"],
    github: "https://github.com/doctor-ra/doctor-ra",
  },
];
