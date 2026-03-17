# SEO.md — Jack Visuals
> Last updated: March 2026
> Goal: Rank for cinematic video production searches in Trinidad & Tobago and the Caribbean.
> Convert Instagram visitors into inquiry leads.

---

## SEO Strategy Overview

Two priorities in order:

1. **Portfolio discovery** — Show up when brands and event organizers in T&T and the Caribbean search for a video production company
2. **Instagram conversion** — When someone visits from @jackvisuals, the site must load fast, look credible, and push them toward the Inquire section

---

## Target Keywords

### Primary (highest priority)
```
video production Trinidad
cinematic video production Trinidad and Tobago
brand video production Trinidad
event videographer Trinidad
```

### Secondary
```
video production Caribbean
cinematic videographer Port of Spain
corporate video production Trinidad
luxury brand video Caribbean
wedding videographer Trinidad
music video production Trinidad
```

### Long-tail (lower volume, easier to rank)
```
cinematic brand film Trinidad and Tobago
event highlight video Trinidad
professional videographer Trinidad
video production company Port of Spain
```

---

## Meta Tags — Implement in `pages/_app.jsx` or `app/layout.jsx`

### Homepage
```jsx
<title>Jack Visuals — Cinematic Video Production | Trinidad & Tobago</title>
<meta name="description" content="Jack Visuals is a cinematic video production company based in Trinidad and Tobago. Brand films, event coverage, and commercial video for the Caribbean region." />
<meta name="keywords" content="video production Trinidad, cinematic videographer Trinidad and Tobago, brand video Caribbean, event videographer Port of Spain" />
<meta name="author" content="Jack Visuals" />
<link rel="canonical" href="https://jackvisuals23.com" />
```

### Work page (/work)
```jsx
<title>Work — Jack Visuals | Video Production Portfolio</title>
<meta name="description" content="Watch cinematic brand films, event coverage, and commercial videos produced by Jack Visuals in Trinidad and Tobago." />
<link rel="canonical" href="https://jackvisuals23.com/work" />
```

---

## Open Graph — Social Sharing

When Nathan shares a link on Instagram or WhatsApp, this controls what the preview card looks like.
Use a high-quality still from one of Nathan's best projects as the OG image.

```jsx
{/* Add to every page */}
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="Jack Visuals" />
<meta property="og:locale"      content="en_TT" />

{/* Homepage specific */}
<meta property="og:title"       content="Jack Visuals — Cinematic Video Production | Trinidad & Tobago" />
<meta property="og:description" content="Brand films, event coverage, and commercial video production based in Trinidad and Tobago." />
<meta property="og:url"         content="https://jackvisuals23.com" />
<meta property="og:image"       content="https://jackvisuals23.com/images/og-cover.jpg" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
```

**OG image spec:**
```
File:       /public/images/og-cover.jpg
Size:       1200 × 630px exactly
Content:    Best project still or branded frame — black background, Jack Visuals logo,
            one strong cinematic image
Format:     JPG, under 200KB
```

---

## Twitter / X Card

```jsx
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Jack Visuals — Cinematic Video Production" />
<meta name="twitter:description" content="Brand films, event coverage, and commercial video production in Trinidad & Tobago." />
<meta name="twitter:image"       content="https://jackvisuals23.com/images/og-cover.jpg" />
```

---

## Structured Data (JSON-LD)

Structured data helps Google understand what the business is.
Add this as a `<script>` tag in the `<head>` of the homepage.

