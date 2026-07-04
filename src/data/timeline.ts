export interface TimelineEntry {
  when: string;
  title: string;
  description: string;
}

export const timeline: TimelineEntry[] = [
  {
    when: "20XX", // TODO(Rohit): year BS in Neuroscience began
    title: "Started BS in Neuroscience",
    description: "Chose the brain as a major. No regrets.",
  },
  {
    when: "2020",
    title: "First lines of code",
    description: "Started teaching myself web development; completed bootcamp projects.",
  },
  {
    when: "2022",
    title: "NURP research",
    description: "Undergraduate research program — first taste of real data analysis.",
  },
  {
    when: "20XX", // TODO(Rohit): graduation year
    title: "Graduated — BS, Neuroscience",
    description: "The first big milestone.",
  },
  {
    when: "Now",
    title: "Road to medical school",
    description:
      "Preparing applications and sharpening both stethoscope-adjacent and software skills.",
  },
];
