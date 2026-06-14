<script setup>
import './assets/styles/main.css'
import { onMounted, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import ScrollToTopButton from './components/ScrollToTopButton.vue'
import { useTheme } from './composables/useTheme.js'

const { isDark, initTheme } = useTheme()

let noiseUrl = null

function buildNoiseUrl() {
  if (noiseUrl) return noiseUrl
  const size = 200
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255)
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 14
  }
  ctx.putImageData(img, 0, 0)
  noiseUrl = canvas.toDataURL()
  return noiseUrl
}

function applyTexture() {
  if (!isDark.value) {
    const url = buildNoiseUrl()
    document.body.style.backgroundImage = `url(${url})`
    document.body.style.backgroundRepeat = 'repeat'
    document.body.style.backgroundSize = '200px 200px'
  } else {
    document.body.style.backgroundImage = ''
  }
}

onMounted(() => {
  initTheme()
  applyTexture()
})

watch(isDark, applyTexture)
</script>

<template>
  <NavBar />
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <ScrollToTopButton />
</template>
