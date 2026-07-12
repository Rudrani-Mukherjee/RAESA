# RAESA 2027 — Conference Website

## Full folder structure

```
raesa-conf/
├── index.html                      ← Home
├── speakers.html                   ← Speakers
├── submission.html                 ← Submission
├── cfp.html                        ← Call for Papers
├── registration.html               ← Registration
├── venue.html                      ← Venue
├── program.html                    ← Program Schedule
├── contact.html                    ← Contact
│
├── committee/
│   ├── organizing.html
│   ├── advisory.html
│   └── technical.html
│
├── past-conferences/
│   ├── ncccs-2012.html
│   ├── ncetstea-2020.html
│   ├── mesiicon-2022.html
│   └── ciacon-2025/
│       └── index.html
│
├── assets/
│   ├── css/style.css               ← SHARED — edit via Pull Request only, do not edit directly
│   ├── js/main.js                  ← SHARED — edit via Pull Request only, do not edit directly
│   ├── data/site-config.json       ← SHARED — edit via Pull Request only, do not edit directly
│   ├── images/{logo,sponsors,speakers,committee,venue}/  ← drop real images here
│   └── docs/                       ← drop PDFs here (brochure, CFP flyer, schedule)
│
└── README.md
```

## Which files are blank vs which to build

**Placeholders (page owners fill in):** everything under `committee/`,
`past-conferences/`, and the 7 top-level pages other than `index.html`.
Each one already has the correct `<head>`, header/footer mounts, and a
`<main id="page-content">` wrapper — the person owning that page only edits
inside `<main id="page-content">…</main>`.

**Home page:** `index.html` gets real content directly (not a placeholder).
The three shared/locked files below are edited via PR only, regardless of
who's making the change — they affect every page at once, so any update to
them goes through review first.

## Depth-aware paths — important

Pages inside a subfolder (`committee/`, `past-conferences/`,
`past-conferences/ciacon-2025/`) need two things set correctly so the shared
header/footer/config still load:

1. `<body data-depth="1">` for one level deep (e.g. `committee/organizing.html`),
   `data-depth="2"` for two levels deep (e.g. `past-conferences/ciacon-2025/index.html`).
2. CSS/JS `<link>`/`<script>` tags prefixed with the matching number of `../`
   (already done in every placeholder — don't remove it).

Any image or PDF a contributor adds inside a subfolder page needs the same
`../` prefix, e.g. from `committee/organizing.html`:
`<img src="../assets/images/committee/chair.jpg">`.

## How the shared header/footer/nav work

Instead of hard-coding the navbar, footer, dates, email, and CMT link into
every page, all of that lives in one file:

    assets/data/site-config.json

Every page just contains two empty mount points:

```html
<div id="site-header"></div>
...page content...
<div id="site-footer"></div>
```

`assets/js/main.js` reads `site-config.json` on load and builds the header,
nav (including the "Committee" and "Past Conf." dropdowns), footer, and any
`[data-widget]` / `[data-field]` elements on the page automatically.

**Practical effect:** when the conference dates change, a new deadline is
added, the email changes, or a nav link is renamed — edit `site-config.json`
once, and every page updates instantly. Page HTML never needs to change for that.

## Dynamic widgets available on any page

- `<div data-widget="important-dates"></div>` — renders the deadlines ledger from config.
- `<a data-widget="cmt-link" href="#">Submit</a>` — auto-fills the CMT submission URL.
- `<span data-field="email"></span>`, `data-field="phone"`, `data-field="siteName"`,
  `data-field="fullName"`, `data-field="venueShort"` — pull single values straight from config.

## Adding a new page

1. Copy the closest existing page as a starting point (e.g. `cfp.html`, or one
   of the `committee/*.html` files if it's a committee-style page).
2. Keep the `<div id="site-header"></div>` / `<div id="site-footer"></div>`
   mounts and the `<link>`/`<script>` tags in `<head>`/before `</body>` — don't
   rebuild them by hand.
3. Add the new page's filename to the `nav` array (or a `children` array) in
   `site-config.json`. It appears in the menu on every page immediately.
4. Write the page's unique content inside `<main id="page-content">`.

## Committee & past-conference sub-pages

`committee/organizing.html`, `committee/advisory.html`, and
`committee/technical.html` are identical in structure — only the people/roles
differ. Same for the four `past-conferences/*.html` files. Duplicate the
closest one when adding another page like these rather than starting from scratch.

## Running locally

Because `main.js` fetches `site-config.json`, the site must be served over
http, not opened directly as a `file://` path (browsers block `fetch()` on
local files). From this folder run one of:

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then open `http://localhost:8080`.

## Design tokens (for anyone extending the CSS)

- Ink navy `#0B2545`, signal gold `#C9A227`, teal accent `#146C6B`, slate bg `#F4F6F9`
- Display type: Source Serif 4 · Body/UI: Inter · Data/dates: IBM Plex Mono
- The "dates ledger" (numbered deadline list) is the one signature visual
  element — reuse it for any page with a real timeline; don't add numbered
  markers elsewhere just for decoration.

## Git workflow

- Clone the repo, then branch per assigned page(s): `git checkout -b page/committee`.
- Only edit inside `<main id="page-content">` in your assigned files.
- Pull `main` before starting each session: `git pull origin main`.
- Push your branch and open a PR into `main` when a page is ready.
- `style.css`, `main.js`, and `site-config.json` always go through a PR —
  raise what you need changed there and it'll get reviewed and merged in.