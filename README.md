# Interactive Archive — Lulu

An interactive personal portfolio built with React and Vite, for **Assignment 3: Interactive Archive**.

**Live site:** https://lululamuz.github.io/interactive-archive/

## Concept

The site presents two sides of an identity:

- **Portfolio — Curated Identity.** Work I choose to present, organised into five categories.
- **Personal Archive — Collected Identity.** A more personal, less structured space (planned, not part of this submission).

The visual idea comes from that split. On the home page the five categories are large, tilted, overlapping words that bleed off the screen — *collected*. Pointing at one straightens it, and its brackets slide open to frame it — *curated*. The bracket becomes the site's sign for "selected": the active filter, the active sort, the current page and the open work are all shown in (brackets).

## Features

| Assignment requirement | How it is met |
|---|---|
| At least 15 items | 16 works in `src/data/projects.json` |
| Items from JSON / API / user input | All works are loaded from the local JSON file |
| Rearrange or curate items | Filter by 5 categories, sort (Newest / Oldest / Shuffle), switch view (Grid / Index) |
| UI updates automatically | The visible list is derived from state, so it re-renders immediately on every change |
| React `useState` | Filter, sort, shuffle seed, view mode, hovered item, mouse position, zoomed image, home-page hover (see `Portfolio.jsx`, `Home.jsx`, `ProjectDetail.jsx`) |
| Interactive elements are recognisable | Brackets mark the selected option; inactive options are grey; a large custom cursor grows and turns half-transparent over anything clickable |
| GitHub Pages | Deployed by the GitHub Actions workflow in `.github/workflows/deploy.yaml` |

### Pages and interactions

- **Home** — the five categories as an interactive typographic composition. Hovering a category opens its brackets and shows its sub-disciplines; clicking goes to the portfolio already filtered to that category.
- **Portfolio**
  - Category filters with live counts; the selected one is framed by brackets.
  - Sort: newest, oldest, or shuffle (each press reshuffles).
  - Two views: a masonry **Grid** that keeps each image's proportions, and an editorial **Index** list where a preview of the work follows the mouse.
  - Hovering a work dims the others.
- **Work detail** — opens over the portfolio, with Prev / Next and Esc to close. The layout adapts to the medium:
  - images open in a zoom viewer (arrow keys to browse);
  - the music video is embedded next to its hand-drawn storyboard;
  - Unity and Arduino work play their recorded clips (the Unity dance clip keeps its music and plays on click);
  - websites get a link to the live site;
  - the photo essay *True Stories* shows each photo beside its text.
- **Custom cursor** — a large white arrow with a black outline. It is turned off on touch screens, where normal taps work.
- Works on phone widths; respects "reduce motion" settings.

## Project structure

```
index.html
src/
  main.jsx               entry point
  App.jsx                hash routing between Home / Portfolio / Work
  styles.css
  data/projects.json     the 16 works
  lib/data.js            categories, helpers, asset paths
  lib/useHashRoute.js    tiny hash router (#/, #/portfolio/<category>, #/work/<slug>)
  pages/Home.jsx
  pages/Portfolio.jsx    filter / sort / view state
  components/ProjectDetail.jsx
  components/Cursor.jsx
  components/SiteHeader.jsx
public/media/            images, thumbnails and video clips
```

### Data format

```json
{
  "id": 2,
  "slug": "the-cage",
  "title": "The Cage",
  "year": 2022,
  "category": "Visual Art",
  "tags": ["Installation", "Sculpture", "Light", "Captivity"],
  "medium": "Acrylic, mirror, LED",
  "size": "120 × 180 × 120 mm",
  "thumb": "media/thumbs/t02.jpg",
  "description": "",
  "images": ["media/images/the-cage-main.jpg", "..."]
}
```

Optional fields used by some works: `series`, `role`, `context`, `inspiration`, `link`, `youtube`, `videos`, `stories`, `parts`, `credits`, `yearNote`.

## Running locally

```bash
npm install
npm run dev
```

## External resources

- [React](https://react.dev/) and [Vite](https://vite.dev/)
- Fonts: [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts
- Video embed: YouTube (privacy-enhanced mode)
- Music in *Still With You — Music Video*: “Still With You” by Jung Kook
- All artworks, photographs, videos, storyboards and writing are my own unless noted on the work's page. *7 Nights* is a group-written story; the layout and book design are mine.

## AI tool usage

<!-- Draft — please edit this section in your own words before submitting. -->

The concept (Curated vs. Collected identity), the content, the category system, the visual direction (black and white, oversized type, the bracket motif, the large outlined cursor) and the selection of works are mine.

I used Claude (Anthropic) as a design and coding assistant. It helped me explore layout directions for the home page as interactive mock-ups, which I reviewed and chose between (I combined two directions and picked the thin bracket style and cursor behaviour). It also organised my works into the JSON data, cropped artworks out of my old portfolio PDFs and screenshots, and wrote most of the React code for the pages, filtering, sorting and detail views based on my designs and feedback. I reviewed the results and asked for changes where they did not match what I wanted.
