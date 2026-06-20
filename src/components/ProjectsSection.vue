<template>
  <section id="projects">
    <div class="container">
      <h2 class="section-heading">Projects</h2>
      <div class="projects-list" v-appear>
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
      <RouterLink to="/projects" class="view-all">View all →</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { projects } from '../data/projects.js'
import ProjectCard from './ProjectCard.vue'
</script>

<style scoped>
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
