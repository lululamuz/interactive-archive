import { useEffect, useState } from "react";

// Hash-based routing keeps every page reachable on GitHub Pages without a server.
//   #/                      → home
//   #/portfolio             → all works
//   #/portfolio/visual-art  → works filtered by category
//   #/work/the-cage         → a single work, opened over the portfolio
export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "portfolio") return { page: "portfolio", category: parts[1] ?? "all" };
  if (parts[0] === "work" && parts[1]) return { page: "work", slug: parts[1] };
  return { page: "home" };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export const go = (hash) => {
  window.location.hash = hash;
};

// Update the address bar without adding a history entry (used for filter changes).
export const replaceHash = (hash) => {
  window.history.replaceState(null, "", hash);
};
