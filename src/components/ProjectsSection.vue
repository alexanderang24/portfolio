<template>
  <section id="projects">
    <div class="container">
      <h2 class="section-heading">Projects</h2>
      <div class="projects-list" v-appear>
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { projects } from '../data/projects.js'
import ProjectCard from './ProjectCard.vue'
</script>
