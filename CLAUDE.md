# CLAUDE.md — Jack Visuals
> Instructions for Claude Code when building this project.
> Read DESIGN.md, SETUP.md, and SEO.md before writing any code.

---

## Project Overview

Jack Visuals is a cinematic video production portfolio site for Nathan (Trinidad & Tobago).
It showcases his work for premium brands and live events.
The site must feel like a luxury creative agency — video leads, text supports.

**Stack:** Next.js · Tailwind CSS · Sanity CMS · Formspree · Vimeo

**Repo:** generatenyc/JackVisuals23
**Domain:** jackvisuals23.com
**Sanity Project ID:** yqj0dj48

---

## Critical Build Rules

### 1. Isolated containers — non-negotiable
Every section is a fully isolated component. CSS for one section must never affect another.

- All zone CSS is scoped to the section ID:
  ```css
  #sec-about .zone-main { height: 280px; }    /* RIGHT */
  .zone-main { height: 280px; }               /* WRONG — bleeds everywhere */
  ```
- Each section component contains all its own markup and styles
- Never use a class name that appears in more than one section without ID scoping

### 2. Zone system
Every section = fixed height (844px mobile / 100vh desktop), divided into named zones.
Full zone specs are in DESIGN.md Section 5.
- Never remove `.zone-top` — it is the nav clearance
- Zone heights must always total the section height
- To resize: change the zone, adjust another zone to compensate

### 3. No inline styles for layout
Layout values (heights, padding, grid) belong in the scoped CSS class, not inline style attributes.
Inline styles are only acceptable for one-off overrides that are truly unique.

### 4. Mobile first
Write mobile styles first. Add `md:` or `lg:` Tailwind prefixes for desktop overrides.
The mobile design is fully locked. Do not change mobile layout when working on desktop.

### 5. Never mock data
If a Sanity field or Vimeo ID is not set up yet, use clearly labeled placeholder content.
Never invent fake Vimeo IDs or fake image URLs.

### 6. Design changes
If a design decision changes during the build:
1. Get approval from Jo before implementing
2. Update DESIGN.md immediately after approval
3. Note the change with a comment in the component file
4. Never change a locked design decision without updating DESIGN.md first

### 7. Commit at phase gates
Build in phases. Commit after each phase completes and passes quality checks.
Do not merge to main until a feature branch is complete.

---

## Sanity CMS — Content Model

Sanity project ID: `yqj0dj48`
Studio URL (after deploy): `jackvisuals23.com/studio`

Three document types. Schemas live in `sanity/schemas/`.

### Project
```js
// sanity/schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title',       title: 'Title',                type: 'string' },
    { name: 'description', title: 'Description',          type: 'text' },
    { name: 'vimeoUrl',    title: 'Vimeo URL',            type: 'url' },
    { name: 'featured',    title: 'Featured on homepage', type: 'boolean' },
    { name: 'date',        title: 'Date',                 type: 'date' },
    { name: 'category',    title: 'Category',             type: 'string' },
  ]
}
```

### Service
```js
// sanity/schemas/service.js
export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title',       title: 'Title',       type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'order',       title: 'Order',       type: 'number' },
  ]
}
```

### Trusted By
```js
// sanity/schemas/trustedBy.js
export default {
  name: 'trustedBy',
  title: 'Trusted By',
  type: 'document',
  fields: [
    { name: 'name',  title: 'Client / Brand Name', type: 'string' },
    { name: 'order', title: 'Order',               type: 'number' },
  ]
}
```

### Data queries (GROQ)

```js
// All projects — for /work page
*[_type == "project"] | order(date desc)

// Featured projects — for homepage (max 3)
*[_type == "project" && featured == true] | order(date desc)[0...3]

// Services — ordered
*[_type == "service"] | order(order asc)

// Trusted By — ordered
*[_type == "trustedBy"] | order(order asc)
```

### Nathan's workflow
1. Go to `jackvisuals23.com/studio`
2. Log in with his email
3. Click the document type he wants to edit
4. Make changes → hit Publish
5. Site updates automatically

**Featured video rule:** Nathan can toggle `featured` on/off per project.
Only 3 projects should have `featured = true` at any time.
Add a validation warning in the schema if more than 3 are featured.

---

## File Names — Use Exactly These

```
/public/images/drone_together.png         ← DJI Avata source photo
/public/images/jack-visuals-logo.png      ← Jack Visuals logo
/public/images/jack-nathan.jpg            ← Nathan's photo for About section
/public/videos/drone-hero.mp4             ← Kie AI hover video
/public/videos/camera-pan-viewfinder.mp4  ← Camera rotation scroll video
/public/videos/frames/                    ← Generated frames (151 JPEGs from FFmpeg, gitignored)
```

**Note:** The `/public/videos/frames/` folder is generated locally via FFmpeg and excluded from git.
To regenerate frames after cloning:
```bash
mkdir -p public/videos/frames
ffmpeg -i public/videos/camera-pan-viewfinder.mp4 -vf fps=30 public/videos/frames/frame_%04d.jpg
```

