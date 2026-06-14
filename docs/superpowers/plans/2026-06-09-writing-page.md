# Writing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Writing section with a post listing page at `/writing` and individual post detail pages at `/writing/:slug`, with Markdown content rendered via `marked`.

**Architecture:** Posts are stored as static objects in `src/data/posts.js`. Two new Vue Router routes render `WritingView` (listing) and `PostView` (detail). `marked` converts Markdown body strings to HTML rendered via `v-html` inside scoped prose styles.

**Tech Stack:** Vue 3, Vue Router 4 (hash history), `marked` npm package, Vite

> **Note:** This project has no test framework configured. TDD steps are replaced with dev-server verification — run `npm run dev` and check in the browser.

---

### Task 1: Install `marked`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the dependency**

```bash
cd "/Users/alexander/Desktop/Personal Files/projects/portfolio"
npm install marked
```

Expected output: `added 1 package` (or similar). No errors.

- [ ] **Step 2: Verify install**

```bash
node -e "const { marked } = require('marked'); console.log(marked('**hello**'))"
```

Expected output: `<p><strong>hello</strong></p>`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add marked for markdown rendering"
```

---

### Task 2: Create post data file

**Files:**
- Create: `src/data/posts.js`

- [ ] **Step 1: Create the file with sample posts**

Create `src/data/posts.js`:

```js
export const posts = [
  {
    id: 1,
    slug: 'building-reliable-payment-systems',
    title: 'Building Reliable Payment Systems',
    date: '2026-05-20',
    category: 'Architecture',
    tags: ['java', 'payments', 'reliability'],
    description:
      'What I learned after years of building high-throughput transaction pipelines — idempotency, distributed locks, and the failure modes that actually happen in production.',
    content: `## The Problem With Payments

Payment systems fail in interesting ways. Unlike a content API where a dropped request just means a missing blog post, a dropped payment request can mean double charges, ghost transactions, or silent failures that surface three days later in a reconciliation report.

## Idempotency Is Non-Negotiable

Every mutation endpoint must be idempotent. This means accepting a client-generated idempotency key, storing it with a short TTL, and returning the cached response on retry — before executing any business logic.

\`\`\`java
@PostMapping("/charge")
public ResponseEntity<ChargeResponse> charge(
    @RequestHeader("Idempotency-Key") String idempotencyKey,
    @RequestBody ChargeRequest request
) {
    return idempotencyService.executeOnce(idempotencyKey, () ->
        chargeService.process(request)
    );
}
\`\`\`

## Distributed Locks for Concurrent Requests

When the same idempotency key arrives twice before the first request completes, you need a distributed lock — not just a database check. Redis with a short expiry works well here.

## Know Your Failure Modes

- **Network timeout after charge, before response:** Client retries with same key — idempotency saves you.
- **Database write succeeded, downstream notification failed:** Outbox pattern, async retry.
- **Partial refund processed twice:** Ledger-based accounting, not stateful balance fields.

Building payments correctly means designing for the failure cases before writing the happy path.`,
  },
  {
    id: 2,
    slug: 'java-virtual-threads-in-practice',
    title: 'Java Virtual Threads in Practice',
    date: '2026-04-10',
    category: 'Java',
    tags: ['java', 'concurrency', 'performance'],
    description:
      'Project Loom\'s virtual threads landed in Java 21. Here\'s what changed in our Spring Boot services when we turned them on — and what didn\'t.',
    content: `## What Virtual Threads Actually Are

Virtual threads are lightweight threads managed by the JVM, not the OS. The key difference: blocking a virtual thread (waiting on I/O, a lock, a sleep) doesn't block the underlying OS thread. The JVM parks the virtual thread and uses the carrier thread for something else.

For services that spend most of their time waiting on database queries or downstream HTTP calls — which is most backend services — this means you can run far more concurrent requests with the same hardware.

## Enabling in Spring Boot 3.2+

```properties
spring.threads.virtual.enabled=true
```

That's it. Spring Boot will use virtual threads for its embedded Tomcat executor.

## What Changed

**Before:** Under load, our connection pool would exhaust before CPU did. Requests queued waiting for a thread. P99 latency spiked.

**After:** Thread exhaustion is no longer the bottleneck. Connection pool exhaustion surfaces more clearly now — which means we fixed the actual constraint.

## What Didn't Change

- CPU-bound work gets no benefit. If you're doing heavy computation, virtual threads don't help.
- You still need to be careful with thread-local state — it's carried per virtual thread, which can cause unexpected behavior with frameworks that rely on ThreadLocal.
- Synchronized blocks still pin the virtual thread to its carrier. Use ReentrantLock instead.

## Verdict

Low-risk, high-upside change for I/O-heavy services. We rolled it out to all Spring Boot 3.2+ services with no incidents.`,
  },
  {
    id: 3,
    slug: 'ai-assisted-code-review',
    title: 'Using AI for Code Review — What Actually Works',
    date: '2026-03-05',
    category: 'Engineering',
    tags: ['ai', 'tooling', 'workflow'],
    description:
      'Six months of using AI tools in daily code review. The patterns where it saves time, the patterns where it hallucinates confidently, and how I adjusted my workflow.',
    content: `## The Honest Starting Point

I was skeptical. Code review requires context — knowing why a design decision was made three sprints ago, understanding the implicit constraints of a third-party integration, recognising patterns that are wrong for *this codebase* even if technically valid.

AI tools don't have that context. But I was wrong about what they're useful for.

## Where It Works Well

**Spotting mechanical bugs:** Null checks, off-by-one errors, missing break statements, incorrect comparisons. These are pattern-match tasks. AI is fast and reliable here.

**Explaining unfamiliar code:** Paste a block of Bash or a regex and ask what it does. Faster than reading it character by character.

**Draft PR descriptions:** Given a diff, AI writes a reasonable first-pass description. I edit it, but starting from something is faster than starting from blank.

**Test case suggestions:** "What edge cases am I missing for this function?" Often surfaces things I'd have caught in QA.

## Where It Doesn't

**Architecture decisions:** It'll tell you your approach is fine even when it isn't. It doesn't know your team's conventions or the six previous attempts at the same problem.

**Security review:** It catches common patterns (SQL injection, XSS) but misses domain-specific issues. Don't rely on it for security-critical paths.

**"Is this the right abstraction?":** Requires judgment, not pattern matching. Still a human problem.

## The Adjusted Workflow

I now use AI as a first pass — mechanical checks, typos, obvious issues — and treat its output as a starting point, not a conclusion. The architectural review still happens in the PR comment thread with the team.`,
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/posts.js
git commit -m "feat: add posts data file with sample writing entries"
```

---

### Task 3: Add router routes for Writing

**Files:**
- Modify: `src/router/index.js`

- [ ] **Step 1: Update the router**

Replace the full contents of `src/router/index.js`:

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  {
    path: '/writing',
    component: () => import('../views/WritingView.vue'),
  },
  {
    path: '/writing/:slug',
    component: () => import('../views/PostView.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
```

Lazy imports (`() => import(...)`) keep the initial bundle small — the Writing views are only loaded when navigated to.

- [ ] **Step 2: Commit**

```bash
git add src/router/index.js
git commit -m "feat: add /writing and /writing/:slug routes"
```

---

### Task 4: Build WritingView

**Files:**
- Create: `src/views/WritingView.vue`

- [ ] **Step 1: Create the component**

Create `src/views/WritingView.vue`:

```vue
<template>
  <div class="writing-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Writing</h1>
        <p class="page-tagline">Thoughts on software, architecture, and engineering.</p>
      </div>

      <div v-for="[year, yearPosts] in groupedPosts" :key="year" class="year-group">
        <h2 class="year-label">{{ year }}</h2>
        <div v-for="post in yearPosts" :key="post.id" class="post-row">
          <div class="post-meta">{{ formatDate(post.date) }} · {{ post.category }}</div>
          <RouterLink :to="`/writing/${post.slug}`" class="post-title">
            {{ post.title }}
          </RouterLink>
          <p class="post-description">{{ post.description }}</p>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts.js'

const groupedPosts = computed(() => {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))
  const map = new Map()
  for (const post of sorted) {
    const year = new Date(post.date).getFullYear().toString()
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(post)
  }
  return [...map.entries()]
})

function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.writing-page {
  padding-top: 56px;
}

.page-header {
  padding: 64px 0 48px;
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--color-text-primary);
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.page-tagline {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.year-group {
  border-top: 1px solid var(--color-border);
  padding: 40px 0;
}

.year-label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.post-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-border);
}

.post-row:first-of-type {
  border-top: none;
  padding-top: 0;
}

.post-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.post-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-base);
}

.post-title:hover {
  color: var(--color-accent);
}

.post-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  max-width: 600px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.tag {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
```

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173/#/writing` in the browser. You should see:
- "Writing" heading with tagline
- Posts grouped under the year "2026"
- Each post shows date · category, title, description, tags
- Clicking a post title navigates to `#/writing/<slug>` (PostView doesn't exist yet, expect blank)

- [ ] **Step 3: Commit**

```bash
git add src/views/WritingView.vue
git commit -m "feat: add Writing listing page"
```

---

### Task 5: Build PostView

**Files:**
- Create: `src/views/PostView.vue`

- [ ] **Step 1: Create the component**

Create `src/views/PostView.vue`:

```vue
<template>
  <div class="post-page">
    <div class="container">
      <RouterLink to="/writing" class="back-link">← Writing</RouterLink>

      <template v-if="post">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">{{ formatDate(post.date) }} · {{ post.category }}</div>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>
        <div class="prose" v-html="renderedContent" />
      </template>

      <div v-else class="not-found">
        <p>Post not found.</p>
        <RouterLink to="/writing" class="back-link">← Back to Writing</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { posts } from '../data/posts.js'

const route = useRoute()

const post = computed(() => posts.find(p => p.slug === route.params.slug) ?? null)

const renderedContent = computed(() =>
  post.value ? marked(post.value.content) : ''
)

function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.post-page {
  padding-top: 56px;
}

.container {
  padding-bottom: 96px;
}

.back-link {
  display: inline-block;
  margin-top: 40px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-base);
}

.back-link:hover {
  color: var(--color-text-primary);
}

.post-header {
  padding: 40px 0 32px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 48px;
}

.post-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: var(--color-text-primary);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.post-meta {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.not-found {
  padding: 64px 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--color-text-secondary);
}

/* Prose styles for rendered Markdown */
.prose {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.85;
  max-width: 660px;
}

.prose :deep(h2) {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin: 2.5rem 0 1rem;
}

.prose :deep(h3) {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 2rem 0 0.75rem;
}

.prose :deep(p) {
  margin-bottom: 1.25rem;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

.prose :deep(li) {
  margin-bottom: 0.4rem;
}

.prose :deep(a) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose :deep(code) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85em;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1px 6px;
}

.prose :deep(pre) {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  overflow-x: auto;
  margin-bottom: 1.25rem;
}

.prose :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.875rem;
}

.prose :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}
</style>
```

- [ ] **Step 2: Verify in browser**

With the dev server running, open `http://localhost:5173/#/writing` and click any post title.

Check:
- "← Writing" back link at the top
- Post title, date, category, tags in the header
- Markdown body renders correctly (headings, paragraphs, code blocks styled)
- Navigating to an invalid slug (e.g. `#/writing/not-real`) shows "Post not found."

- [ ] **Step 3: Commit**

```bash
git add src/views/PostView.vue
git commit -m "feat: add post detail page with markdown rendering"
```

---

### Task 6: Add Writing link to NavBar

**Files:**
- Modify: `src/components/NavBar.vue`

- [ ] **Step 1: Add RouterLink import and Writing nav item**

In `src/components/NavBar.vue`, add "Writing" as the first list item using `RouterLink`. The existing scroll links stay as `<a>` tags.

Replace the `<ul class="navbar-links">` block:

```html
<ul class="navbar-links" :class="{ open: menuOpen }">
  <li>
    <RouterLink to="/writing" @click="menuOpen = false">Writing</RouterLink>
  </li>
  <li><a href="#" @click.prevent="scrollTo('about')">About</a></li>
  <li><a href="#" @click.prevent="scrollTo('experience')">Experience</a></li>
  <li><a href="#" @click.prevent="scrollTo('projects')">Projects</a></li>
  <li><a href="#" @click.prevent="scrollTo('skills')">Skills</a></li>
  <li><a href="#" @click.prevent="scrollTo('contact')">Contact</a></li>
</ul>
```

Then add active-link styling inside `<style scoped>`:

```css
.navbar-links :deep(.router-link-active) {
  color: var(--color-text-primary);
}
```

- [ ] **Step 2: Verify in browser**

Check:
- "Writing" appears as first item in the navbar
- Clicking it navigates to the Writing listing page
- The Writing link is visually highlighted (primary text color) when on `/writing` or any post page
- Other nav links still scroll correctly when on the home page

- [ ] **Step 3: Commit**

```bash
git add src/components/NavBar.vue
git commit -m "feat: add Writing link to navbar"
```
