# DESIGN.md — Jack Visuals
> Last updated: March 2026
> Status: LOCKED — Mobile v1.0 + Desktop v1.0
> Stack: React + Next.js · Tailwind CSS · Vimeo · Sanity CMS · Formspree

---

## CRITICAL BUILD RULE — READ BEFORE WRITING ANY CODE

> **Every section is an isolated container. Edits inside one section must never affect another section.**

This is enforced through three rules:

1. **ID-scoped CSS** — All zone CSS is prefixed with the section ID:
   ```css
   #sec-about .zone-main { height: 280px; }   /* ONLY affects about */
   #sec-inquire .zone-main { flex: 1; }        /* ONLY affects inquire */
   ```
   Never write a bare `.zone-main { }` rule that applies globally.

2. **Self-contained HTML** — Each section contains all its own markup.
   Nothing reaches outside its `<section>` tag.

3. **No shared height dependencies** — Zones use fixed pixel heights or
   `flex: 1` within their own section. Never `calc()` referencing another
   section's values.

---

## Design Change Process

> Any change to a locked design decision must follow this process:

1. **Propose** the change in conversation with Jo
2. **Approve** — Jo confirms the change
3. **Update DESIGN.md** — update the relevant section immediately
4. **Implement** in the component
5. **Comment** in the component file: `/* DESIGN UPDATE: [what changed] [date] */`

Never implement a design change without updating DESIGN.md first.

---

## 1. Brand Identity

| Token | Value |
|---|---|
| Primary font | Bebas Neue (headlines) |
| Body font | DM Sans (300, 400, 500, 600) |
| Background | `#000000` pure black |
| Text primary | `#f5f5f7` |
| Text dim | `rgba(255,255,255,0.5)` |
| Text faint | `rgba(255,255,255,0.28)` |
| Accent blue | `#2997ff` |
| Divider | `rgba(255,255,255,0.07)` |
| Nav background | `rgba(0,0,0,0.85)` + `backdrop-filter: saturate(180%) blur(20px)` |

---

## 2. Global Rules

- **Mobile-first.** All decisions made at 390px width first.
- **Scroll snap.** Every section snaps to fill the full screen.
  - Mobile: `scroll-snap-type: y mandatory` on the phone scroll container
  - Desktop: `scroll-snap-type: y mandatory` on `html`
- **Section height.**
  - Mobile: exactly **844px** per section
  - Desktop: exactly **100vh** per section
- **Zone system.** Every section divided into fixed-height zones.
  Removing or editing content inside a zone never affects other zones or sections.
- **Nav.** Fixed overlay — always just logo + Inquire button on both mobile and desktop.
  Nav fades in at section tops, fades out on scroll.

---

## 3. Zone System

### Rule
> Each section has its own zone CSS classes scoped to its ID.
> A change to `#sec-about .zone-main` cannot affect `#sec-inquire .zone-main`.

### Shared zones (generic, no height set globally)
```css
/* These have NO height — height is always set per-section */
#sec-[name] .zone-top     { flex-shrink: 0; }
#sec-[name] .zone-divider { height: 1px; flex-shrink: 0; background: rgba(255,255,255,0.07); }
#sec-[name] .zone-header  { flex-shrink: 0; display: flex; align-items: center;
                             justify-content: space-between; padding: 0 [pad]; }
```

### Zone editing rules
1. **Never remove `zone-top`** from any section — it is the nav clearance
2. **Heights must always total the section height** (844px mobile / 100vh desktop)
3. **To resize a zone** — change only that section's scoped CSS class
4. **To add content** — put it inside the appropriate zone div
5. **The divider** sits between zones as its own element, never inside content padding

---

## 4. Navigation Component

**Both mobile and desktop — identical behavior**

