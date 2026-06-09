# Free Deployment Guide — Architecture Advisor on GitHub (from Ubuntu / elementary OS)

This guide deploys the v3 app to **GitHub Pages** for **free**, with a free **GitHub Actions**
CI/CD pipeline. It assumes a **public** repository (the only fully-free path: public repos get
unlimited Actions minutes on standard runners and free Pages hosting).

Everything in the stack (Vite, React, TypeScript, Tailwind, recharts, mermaid, vitest) is free
and open source. Your elementary OS machine (Ubuntu 24.04 base) is fine as the dev box.

---

## 0. Cost summary (why this is free)

| Component                  | Cost on a PUBLIC repo |
|----------------------------|------------------------|
| GitHub account (Free plan) | Free |
| GitHub Pages hosting       | Free |
| GitHub Actions CI/CD       | Free, unlimited (standard Ubuntu runners) |
| All npm dependencies       | Free / open source |
| Dev tooling on your laptop | Free |

Caveat: on a PRIVATE repo, Actions is limited to 2,000 free minutes/month and private Pages
needs a paid org plan. Keep the repo public for zero cost.

---

## 1. One-time setup on elementary OS (Ubuntu 24.04 base)

Install Node.js (use the NodeSource LTS or nvm — nvm is recommended so you control versions):

```bash
# Recommended: nvm (no sudo, easy version switching)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# restart the terminal, then:
nvm install --lts
nvm use --lts
node -v && npm -v   # verify

# Git (usually already present on elementary OS)
sudo apt update && sudo apt install -y git
git --version
```

Configure Git identity and authentication:

```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
```

For pushing to GitHub, the simplest free auth is the GitHub CLI:

```bash
sudo apt install -y gh        # or: see cli.github.com for the latest install method
gh auth login                 # choose GitHub.com → HTTPS → login via browser
```

---

## 2. Get the project on your machine

If the AI agent already generated the project into a folder (e.g. `architecture-advisor`),
just `cd` into it. Otherwise create the repo first:

```bash
cd ~/Projects                       # or wherever you keep code
# If you already have the generated app folder, cd into it and skip the next line.
gh repo create architecture-advisor --public --clone
cd architecture-advisor
```

Install dependencies and run locally to confirm it works:

```bash
npm install
npm run dev      # open the printed http://localhost:5173 in your browser
npm run test     # run the unit tests
npm run build    # produce the static site in ./dist
```

---

## 3. Configure Vite for GitHub Pages (critical step)

A project page is served from `https://<username>.github.io/<repo-name>/`, so the app must know
its sub-path. Edit `vite.config.ts` and set `base` to your repo name:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: must match your repository name, with leading & trailing slash
  base: '/architecture-advisor/',
})
```

Notes:
- If you later use a custom domain or a user/organization page
  (`<username>.github.io`), set `base: '/'` instead.
- The app stores state in the URL **hash** (`#...`), which works perfectly on GitHub Pages with
  no extra SPA-fallback configuration, because there is only one HTML entry point.

---

## 4. Add the CI/CD workflow (build + deploy to Pages)

Create the file `.github/workflows/deploy.yml` with the content below. It builds the site and
publishes it to GitHub Pages on every push to `main`, using the official GitHub Pages Actions.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run test --if-present
      - run: npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

(You can keep the separate `ci.yml` from the spec for lint/test on pull requests; this
`deploy.yml` handles production deploys.)

---

## 5. Push, then turn on Pages

```bash
git add .
git commit -m "Architecture Advisor v3 + Pages deploy workflow"
git branch -M main
git push -u origin main
```

Then in the browser:
1. Go to your repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, choose **GitHub Actions**.
3. Push again (or use the **Run workflow** button under the Actions tab) to trigger a deploy.

After the workflow finishes (watch it under the **Actions** tab), your app is live at:

```
https://<your-username>.github.io/architecture-advisor/
```

Every future `git push` to `main` redeploys automatically.

---

## 6. Optional: even simpler hosting (also free)

GitHub Pages is fully free and integrated, but these are equally free for static sites and
give zero-config sub-paths and nicer previews. Any one of them works with the same `dist` build:

- **Cloudflare Pages** — connect the repo, build command `npm run build`, output dir `dist`.
- **Netlify** — same idea; generous free tier; deploy previews on PRs.
- **Vercel** — same; auto-detects Vite.

With these you can leave `base: '/'` (no sub-path), which avoids the step-3 gotcha entirely.

---

## 7. Quick troubleshooting

- **Blank page / 404 on assets after deploy** → almost always the `base` in `vite.config.ts`
  doesn't match the repo name. Fix it, commit, push.
- **Workflow fails on `npm ci`** → ensure `package-lock.json` is committed.
- **Pages source not set** → Settings → Pages → Source must be "GitHub Actions".
- **Charts/diagrams missing in prod but fine locally** → confirm recharts/mermaid are in
  `dependencies` (not only `devDependencies`).

---

## 8. The whole free loop, in one picture

```
edit code on elementary OS  →  git push to main  →  GitHub Actions (free)
   builds + tests + deploys  →  GitHub Pages (free)  →  public live URL
```

No servers to manage, no monthly bill. Total cost: your time.
