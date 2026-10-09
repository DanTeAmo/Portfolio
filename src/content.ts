export const navigation = [
  "About",
  "Skills",
  "Projects",
  "Education",
  "Contact",
];
export const about = [
  "I'm Daniel Rusnac, an Information Security student at the Technical University of Moldova.",
  "My interests bring together three areas of technology: software development, cybersecurity, and digital design.",
  "I enjoy exploring the entire process of creating digital products — from planning and designing an interface to understanding the code and systems that power it.",
  "Through university studies and personal projects, I'm building a foundation in programming, databases, web technologies, and information security.",
  "My goal is to develop the skills needed to create digital experiences that are functional, intuitive, and secure.",
];
export const skills = [
  ["Programming", "Python · C · JavaScript · TypeScript"],
  ["Frontend Technologies", "React · HTML · CSS · JSX"],
  ["Databases", "SQL"],
  ["Development Tools", "Git · GitHub · VS Code · Vite"],
  ["Design", "Figma · UI Design · Interface Prototyping"],
];
export interface Screenshot {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}
export const screenshots: Screenshot[] = [
  {
    src: "/assets/asos-shop-by-fit-original.png",
    width: 1803,
    height: 925,
    alt: "ASOS-inspired storefront navigation and Shop by fit fashion categories",
    caption: "Categories",
  },
  {
    src: "/assets/asos-products-original.png",
    width: 1917,
    height: 928,
    alt: "ASOS-inspired storefront product cards and carousel",
    caption: "Product cards",
  },
  {
    src: "/assets/asos-brands-original.png",
    width: 1917,
    height: 927,
    alt: "ASOS-inspired storefront brand showcase and footer",
    caption: "Brands & footer",
  },
];
export const project = {
  title: "ASOS-inspired E-commerce Website",
  category: "Web design / React development",
  overview:
    "A responsive fashion e-commerce frontend inspired by ASOS, based on an interface I designed independently in Figma.",
  description: [
    "I translated the design into a React application using JavaScript, JSX, and CSS, with Vite as the development and build tool.",
    "The project explores the structure of modern online retail through product collections, interactive components, responsive layouts, and consistent visual presentation.",
  ],
  role: "UI Design · Frontend Development",
  contribution:
    "I designed the website interface in Figma, prepared its visual assets, and worked on its implementation using Codex as an AI development assistant.",
  features: [
    "Responsive layouts for desktop, tablet, and mobile.",
    "Fashion categories and featured product sections.",
    "Interactive product carousel.",
    "Product search within the provided catalog.",
    "Product detail dialogs.",
    "Saved items and shopping bag with local browser persistence.",
    "Brand showcase and navigation.",
  ],
  technologies: "React · JavaScript · JSX · CSS · Vite",
  designTool: "Figma",
  developmentEnvironment: "VS Code · Codex · Git · GitHub",
  projectType:
    "Personal frontend project. No custom backend or checkout system.",
  disclaimer:
    "Independent project inspired by ASOS. Not affiliated with or endorsed by ASOS.",
  liveUrl: "https://asos-remake.vercel.app/",
  repositoryUrl: "https://github.com/DanTeAmo/Asos-Remake",
};
export const credentials = [
  {
    subject: "Databases",
    date: "2026-02-12",
    label: "February 12, 2026",
    document: "/assets/it-specialist-databases.pdf",
  },
  {
    subject: "JavaScript",
    date: "2025-12-11",
    label: "December 11, 2025",
    document: "/assets/it-specialist-javascript.pdf",
  },
];