```
Position:   Fixed overlay (not in scroll flow)
Height:     Mobile 52px · Desktop 72px
Background: rgba(0,0,0,0.85) + saturate(180%) blur(20px)
Border:     1px solid rgba(255,255,255,0.06) bottom

Left:       Logo icon (camera SVG) + "JACK VISUALS" in Bebas Neue
Right:      Inquire button only — no other links

Behavior:   Fades in within 120px of any section top
            Fades out as user scrolls into section content
```

**Inquire button — bordered rectangle:**
```css
padding: 8px 16px;                          /* mobile */
padding: 8px 18px;                          /* desktop */
border: 1px solid rgba(41,151,255,0.4);
color: #2997ff;
background: transparent;
font-size: 11px; font-weight: 500;
letter-spacing: 0.1em;
text-transform: uppercase;
border-radius: 0;
```
Hover: `background: rgba(41,151,255,0.1)`
Link: scrolls to `#sec-inquire`

---

## 5. Section Components

---

### 5.1 HOME (Hero)

**Mobile zones (844px):** Full section, no zone subdivisions
**Desktop zones (100vh):** Full section, no zone subdivisions

```
Background:   Pure black (#000)
              Drone hover video (from Kie AI) floats in top 40% of hero

Drone asset:  drone_together.png → animated to drone-hover.mp4 from Kie
              Floats and bobs in top 40% of hero
              Repositions every 3 seconds (smooth CSS transition)
              Never enters bottom 60% where headline lives
              Video tag: autoPlay muted loop playsInline

Eyebrow:      "CINEMATIC VIDEO PRODUCTION"
              Font: DM Sans 11px (mobile) · 13px (desktop)
              Letter-spacing: 2px (mobile) · 3px (desktop)
              Uppercase · Color: #2997ff

Headline:     "Where every video tells a story"
              Font: Bebas Neue
              Size: 88px mobile · clamp(80px, 10vw, 140px) desktop
              Line-height: 0.88 · Position: bottom left
              Animation: slides up from bottom on page load

No CTA buttons — user scrolls naturally.
```

---

### 5.2 FEATURED WORK

**Data source:** Sanity — `*[_type == "project" && featured == true] | order(date desc)[0...3]`

**Mobile zones (844px):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-work .zone-top` | 52px | Empty |
| Header | `#sec-work .zone-header` | 72px | "Featured Work" + "All Projects →" |
| Cards + dots | (flex column) | 720px | Carousel + dots |

**Desktop zones (100vh):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-work .zone-top` | 72px | Empty |
| Header | `#sec-work .zone-header` | 100px | "Featured Work" + "All Projects →" |
| Cards | (flex: 1) | Remaining | 3-column grid |

```
Header:
  Title:      "Featured Work" — Bebas Neue 44px (mobile) · 72px (desktop)
  Link:       "All Projects →" — 13px (mobile) · 16px (desktop)
              Color: #2997ff · Underline on hover
              Links to: /work (internal page — all projects)

Mobile cards:
  Layout:     Horizontal scroll carousel, scroll-snap: x mandatory
  Card width: 260px · Height: fills carousel height
  Gap:        14px · Padding: 0 24px
  Dots:       3 dots, active = 16px wide pill

Desktop cards:
  Layout:     3-column grid, gap: 2px, fills full remaining height
  Hover:      Category tag (blue) + title + spec line slide up
              Frosted glass play button appears center
  Playing:    All text hides, video plays (Vimeo player API)
              Small pause button bottom right

Each card:
  Category tag: top left, always visible, 9px uppercase
  Title:        Bebas Neue 22px (mobile) · 32px (desktop)
  Spec:         12px, rgba white 0.4 (desktop hover only)
```

**Camera scroll animation (build phase):**
```
Trigger:    User scrolls to Featured Work
0–60%:      Camera front → rotates to viewfinder (scroll-driven video)
60–90%:     Zoom into viewfinder screen
90–100%:    Cards appear instantly
Exit:       Resets to frame 0
Tech:       GSAP + ScrollTrigger + Lenis + FFmpeg frames
Video:      Camera_pans_to_viewfinder_video.mp4
```

