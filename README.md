# Youth Ministry Planner — Marketing Site

Static marketing/landing site for the Youth Ministry Planner app. Plain HTML/CSS/JS — no build step, no framework, no package manager. Open any `.html` file in a browser and it works; push the folder to GitHub Pages and it works there too.

This README is organized so new sections can be **appended** as the site grows — each part below (pages, styling, scripts, assets) is self-contained. When you add something new to the project, add a new entry in the matching section rather than restructuring what's already here.

---

## Quick start

- **Preview locally:** open `index.html` directly in a browser, or run any static server from this folder (e.g. `npx serve .` / VS Code "Live Server") so relative paths and the mobile viewport behave the same as production.
- **Deploy:** push to GitHub, then enable GitHub Pages on the branch/folder in the repo settings. No build step — the repo root is the site root.
- **⚠️ Case sensitivity:** GitHub Pages serves files from a case-sensitive Linux filesystem. This project's Windows dev environment is case-insensitive, so a folder rename (e.g. `images` → `Images`) can work fine locally but silently 404 once deployed if any HTML/CSS reference doesn't match the new casing exactly. If you rename or move a file/folder, grep the whole project for its old path and update every reference.
- **⚠️ Spaces in filenames:** several image files (`Hero Phone Display.png`, `Schedule Maker 5-4.gif`, `Placeholder Dashboard.png`, etc.) have spaces in their names. HTML references them URL-encoded (`%20`) — this works fine locally and on GitHub Pages, but if you rename these files, either keep the encoding in sync or switch to kebab-case names (e.g. `hero-phone-display.png`) to avoid the encoding entirely.
- **⚠️ OneDrive + git:** this project folder lives inside OneDrive. OneDrive's own sync can conflict with git (file locks mid-commit, `.git`'s thousands of small files syncing slowly or triggering "back up this folder" prompts). Recommended: either add this folder to OneDrive's "always keep on this device" so files aren't cloud-only placeholders, or clone/work from a copy outside OneDrive and copy the finished folder back. Either way, confirm every file below is fully downloaded (not a cloud-only ghost icon in File Explorer) before you run `git add`.


## Page map

| Page | Purpose |
|---|---|
| `index.html` | The landing page. Single scrolling page — see "Landing page sections" below. |
| `contact.html` | Simple contact page; "Email Us" button opens a `mailto:` to `tim@smartcascadia.com`. |
| `terms.html` | Real Terms of Service content, built from `Legal/terms-of-service.md`. Uses the `.legal-page` / `.legal-content` styles (see below). If the terms change, edit `Legal/terms-of-service.md` first, then update this file to match. |
| `privacy.html` | Real Privacy Policy content, built from `Legal/privacy-policy.md`. Same `.legal-page` styling as `terms.html`, plus a table for the third-party services list. Keep it in sync with `Legal/privacy-policy.md` the same way. |

There used to be a standalone `pricing.html`; it was merged into `index.html#pricing` to avoid keeping two copies of the price cards in sync.

### Landing page sections (`index.html`)

The homepage is one continuously scrolling page, in this order:

1. **Nav** — logo (links home), Pricing / Contact / Log in. Transparent over the hero on scroll position 0, fades to solid white once you scroll (see `script.js`).
2. **Hero** (`.hero`) — headline, CTA, and phone mockup image.
3. **Showcase Gifs** (`#showcase-gifs`) — 2 alternating text/media cards: the Schedule Maker demo GIF, then the Supplies Tracker screenshot. See "Images" below for the source files.
4. **Image Carousel** (`#showcase`) — auto-advancing slide carousel (Dashboard, Debrief, Worship/Scripture screenshots) with dots and prev/next arrows.
5. **Icon Features** (`#features`) — 4 static icon feature cards ("Built for Youth Ministry").
6. **Pricing** (`#pricing`) — Starter / Ministry / Church price cards. Ministry is the "Best Value" featured tier.
7. **Footer** — links + copyright.

