import projects from "../data/projects.json";

// The five main categories, in the order they appear everywhere on the site.
export const CATEGORIES = [
  { slug: "visual-art", label: "Visual Art", sub: "Painting · Illustration · Drawing · Print" },
  { slug: "creative-video", label: "Creative Video", sub: "Music video · Animation · Experimental film" },
  { slug: "web-interactive", label: "Web & Interactive", sub: "Websites · Creative coding · Data visualization" },
  { slug: "creative-technology", label: "Creative Technology", sub: "Unity · Arduino · Installation · Physical computing" },
  { slug: "other", label: "Other Design & Experiments", sub: "Performance · Photo essay · Book design" },
];

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const categoryByLabel = (label) => CATEGORIES.find((c) => c.label === label);

export const PROJECTS = projects.map((p) => ({
  ...p,
  categorySlug: categoryByLabel(p.category)?.slug ?? "other",
}));

export const projectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug);

// Files in /public are served from the site's base path (e.g. /interactive-archive/ on GitHub Pages).
export const asset = (path) => import.meta.env.BASE_URL + path;

export const pad = (n) => String(n).padStart(2, "0");
