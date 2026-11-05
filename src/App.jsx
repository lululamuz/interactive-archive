import { useCallback, useEffect, useRef } from "react";
import Cursor from "./components/Cursor.jsx";
import ProjectDetail from "./components/ProjectDetail.jsx";
import Home from "./pages/Home.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import { projectBySlug } from "./lib/data.js";
import { go, useHashRoute } from "./lib/useHashRoute.js";

export default function App() {
  const route = useHashRoute();
  // True when a work was opened from the portfolio, so closing can return to the same place.
  const openedFromList = useRef(false);

  const project = route.page === "work" ? projectBySlug(route.slug) : null;

  useEffect(() => {
    if (route.page === "work" && !project) go("#/portfolio");
  }, [route.page, project]);

  // Jump to the top when changing pages, but keep the list's scroll position when a work closes.
  const lastPage = useRef(route.page);
  useEffect(() => {
    if (route.page !== "work" && lastPage.current !== "work") window.scrollTo(0, 0);
    lastPage.current = route.page;
  }, [route.page]);

  const openProject = useCallback((slug) => {
    openedFromList.current = true;
    go(`#/work/${slug}`);
  }, []);

  const closeProject = useCallback(() => {
    if (openedFromList.current) {
      openedFromList.current = false;
      window.history.back();
    } else {
      go("#/portfolio");
    }
  }, []);

  // Prev / Next inside the detail view replaces the entry, so "Close" still returns to the list.
  const navigateProject = useCallback((slug) => {
    window.location.replace(`#/work/${slug}`);
  }, []);

  return (
    <>
      <Cursor size={56} grow={1.6} hoverOpacity={0.5} />
      {route.page === "home" ? (
        <Home />
      ) : (
        <>
          <Portfolio
            routeCategory={route.page === "portfolio" ? route.category : undefined}
            onOpen={openProject}
          />
          {project && <ProjectDetail project={project} onClose={closeProject} onNavigate={navigateProject} />}
        </>
      )}
    </>
  );
}
