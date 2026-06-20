<template>
  <section class="hero">
    <div class="container hero-content">
      <div class="availability">
        <span class="dot" />
        Available for new roles
      </div>
      <p class="eyebrow"><span class="highlight">Software Engineer</span> · 7+ Years</p>
      <h1 class="hero-heading">Crafting reliable APIs for the payments industry.</h1>
      <p class="hero-sub">
        Hi, I'm Alexander. I specialise in enterprise backend development using Java (Spring Boot)
        and high-throughput payment architectures.
      </p>
      <div class="stats">
        <div class="stat">
          <span class="stat-number">7+</span>
          <span class="stat-label">Years Experience in Payment Tech</span>
        </div>
        <div class="stat">
          <span class="stat-number">3</span>
          <span class="stat-label">Tech Stacks</span>
        </div>
      </div>
      <div class="hero-links">
        <a href="#" @click.prevent="scrollTo('skills')">Check my skills ↓</a>
        <a href="#" @click.prevent="scrollTo('contact')">Get in touch ↓</a>
        <RouterLink to="/projects">Check my projects →</RouterLink>
        <RouterLink to="/writing">Check my writings →</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  border-top: none;
}

.hero-content {
  padding-top: 56px;
}

.availability {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
  padding: 5px 12px 5px 10px;
  border-radius: 999px;
  background: var(--color-surface);
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  flex-shrink: 0;
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

.eyebrow {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
}

.highlight {
  color: var(--color-accent);
}

.hero-heading {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 3.8rem);
  line-height: 1.15;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  max-width: 640px;
}

.hero-sub {
  font-size: 1.05rem;
  color: var(--color-text-secondary);
  max-width: 520px;
  margin-bottom: 3rem;
}

.stats {
  display: flex;
  gap: 3rem;
  margin-bottom: 2.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-accent);
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.hero-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-links a {
  font-size: 0.925rem;
  color: var(--color-accent);
  text-decoration: none;
  transition: opacity var(--transition-base);
}

.hero-links a:hover {
  opacity: 0.75;
}

@media (max-width: 640px) {
  .stats {
    gap: 2rem;
    flex-wrap: wrap;
  }

  .hero-links {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
