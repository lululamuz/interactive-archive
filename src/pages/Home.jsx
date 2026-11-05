import { useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import { CATEGORIES, PROJECTS } from "../lib/data.js";

// Home: the five categories as large, tilted, overlapping words that bleed off the screen
// ("collected"). Pointing at one straightens it and its brackets slide open to frame it ("curated").
const LAYOUT = [
  { bleed: 8, top: 10, rot: -6, vw: 14, a: 0.1, b: 1 },
  { bleed: 4, top: 27, rot: 4, vw: 10, a: 1.2, b: 0.2 },
  { bleed: 10, top: 44, rot: -2.5, vw: 11, a: 0.4, b: 0.6 },
  { bleed: 6, top: 61, rot: 6, vw: 8.5, a: 0.9, b: 0.1 },
  { bleed: 14, top: 77, rot: -3, vw: 8, a: 0, b: 0.3 },
];

export default function Home() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="home">
      <SiteHeader current="home" overlay />

      <nav className="home__cats" aria-label="Portfolio categories" onMouseLeave={() => setHovered(null)}>
        {CATEGORIES.map((cat, i) => {
          const l = LAYOUT[i];
          const on = hovered === i;
          const fitVw = Math.min(l.vw, 74 / (cat.label.length * 0.5));
          const count = PROJECTS.filter((p) => p.categorySlug === cat.slug).length;
          return (
            <div
              key={cat.slug}
              className="home__row"
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              style={{
                top: `${l.top}%`,
                left: on ? "0%" : `${-l.bleed}%`,
                width: on ? "100%" : `${100 + l.bleed * 2}%`,
                padding: on ? "0 clamp(16px, 3vw, 48px)" : 0,
                zIndex: on ? 10 : i + 1,
                opacity: hovered === null || on ? 1 : 0.3,
                transform: `rotate(${on ? 0 : l.rot}deg)`,
              }}
            >
              <span className="home__spacer" style={{ flexGrow: on ? 0 : l.a }} />
              <span
                className="home__bracket"
                aria-hidden="true"
                style={{ fontSize: `${(on ? fitVw * 1.9 : l.vw * 1.2).toFixed(2)}vw` }}
              >
                (
              </span>
              <span className="home__spacer home__spacer--inner" style={{ flexGrow: on ? 1 : 0 }} />
              <a
                href={`#/portfolio/${cat.slug}`}
                className="home__word"
                style={{ fontSize: `${(on ? fitVw : l.vw).toFixed(2)}vw` }}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-label={`${cat.label} — ${count} works`}
              >
                <sup>{String(i + 1).padStart(2, "0")}</sup>
                {cat.label}
                <span className="home__sub" style={{ opacity: on ? 1 : 0 }}>
                  {cat.sub}
                </span>
              </a>
              <span className="home__spacer home__spacer--inner" style={{ flexGrow: on ? 1 : 0 }} />
              <span
                className="home__bracket"
                aria-hidden="true"
                style={{ fontSize: `${(on ? fitVw * 1.9 : l.vw * 1.2).toFixed(2)}vw` }}
              >
                )
              </span>
              <span className="home__spacer" style={{ flexGrow: on ? 0 : l.b }} />
            </div>
          );
        })}
      </nav>
    </div>
  );
}
