<template>
  <aside class="flex flex-col h-full bg-brand-panel border-r border-brand-border">
    <!-- Header -->
    <div class="px-5 py-5 border-b border-brand-border flex-shrink-0">
      <div class="flex items-center gap-2.5 mb-1">
        <div class="w-7 h-7 rounded-lg bg-brand-orange/20 flex items-center justify-center">
          <svg class="w-4 h-4 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M3 9h13M3 14h8M3 19h5" />
          </svg>
        </div>
        <span class="text-xs font-mono text-brand-orange uppercase tracking-widest">Campaigns</span>
      </div>
      <p class="text-brand-sub text-xs mt-2">{{ campaigns.length }} active campaigns</p>
    </div>

    <!-- List -->
    <nav class="flex-1 overflow-y-auto py-3 px-3 space-y-1">
      <button
        v-for="campaign in enrichedCampaigns"
        :key="campaign.id"
        class="campaign-item w-full text-left rounded-xl px-4 py-3.5 group relative overflow-hidden"
        :class="[
          selectedId === campaign.id
            ? 'bg-brand-card border border-brand-orange/40 shadow-lg shadow-brand-orange/5'
            : 'border border-transparent hover:bg-brand-card/60 hover:border-brand-border'
        ]"
        @click="$emit('select', campaign.id)"
      >
        <!-- Active indicator line -->
        <div
          v-if="selectedId === campaign.id"
          class="absolute left-0 top-3 bottom-3 w-0.5 bg-brand-orange rounded-full"
        />

        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <p
              class="text-sm font-medium truncate leading-snug"
              :class="selectedId === campaign.id ? 'text-brand-text' : 'text-brand-sub group-hover:text-brand-text'"
            >
              {{ campaign.name }}
            </p>
            <div class="flex items-center gap-2 mt-1.5">
              <DeviceIcon :device="campaign.device" />
              <span class="text-xs text-brand-muted capitalize">{{ campaign.device }}</span>
              <span class="text-brand-border">·</span>
              <span class="text-xs text-brand-muted">{{ campaign.steps.length }} steps</span>
            </div>
          </div>
          <!-- Conversion badge -->
          <div class="flex-shrink-0 text-right">
            <span
              class="text-sm font-mono font-medium"
              :class="campaign.overallRate >= 10 ? 'text-emerald-400' : campaign.overallRate >= 5 ? 'text-amber-400' : 'text-red-400'"
            >
              {{ campaign.overallRate }}%
            </span>
            <p class="text-xs text-brand-muted mt-0.5">overall</p>
          </div>
        </div>

        <!-- Mini funnel bar -->
        <div class="mt-3 flex items-center gap-1">
          <div
            v-for="(step, i) in campaign.steps"
            :key="step.id"
            class="h-1 rounded-full flex-1"
            :class="getMiniBarColor(campaign, i)"
          />
        </div>
      </button>
    </nav>

    <!-- Footer hint -->
    <div class="px-5 py-4 border-t border-brand-border flex-shrink-0">
      <p class="text-xs text-brand-muted text-center">Click a campaign to explore its funnel</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { overallConversionRate, enrichSteps, worstStep } from '../utils/analytics.js'
import DeviceIcon from './DeviceIcon.vue'

const props = defineProps({
  campaigns: { type: Array, required: true },
  selectedId: { type: String, default: null },
})

defineEmits(['select'])

const enrichedCampaigns = computed(() =>
  props.campaigns.map(c => ({
    ...c,
    overallRate: Math.round(overallConversionRate(c.steps) * 10) / 10,
    enriched: enrichSteps(c.steps),
  }))
)

function getMiniBarColor(campaign, stepIndex) {
  const enriched = campaign.enriched
  const worst = worstStep(enriched)
  if (worst && enriched[stepIndex]?.id === worst.id) return 'bg-red-500'
  return 'bg-brand-border'
}
</script>
