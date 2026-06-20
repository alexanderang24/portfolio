<template>
  <div class="projects-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Projects</h1>
        <p class="page-tagline">Things I've built — at work and on the side.</p>
      </div>

      <div class="section">
        <h2 class="section-label">Highlights</h2>
        <div class="highlights-list">
          <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
        </div>
      </div>

      <div v-for="cat in projectCategories" :key="cat.category" class="section">
        <h2 class="section-label">{{ cat.category }}</h2>
        <div class="category-grid">
          <a
            v-for="p in cat.projects"
            :key="p.name"
            :href="p.githubUrl"
            target="_blank"
            rel="noopener"
            class="project-link"
          >
            <span>{{ p.name }}</span>
            <Code2 :size="14" class="link-icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Code2 } from '@lucide/vue'
import { projects } from '../data/projects.js'
import { projectCategories } from '../data/projectCategories.js'
import ProjectCard from '../components/ProjectCard.vue'
</script>

<style scoped>
.projects-page {
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

.section {
  border-top: 1px solid var(--color-border);
  padding: 40px 0;
}

.section-label {
  font-size: 0.7rem;
  font-variant: small-caps;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
}

.highlights-list {
  margin-top: 1rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.5rem;
}

.project-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color var(--transition-base), border-color var(--transition-base);
}

.project-link:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-muted);
}

.link-icon {
  flex-shrink: 0;
  color: var(--color-text-secondary);
}
</style>
