<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <a class="navbar-logo" href="#" @click.prevent="scrollToTop">Alexander Ang</a>
      <ul class="navbar-links" :class="{ open: menuOpen }">
        <li><RouterLink to="/projects" @click="menuOpen = false">Projects</RouterLink></li>
        <li><RouterLink to="/writing" @click="menuOpen = false">Writing</RouterLink></li>
        <li><a href="#" @click.prevent="scrollTo('experience')" :class="{ active: onHome && activeId === 'experience' }">Experience</a></li>
        <li><a href="#" @click.prevent="scrollTo('skills')" :class="{ active: onHome && activeId === 'skills' }">Skills</a></li>
        <li><a href="#" @click.prevent="scrollTo('contact')" :class="{ active: onHome && activeId === 'contact' }">Contact</a></li>
      </ul>
      <div class="nav-right">
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
          :class="{ 'is-light': !isDark }"
        >
          <Moon :size="14" class="toggle-icon" />
          <span class="toggle-track">
            <span class="toggle-thumb" />
          </span>
          <Sun :size="14" class="toggle-icon" />
        </button>
        <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Moon, Sun } from '@lucide/vue'
import { useTheme } from '../composables/useTheme.js'
import { useActiveSection } from '../composables/useActiveSection.js'

const menuOpen = ref(false)
const { isDark, toggleTheme } = useTheme()
const route = useRoute()
const router = useRouter()
const { activeId } = useActiveSection()
const onHome = computed(() => route.path === '/')

async function scrollTo(id) {
  menuOpen.value = false
  if (route.path !== '/') {
    await router.push('/')
    await nextTick()
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 250)
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

async function scrollToTop() {
  menuOpen.value = false
  if (route.path !== '/') {
    await router.push('/')
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.navbar-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  text-decoration: none;
  cursor: pointer;
}

.navbar-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.navbar-links a {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-base);
}

.navbar-links a:hover {
  color: var(--color-text-primary);
}

.navbar-links a.active {
  color: var(--color-accent);
}

.navbar-links :deep(.router-link-active) {
  color: var(--color-text-primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Toggle switch */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: color 200ms ease;
}

.is-light .toggle-icon {
  color: var(--color-text-secondary);
}

.toggle-track {
  display: flex;
  align-items: center;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: var(--color-border);
  border: 1px solid var(--color-text-muted);
  padding: 2px;
  transition: background 200ms ease, border-color 200ms ease;
  position: relative;
}

.is-light .toggle-track {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.toggle-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-text-muted);
  transition: transform 200ms ease, background 200ms ease;
  flex-shrink: 0;
}

.is-light .toggle-thumb {
  transform: translateX(18px);
  background: #fff;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text-secondary);
  border-radius: 2px;
}

@media (max-width: 640px) {
  .hamburger {
    display: flex;
  }

  .navbar-links {
    display: none;
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .navbar-links.open {
    display: flex;
  }

  .navbar-links li a {
    display: block;
    padding: 14px 24px;
    border-top: 1px solid var(--color-border);
  }
}
</style>
