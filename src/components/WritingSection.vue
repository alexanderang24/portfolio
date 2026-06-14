<template>
  <section id="writing">
    <div class="container">
      <h2 class="section-heading">Writing</h2>

      <div class="posts-list" v-appear>
        <div v-for="(post, index) in latestPosts" :key="post.id"
          class="post-row"
          :class="{ 'post-row--faded': index === 1 }"
        >
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

      <RouterLink to="/writing" class="view-all">View all →</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts.js'
import { readingTime } from '../utils/readingTime.js'

const latestPosts = computed(() =>
  [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2)
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
.posts-list {
  display: flex;
  flex-direction: column;
}

.post-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-border);
}

.post-row:first-child {
  border-top: none;
  padding-top: 0;
}

.post-row--faded .post-description {
  max-height: calc(1.6em * 2);
  overflow: hidden;
  line-height: 1.6;
  -webkit-mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
}

.post-row--faded .post-tags {
  display: none;
}

.post-meta {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.post-title {
  font-size: 1.1rem;
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
  margin-top: 0.1rem;
}

.tag {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.view-all {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: opacity var(--transition-base);
}

.view-all:hover {
  opacity: 0.75;
}
</style>
