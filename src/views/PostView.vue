<template>
  <div class="post-page">
    <div class="container">
      <RouterLink to="/writing" class="back-link">← Writing</RouterLink>

      <template v-if="post">
        <div class="post-header">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            {{ formatDate(post.date) }} · {{ post.category }} · {{ postReadingTime }}
          </div>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </div>
        <div class="prose" v-html="renderedContent" />

        <div v-if="post.mediumUrl" class="medium-footer">
          <a :href="post.mediumUrl" target="_blank" rel="noopener noreferrer">
            Read the full article on Medium →
          </a>
        </div>
      </template>

      <div v-else class="not-found">
        <p>Post not found.</p>
        <RouterLink to="/writing" class="back-link">← Back to Writing</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watchEffect, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import DOMPurify from 'dompurify'
import { marked } from '../utils/markedWithHljs.js'
import { posts } from '../data/posts.js'
import { readingTime } from '../utils/readingTime.js'

const route = useRoute()

const post = computed(() => posts.find(p => p.slug === route.params.slug) ?? null)

const renderedContent = computed(() =>
  post.value ? DOMPurify.sanitize(marked(post.value.content)) : ''
)

const postReadingTime = computed(() =>
  post.value ? readingTime(post.value.content) : ''
)

watchEffect(() => {
  document.title = post.value
    ? `${post.value.title} — Alexander Ang`
    : 'Alexander Ang — Software Engineer'
})

onUnmounted(() => {
  document.title = 'Alexander Ang — Software Engineer'
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
  color: var(--color-text-secondary);
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

.medium-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.medium-footer a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.95rem;
  transition: opacity var(--transition-base);
}

.medium-footer a:hover {
  opacity: 0.75;
}

.not-found {
  padding: 64px 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--color-text-secondary);
}

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
  color: var(--color-code-text);
}

.prose :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  padding-left: 1.25rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}

/* Darcula syntax colors */
.prose :deep(.hljs-keyword),
.prose :deep(.hljs-selector-tag),
.prose :deep(.hljs-deletion) {
  color: #cc7832;
}

.prose :deep(.hljs-meta) {
  color: #bbb529;
}

.prose :deep(.hljs-string),
.prose :deep(.hljs-attribute),
.prose :deep(.hljs-addition) {
  color: rgb(98, 160, 107);
}

.prose :deep(.hljs-title),
.prose :deep(.hljs-section) {
  color: rgb(87, 167, 244);
}

.prose :deep(.hljs-type) {
  color: #ffc66d;
}

.prose :deep(.hljs-number),
.prose :deep(.hljs-literal),
.prose :deep(.hljs-symbol),
.prose :deep(.hljs-bullet) {
  color: #6897bb;
}

.prose :deep(.hljs-comment),
.prose :deep(.hljs-quote) {
  color: #808080;
  font-style: italic;
}

.prose :deep(.hljs-field) {
  color: rgb(200, 125, 187);
}

.prose :deep(.hljs-variable),
.prose :deep(.hljs-template-variable),
.prose :deep(.hljs-link) {
  color: #629755;
}

.prose :deep(.hljs-name),
.prose :deep(.hljs-selector-id),
.prose :deep(.hljs-selector-class) {
  color: #e8bf6a;
}
</style>
