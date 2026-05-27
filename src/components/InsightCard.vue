<template>
  <div class="bg-brand-card border border-brand-border rounded-2xl p-5">
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-brand-text">Insights & Recommendations</h3>
    </div>

    <ul class="space-y-3">
      <li
        v-for="(insight, i) in insights"
        :key="i"
        class="flex items-start gap-3 text-sm text-brand-sub leading-relaxed"
      >
        <span class="flex-shrink-0 w-5 h-5 rounded-full bg-brand-border/60 text-brand-muted text-xs font-mono flex items-center justify-center mt-0.5">
          {{ i + 1 }}
        </span>
        <span>{{ insight }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  insights: { type: Array, required: true }
})
</script>
