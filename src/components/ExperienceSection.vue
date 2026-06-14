<template>
  <section id="experience">
    <div class="container">
      <h2 class="section-heading">Experience</h2>
      <div class="experience-list" v-appear>
        <div
          v-for="job in experience"
          :key="job.id"
          class="experience-entry"
        >
          <div class="entry-header">
            <span class="company">{{ job.company }}</span>
            <span class="period">{{ job.period }}</span>
          </div>
          <p class="role">{{ job.role }}</p>
          <ul class="bullets">
            <li v-for="(bullet, i) in job.bullets" :key="i">{{ bullet }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { experience } from '../data/experience.js'
</script>

<style scoped>
.experience-list {
  display: flex;
  flex-direction: column;
}

.experience-entry {
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
}

.experience-entry:first-child {
  border-top: none;
  padding-top: 0;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.company {
  font-weight: 600;
  color: var(--color-text-primary);
}

.period {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.role {
  font-size: 0.9rem;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-left: 1rem;
  border-left: 2px solid var(--color-accent-dim);
}

.bullets li {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

@media (max-width: 480px) {
  .entry-header {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