---

### 5.3 ABOUT

**Mobile zones (844px):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-about .zone-top` | 52px | Empty |
| Header | `#sec-about .zone-header` | 72px | "Jack Visuals" headline |
| Divider | `#sec-about .zone-divider` | 1px | Horizontal rule |
| Main | `#sec-about .zone-main` | 440px | Photo left · Bio right |
| Info blocks | `#sec-about .zone-info` | 278px | Stacked info items |

**Desktop zones (100vh):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-about .zone-top` | 72px | Empty |
| Header | `#sec-about .zone-header` | 100px | "Jack Visuals" headline |
| Divider | `#sec-about .zone-divider` | 1px | Horizontal rule |
| Main | `#sec-about .zone-main` | flex: 1 | Photo left · Bio right |

```
Header:
  "Jack Visuals" — Bebas Neue, left-aligned
  Size: 44px (mobile) · 72px (desktop)

Two-column grid (zone-main):
  Left:   Nathan's photo — object-fit: cover, full zone height
  Right:  Bio text — DM Sans, rgba white 0.7

Info blocks (stacked vertically on both mobile and desktop):
  Years active, location, specialty, etc.
  Each block: label (rgba white 0.28) + value (rgba white 0.7)
```

---

### 5.4 SERVICES

**Data source:** Sanity — `*[_type == "service"] | order(order asc)`

**Mobile zones (844px):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-services .zone-top` | 52px | Empty |
| Header | `#sec-services .zone-header` | 72px | "Services" headline |
| Divider | `#sec-services .zone-divider` | 1px | Horizontal rule |
| Grid | `#sec-services .zone-main` | flex: 1 | Single column stack |

**Desktop zones (100vh):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-services .zone-top` | 72px | Empty |
| Header | `#sec-services .zone-header` | 100px | "Services" headline |
| Divider | `#sec-services .zone-divider` | 1px | Horizontal rule |
| Grid | `#sec-services .zone-main` | flex: 1 | 4-column numbered grid |

```
Header:
  "Services" — Bebas Neue, left-aligned
  Size: 44px (mobile) · 72px (desktop)

Desktop grid:
  4 columns · each numbered (01, 02, 03, 04...)
  Number: Bebas Neue, rgba white 0.2, large (48px)
  Title: Bebas Neue, #f5f5f7, 24px
  Description: DM Sans, rgba white 0.5, 14px

Mobile:
  Single column stack
  Same number + title + description layout

Empty state: show placeholder text if Sanity returns no services
```

---

### 5.5 TRUSTED BY

**Data source:** Sanity — `*[_type == "trustedBy"] | order(order asc)`

**Mobile zones (844px):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-trusted .zone-top` | 52px | Empty |
| Header | `#sec-trusted .zone-header` | 72px | "Trusted By" headline |
| Divider | `#sec-trusted .zone-divider` | 1px | Horizontal rule |
| Names | `#sec-trusted .zone-main` | flex: 1 | Stacked text names |

**Desktop zones (100vh):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-trusted .zone-top` | 72px | Empty |
| Header | `#sec-trusted .zone-header` | 100px | "Trusted By" headline |
| Divider | `#sec-trusted .zone-divider` | 1px | Horizontal rule |
| Names | `#sec-trusted .zone-main` | flex: 1 | Multi-column text layout |

```
Header:
  "Trusted By" — Bebas Neue, left-aligned
  Size: 44px (mobile) · 72px (desktop)

Names:
  Text only — no logos
  Font: Bebas Neue or DM Sans (decide during build)
  Color: rgba white 0.5 (dim, supporting role)

Empty state: hide section entirely if Sanity returns no entries
```

---

### 5.6 INQUIRE

