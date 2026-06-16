# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Vite, default port 5173)
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

No test suite or linter is configured.

## Architecture

Single-page Vue 3 app built with Vite. Two routes: `/` (home) and `/writing` (post list) and `/writing/:slug` (post detail).

**Router**: `src/router/index.js` uses `createWebHistory`. A `vercel.json` at the root rewrites all paths to `index.html` to support SPA routing on Vercel.

**Home page**: `src/views/HomeView.vue` composes all section components in order: Hero, About, Experience, Projects, Skills, Writing, Contact, Footer. Each section is a standalone component in `src/components/`.

**Writing system**: Posts are stored as JS objects in `src/data/posts.js`. Each post has `id`, `slug`, `title`, `date`, `category`, `tags`, `description`, and a `content` field containing raw markdown. Medium-imported posts also have a `mediumUrl` field, which PostView uses to render a "Read the full article on Medium" footer link. Markdown is rendered via `marked` with a custom highlight.js renderer in `src/utils/markedWithHljs.js`. Registered languages: java, javascript, properties, xml, bash, yaml, plaintext.

**Data files**: All editable content lives in `src/data/` — `posts.js`, `projects.js`, `skills.js`, `experience.js`. No backend or CMS.

**Theme**: Light/dark toggle via `useTheme` composable (`src/composables/useTheme.js`). Default is light mode. Preference is persisted in `localStorage`. Theme is applied as `data-theme="light|dark"` on `<html>`. CSS variables for both themes are defined in `src/assets/styles/main.css`.

**Animations**: A global `v-appear` directive (registered in `main.js`) fades + slides elements in when they enter the viewport via IntersectionObserver. Page transitions use the `.page-enter/leave` CSS classes defined in `main.css` (120ms opacity transition).

**Syntax highlighting**: Uses `highlight.js/lib/core` (not the full bundle). Only explicitly registered languages work — add imports + `hljs.registerLanguage()` calls in `src/utils/markedWithHljs.js` when adding code blocks in new languages.

## Deployment

Deployed on Vercel (free Hobby plan) at `https://alexanderang.vercel.app`. Every push to `main` triggers an automatic redeploy. The repo uses two GitHub accounts via SSH config — the personal account uses the `github-personal` host alias (maps to `~/.ssh/id_ed25519_personal`).
