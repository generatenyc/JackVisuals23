# Sanity CMS Playbook
> Reusable reference for setting up Sanity Studio on client projects
> Captured from Jack Visuals 23 build (March 2026)

---

## 1. Project Setup

### Create Sanity Project
1. Go to [sanity.io](https://sanity.io) and log in with GenerateNYC Google account
2. Click **Create Project**
3. Select **GenerateNYC** organization
4. Name the project (e.g., "Jack Visuals Studio")
5. Note the **Project ID** (format: `abc123de`)

### Initialize Studio Inside Next.js Repo
```bash
# From project root, create sanity subfolder
npm create sanity@latest -- --project <projectId> --dataset production --template clean
```

This creates:
- `sanity/` directory
- `sanity/sanity.config.js` — studio configuration
- `sanity/schemas/` — content type definitions

### Add sanity/package.json
The CLI init doesn't always create a proper `package.json`. Create one manually:

```json
{
  "name": "client-studio",
  "private": true,
  "version": "1.0.0",
  "description": "Sanity Studio for [Client Name]",
  "scripts": {
    "dev": "sanity dev",
    "build": "sanity build",
    "deploy": "sanity deploy"
  },
  "dependencies": {
    "@sanity/cli": "^6.2.1",
    "sanity": "^5.18.0",
    "styled-components": "^6.3.12"
  }
}
```

**Critical:** `styled-components` must be listed as a dependency, or the studio will fail to deploy.

### Install Dependencies
```bash
cd sanity
npm install
```

This creates `sanity/node_modules/` with a local copy of the Sanity CLI.

### Add to .gitignore
Add these lines to the root `.gitignore`:

```
# Sanity
sanity/node_modules
sanity/dist
sanity/.sanity
```

Commit `sanity/package.json` and `sanity/package-lock.json` to the repo.

---

## 2. Schema Design Principles

### File Structure
```
sanity/schemas/
├── project.js
├── service.js
├── trustedBy.js
└── productionKit.js
```

One schema file per content type. Register all schemas in `sanity/sanity.config.js`:

```js
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import project from "./schemas/project";
import service from "./schemas/service";

export default defineConfig({
  name: "studio-name",
  title: "Client Studio",
  projectId: "abc123de",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [project, service],
  },
});
```

### Always Include an `order` Field
For any content type that appears in a list (Services, Trusted By, FAQ, etc.):

```js
{
  name: 'order',
  title: 'Display Order',
  type: 'number',
  description: 'Controls the order this item appears. Lower numbers appear first.',
}
```

Fetch with `order(order asc)` in your GROQ query.

### Preset + Custom Category Pattern
When a client needs category tags but may need values outside a preset list:

```js
{
  name: 'category',
  title: 'Category',
  type: 'string',
  description: 'Select from the preset list. If your category is not listed, leave this blank and use the Custom Category field below.',
  options: {
    list: [
      { title: 'Live Event', value: 'Live Event' },
      { title: 'Brand', value: 'Brand' },
      { title: 'Aerial', value: 'Aerial' },
    ],
    layout: 'dropdown',
  },
},
{
  name: 'customCategory',
  title: 'Custom Category',
  type: 'string',
  description: 'Only fill this in if your category is not in the preset list above. Leave blank otherwise.',
}
```

In your GROQ query, compute `resolvedCategory`:

```js
export const projectsQuery = `*[_type == "project"] | order(date desc) {
  ...,
  "resolvedCategory": select(
    defined(customCategory) && customCategory != "" => customCategory,
    category
  )
}`;
```

Frontend components use `project.resolvedCategory || project.category` as fallback.

### Singleton Pattern
For one-off content (About text, Production Kit description, Contact info):

```js
// schemas/productionKit.js
export default {
  name: 'productionKit',
  title: 'Production Kit',
  type: 'document',
  fields: [
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Describe your production equipment...',
    },
  ],
};
```

Query fetches the first document: `*[_type == "productionKit"][0]`

Configure the studio to show it as a single editable entry, not a list:

```js
plugins: [
  structureTool({
    structure: (S) =>
      S.list()
        .title('Content')
        .items([
          S.documentTypeListItem('project').title('Project'),
          S.documentTypeListItem('productionKit').title('Production Kit'),
        ]),
  }),
],
```

### Always Add Helper Text
Every field should have a `description` so the client knows exactly what to enter:

```js
{
  name: 'vimeoUrl',
  title: 'Vimeo URL',
  type: 'url',
  description: 'Paste your full Vimeo video URL (e.g. https://vimeo.com/123456789)',
}
```

### Max Featured Items Validation
To enforce a limit (e.g., max 3 featured projects on the homepage):

```js
{
  name: 'featured',
  title: 'Featured on homepage',
  type: 'boolean',
  description: 'Toggle on to show this project on the homepage. Maximum 3 featured projects allowed.',
  initialValue: false,
  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      if (!value) return true;
      const client = context.getClient({ apiVersion: '2024-01-01' });
      const id = context.document._id.replace(/^drafts\./, '');
      const count = await client.fetch(
        `count(*[_type == "project" && featured == true && !(_id in [$current, "drafts." + $current])])`,
        { current: id }
      );
      if (count >= 3) {
        return 'There are already 3 featured projects. Un-feature another project first.';
      }
      return true;
    }),
}
```

---

## 3. Queries and Frontend Wiring

### Query File: lib/sanity.js
Centralize all Sanity queries in one file:

```js
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "abc123de",
  dataset: "production",
  useCdn: true,  // Use CDN for faster reads in production
  apiVersion: "2024-01-01",
});

// All projects — /work page
export const allProjectsQuery = `*[_type == "project"] | order(date desc) {
  ...,
  "resolvedCategory": select(
    defined(customCategory) && customCategory != "" => customCategory,
    category
  )
}`;

// Featured projects — homepage (max 3)
export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(date desc)[0...3] {
  ...,
  "resolvedCategory": select(
    defined(customCategory) && customCategory != "" => customCategory,
    category
  )
}`;

// Services — ordered
export const servicesQuery = `*[_type == "service"] | order(order asc)`;

// Production Kit — singleton
export const productionKitQuery = `*[_type == "productionKit"][0]`;
```

### Server-Side Fetching (Next.js App Router)
Fetch data on the server in `app/page.jsx` and pass as props to client components:

```js
import { client, featuredProjectsQuery, servicesQuery } from "@/lib/sanity";

export default async function HomePage() {
  let featuredProjects = [];
  let services = [];

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch {
    /* Sanity fetch failed — component will show placeholder */
  }

  try {
    services = await client.fetch(servicesQuery);
  } catch {
    /* Sanity fetch failed — component will show placeholder */
  }

  return (
    <>
      <FeaturedWork projects={featuredProjects} />
      <About services={services} />
    </>
  );
}
```

### Always Include Fallbacks
Components should gracefully handle empty Sanity data:

```js
const PLACEHOLDER_SERVICES = "Event Videography · Brand Campaigns · Drone & Aerial";

export default function About({ services = [] }) {
  const servicesText =
    services.length > 0
      ? services.map((s) => s.title).join(" · ")
      : PLACEHOLDER_SERVICES;

  return <p>{servicesText}</p>;
}
```

### Debugging Stale Data
If changes in Sanity Studio don't appear on the frontend:

1. Temporarily set `useCdn: false` in `lib/sanity.js`
2. Hard refresh the browser (Ctrl+Shift+R)
3. Once confirmed working, switch back to `useCdn: true` for production

---

## 4. Studio Deployment

### Install Dependencies First
**Critical:** Run `npm install` inside the `sanity/` folder before deploying:

```bash
cd sanity
npm install
```

This ensures `styled-components` and all dependencies are present.

### Login
```bash
npx sanity login
```

This opens a browser for you to authenticate with the GenerateNYC Google account.

### Deploy
```bash
npm run deploy
```

When prompted:
- **Hostname:** Choose carefully. Use the client's brand name or domain prefix (e.g., `jackvisuals23`)
- Deleted hostnames can still block re-registration temporarily

### Add appId to sanity.cli.js
After successful deployment, Sanity will provide an `appId`. Add it to `sanity/sanity.cli.js`:

```js
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "abc123de",
    dataset: "production",
  },
  deployment: {
    appId: "jgz8ou5yf0kwr36ioex99zex",
  },
});
```

Commit this file.

### Studio URL
After deployment, the studio is accessible at:

```
https://<hostname>.sanity.studio
```

Example: `https://jackvisuals23.sanity.studio`

