<template>
  <Transition name="fade-up">
    <button v-if="visible" class="scroll-top" @click="scrollToTop" aria-label="Scroll to top">
      <ArrowUp :size="18" />
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@lucide/vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--transition-base), color var(--transition-base), transform var(--transition-base);
}

.scroll-top:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
  transform: translateY(-2px);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
