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
          <div class="post-meta">{{ formatDate(post.date) }} · {{ post.category }} · {{ readingTime(post.content) }}</div>
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
import { readingTime } from '../utils/readingTime.js'

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
  color: var(--color-text-secondary);
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
  color: var(--color-text-secondary);
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