**Mobile zones (844px):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-inquire .zone-top` | 48px | Extra nav clearance |
| Eyebrow | `#sec-inquire .zone-eyebrow` | 40px | "GET IN TOUCH" |
| Headline | `#sec-inquire .zone-headline` | 140px | 3-line headline |
| Form | `#sec-inquire .zone-main` | 300px | Sub text + fields + button |
| Footer | `#sec-inquire .zone-bottom` | 304px | Divider + logo + links |

**Desktop zones (100vh):**

| Zone | Class | Height | Contents |
|---|---|---|---|
| Nav clearance | `#sec-inquire .zone-top` | 100px | Extra nav clearance |
| Eyebrow | `#sec-inquire .zone-eyebrow` | 40px | "GET IN TOUCH" |
| Form (2-col) | `#sec-inquire .zone-main` | flex: 1 | Headline+sub LEFT · Form RIGHT |
| Footer | `#sec-inquire .zone-bottom` | 240px | Divider + logo + links |

```
Eyebrow:
  "GET IN TOUCH" — 16px, 500 weight, uppercase
  Color: #2997ff

Headline:
  "Let's create" (line 1)
  "something you" (line 2)
  "can FEEL." (line 3 — "feel." in #2997ff)
  Font: Bebas Neue
  Size: 52px (mobile) · clamp(52px, 5.5vw, 80px) (desktop)

Desktop layout — two columns, align-items: center:
  Left col:   Headline + sub text
  Right col:  Form fields + Start a Conversation button

Form fields:
  Name:     required · type="text"
  Email:    required · type="email"
  Message:  optional · textarea
  Style:    border-bottom only · 1px rgba white 0.1
            Focus: border-color rgba white 0.35
            Placeholder: rgba white 0.2–0.22

Start a Conversation button:
  Background:  #2997ff
  Color:       white
  Font:        DM Sans 13px, 700 weight, letter-spacing 2px, uppercase
  Width:       100% of its column
  clip-path:   polygon(
                 0 0, calc(100% - 14px) 0,
                 100% 14px, 100% 100%,
                 14px 100%, 0 calc(100% - 14px)
               )
  Action:      Formspree — https://formspree.io/f/REPLACE_WITH_ID
  Validation:  name + email required before submit fires

Footer (zone-bottom):
  Divider line: full width, rgba white 0.07
  Mobile:  JACK VISUALS logo · Instagram icon + @jackvisuals23 · email stacked
  Desktop: Left — JACK VISUALS + copyright · Right — Instagram + email in one row
  Logo:    Bebas Neue 18px (mobile) · 22px (desktop) · rgba white 0.6
  Links:   Instagram → https://instagram.com/jackvisuals23 (new tab)
           Email → nathan@rjaonline.com
  Copy:    © 2025 Jack Visuals · jackvisuals23.com · All Rights Reserved
```

---

## 5.7 WORK PAGE (/work)

**File:** `pages/work.jsx`
**Data source:** Sanity — `*[_type == "project"] | order(date desc)`

```
URL:      /work
Link from: "All Projects →" on Featured Work section

Layout:
  Nav:      Same fixed nav as rest of site
  Filters:  All · Events · Brand · Commercial · Drone
            Horizontal scroll on mobile, inline on desktop
            Active filter highlighted in blue
  Grid:     Mobile: single column
            Desktop: 3-column grid, gap: 2px
  Cards:    Same card design as Featured Work section
            Category tag, title, play button

Empty state: "No projects in this category yet."
             Shown if a filter returns 0 results
```

---

## 6. Intro Animation (Camera Dissection)

```
Duration:     ~11 seconds total, then site reveals
Object:       Real cinema camera — photo sliced into CSS clip-path layers
              NOT SVG — uses actual camera photograph

Sequence:
  0.0–2.5s    Camera assembled · blueprint grid · scan line · HUD text
  2.5–8.0s    Layers drift apart vertically (Apple Watch style)
              Callout labels with dashed leader lines appear
  8.0–11.0s   All layers fly off screen · black fades · hero appears

Layers (top to bottom):
  1. Matte Box / Top Handle
  2. ND Filter Stack
  3. Camera Body (ARRI Alexa 35)
  4. Sensor Board (4.6K · ALEV 4)
  5. PL Lens Mount
  6. Cooke S5/i Lens (32mm T1.5)
  7. 15mm Rail Baseplate
```

