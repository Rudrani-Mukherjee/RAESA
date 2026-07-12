# RAESA 2027 — Conference Website Starter

## Full folder structure

```
riyasa-website/
├── index.html                      ← Home            (Rudrani — build)
├── cfp.html                        ← Call for Papers  (placeholder)
├── speakers.html                   ← Speakers         (placeholder)
├── submission.html                 ← Submission       (placeholder)
├── registration.html               ← Registration     (placeholder — has fee table)
├── venue.html                      ← Venue            (placeholder)
├── program.html                    ← Program Schedule (placeholder)
├── contact.html                    ← Contact          (placeholder)
│
├── committee/
│   ├── organizing.html             (placeholder)
│   ├── advisory.html               (placeholder)
│   └── technical.html              (placeholder)
│
├── past-conferences/
│   ├── ncccs-2012.html             (placeholder)
│   ├── ncetstea-2020.html          (placeholder)
│   ├── mesiicon-2022.html          (placeholder)
│   └── ciacon-2025/
│       └── index.html              (placeholder — archived mini-site)
│
├── assets/
│   ├── css/style.css               ← SHARED — Rudrani owns, PR required to touch
│   ├── js/main.js                  ← SHARED — Rudrani owns, PR required to touch
│   ├── data/site-config.json       ← SHARED — Rudrani owns, PR required to touch
│   ├── images/{logo,sponsors,speakers,committee,venue}/  ← empty, drop real images here
│   └── docs/                       ← empty, drop PDFs here (brochure, CFP flyer, schedule)
│
└── README.md
```

## Which files are blank vs which to build

**Blank placeholders (teammates fill in):** everything under `committee/`,
`past-conferences/`, and the 7 top-level pages other than `index.html`.
Each one already has the correct `<head>`, header/footer mounts, and a
`<main id="page-content">` wrapper with a `TODO` note — the person owning
that page only edits inside `<main id="page-content">…</main>`.

**Rudrani builds:** `index.html` (real content, not a placeholder) plus the
three shared/locked files — `style.css`, `main.js`, `site-config.json`.
Nobody else should edit those three without a PR + your review, since they
affect every page at once.

## Depth-aware paths — important

Pages inside a subfolder (`committee/`, `past-conferences/`,
`past-conferences/ciacon-2025/`) need two things set correctly so the shared
header/footer/config still load:

1. `<body data-depth="1">` for one level deep (e.g. `committee/organizing.html`),
   `data-depth="2"` for two levels deep (e.g. `past-conferences/ciacon-2025/index.html`).
2. CSS/JS `<link>`/`<script>` tags prefixed with the matching number of `../`
   (already done in the placeholders — don't remove it).

Any image or PDF a contributor adds inside a subfolder page needs the same
`../` prefix, e.g. from `committee/organizing.html`:
`<img src="../assets/images/committee/chair.jpg">`.



Instead of hard-coding the navbar, footer, dates, email, and CMT link into every
one of the 45 pages, all of that lives in **one file**:

    assets/data/site-config.json

Every page just contains two empty mount points:

```html
<div id="site-header"></div>
...page content...
<div id="site-footer"></div>
```

`assets/js/main.js` reads `site-config.json` on load and builds the header, nav
(including the "Committee" dropdown), footer, and any `[data-widget]` /
`[data-field]` elements on the page automatically.

**Practical effect:** when the conference dates change, a new deadline is
added, the email changes, or a nav link is renamed — you edit `site-config.json`
once, and all 45 pages update instantly. You never touch page HTML for that.

## Dynamic widgets available on any page

- `<div data-widget="important-dates"></div>` — renders the deadlines ledger from config.
- `<a data-widget="cmt-link" href="#">Submit</a>` — auto-fills the CMT submission URL.
- `<span data-field="email"></span>`, `data-field="phone"`, `data-field="siteName"`,
  `data-field="fullName"`, `data-field="venueShort"` — pull single values straight from config.

## Adding a new page (of the ~45)

1. Copy any existing page (e.g. `cfp.html`) as a starting point.
2. Keep the `<div id="site-header"></div>` / `<div id="site-footer"></div>` mounts and the two `<script>`/`<link>` tags in `<head>`/before `</body>` — don't rebuild them by hand.
3. Add the new page's filename to the `nav` array (or a committee-style `children` array) in `site-config.json`. It appears in the menu on every page immediately.
4. Write the page's unique content in the middle.

For deeply-nested pages (e.g. `/proceedings/2026/track-1.html`), set
`data-depth="2"` on `<body>` so the config path resolves correctly (see comment in `main.js`).

## Committee sub-pages

`committee-organizing.html`, `committee-advisory.html`, and `committee-tpc.html`
are identical in structure — only the people/roles differ. Duplicate one of
these three when adding another committee-style page rather than starting from scratch.

## Running locally

Because `main.js` fetches `site-config.json`, the site must be served over
http, not opened directly as a `file://` path (browsers block `fetch()` on
local files). From this folder run one of:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`. On your actual hosting (pcrace or
otherwise) this works automatically since it's a real web server.

## Design tokens (for anyone extending the CSS)

- Ink navy `#0B2545`, signal gold `#C9A227`, teal accent `#146C6B`, slate bg `#F4F6F9`
- Display type: Source Serif 4 · Body/UI: Inter · Data/dates: IBM Plex Mono
- The "dates ledger" (numbered deadline list) is the one signature visual
  element — reuse it for any page with a real timeline; don't add numbered
  markers elsewhere just for decoration.

## Suggested build order for the remaining pages

1. Finish the 9 structural pages already scaffolded here.
2. Add per-track "Call for Papers" detail pages (if each track needs its own page).
3. Add individual author/paper-listing pages if proceedings will be listed page-by-page.
4. Add a photo-gallery / past-conference archive section once you have real photos.
5. Swap placeholder avatars, sponsor logos, and map embed for real assets last —
   structure first, content polish last.