### Troubleshooting Deployment

**Error: "You must login first"**
- Run `npx sanity login` again
- Ensure you're logged in with the GenerateNYC Google account

**Error: "Cannot resolve styled-components"**
- Add `styled-components` to `sanity/package.json` dependencies
- Run `npm install` inside the `sanity/` folder

**Error: "No CLI config found"**
- Create `sanity/sanity.cli.js` with `projectId` and `dataset`

**PowerShell path issues:**
- Wrap paths with spaces in quotes: `cd "C:\Users\Jonel Richardson\..."`

---

## 5. Client Permissions

### When to Invite the Client
**Wait until the end of the project.** Do not invite the client during development.

Reasons:
- The studio should be fully configured with all schemas before the client sees it
- Placeholder content should be seeded so they never log into a blank studio
- You avoid confusing the client with schema changes mid-project

### How to Invite
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select the project
3. Click **Members** tab
4. Click **Add members**
5. Enter the client's email address
6. Set role to **Editor**
7. Send invite

### Role Definitions
- **Administrator:** Full access to schema, settings, billing, members. Never give this to clients.
- **Editor:** Can create, edit, publish content. Cannot modify schema or settings. Use this for clients.
- **Viewer:** Read-only access. Rarely needed.

**Important:** Organization-level Administrator does not automatically grant project-level access. You must explicitly add the client's email to the project's Members tab.

