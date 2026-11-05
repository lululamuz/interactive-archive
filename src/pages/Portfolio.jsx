import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import { CATEGORIES, PROJECTS, asset, pad } from "../lib/data.js";
import { replaceHash } from "../lib/useHashRoute.js";

const SORTS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "shuffle", label: "Shuffle" },
];
const VIEWS = [
  { key: "grid", label: "Grid" },
  { key: "index", label: "Index" },
];

// Small seeded shuffle so the order only changes when "Shuffle" is pressed, not on every render.
function shuffled(list, seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return list
    .map((p) => ({ p, k: rnd() }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.p);
}

const validCategory = (slug) => (CATEGORIES.some((c) => c.slug === slug) ? slug : "all");

export default function Portfolio({ routeCategory: rawCategory, onOpen }) {
  const routeCategory = rawCategory ? validCategory(rawCategory) : undefined;
  // --- Curation state (React useState) ---
  const [filter, setFilter] = useState(routeCategory ?? "all");
  const [sort, setSort] = useState("newest");
  const [seed, setSeed] = useState(1);
  const [view, setView] = useState("grid");
  const [hovered, setHovered] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Arriving from a category on the home page → apply that filter.
  useEffect(() => {
    if (routeCategory) setFilter(routeCategory);
  }, [routeCategory]);

  const chooseFilter = (slug) => {
    setFilter(slug);
    setHovered(null);
    replaceHash(slug === "all" ? "#/portfolio" : `#/portfolio/${slug}`);
  };

  const chooseSort = (key) => {
    setSort(key);
    if (key === "shuffle") setSeed((s) => s + 1);
  };

  // The list on screen is derived from state, so it updates immediately whenever filter or sort change.
  const items = useMemo(() => {
    const list = PROJECTS.filter((p) => filter === "all" || p.categorySlug === filter);
    if (sort === "newest") return [...list].sort((a, b) => b.year - a.year || b.id - a.id);
    if (sort === "oldest") return [...list].sort((a, b) => a.year - b.year || a.id - b.id);
    return shuffled(list, seed);
  }, [filter, sort, seed]);

  const filters = [{ slug: "all", label: "All" }, ...CATEGORIES];
  const countFor = (slug) =>
    slug === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.categorySlug === slug).length;
  const preview = view === "index" && hovered ? PROJECTS.find((p) => p.id === hovered) : null;

  const open = (e, p) => {
    e.preventDefault();
    onOpen(p.slug);
  };

  return (
    <div
      className="portfolio"
      onMouseMove={view === "index" ? (e) => setMouse({ x: e.clientX, y: e.clientY }) : undefined}
    >
      <SiteHeader current="portfolio" />

      <section className="filters" aria-labelledby="filters-label">
        <div className="eyebrow">
          <span>INDEX OF WORKS · 2022–2026</span>
          <span id="filters-label">FILTER BY CATEGORY</span>
        </div>
        <div className="filters__list" role="group" aria-labelledby="filters-label">
          {filters.map((f) => {
            const on = filter === f.slug;
            return (
              <button
                key={f.slug}
                type="button"
                className={"filter" + (on ? " is-on" : "")}
                aria-pressed={on}
                onClick={() => chooseFilter(f.slug)}
              >
                <span className="filter__bracket" aria-hidden="true">(</span>
                <span>{f.label}</span>
                <span className="filter__bracket" aria-hidden="true">)</span>
                <sup className="filter__count">{pad(countFor(f.slug))}</sup>
              </button>
            );
          })}
        </div>
      </section>

      <div className="toolbar">
        <p className="toolbar__count" aria-live="polite">
          SHOWING <strong>{pad(items.length)}</strong> / {pad(PROJECTS.length)}
        </p>
        <div className="toolbar__group" role="group" aria-label="Sort">
          <span className="toolbar__label">SORT</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={"toggle" + (sort === s.key ? " is-on" : "")}
              aria-pressed={sort === s.key}
              onClick={() => chooseSort(s.key)}
            >
              {sort === s.key ? `(${s.label})` : s.label}
            </button>
          ))}
        </div>
        <div className="toolbar__group" role="group" aria-label="View">
          <span className="toolbar__label">VIEW</span>
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              className={"toggle" + (view === v.key ? " is-on" : "")}
              aria-pressed={view === v.key}
              onClick={() => {
                setView(v.key);
                setHovered(null);
              }}
            >
              {view === v.key ? `(${v.label})` : v.label}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <ul className={"grid" + (hovered ? " has-hover" : "")} onMouseLeave={() => setHovered(null)}>
          {items.map((p) => (
            <li key={p.id} className={"card" + (hovered === p.id ? " is-hovered" : "")}>
              <a href={`#/work/${p.slug}`} onClick={(e) => open(e, p)} onMouseEnter={() => setHovered(p.id)} onFocus={() => setHovered(p.id)}>
                <div className="card__media">
                  <img src={asset(p.thumb)} alt="" loading="lazy" />
                </div>
                <div className="card__meta">
                  <span className="mono dim">{pad(p.id)}</span>
                  <span className="card__title">{p.title}</span>
                  <span className="mono dim">{p.year}</span>
                </div>
                <p className="card__tags mono dim">
                  ({p.category}) {p.tags.slice(0, 2).join(" · ")}
                </p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul className={"index" + (hovered ? " has-hover" : "")} onMouseLeave={() => setHovered(null)}>
          {items.map((p) => (
            <li key={p.id} className={"index__row" + (hovered === p.id ? " is-hovered" : "")}>
              <a href={`#/work/${p.slug}`} onClick={(e) => open(e, p)} onMouseEnter={() => setHovered(p.id)} onFocus={() => setHovered(p.id)}>
                <span className="mono dim index__num">{pad(p.id)}</span>
                <span className="index__title">{p.title}</span>
                <span className="mono dim index__cat">({p.category})</span>
                <span className="mono dim index__year">{p.year}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      {preview && (
        <img
          className="index__preview"
          src={asset(preview.thumb)}
          alt=""
          aria-hidden="true"
          style={{ transform: `translate3d(${mouse.x + 48}px, ${mouse.y - 120}px, 0)` }}
        />
      )}
    </div>
  );
}
