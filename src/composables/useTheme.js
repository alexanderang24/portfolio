import { ref } from 'vue'

const isDark = ref(true)

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

export function useTheme() {
  function initTheme() {
    const saved = localStorage.getItem('theme')
    isDark.value = saved ? saved === 'dark' : true
    applyTheme()
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return { isDark, initTheme, toggleTheme }
}
