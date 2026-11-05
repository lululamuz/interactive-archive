// Shared top bar. The current page is wrapped in brackets, like a selected filter.
export default function SiteHeader({ current, overlay = false }) {
  const links = [
    { key: "home", label: "Home", href: "#/" },
    { key: "portfolio", label: "Portfolio", href: "#/portfolio" },
  ];
  return (
    <header className={"site-header" + (overlay ? " site-header--overlay" : "")}>
      <a href="#/" className="site-header__name">
        Lulu
      </a>
      <nav aria-label="Site">
        <ul className="site-header__nav">
          {links.map((l) => (
            <li key={l.key}>
              <a href={l.href} aria-current={current === l.key ? "page" : undefined}>
                {current === l.key ? (
                  <>
                    <span className="thin">(</span>
                    {l.label}
                    <span className="thin">)</span>
                  </>
                ) : (
                  l.label
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
