<template>
  <section id="contact">
    <div class="container">
      <h2 class="section-heading">Get in touch</h2>
      <p class="contact-intro">
        I'm open to senior backend roles, architecture consulting, and interesting engineering
        conversations.
      </p>
      <div class="contact-links" v-appear>
        <a href="mailto:alexanderang.24@gmail.com">→ alexanderang.24@gmail.com</a>
        <a href="https://linkedin.com/in/alexanderang24" target="_blank" rel="noopener">→ linkedin.com/in/alexanderang24</a>
        <a href="https://github.com/alexanderang24" target="_blank" rel="noopener">→ github.com/alexanderang24</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-intro {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  max-width: 480px;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-links a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.95rem;
  transition: opacity var(--transition-base);
}

.contact-links a:hover {
  text-decoration: underline;
  opacity: 0.8;
}
</style>