It's a normal scrolling page — no scroll-snapping or keyboard section-jumping. Sections just size to their own content.

---


## Styling: `styles.css`

One stylesheet for the whole site, organized top-to-bottom with `/* ---- Comment ---- */` section headers matching what they style (Menu bar, Hero, Sections, Showcase, Carousel, Feature cards, Footer, Auth/simple pages, Pricing, Tablet & Mobile). When adding a new component, add its own labeled section rather than mixing rules into an unrelated one.

**Theme variables** live in the `:root` block at the very top and are grouped by area (`brand`, `menu`, `hero`, `buttons`, `carousel`, `footer`, `page`, `showcase`, `layout`, `pricing`). These values are meant to mirror `theme.csv` (see below) — if you change a color/value here, update the matching row in `theme.csv` too, and vice versa, so the CSV stays a trustworthy reference instead of going stale.

**`html.home` / `body.home` scoping:** this only applies on the landing page. Both `<html>` and `<body>` get `class="home"` in `index.html` only — the fixed, transparent-fading nav is scoped to `html.home` / `body.home` so it simply doesn't match on any other page; contact/terms/privacy use the normal sticky nav instead.

**Legal / content pages (`.legal-page` / `.legal-content`):** used by `terms.html` and `privacy.html` for long-form prose — headings, paragraphs, lists, an `<hr>` between sections, and a styled `<table>` (used once, in `privacy.html`'s third-party services list). Plain white background and a ~780px reading column, distinct from the narrow `.card` still used on `contact.html`.

**`.card` form styles (`.card form`, `.card label`, `.card input`):** originally built for `signin.html`'s login form. That page has been removed (see "Login handoff" below), so these rules are currently unused — kept in case a future page needs a similar form card, but safe to prune if nothing ends up using them.

**Responsive breakpoints:**
- `max-width: 900px` — nav collapses to the hamburger menu (`.nav-toggle` / `.nav-links.open`), and pricing cards stack to a single column. This is wider than the breakpoint below on purpose, since 3 nav links + logo don't comfortably fit down to 900px.
- `max-width: 760px` — "true mobile": hero/showcase cards stack vertically.

---

## Behavior: `script.js`

Four independent pieces, each in its own commented block:

1. **Mobile menu toggle** — click the hamburger (`.nav-toggle`) to open/close `.nav-links`.
2. **Navbar scroll fade** — only runs if `body.home` exists (landing page only). Toggles a `.scrolled` class once you scroll past 40px, which is what fades the nav from transparent to solid white.
3. **Showcase GIF fallback** — if a `.showcase-media img` fails to load (i.e. the GIF hasn't been added yet), it swaps in a small on-page note telling you which filename to add and where, instead of a broken-image icon.
4. **Image carousel** — builds the dots, wires prev/next buttons, supports touch swipe, and auto-advances every 5 seconds.
5. **Lightbox** — clicking any carousel slide *or* showcase-gif card image (Schedule Maker gif, Supplies Tracker, etc.) opens it enlarged in a full-screen overlay (`#lightbox` in `index.html`). Closes via the &times; button, clicking the dark backdrop, or Escape. One shared `openLightbox`/`closeLightbox` pair handles both; the carousel additionally pauses auto-advance while open and resumes it on close (showcase cards have no auto-advance to pause).

---

## Design tokens: `theme.csv`

A flat reference table (`group,token,value,description`) of every CSS custom property used across the site, grouped by area. This is the place to look to answer "what color is X" without hunting through `styles.css`.

**Important:** editing this CSV by itself does nothing — it's documentation, not a build input. The actual values live in `styles.css`'s `:root` block. Treat this file as the source of truth for *what the values should be*, and keep both files in sync by hand when you change a token.

---

## Images: `Images/`

| Folder | Contents |
|---|---|
| `Images/logos/` | `logo-icon.png` (square icon — used in the nav, favicon, and small card badges), `logo-full.png` (icon + wordmark stacked), `logo-text.png` (wordmark only). |
| `Images/photos/Backgrounds/` | `hero-background-source.jpg` — the hero and auth-page background photo. |
| `Images/photos/Elements/` | `Hero Phone Display.png` — the two-phone mockup graphic in the hero (this has been swapped a few times — `hero-iphone-mockup.png` → `Hero Phone Display.png` → `Overview Hero Phone Display.png` → `White Phone Hero Display.png` → back to `Hero Phone Display.png`; only the current filename exists on disk). Filename has spaces, so `index.html` references it URL-encoded (`Hero%20Phone%20Display.png`). |
| `Images/photos/Slides/` | `Placeholder Dashboard.png`, `Placeholder Debrief.png`, `Placeholder Worship Scripture.png` — the 3 real app-screenshot slides used in the `#showcase` carousel. Filenames contain spaces, so `index.html` references them URL-encoded (e.g. `Placeholder%20Dashboard.png`) — keep that encoding if you rename or add files here. `slide1.svg`/`slide2.svg`/`slide3.svg` are the old generic line-art placeholders; no longer referenced from any page, kept in the folder in case they're useful later. |
| `Images/photos/Gifs/` | `Schedule Maker 5-4.gif` (real animated demo, 5:4 aspect ratio) and `Placeholder Supplies Tracker.png` (static stand-in screenshot until a real Supplies Tracker GIF is made) — both used in the `#showcase-gifs` section. Same URL-encoding note as above applies (spaces in filenames). |
| `Images/photos/Showcase/` | No longer referenced — the Showcase Gifs section now points at `Images/photos/Gifs/` instead. Folder kept but currently unused; safe to remove once you're sure nothing needs it. |
| `Images/Icons/` | Small UI icons — currently `chevron-down-svgrepo-com.svg` (unused since the hero's scroll-down button was removed; kept in case you want a similar affordance later). |
| `Images/reference/` | `design-inspiration-screenshot.png` and a few other reference/pre-production screenshots — kept for design reference, not used anywhere in the live site. |

---

## Pre-publish checklist

What's real vs. still placeholder, as of the last audit:

- ✅ All pages link correctly (nav, footer, carousel, showcase) — no dead links or 404s found.
- ✅ All image/CSS/script references resolve to files that actually exist, case-sensitive-checked (matters for GitHub Pages — see "Case sensitivity" above).
- ✅ Terms of Service and Privacy Policy are real content (from `Legal/*.md`), not placeholders.
- ✅ Contact email is unified on `tim@smartcascadia.com` everywhere (contact page, legal pages, footers).
- ✅ `.nojekyll` is present at the repo root, so GitHub Pages serves the site as-is without Jekyll processing.
- ⚠️ `Images/photos/Gifs/Placeholder Supplies Tracker.png` is a static screenshot standing in for a future animated Supplies Tracker GIF — swap it in when one exists (update the `src` in the `#showcase-gifs` section of `index.html`).
- ⚠️ Pricing plan names/prices/features are explicitly placeholder copy (the page says so) — update `#pricing` in `index.html` when real plans are finalized.
- ✅ Login handoff: `signin.html` has been removed. Every "Log in" / "Get started" / "Start free trial" button across the site (nav, hero, pricing, footer — in `index.html`, `contact.html`, `terms.html`, `privacy.html`) now links directly to `https://www.youthministryplanner.com`, the actual app, built and owned by a separate team/codebase.

---

## Conventions for future edits

- **Adding a new landing-page section:** give it the `.section` class for standard padding/width, and add its own `/* ---- Name ---- */` block in `styles.css` near the other section styles.
- **Adding a new color/token:** add it to `:root` in `styles.css` *and* add a matching row in `theme.csv` in the same commit.
- **New images:** follow the existing `Images/<category>/<name>` pattern rather than dropping loose files at the project root.
- **Deleting something you're not 100% sure about:** move it to `_trash/` instead of deleting outright.
