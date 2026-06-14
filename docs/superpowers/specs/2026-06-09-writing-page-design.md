# Writing Page — Design Spec

**Date:** 2026-06-09
**Status:** Approved

## Overview

Add a "Writing" section to the portfolio: a listing page at `/writing` and individual post detail pages at `/writing/:slug`. Posts are stored as static data in `src/data/posts.js` with Markdown body content rendered via `marked.js`. Style matches the reference at hanafifirman.dev/blog — vertical list, grouped by year, minimal and text-focused.

## Architecture

### Dependency

Add `marked` npm package for Markdown → HTML rendering on the detail page.

### Data — `src/data/posts.js`

Array of post objects:

```js
{
  id: 1,
  slug: 'post-url-slug',
  title: 'Post Title',
  date: '2026-06-01',           // ISO date string
  category: 'Architecture',
  tags: ['java', 'systems'],    // rendered as #java #systems
  description: 'One or two sentence summary shown in the listing.',
  content: `## Heading\n\nMarkdown body...`
}
```

Posts are sorted reverse-chronologically in the view (no pre-sorting in the data file).

### Routing — `src/router/index.js`

Two new routes added alongside the existing `/` home route:

| Path | Component |
|---|---|
| `/writing` | `WritingView` |
| `/writing/:slug` | `PostView` |

Router stays on `createWebHashHistory` — no server config needed for static builds.

### `src/views/WritingView.vue`

- Page heading: **"Writing"** with tagline `"Thoughts on software, architecture, and engineering."` (editable in the component)
- Posts fetched from `posts.js`, sorted reverse-chronologically, then grouped by year
- Year headers rendered as section dividers
- Each post row:
  - Line 1: `date · category` (muted text, small)
  - Line 2: post title as `<RouterLink to="/writing/:slug">` (primary text, hover accent)
  - Line 3: description (secondary text)
  - Line 4: hashtag chips (`#tag`) matching existing chip style
- Consistent spacing with other site sections (uses `.container` and existing CSS vars)

### `src/views/PostView.vue`

- Back link: `← Writing` using `<RouterLink to="/writing">` at the top
- Post header: title, then `date · category` line, then hashtag chips
- Body: `v-html` of `marked(post.content)` inside a `.prose` wrapper
- Scoped `.prose` styles: line-height 1.8, heading sizes, `<code>` styling, `<a>` color, paragraph spacing
- If slug not found: show a "Post not found" message with a back link

### `src/components/NavBar.vue`

Add "Writing" as the first nav item using `<RouterLink to="/writing">` (not a scroll link). Active route styling uses Vue Router's `router-link-active` class — apply `color: var(--color-text-primary)` when active.

## Files Changed

| File | Change |
|---|---|
| `src/data/posts.js` | New — post data array |
| `src/views/WritingView.vue` | New — listing page |
| `src/views/PostView.vue` | New — detail page |
| `src/router/index.js` | Add `/writing` and `/writing/:slug` routes |
| `src/components/NavBar.vue` | Add Writing RouterLink |
| `package.json` | Add `marked` dependency |

## Out of Scope

- Search or tag filtering on the listing page
- Pagination (all posts shown on one page)
- RSS feed
- Comments
- Reading time estimate