---

## 7. Camera Scroll Animation — Featured Work

```
Tech:         GSAP + ScrollTrigger + Lenis + canvas frame rendering
Video asset:  Camera_pans_to_viewfinder_video.mp4
Frames:       60–90 WebP frames via FFmpeg
FRAME_SPEED:  2.0

Lenis config:
  duration: 1.2
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  smoothWheel: true

Scroll binding:
  progress = scrollInSection / sectionHeight
  canvas.currentTime = progress * duration
  (reversible — scroll up reverses camera)
```

---

## 8. Drone Hero Asset

```
Source photo: drone_together.png       ← save in /public/images/
Hover video:  drone-hero.mp4           ← generated from Kie AI, save in /public/videos/
Logo:         jack-visuals-logo.png    ← save in /public/images/

Camera pan:   camera-pan-viewfinder.mp4 ← Nathan's video, save in /public/videos/

In code:      <video autoPlay muted loop playsInline>
                <source src="/videos/drone-hover.mp4" type="video/mp4" />
              </video>

Boundary:     Top 40% of hero only — never overlaps headline
Movement:     Repositions every 3 seconds, smooth CSS transition
Bob:          Subtle up/down float animation (2s ease-in-out infinite)
```

---

## 9. CMS — Sanity

**Project ID:** `yqj0dj48`
**Studio URL:** `jackvisuals23.com/studio` (after deploy)

Three document types — full schema in CLAUDE.md Section "Sanity CMS — Content Model".

```
Project:    title · description · vimeoUrl · featured (boolean) · date · category
Service:    title · description · order
Trusted By: name · order
```

**Nathan's workflow:**
`jackvisuals23.com/studio` → login → select document type → edit fields → Publish

**Featured rule:**
Only 3 projects should have `featured = true` at any time.
Schema includes a validation warning if more than 3 are featured.

---

## 10. File Structure

```
JackVisuals23/
├── public/
│   ├── images/
│   │   ├── drone_together.png
│   │   ├── jack-nathan.jpg
│   │   └── jack-visuals-logo.png
│   └── videos/
│       ├── drone-hero.mp4
│       └── camera-pan-viewfinder.mp4
├── sanity/
│   ├── schemas/
│   │   ├── project.js
│   │   ├── service.js
│   │   └── trustedBy.js
│   └── sanity.config.js
├── lib/
│   └── sanity.js             ← Sanity client + GROQ queries
├── components/
│   ├── Nav.jsx
│   ├── IntroAnimation.jsx
│   └── sections/
│       ├── Home.jsx
│       ├── FeaturedWork.jsx
│       ├── About.jsx
│       ├── Services.jsx
│       ├── TrustedBy.jsx
│       └── Inquire.jsx
├── styles/
│   └── globals.css           ← Brand tokens only — NO section heights here
├── pages/
│   ├── index.jsx             ← Assembles components only
│   └── work.jsx              ← All projects page
├── CLAUDE.md
├── DESIGN.md
└── SETUP.md
```

---

## 11. Zone Editing Cheat Sheet

| I want to... | Do this |
|---|---|
| Change a zone height | Edit `#sec-[name] .zone-[name]` height — adjust another zone to compensate |
| Add content to a section | Put it inside the correct zone div |
| Remove content from a section | Remove it from inside its zone — other zones don't move |
| Add a new zone | Add a new div inside the section — give it a scoped CSS class |
| Change the divider position | Resize zone-main and zone-bottom, keep total = 844px/100vh |
| Change desktop without breaking mobile | Use `@media (min-width: 768px)` breakpoints inside each section's scoped CSS |

---

*End of DESIGN.md — v3.0*