```jsx
// components/StructuredData.jsx
export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Jack Visuals",
    "description": "Cinematic video production company based in Trinidad and Tobago. Specializing in brand films, event coverage, and commercial video.",
    "url": "https://jackvisuals23.com",
    "logo": "https://jackvisuals23.com/images/jack-visuals-logo.png",
    "image": "https://jackvisuals23.com/images/og-cover.jpg",
    "email": "nathan@rjaonline.com",
    "sameAs": [
      "https://instagram.com/jackvisuals23",
      "https://vimeo.com/jackvisuals"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TT",
      "addressRegion": "Trinidad and Tobago"
    },
    "areaServed": [
      "Trinidad and Tobago",
      "Caribbean"
    ],
    "serviceType": [
      "Brand Film Production",
      "Event Videography",
      "Commercial Video Production",
      "Music Video Production"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

Add `<StructuredData />` inside the `<head>` on the homepage.

---

## Next.js Implementation

Use Next.js built-in `<Head>` or the App Router `metadata` export.

### App Router (recommended)
```js
// app/layout.jsx
export const metadata = {
  title: {
    default: 'Jack Visuals — Cinematic Video Production | Trinidad & Tobago',
    template: '%s — Jack Visuals',
  },
  description: 'Cinematic video production company based in Trinidad and Tobago. Brand films, event coverage, and commercial video for the Caribbean region.',
  keywords: ['video production Trinidad', 'cinematic videographer Trinidad and Tobago', 'brand video Caribbean', 'event videographer Port of Spain'],
  authors: [{ name: 'Jack Visuals' }],
  openGraph: {
    title: 'Jack Visuals — Cinematic Video Production | Trinidad & Tobago',
    description: 'Brand films, event coverage, and commercial video production based in Trinidad and Tobago.',
    url: 'https://jackvisuals23.com',
    siteName: 'Jack Visuals',
    locale: 'en_TT',
    type: 'website',
    images: [
      {
        url: 'https://jackvisuals23.com/images/og-cover.jpg',
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jack Visuals — Cinematic Video Production',
    description: 'Brand films, event coverage, and commercial video in Trinidad & Tobago.',
    images: ['https://jackvisuals23.com/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://jackvisuals23.com',
  },
}
```

---

## Sitemap

Add a sitemap so Google can find all pages.

```js
// app/sitemap.js
export default function sitemap() {
  return [
    {
      url: 'https://jackvisuals23.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://jackvisuals23.com/work',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
```

---

## robots.txt

```js
// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/',
    },
    sitemap: 'https://jackvisuals23.com/sitemap.xml',
  }
}
```

The `/studio/` route is blocked so Google does not index the Sanity admin panel.

---

## Performance — Core Web Vitals

Google uses page speed as a ranking signal. These rules keep the score above 80.

| Rule | Implementation |
|---|---|
| Lazy load all images | Use Next.js `<Image>` with `loading="lazy"` |
| Never autoplay audio | Vimeo embeds are muted by default — keep it that way |
| Preload hero font | Add `<link rel="preload">` for Bebas Neue in `<head>` |
| Minimize layout shift | Set explicit width/height on all images and video containers |
| Defer non-critical JS | GSAP and scroll animation scripts load after page interactive |
| Cache Sanity responses | Use `next: { revalidate: 3600 }` on Sanity fetches (1 hour cache) |

```jsx
// Example: Sanity fetch with revalidation
const projects = await client.fetch(featuredProjectsQuery, {}, {
  next: { revalidate: 3600 }
})
```

---

## Instagram Conversion — Bio Link Optimization

When someone taps the link in Nathan's Instagram bio, this is what they land on.

**What must happen in the first 3 seconds:**
1. Site loads (performance — see above)
2. They see a cinematic, professional aesthetic immediately
3. The brand name "Jack Visuals" is visible
4. There is one clear action available — scroll or hit Inquire

**Do not do:**
- No splash screen that delays the hero
- No popup asking for email or cookies on first load
- No autoplay video with sound (kills trust on mobile)

**Instagram bio link:** `jackvisuals23.com` — no tracking parameters needed, clean URL.

---

## Build Phase — SEO Checklist (add to Phase 10 QA)

- [ ] All meta title tags present on homepage and /work
- [ ] All meta description tags present and under 160 characters
- [ ] Open Graph tags present — test at developers.facebook.com/tools/debug
- [ ] OG image created at 1200×630px and under 200KB
- [ ] Structured data (JSON-LD) present on homepage — test at search.google.com/test/rich-results
- [ ] Sitemap accessible at jackvisuals23.com/sitemap.xml
- [ ] robots.txt accessible at jackvisuals23.com/robots.txt
- [ ] /studio/ blocked in robots.txt
- [ ] Canonical tags present on all pages
- [ ] Lighthouse SEO score > 90
- [ ] Lighthouse Performance score > 80
- [ ] No broken links
- [ ] All images have descriptive alt text (not "image1.jpg")
- [ ] Bebas Neue font preloaded in head
- [ ] Sanity fetches use revalidate: 3600

---

## Alt Text Guidelines

Google reads alt text. Every image needs a descriptive tag.

| Image | Alt text |
|---|---|
| Nathan's photo | `Nathan — cinematographer and founder of Jack Visuals, Trinidad` |
| Logo | `Jack Visuals logo` |
| Drone photo | `DJI drone used for aerial cinematography by Jack Visuals` |
| Project thumbnails | `[Project title] — cinematic video by Jack Visuals` |
| OG cover | `Jack Visuals — cinematic video production Trinidad and Tobago` |

---

*End of SEO.md — v1.0*