---

## 6. Content Seeding

### Why Seed Content?
A blank studio is intimidating. Seed 3-5 placeholder items in each content type before inviting the client.

### Video Portfolio Projects
**Use Vimeo for video hosting, never Instagram.**

Reasons:
- Vimeo embeds are cleaner and more reliable
- Vimeo free plan: 5GB storage, sufficient for portfolio use
- Instagram embed support is unreliable and requires constant auth

### Vimeo Setup for Client
1. Have the client create a free Vimeo account
2. Upload 3-5 portfolio videos
3. Get the Vimeo URLs (format: `https://vimeo.com/123456789`)
4. Use these real URLs for seeding, not test URLs

### Placeholder Project Example
```
Title: Trinidad Carnival 2024
Vimeo URL: https://vimeo.com/76979871
Category: Live Event
Featured: true
Date: 2024-02-01
```

Seed 3 featured projects, 2-3 non-featured projects.

### Verify Seeded Content
Before inviting the client:
1. Hard refresh the live site
2. Confirm all seeded projects appear correctly
3. Test Vimeo embeds play correctly
4. Verify category filters work on the /work page

---

## 7. Client Handoff Guide Template

Create a `CLIENT_GUIDE.md` (rename per client, e.g., `NATHAN_GUIDE.md`).

Keep it **under one page, plain English, no jargon.**

### Template Structure

```markdown
# How to Update Your Portfolio — [Client Name]

## Logging In
1. Go to [your-studio-url].sanity.studio
2. Click "Login with Google"
3. Use the email address we invited: [client-email]

## Adding a New Project
1. Click **Project** in the left sidebar
2. Click the **+** button at the top
3. Fill in the fields:
   - **Title:** The name of the project (e.g., "Grey Goose Launch Event")
   - **Vimeo URL:** Paste your Vimeo link (e.g., https://vimeo.com/123456789)
   - **Category:** Choose from the dropdown, or use Custom Category if needed
   - **Featured on homepage:** Toggle ON if you want this on the homepage (max 3)
   - **Date:** The date of the project or shoot
4. Click **Publish** at the bottom

Your project will appear on the site within 1 minute.

## Editing an Existing Project
1. Click **Project** in the sidebar
2. Find and click the project you want to edit
3. Make your changes
4. Click **Publish** at the bottom

## Deleting a Project
1. Open the project
2. Click the **three dots menu** (⋯) at the top right
3. Select **Delete**
4. Confirm deletion
5. **Important:** Publish the deletion (you'll see a deleted draft to publish)

## Content Limits
- **Homepage:** Maximum 3 featured projects allowed
- If you try to feature a 4th project, you'll see an error message
- Un-feature another project first, then feature the new one

## Need Help?
Contact [Your Name] at [your-email]
Response time: 24 hours
```

---

## 8. Lessons Learned (Jack Visuals 23)

### The sanity/ Subfolder Needs Its Own node_modules
Running `npm install` from the root does NOT install Sanity dependencies.

**Always run:**
```bash
cd sanity
npm install
```

This creates `sanity/node_modules/` with the local Sanity CLI.

### styled-components Must Be Explicitly Added
The Sanity CLI does not always add `styled-components` to `package.json`.

**Always manually add it:**
```json
"dependencies": {
  "@sanity/cli": "^6.2.1",
  "sanity": "^5.18.0",
  "styled-components": "^6.3.12"
}
```

### CLI Deploy Requires User Session, Not Robot Token
Robot tokens (created in Sanity Manage → API → Tokens) **cannot** register studio hostnames.

Only user sessions (via `npx sanity login`) can deploy studios.

### Organization-Level Admin ≠ Project-Level Access
Being an Administrator at the organization level does not automatically grant access to individual projects.

**Always explicitly add the account to the project's Members tab.**

### PowerShell Path Issues on Windows
Paths with spaces need quotes:

```powershell
# Wrong
cd C:\Users\Jonel Richardson\...

# Right
cd "C:\Users\Jonel Richardson\..."
```

### Clearing a Stuck Token in PowerShell
```powershell
$env:SANITY_AUTH_TOKEN=""
```

Then re-run `npx sanity login`.

### Deleted Hostnames Are Not Immediately Available
If you delete a studio hostname in Sanity Manage, it may not be immediately available for re-registration.

**Choose hostnames carefully the first time.**

### resolvedCategory Pattern Is Essential
When clients need preset categories + custom free-text fallback, always use the `resolvedCategory` pattern in GROQ:

```js
"resolvedCategory": select(
  defined(customCategory) && customCategory != "" => customCategory,
  category
)
```

Frontend components use `item.resolvedCategory || item.category` as fallback.

---

## End of Playbook

This playbook was created from the Jack Visuals 23 build (March 2026).
Update this document as new patterns and lessons emerge.
