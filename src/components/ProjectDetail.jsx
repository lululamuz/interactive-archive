import { useEffect, useRef, useState } from "react";
import { PROJECTS, asset, pad } from "../lib/data.js";

// Full-screen view of one work. What appears depends on the medium:
// websites get a "visit" link, the music video a player beside its storyboard,
// Unity / Arduino work their clips, the photo essay its stories, and images open in a zoom view.
export default function ProjectDetail({ project, onClose, onNavigate }) {
  const [zoom, setZoom] = useState(null); // index of the image open in the zoom view
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  const order = [...PROJECTS].sort((a, b) => a.id - b.id);
  const i = order.findIndex((p) => p.id === project.id);
  const prev = order[(i - 1 + order.length) % order.length];
  const next = order[(i + 1) % order.length];

  useEffect(() => {
    closeRef.current?.focus();
    panelRef.current?.scrollTo(0, 0);
    setZoom(null);
  }, [project.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // A ref mirrors the zoom state so quick repeated key presses always see the latest value.
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  useEffect(() => {
    const n = project.images.length;
    const onKey = (e) => {
      const z = zoomRef.current;
      if (e.key === "Escape") {
        if (z !== null) {
          zoomRef.current = null;
          setZoom(null);
        } else onClose();
      }
      if (z !== null && e.key === "ArrowRight") setZoom((v) => (v + 1) % n);
      if (z !== null && e.key === "ArrowLeft") setZoom((v) => (v - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, project.images.length]);

  const facts = [
    ["Year", project.yearNote ? `${project.year} (${project.yearNote})` : project.year],
    ["Category", project.category],
    ["Medium", project.medium],
    ["Size", project.size],
    ["Role", project.role],
    ["Series", project.series],
    ["Context", project.context],
    ["Inspiration", project.inspiration],
  ].filter(([, v]) => v);

  // Images already shown as video posters or story photos are not repeated in the gallery.
  const shownElsewhere = new Set([
    ...(project.videos ?? []).map((v) => v.poster),
    ...(project.stories ?? []).map((s) => s.image),
  ]);
  const gallery = project.images.filter((src) => !shownElsewhere.has(src));

  return (
    <div className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title" ref={panelRef}>
      <div className="detail__bar">
        <button type="button" ref={closeRef} onClick={onClose} className="toggle is-on">
          (Close)
        </button>
        <div className="detail__pager">
          <button type="button" className="toggle" onClick={() => onNavigate(prev.slug)} aria-label={`Previous work: ${prev.title}`}>
            ← Prev
          </button>
          <span className="mono dim">
            {pad(project.id)} / {pad(order.length)}
          </span>
          <button type="button" className="toggle" onClick={() => onNavigate(next.slug)} aria-label={`Next work: ${next.title}`}>
            Next →
          </button>
        </div>
      </div>

      <header className="detail__head">
        <p className="mono dim">({project.category})</p>
        <h1 id="detail-title" className="detail__title">
          {project.title}
        </h1>
      </header>

      <div className="detail__body">
        <aside className="detail__facts">
          <dl>
            {facts.map(([k, v]) => (
              <div key={k} className="fact">
                <dt className="mono dim">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {project.tags?.length > 0 && (
            <ul className="tags" aria-label="Tags">
              {project.tags.map((t) => (
                <li key={t} className="mono">
                  {t}
                </li>
              ))}
            </ul>
          )}
          {project.link && (
            <a className="visit" href={project.link} target="_blank" rel="noreferrer">
              <span className="thin">(</span>
              {project.youtube ? "Watch on YouTube" : "Visit the site"} ↗<span className="thin">)</span>
            </a>
          )}
        </aside>

        <div className="detail__main">
          {project.description && <p className="detail__desc">{project.description}</p>}

          {project.parts && (
            <ul className="parts">
              {project.parts.map((part) => (
                <li key={part.title}>
                  <strong>{part.title}</strong>
                  <span className="mono dim">{[part.medium, part.size].filter(Boolean).join(" · ")}</span>
                </li>
              ))}
            </ul>
          )}

          {project.credits && (
            <dl className="credits">
              {project.credits.map((c) => (
                <div key={c.role} className="fact">
                  <dt className="mono dim">{c.role}</dt>
                  <dd>{c.name}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.youtube && (
            <div className="embed">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${project.youtube}`}
                title={`${project.title} — video`}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {project.videos?.map((v) => (
            <figure key={v.src} className="clip">
              {v.sound ? (
                <video src={asset(v.src)} poster={asset(v.poster)} controls playsInline preload="none" />
              ) : (
                <video src={asset(v.src)} poster={asset(v.poster)} autoPlay muted loop playsInline preload="metadata" />
              )}
              <figcaption className="mono dim">
                {v.caption}
                {v.sound ? " — press play, sound on" : ""}
              </figcaption>
            </figure>
          ))}

          {project.stories && (
            <ol className="stories">
              {project.stories.map((s) => (
                <li key={s.title} className="story">
                  <img src={asset(s.image)} alt="" loading="lazy" />
                  <div>
                    <h2>{s.title}</h2>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {gallery.length > 0 && (
            <>
              {project.youtube && <h2 className="section-label mono dim">Storyboard</h2>}
              <ul className={"gallery" + (gallery.length === 1 ? " gallery--single" : "")}>
                {gallery.map((src) => (
                  <li key={src}>
                    <button
                      type="button"
                      className="gallery__item"
                      onClick={() => setZoom(project.images.indexOf(src))}
                      aria-label="Open image larger"
                    >
                      <img src={asset(src)} alt="" loading="lazy" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {zoom !== null && (
        <div className="zoom" role="dialog" aria-label="Image viewer">
          <img src={asset(project.images[zoom])} alt="" />
          <div className="zoom__bar">
            <button type="button" className="toggle" onClick={() => setZoom((z) => (z - 1 + project.images.length) % project.images.length)}>
              ← Prev
            </button>
            <span className="mono dim">
              {pad(zoom + 1)} / {pad(project.images.length)}
            </span>
            <button type="button" className="toggle" onClick={() => setZoom((z) => (z + 1) % project.images.length)}>
              Next →
            </button>
            <button type="button" className="toggle is-on" onClick={() => setZoom(null)} autoFocus>
              (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
