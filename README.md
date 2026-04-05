# Portfolio (Vite + React + Tailwind)

Static portfolio with an interactive hero canvas, liquid-glass UI panels, and sections for **career** vs **freelance** work. Default **Vite `base`** is **`/portfolio/`** for a **project site** at `https://<user>.github.io/portfolio/`. For a **user site** at the domain root, set `VITE_BASE_PATH=/` in `.env.production` (see [`.env.production.example`](.env.production.example)).

## Prerequisites

- Node.js 20+ (CI uses 22)
- npm

## Local development

```bash
npm install
npm run dev
```

Open **`http://localhost:5173/portfolio/`** (trailing path matches `base`).

`postinstall` copies variable **DM Sans** and **Syne** WOFF2 files into `public/fonts/` (see `scripts/copy-fonts.mjs`). Fonts are declared in `src/fonts.css` and preloaded from `index.html` (no Google Fonts).

PNG screenshots in `public/screenshots/` have matching **`.webp`** siblings (run `npm run optimize-screenshots` after adding or changing PNGs). The UI uses `<picture>` via `ScreenshotImg` so browsers load WebP when supported.

## Production build and preview

```bash
npm run build
npm run preview
```

Preview is served at **`http://localhost:4173/portfolio/`** by default.

Open the preview URL in Chrome, then run **Lighthouse** (DevTools → Lighthouse) against the **production** build. Test **Mobile** and **Desktop**. Prefer auditing the preview URL rather than `npm run dev` for accurate scores.

## Customize content

- **Site copy & SEO (single source):** edit [`src/data/siteContent.json`](src/data/siteContent.json). Section headings, hero, about, skills intro, work blurbs, contact details, nav labels, footer line (`{year}` placeholder), and **meta** (title, descriptions, canonical URL) all live there. At **`npm run build`**, [`vite.config.ts`](vite.config.ts) injects meta tags and JSON-LD into `index.html` from that file.
- **Production URL:** set `meta.siteUrl` in `siteContent.json`, or add `.env.production` with `VITE_SITE_URL=https://your-domain/` (see [`.env.production.example`](.env.production.example)).
- **Projects & hero tiles:** [`src/data/projects.ts`](src/data/projects.ts).
- **Skill categories & CV path:** [`src/data/skills.ts`](src/data/skills.ts).
- **Screenshots:** add files under [`public/screenshots/`](public/screenshots/) and reference them as `/screenshots/...` on each project (`imageSrc` / `imageAlt`). Set `featuredInHero: true` for the hero “Live previews” strip; use optional `heroStrip` for multiple tiles. External `https` links open in a new tab.

## GitHub Pages deployment (automated)

This repo is set up as a **project site** at `https://<user>.github.io/portfolio/` (repository name **`portfolio`**). The production build must be the Vite output in **`dist/`**, not the raw repo files.

1. Push this repo to GitHub (for example `https://github.com/<you>/portfolio`).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions** (not “Deploy from a branch”). If Pages is set to deploy the **`main`** branch from **`/` (root)`**, visitors get unprocessed `index.html` (you will see **`%SITE_TITLE%`**, **`%BASE_PATH%`**, script **`/src/main.tsx`**, and **404**s for fonts and logos under the wrong path).
3. Ensure **Settings → Actions → General → Workflow permissions** allows the default `GITHUB_TOKEN` to deploy Pages (read and write for **Workflow permissions** on public repos is usually enough).
4. The workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push to **`main`** (and can be run manually via **Actions → Deploy to GitHub Pages → Run workflow**): `npm ci`, `npm run build`, uploads **`dist/`**, deploys with **Deploy GitHub Pages**. The build step sets **`VITE_BASE_PATH=/portfolio/`** so asset URLs match the project-site path.

**If you use a user site** at `https://<you>.github.io/` (repository **`<you>.github.io`**): set `VITE_BASE_PATH=/` in [`.env.production`](.env.production.example) locally and change the **`VITE_BASE_PATH`** line in the workflow to **`/`**, and align `meta.siteUrl` in `siteContent.json`.

If your default branch is not `main`, either rename it to `main` or change the `on.push.branches` entry in the workflow file.

## Optional: GitHub in Cursor (MCP)

To let compatible tools talk to GitHub (issues, PRs, etc.), add a **GitHub MCP server** in Cursor’s MCP settings and authenticate (PAT or OAuth). This is editor configuration only; it does not change how Pages builds.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)

## Accessibility notes

- Skip link, landmarks, single `h1`, focus-visible styles.
- Hero canvas: reduced-motion handling in the point-field background.
