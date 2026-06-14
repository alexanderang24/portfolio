<script setup>
</script>
<template>
  <section id="about">
    <div class="container">
      <h2 class="section-heading">About</h2>
      <div class="about-body" v-appear>
        <p>
          I'm a <span class="highlight">Software Engineer</span> based in Jakarta, Indonesia, with over <span class="highlight">7 years</span> of professional
          experience in enterprise backend development — primarily in the <span class="highlight">Financial Services</span> and
          <span class="highlight">Payment Gateway</span> sectors.
        </p>
        <p>
          At DOKU, I architect and maintain high-throughput payment systems built on <span class="highlight">Java and
          Spring Boot</span> — focusing on transaction reliability, data integrity, and scalable merchant
          workflows.
        </p>
        <p>
          Outside of work, I've been expanding into frontend development with Vue.js, exploring
          AI-assisted programming workflows, and studying distributed systems patterns.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.about-body p {
  color: var(--color-text-secondary);
  max-width: 620px;
}

.highlight {
  color: var(--color-accent);
}

.education {
  color: var(--color-text-muted) !important;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
