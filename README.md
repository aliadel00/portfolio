# Portfolio (Vite + React + Tailwind)

Static portfolio with an interactive hero canvas, liquid-glass UI panels, and sections for **career** vs **freelance** work. Built for **GitHub Pages** at the site root (`base: '/'`).

## Prerequisites

- Node.js 20+ (CI uses 22)
- npm

## Local development

```bash
npm install
npm run dev
```

`postinstall` copies variable **DM Sans** and **Syne** WOFF2 files into `public/fonts/` (see `scripts/copy-fonts.mjs`). Fonts are declared in `src/fonts.css` and preloaded from `index.html` (no Google Fonts).

PNG screenshots in `public/screenshots/` have matching **`.webp`** siblings (run `npm run optimize-screenshots` after adding or changing PNGs). The UI uses `<picture>` via `ScreenshotImg` so browsers load WebP when supported.

## Production build and preview

```bash
npm run build
npm run preview
```

Open the preview URL in Chrome, then run **Lighthouse** (DevTools → Lighthouse) against the **production** build. Test **Mobile** and **Desktop**. Prefer auditing the preview URL rather than `npm run dev` for accurate scores.

## Customize content

- **Site copy & SEO (single source):** edit [`src/data/siteContent.json`](src/data/siteContent.json). Section headings, hero, about, skills intro, work blurbs, contact details, nav labels, footer line (`{year}` placeholder), and **meta** (title, descriptions, canonical URL) all live there. At **`npm run build`**, [`vite.config.ts`](vite.config.ts) injects meta tags and JSON-LD into `index.html` from that file.
- **Production URL:** set `meta.siteUrl` in `siteContent.json`, or add `.env.production` with `VITE_SITE_URL=https://your-domain/` (see [`.env.production.example`](.env.production.example)).
- **Projects & hero tiles:** [`src/data/projects.ts`](src/data/projects.ts).
- **Skill categories & CV path:** [`src/data/skills.ts`](src/data/skills.ts).
- **Screenshots:** add files under [`public/screenshots/`](public/screenshots/) and reference them as `/screenshots/...` on each project (`imageSrc` / `imageAlt`). Set `featuredInHero: true` for the hero “Live previews” strip; use optional `heroStrip` for multiple tiles. External `https` links open in a new tab.

## GitHub Pages deployment (automated)

1. On GitHub, create a repository named **`<your-username>.github.io`** (user or org site).
2. Rename this local folder to match if you like, then:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```

3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
4. Ensure **Settings → Actions → General → Workflow permissions** allows **read and write** where needed for Pages (default for `GITHUB_TOKEN` on public repos is usually sufficient).
5. The workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main`: `npm ci`, `npm run build`, uploads `dist/`, deploys via **Deploy GitHub Pages**.

If your default branch is not `main`, either rename it to `main` or change the `on.push.branches` entry in the workflow file.

## Optional: GitHub in Cursor (MCP)

To let compatible tools talk to GitHub (issues, PRs, etc.), add a **GitHub MCP server** in Cursor’s MCP settings and authenticate (PAT or OAuth). This is editor configuration only; it does not change how Pages builds.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)

## Accessibility notes

- Skip link, landmarks, single `h1`, focus-visible styles.
- Hero canvas: reduced-motion handling in the point-field background.
