<script setup>
</script>
<template>
  <section id="about">
    <div class="container">
      <h2 class="section-heading">About Me</h2>
      <div class="about-body" v-appear>
        <p>
          I'm a <span class="highlight">Software Engineer</span> based in Jakarta, Indonesia, with
          <span class="highlight">7+ years</span> of experience in enterprise backend development —
          specialising in <span class="highlight">financial services</span> and
          <span class="highlight">payment infrastructure</span>.
        </p>
        <p>
          At DOKU, I've built and maintained the systems behind <span class="highlight">KirimDOKU</span>
          (fund transfers across 9+ banks), <span class="highlight">Refund Service</span>, and
          <span class="highlight">QRIS merchant onboarding</span> — contributing to a platform that
          processes a total of <span class="highlight">360M+ transactions</span> and
          <span class="highlight">330T+ IDR</span> in volume, serving
          <span class="highlight">100+ merchants</span> and <span class="highlight">4M+ users</span>
          across 45+ payment methods.
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