---

## Testing

### Run tests throughout every phase — not just at the end

**Test types required:**
- **Unit tests** — test each component in isolation (Jest + React Testing Library)
- **Integration tests** — test components working together (e.g. form submits correctly)
- **End-to-end tests** — test full user flows (Playwright)
- **Error handling** — test what happens when Vimeo fails to load, form submission fails, Sanity returns empty
- **Responsive tests** — test on all target breakpoints (see below)

**Run after every phase:**
```bash
npm run test        # unit + integration
npm run test:e2e    # end-to-end (Playwright)
```

**Never advance to the next phase with failing tests.**

---

### Testing Mobile Locally

**Option 1 — Browser DevTools (fastest):**
1. Run `npm run dev`
2. Open `http://localhost:3000` in Chrome
3. Press `F12` → click the device icon (Toggle Device Toolbar)
4. Select iPhone 14 or set custom width to 390px
5. Test all sections, scroll snap, nav fade

**Option 2 — Real device on same WiFi (most accurate):**
1. Run `npm run dev`
2. Find your computer's local IP:
   - Mac: run `ifconfig | grep "inet "` in terminal
   - Windows: run `ipconfig` in terminal
3. On your phone, open browser → go to `http://[YOUR-IP]:3000`
4. Both devices must be on the same WiFi network

**Option 3 — Share with Nathan for review:**
```bash
npx localtunnel --port 3000
```

---

### Target Breakpoints — Test on All of These

| Device | Width | Test |
|---|---|---|
| iPhone SE | 375px | Smallest supported mobile |
| iPhone 14 / 15 | 390px | Primary design target |
| iPhone 14 Pro Max | 430px | Large mobile |
| Android (common) | 412px | Samsung Galaxy, Pixel |
| iPad Mini | 768px | Tablet breakpoint |
| Desktop | 1280px | Standard laptop |
| Desktop wide | 1440px | Primary desktop target |
| Desktop XL | 1920px | Large monitor |

---

### Error Handling — Test These Scenarios

| Scenario | Expected behavior |
|---|---|
| Vimeo video fails to load | Show thumbnail, hide play button gracefully |
| Formspree submission fails | Show error message, do not clear the form |
| Sanity returns no projects | Show placeholder cards, no blank page |
| Sanity returns no services | Show placeholder text in About info blocks |
| Sanity returns no trusted by entries | Show placeholder text in About info blocks |
| Drone video fails to load | Hero shows black background, no broken element |
| Camera pan video fails | Skip animation, show Featured Work section directly |
| User submits form without required fields | Browser validation blocks submit, field highlights |
| Slow network (3G) | Site still loads, images lazy load, no layout shift |

---

## Build Phases

### Phase 1 — Scaffold
- [ ] Next.js project created
- [ ] Tailwind CSS configured
- [ ] DESIGN.md brand tokens added to `globals.css`
- [ ] Font imports: Bebas Neue + DM Sans
- [ ] Sanity project initialized (`sanity init`) using project ID `yqj0dj48`
- [ ] All three schemas created: `project.js`, `service.js`, `trustedBy.js`
- [ ] Schemas registered in `sanity.config.js`
- [ ] File structure matches DESIGN.md Section 10
- [ ] CLAUDE.md, DESIGN.md, SETUP.md committed to repo

### Phase 2 — Nav Component
- [ ] `Nav.jsx` built — logo left, Inquire button right
- [ ] Fixed overlay — not in scroll flow
- [ ] Fade in/out behavior on scroll (120px threshold per section top)
- [ ] Inquire button scrolls to `#sec-inquire`
- [ ] Mobile: 52px height · Desktop: 72px height
- [ ] Tested on both mobile and desktop

### Phase 3 — Home Section
- [ ] `Home.jsx` built — full viewport height
- [ ] Black background
- [ ] Drone video (`drone-hero.mp4`) floating in top 40%, repositions every 3s
- [ ] Eyebrow: "CINEMATIC VIDEO PRODUCTION" in blue
- [ ] Headline: "Where every video tells a story" — Bebas Neue, slides up on load
- [ ] Scroll snap configured
- [ ] Tested on mobile and desktop

### Phase 4 — Featured Work Section
- [ ] `FeaturedWork.jsx` built
- [ ] Fetches 3 projects where `featured == true` from Sanity
- [ ] Mobile: horizontal scroll carousel with dots
- [ ] Desktop: 3-column grid, hover reveals info + play button
- [ ] "All Projects →" links to internal `/work` page
- [ ] Zone system applied — scoped CSS only
- [ ] Camera scroll animation placeholder (full animation in Phase 8)

### Phase 4b — Work Page (/work)
- [ ] `pages/work.jsx` created
- [ ] Fetches all projects from Sanity ordered by date desc
- [ ] Same black aesthetic as rest of site
- [ ] Nav included at top
- [ ] Filter tabs: All · Events · Brand · Commercial · Drone
- [ ] Each card: category tag, title, play button
- [ ] Play button opens Vimeo embed (lightbox or inline)
- [ ] Filtering works without page reload
- [ ] Mobile: single column stack · Desktop: 3-column grid
- [ ] Empty state if no projects in a category

