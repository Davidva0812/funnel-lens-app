<template>
  <span class="inline-flex items-center">
    <!-- Desktop -->
    <svg v-if="device === 'desktop'" class="w-3 h-3 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
    <!-- Mobile -->
    <svg v-else class="w-3 h-3 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  device: { type: String, default: 'desktop' }
})
</script>
