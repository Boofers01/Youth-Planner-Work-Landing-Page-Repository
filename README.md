# Youth Ministry Planner — Marketing Site

Static marketing/landing site for the Youth Ministry Planner app. Plain HTML/CSS/JS — no build step, no framework, no package manager. Open any `.html` file in a browser and it works; push the folder to GitHub Pages and it works there too.

This README is organized so new sections can be **appended** as the site grows — each part below (pages, styling, scripts, assets) is self-contained. When you add something new to the project, add a new entry in the matching section rather than restructuring what's already here.

---

## Quick start

- **Preview locally:** open `index.html` directly in a browser, or run any static server from this folder (e.g. `npx serve .` / VS Code "Live Server") so relative paths and the mobile viewport behave the same as production.
- **Deploy:** push to GitHub, then enable GitHub Pages on the branch/folder in the repo settings. No build step — the repo root is the site root.
- **⚠️ Case sensitivity:** GitHub Pages serves files from a case-sensitive Linux filesystem. This project's Windows dev environment is case-insensitive, so a folder rename (e.g. `images` → `Images`) can work fine locally but silently 404 once deployed if any HTML/CSS reference doesn't match the new casing exactly. If you rename or move a file/folder, grep the whole project for its old path and update every reference.

---

## Page map

| Page | Purpose |
|---|---|
| `index.html` | The landing page. Single scrolling page — see "Landing page sections" below. |
| `contact.html` | Simple contact page; "Email Us" button opens a `mailto:` to `Tim@smartcascadai.com`. |
| `signin.html` | Log in page mockup. The form does **not** submit anywhere yet — `onsubmit` just shows a placeholder alert. Wire it up to the real app backend when that's ready. |
| `terms.html` | Not real content — it's a redirect stub (3-second meta-refresh) to an external Terms of Service URL. Replace the placeholder URL (appears twice in the file, in the `<meta>` tag and the "Continue" link) once you have real terms hosted somewhere. |

There used to be a standalone `pricing.html`; it was merged into `index.html#pricing` to avoid keeping two copies of the price cards in sync. The old file is kept (not deleted) in `_trash/` for reference.

### Landing page sections (`index.html`)

The homepage is one continuously scrolling page, in this order:

1. **Nav** — logo (links home), Pricing / Contact / Log in. Transparent over the hero on scroll position 0, fades to solid white once you scroll (see `script.js`).
2. **Hero** (`.hero`) — headline, CTA, phone mockup image, and the bouncing down-arrow button.
3. **Showcase Gifs** (`#showcase-gifs`) — 3 alternating text/media cards meant to hold short app-demo GIFs. See "Known placeholders" below — the GIF files don't exist yet.
4. **Image Carousel** (`#showcase`) — auto-advancing slide carousel with dots and prev/next arrows.
5. **Icon Features** (`#features`) — 4 static icon feature cards ("Built for Youth Ministry").
6. **Pricing** (`#pricing`) — Starter / Ministry / Church price cards. Ministry is the "Best Value" featured tier.
7. **Footer** — links + copyright.

Each of these (except the footer) has the `.snap-section` class, which is what drives the scroll-snap + arrow-key navigation described in the JS section below. Add that class to any new element you insert into this flow and it's automatically picked up — no other code changes needed.

---

## Styling: `styles.css`

One stylesheet for the whole site, organized top-to-bottom with `/* ---- Comment ---- */` section headers matching what they style (Menu bar, Hero, Sections, Showcase, Carousel, Feature cards, Footer, Auth/simple pages, Pricing, Tablet & Mobile). When adding a new component, add its own labeled section rather than mixing rules into an unrelated one.

**Theme variables** live in the `:root` block at the very top and are grouped by area (`brand`, `menu`, `hero`, `buttons`, `carousel`, `footer`, `page`, `showcase`, `layout`, `pricing`). These values are meant to mirror `theme.csv` (see below) — if you change a color/value here, update the matching row in `theme.csv` too, and vice versa, so the CSV stays a trustworthy reference instead of going stale.