### Phase 5 — About Section
- [ ] `About.jsx` built
- [ ] Two-column grid: photo left, bio text right (zone-main)
- [ ] Divider line between main and bottom zones
- [ ] zone-bottom: three info blocks — What We Offer, Production Kit, Trusted By
- [ ] Info blocks stacked with `justify-content: space-evenly` (479px mobile)
- [ ] Fetches services from Sanity (`order asc`) for What We Offer block
- [ ] Fetches trusted by entries from Sanity (`order asc`) for Trusted By block
- [ ] Empty state: placeholder text if Sanity returns no services or trusted by entries
- [ ] Photo ready for `object-fit: cover` swap
- [ ] Zone system applied — scoped CSS only

### Phase 6 — Inquire Section
- [ ] `Inquire.jsx` built
- [ ] Mobile layout: eyebrow → headline → form → footer
- [ ] Desktop layout: two columns (headline+sub left, form+button right)
- [ ] Formspree form action wired up
- [ ] Name + email fields marked `required`
- [ ] "Start a Conversation" button with clip-path shape
- [ ] Footer: Instagram + email links
- [ ] Zone system applied — scoped CSS only

### Phase 7 — Sanity Studio Deploy
- [ ] Sanity Studio deployed to `jackvisuals23.com/studio` (or standalone URL)
- [ ] Nathan invited via `nathan@rjaonline.com` with editor role
- [ ] CMS tested — Nathan can add/edit/publish a project, service, and trusted by entry
- [ ] Featured validation warning working (>3 featured projects triggers warning)

### Phase 8 — Camera Scroll Animation
- [ ] `camera-pan-viewfinder.mp4` frames extracted via FFmpeg
- [ ] Canvas renderer built
- [ ] GSAP + ScrollTrigger + Lenis wired up
- [ ] Scroll binding: progress → video currentTime
- [ ] Cards appear at 100% frame progress
- [ ] Animation resets on section exit
- [ ] Tested on mobile and desktop

### Phase 9 — Intro Animation
- [ ] `IntroAnimation.jsx` built
- [ ] Real camera photo sliced into CSS clip-path layers
- [ ] Layers drift apart vertically on timer
- [ ] Callout labels with dashed lines appear during spread
- [ ] Layers fly off screen
- [ ] Site hero revealed underneath
- [ ] Tested on mobile and desktop

### Phase 9b — SEO
- [ ] `app/layout.jsx` metadata export configured (title, description, OG, Twitter)
- [ ] OG image created at 1200×630px, saved to `/public/images/og-cover.jpg`
- [ ] `StructuredData.jsx` component built and added to homepage head
- [ ] `app/sitemap.js` created — homepage + /work
- [ ] `app/robots.js` created — /studio/ blocked
- [ ] Canonical tags on all pages
- [ ] Bebas Neue font preloaded in head
- [ ] Sanity fetches using `next: { revalidate: 3600 }`
- [ ] All images have descriptive alt text per SEO.md guidelines

### Phase 10 — QA & Launch
- [ ] Lighthouse SEO score > 90
- [ ] Lighthouse Performance score > 80
- [ ] OG image tested at developers.facebook.com/tools/debug
- [ ] Structured data tested at search.google.com/test/rich-results
- [ ] Sitemap accessible at jackvisuals23.com/sitemap.xml
- [ ] /studio/ blocked in robots.txt
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing (Playwright)
- [ ] All sections tested at all target breakpoints
- [ ] Scroll snap working on all breakpoints
- [ ] Nav fade working on all section tops
- [ ] Form submits to nathan@rjaonline.com via Formspree
- [ ] Vimeo embeds playing correctly
- [ ] Error states tested (Vimeo fail, form fail, empty Sanity)
- [ ] Sanity: Nathan can add a project and it appears on site
- [ ] Sanity: toggling featured correctly updates homepage
- [ ] Tested on real iPhone and Android
- [ ] Domain connected and SSL active
- [ ] Performance: Lighthouse score > 80
- [ ] DESIGN.md is up to date with all approved changes

---

## Design Reference

All design decisions are in `DESIGN.md`. SEO configuration is in `SEO.md`. When in doubt:
1. Check DESIGN.md first
2. Check SEO.md for any metadata or performance questions
3. Check the mockup files:
   - `jack-visuals-scroll.html` — mobile mockup
   - `jack-visuals-desktop.html` — desktop mockup
3. Ask before inventing

---

## Key Contacts

| Person | Role | Contact |
|---|---|---|
| Jonel (Jo) | Developer | — |
| Nathan | Client / Content owner | nathan@rjaonline.com |

**Instagram:** @jackvisuals23
**Domain:** jackvisuals23.com
**Vimeo:** vimeo.com/jackvisuals (update when Nathan sets up account)

---

## Clear Command
Use the `clear` command between phases to drop stale context before starting the next phase.

---

*End of CLAUDE.md*
