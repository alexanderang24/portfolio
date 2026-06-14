<template>
  <section id="skills">
    <div class="container">
      <h2 class="section-heading">Skills</h2>
      <div class="skills-list" v-appear>
        <div v-for="group in skills" :key="group.category" class="skill-group">
          <span class="category-label">{{ group.category }}</span>
          <p class="skill-items">{{ group.items.join(' · ') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { skills } from '../data/skills.js'
</script>

<style scoped>
.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-label {
  display: block;
  font-size: 0.7rem;
  font-variant: small-caps;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: 0.35rem;
}

.skill-items {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}
</style>
