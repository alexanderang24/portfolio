# Light/Dark Theme Toggle — Design Spec

**Date:** 2026-06-09
**Status:** Approved

## Overview

Add a light/dark theme toggle to the portfolio site. The dark theme (current) is kept as-is and as the default. A new warm off-white light theme is added, inspired by hanafifirman.dev. The user's preference persists via `localStorage` and is applied before first render to avoid flash.

## Architecture

### CSS Layer

All color tokens live in `src/assets/styles/main.css` as CSS custom properties. The light theme is defined as an override block on `[data-theme="light"]` applied to `<html>`. No component-level changes to color references are needed — they all read from the same variables.

**Light theme palette:**

| Variable | Value |
|---|---|
| `--color-bg` | `#f9f7f4` |
| `--color-surface` | `#f0ede8` |
| `--color-border` | `#e0dbd4` |
| `--color-text-primary` | `#1a1a20` |
| `--color-text-secondary` | `#5a5a66` |
| `--color-text-muted` | `#9a9aa8` |
| `--color-accent` | `#4a56d6` |
| `--color-accent-dim` | `rgba(74, 86, 214, 0.10)` |

A `color-scheme` property is also set per theme (`dark` / `light`) so browser chrome (scrollbars, inputs) follows the active theme.

### Composable: `src/composables/useTheme.js`

Singleton composable using Vue's `ref` at module scope so state is shared across components.

- `isDark`: reactive boolean, default `true`
- `initTheme()`: reads `localStorage.getItem('theme')`, sets `isDark` accordingly, applies `data-theme` attribute to `<html>`
- `toggleTheme()`: flips `isDark`, writes to `localStorage`, updates `data-theme`

### App.vue

Calls `initTheme()` inside `onMounted` to restore the saved preference before the first paint.

### NavBar.vue

Imports `useTheme`. Adds a `<button>` at the far right of `.navbar-inner`. Renders Lucide `Moon` icon when dark (click → switch to light), `Sun` icon when light (click → switch to dark). Styled to match the existing nav icon aesthetic (muted color, hover brightens).

## Data Flow

```
localStorage ('theme') 
    → initTheme() on mount 
    → data-theme on <html> 
    → CSS variables cascade to all components
```

Toggle click → `toggleTheme()` → localStorage + `data-theme` update → CSS re-cascades instantly.

## Files Changed

| File | Change |
|---|---|
| `src/assets/styles/main.css` | Add `[data-theme="light"]` variable block |
| `src/composables/useTheme.js` | New file — theme state + init/toggle logic |
| `src/App.vue` | Call `initTheme()` on mount |
| `src/components/NavBar.vue` | Add toggle button with Sun/Moon icon |

## Out of Scope

- System preference (`prefers-color-scheme`) auto-detection — dark is always the explicit default
- Per-section or per-component theme overrides
- Theme-specific images or illustrations
