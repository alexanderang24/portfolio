<template>
  <div class="project-card">
    <div class="card-top">
      <h3 class="card-title">{{ project.title }}</h3>
      <div class="card-links">
        <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener" aria-label="GitHub">
          <Code2 :size="18" />
        </a>
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener"
          aria-label="Live site"
        >
          <ExternalLink :size="18" />
        </a>
      </div>
    </div>
    <p class="card-description">{{ project.description }}</p>
    <div class="card-chips">
      <span v-for="tag in project.tech" :key="tag" class="chip">{{ tag }}</span>
    </div>
  </div>
</template>

<script setup>
import { Code2, ExternalLink } from '@lucide/vue'

defineProps({
  project: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.project-card {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.project-card:first-child {
  border-top: none;
  padding-top: 0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-text-primary);
}

.card-links {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.card-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color var(--transition-base);
}

.card-links a:hover {
  color: var(--color-text-primary);
}

.card-description {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  max-width: 600px;
}

.card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  font-size: 0.75rem;
  padding: 3px 10px;
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  color: var(--color-accent);
  background: var(--color-accent-dim);
}
</style>
