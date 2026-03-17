# SETUP.md — Jack Visuals
> External Accounts, Deployment & Embedding Guide
> For: Jonel (Developer)

---

## Overview — What Needs to Be Set Up and When

```
PHASE 1: Local Development (NOW)
  ✅ GitHub repo exists — generatenyc/JackVisuals23
  ✅ Sanity account created — project ID: yqj0dj48
  ✅ Run locally at localhost:3000

PHASE 2: Pre-Launch Accounts (Before deploying)
  □ Vercel — hosting + auto-deploy from GitHub
  □ Vimeo Pro — video hosting (Nathan's account)
  □ Formspree — contact form (Nathan's account)

PHASE 3: Launch (When Nathan is ready)
  □ Connect jackvisuals23.com domain to Vercel
  □ Deploy Sanity Studio
  □ Invite Nathan to Sanity as editor
```

---

## PHASE 1 — Local Development

Repo and Sanity project already exist. Clone and run:

```bash
git clone https://github.com/generatenyc/JackVisuals23.git
cd JackVisuals23
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

To share with Nathan for review without deploying:
```bash
npx localtunnel --port 3000
```
Gives a temporary public URL — no domain or deployment required.

---

## PHASE 2 — Pre-Launch Accounts

---

### 1. Sanity CMS ✅ Already Set Up

**Account:** Jonel's account (jo@...)
**Project ID:** `yqj0dj48`
**Purpose:** Nathan's content editing interface. He logs into the Studio to add/edit projects, services, and trusted by entries without touching code.

**Three document types:**
- **Project** — title, description, Vimeo URL, featured toggle, date, category
- **Service** — title, description, order
- **Trusted By** — name, order

**Initialize Sanity in the project:**
```bash
npm install @sanity/client @sanity/image-url next-sanity
npx sanity init --project yqj0dj48
```

**Sanity client config:**
```js
// lib/sanity.js
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'yqj0dj48',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
})
```

**GROQ queries:**
```js
// All projects — /work page
export const allProjectsQuery = `*[_type == "project"] | order(date desc)`

// Featured projects — homepage (max 3)
export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(date desc)[0...3]`

// Services — ordered
export const servicesQuery = `*[_type == "service"] | order(order asc)`

// Trusted By — ordered
export const trustedByQuery = `*[_type == "trustedBy"] | order(order asc)`
```

**Deploy Sanity Studio:**
```bash
npx sanity deploy
# Choose studio hostname — e.g. jack-visuals.sanity.studio
# OR embed at jackvisuals23.com/studio (see Embedding below)
```

**Invite Nathan as editor:**
1. Go to sanity.io/manage → select the jack-visuals project
2. Members → Invite → enter `nathan@rjaonline.com`
3. Set role to **Editor** (can add/edit/publish content, cannot change schemas)
4. Nathan receives an email invite → sets his own password
5. From that point: Nathan logs in at the Studio URL with his email + password

**Nathan's workflow:**
`jackvisuals23.com/studio` → login → click document type → edit → Publish → live immediately

---

### 2. Vercel

**When to set up:** When you're ready to deploy a preview for Nathan.
**Cost:** Free tier is enough for this project.
**Purpose:** Hosts the live site. Auto-deploys when you push to GitHub.

**Whose account:** Your account (Jonel) — Nathan does not need a Vercel account.

**Steps:**
1. Go to vercel.com → Sign up with your GitHub account
2. Click "Add New Project" → Import `generatenyc/JackVisuals23`
3. Build settings (Next.js auto-detected):
   - Build command: `npm run build`
   - Output directory: `.next`
4. Add environment variables:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=yqj0dj48
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
5. Click Deploy

Every push to `main` auto-deploys. Feature branches get preview URLs automatically.

---

### 3. Vimeo Pro

**When to set up:** When Nathan has videos ready to upload.
**Cost:** ~$20/month (Pro plan)
**Purpose:** Hosts all videos. Pro removes Vimeo branding and allows domain-restricted embeds.