**Scroll-snap system:** this only applies on the landing page. Both `<html>` and `<body>` get `class="home"` in `index.html` only — CSS rules scoped to `html.home` / `body.home` (fixed transparent nav, scroll-snap-type, min-height per section) simply don't match on any other page, so contact/signin/terms scroll normally with no snapping and no fixed nav.

**Responsive breakpoints:**
- `max-width: 900px` — nav collapses to the hamburger menu (`.nav-toggle` / `.nav-links.open`), and pricing cards stack to a single column. This is wider than the breakpoint below on purpose, since 3 nav links + logo don't comfortably fit down to 900px.
- `max-width: 760px` — "true mobile": hero/showcase cards stack vertically, and scroll-snap is turned off (`html.home { scroll-snap-type: none; }`) since it fights normal touch scrolling more than it helps on phones. Tablets (761–900px) keep the snap-scrolling feel.

---

## Behavior: `script.js`

Four independent pieces, each in its own commented block:

1. **Mobile menu toggle** — click the hamburger (`.nav-toggle`) to open/close `.nav-links`.
2. **Navbar scroll fade** — only runs if `body.home` exists (landing page only). Toggles a `.scrolled` class once you scroll past 40px, which is what fades the nav from transparent to solid white.
3. **Section-to-section navigation** — queries `document.querySelectorAll('.snap-section')` fresh every time (not cached), so any section you add/remove/reorder in the markup is picked up automatically:
   - Arrow keys / Page Up / Page Down jump between sections. Ignored while a text field has focus.
   - The hero's down-arrow button jumps to "next section".
   - Figures out which section is "current" by checking which one's midpoint is closest to the viewport's midpoint — works regardless of whether a section snaps to `start` or `center` (the showcase cards use `center`; everything else uses `start`).
4. **Showcase GIF fallback** — if a `.showcase-media img` fails to load (i.e. the GIF hasn't been added yet), it swaps in a small on-page note telling you which filename to add and where, instead of a broken-image icon.
5. **Image carousel** — builds the dots, wires prev/next buttons, supports touch swipe, and auto-advances every 5 seconds.

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
| `Images/photos/Elements/` | `hero-iphone-mockup.png` — the phone mockup graphic in the hero. |
| `Images/photos/Slides/` | `slide1.svg`, `slide2.svg`, `slide3.svg` — the 3 image carousel slides. |
| `Images/photos/Showcase/` | **Not created yet.** The Showcase Gifs section expects `showcase-calendar.gif`, `showcase-reminders.gif`, and `showcase-volunteers.gif` here. Until they exist, each card shows a placeholder telling you the exact filename to drop in (see `script.js` behavior #4 above) — nothing is broken, it's just waiting for real GIFs. |
| `Images/Icons/` | Small UI icons — currently `chevron-down-svgrepo-com.svg` (the hero's scroll-down arrow). |
| `Images/reference/` | `design-inspiration-screenshot.png` — a screenshot kept for design reference, not used anywhere in the live site. |

`_trash/` — retired files kept instead of hard-deleted (currently just the old standalone `pricing.html`). Safe to permanently delete once you're confident nothing needs it, but nothing here is loaded by the live site.

---

## Known placeholders / TODO before fully "live"

- `Images/photos/Showcase/*.gif` don't exist yet — add them to light up the Showcase Gifs section.
- `terms.html` redirects to `https://example.com/your-terms-of-service` — replace with your real hosted Terms of Service URL (update it in both places in the file).
- Pricing plan names/prices/features are explicitly placeholder copy (the page says so) — update `#pricing` in `index.html` when real plans are finalized.
- `signin.html`'s form doesn't submit anywhere real yet — connect it to the actual app's auth once that exists.

---

## Conventions for future edits

- **Adding a new landing-page section:** give it the `.section` class for standard padding/width, add `.snap-section` if it should be a scroll/keyboard-nav stop, and add its own `/* ---- Name ---- */` block in `styles.css` near the other section styles.
- **Adding a new color/token:** add it to `:root` in `styles.css` *and* add a matching row in `theme.csv` in the same commit.
- **New images:** follow the existing `Images/<category>/<name>` pattern rather than dropping loose files at the project root.
- **Deleting something you're not 100% sure about:** move it to `_trash/` instead of deleting outright.
