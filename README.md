# 3D portfolio (Vite + React + Tailwind + React Three Fiber)

Static portfolio with a lazy-loaded WebGL hero, liquid-glass UI panels, and sections for **career** vs **freelance** work. Built for **GitHub Pages** at the site root (`base: '/'`).

## Prerequisites

- Node.js 20+ (CI uses 22)
- npm

## Local development

```bash
npm install
npm run dev
```

## Production build and preview

```bash
npm run build
npm run preview
```

Open the preview URL in Chrome, then run **Lighthouse** (DevTools → Lighthouse) against the **production** build. Test **Mobile** and **Desktop**. Prefer auditing the preview URL rather than `npm run dev` for accurate scores.

## Customize content

- **Projects & copy:** [`src/data/projects.ts`](src/data/projects.ts), [`src/components/sections/About.tsx`](src/components/sections/About.tsx), [`src/components/sections/Hero.tsx`](src/components/sections/Hero.tsx).
- **Screenshots:** add files under [`public/screenshots/`](public/screenshots/) and reference them as `/screenshots/...` on each project (`imageSrc` / `imageAlt`). Set `featuredInHero: true` for the hero “Live previews” strip; use optional `heroStrip` in [`src/data/projects.ts`](src/data/projects.ts) for multiple tiles (each with `href`, `label`, `imageSrc`, `imageAlt`). External `https` links open in a new tab.
- **Meta / SEO:** update [`index.html`](index.html) if your GitHub Pages URL is not `https://aliadel00.github.io/`.
- **Contact:** [`src/components/sections/Contact.tsx`](src/components/sections/Contact.tsx).

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
- [three.js](https://threejs.org/), [@react-three/fiber](https://github.com/pmndrs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- `three-mesh-bvh` (required for bundling current `drei` entry points)

## Accessibility notes

- Skip link, landmarks, single `h1`, focus-visible styles.
- 3D canvas: `aria-label` and reduced-motion handling (rotation and orbit controls disabled when `prefers-reduced-motion: reduce`).