**Whose account:** Nathan's — use `nathan@rjaonline.com` and his payment method.
This is his content and his brand. He should own the Vimeo account.

**Steps:**
1. Go to vimeo.com → Sign up as Nathan
2. Upgrade to Pro
3. Upload a video
4. Go to video settings → Privacy → "Only on sites I choose" → add `jackvisuals23.com`
5. Copy the video ID from the URL: `vimeo.com/123456789` → ID is `123456789`
6. Paste the full Vimeo URL into Sanity when adding a project

**Embed in project card:**
```jsx
// components/ProjectCard.jsx
export default function ProjectCard({ title, category, vimeoUrl }) {
  const vimeoId = vimeoUrl?.split('/').pop()

  return (
    <div className="project-card">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=0&title=0&byline=0&portrait=0`}
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
      <div className="card-info">
        <span className="card-cat">{category}</span>
        <h3 className="card-title">{title}</h3>
      </div>
    </div>
  )
}
```

---

### 4. Formspree

**When to set up:** When you're ready to make the contact form functional.
**Cost:** Free (50 submissions/month — enough for an inquiry form)
**Purpose:** Receives form submissions and forwards to Nathan's email. No backend needed.

**Whose account:** Nathan's — use `nathan@rjaonline.com` so he owns the submissions.

**Steps:**
1. Go to formspree.io → Sign up as Nathan
2. Click "New Form" → name it "Jack Visuals Contact"
3. Set destination email to `nathan@rjaonline.com`
4. Copy the endpoint URL (looks like `https://formspree.io/f/xabcdefg`)
5. Add to `Inquire.jsx`:

```jsx
<form action="https://formspree.io/f/xabcdefg" method="POST">
  <input name="name"    type="text"  placeholder="Your name"      required />
  <input name="email"   type="email" placeholder="Email address"  required />
  <textarea name="message" placeholder="Tell us about your project..." />
  <button type="submit">Start a Conversation</button>
</form>
```

---

## PHASE 3 — Domain & Launch

**Whose account:** Nathan's — he buys and owns the domain.

**Steps:**
1. Nathan buys `jackvisuals23.com` at Namecheap (~$12/yr)
2. In Vercel → Project settings → Domains → Add `jackvisuals23.com`
3. Vercel gives you nameservers or a CNAME record
4. Nathan updates DNS at his registrar
5. DNS propagates in 24–48 hours
6. Vercel auto-provisions SSL (HTTPS) for free

---

## Quick Reference — Account Status

| Account | Whose Account | Status | Cost |
|---|---|---|---|
| GitHub | Jonel | ✅ Exists — generatenyc/JackVisuals23 | Free |
| Sanity | Jonel | ✅ Exists — project ID yqj0dj48 | Free |
| Nathan (Sanity editor) | Nathan (invite) | □ Invite when Studio is deployed | Free |
| Vercel | Jonel | □ Set up at first deploy | Free |
| Vimeo Pro | Nathan | □ When videos are ready | ~$20/mo |
| Formspree | Nathan | □ When contact form is wired | Free |
| Domain | Nathan | □ Go-live | ~$12/yr |

---

## Local vs Live — What Works Where

| Feature | Local (localhost) | Vercel Preview | Live (domain) |
|---|---|---|---|
| See the site | ✅ | ✅ | ✅ |
| Nathan reviews design | Share localtunnel URL | ✅ | ✅ |
| Vimeo videos play | ✅ (if domain whitelisted) | ✅ | ✅ |
| Sanity content | ✅ (reads from Content Lake) | ✅ | ✅ |
| Nathan edits content | ✅ (via Studio URL) | ✅ | ✅ |
| Contact form sends email | ✅ (Formspree works locally) | ✅ | ✅ |
| Custom domain | ❌ | ❌ | ✅ |

---

*End of SETUP.md*
