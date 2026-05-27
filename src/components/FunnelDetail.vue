<template>
  <div class="flex flex-col h-full">
    <div v-if="!campaign" class="flex-1 flex flex-col items-center justify-center text-center p-10">
      <div class="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M7 9h10M10 14h4M12 19h0" />
        </svg>
      </div>
      <p class="text-brand-sub font-medium">Select a campaign</p>
      <p class="text-brand-muted text-sm mt-1">Choose one from the left panel to see its funnel breakdown</p>
    </div>

    <template v-else>
      <div class="px-4 sm:px-8 pt-7 pb-5 border-b border-brand-border flex-shrink-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <DeviceIcon :device="campaign.device" />
              <span class="text-xs font-mono text-brand-muted uppercase tracking-wider">{{ campaign.device }}</span>
            </div>
            <h2 class="text-lg sm:text-xl font-semibold text-brand-text">{{ campaign.name }}</h2>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-2xl sm:text-3xl font-mono font-bold" :class="kpiColor">{{ overallRate }}%</p>
            <p class="text-[10px] sm:text-xs text-brand-muted mt-0.5">overall conversion</p>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
          <div>
            <p class="text-xl sm:text-2xl font-mono font-semibold text-brand-text">{{ firstViews.toLocaleString() }}</p>
            <p class="text-xs text-brand-muted mt-0.5">total visitors</p>
          </div>
          <div class="hidden sm:block w-px h-8 bg-brand-border" />
          <div>
            <p class="text-xl sm:text-2xl font-mono font-semibold text-brand-text">{{ lastProceeds.toLocaleString() }}</p>
            <p class="text-xs text-brand-muted mt-0.5">completions</p>
          </div>
          <div class="hidden sm:block w-px h-8 bg-brand-border" />
          <div>
            <p class="text-xl sm:text-2xl font-mono font-semibold text-red-400">{{ worstDropOff }}%</p>
            <p class="text-xs text-brand-muted mt-0.5">worst drop-off</p>
          </div>
          <div class="hidden sm:block w-px h-8 bg-brand-border" />
          <div>
            <p class="text-xl sm:text-2xl font-mono font-semibold text-brand-text">{{ enriched.length }}</p>
            <p class="text-xs text-brand-muted mt-0.5">steps</p>
          </div>
        </div>
      </div>

      <div v-if="worst" class="mx-4 sm:mx-8 mt-5 flex-shrink-0">
        <div class="flex items-start sm:items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
          <svg class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p class="text-xs sm:text-sm text-red-300 leading-relaxed">
            <span class="font-semibold">Biggest drop-off:</span>
            Step {{ worst.stepIndex + 1 }} – {{ worst.name }}
            <span class="block sm:inline font-mono text-red-400 sm:ml-1">({{ worst.dropOffRate }}% dropped, {{ worst.droppedAbsolute.toLocaleString() }} users lost)</span>
          </p>
        </div>
      </div>

      <div class="px-4 sm:px-8 pt-6 pb-2 flex-shrink-0">
        <h3 class="text-xs font-mono text-brand-muted uppercase tracking-widest mb-4">Step-by-step funnel</h3>
        <div class="space-y-3">
          <div v-for="(step, index) in enriched" :key="step.id" class="step-card relative">
            <div
              class="rounded-2xl border p-4 sm:p-5 relative overflow-hidden"
              :class="[worst && step.id === worst.id ? 'bg-red-500/8 border-red-500/35' : 'bg-brand-card border-brand-border']"
            >
              <div
                class="absolute left-0 top-0 bottom-0 rounded-2xl opacity-10 funnel-bar"
                :style="{ width: step.barWidth + '%' }"
                :class="worst && step.id === worst.id ? 'bg-red-500' : 'bg-brand-orange'"
              />

              <div class="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div class="flex items-start gap-3">
                  <div
                    class="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-mono font-semibold flex-shrink-0"
                    :class="worst && step.id === worst.id ? 'bg-red-500/20 text-red-400' : 'bg-brand-orange/15 text-brand-orange'"
                  >
                    {{ index + 1 }}
                  </div>

                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-sm font-medium text-brand-text">{{ step.name }}</p>
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full border" :class="getTypeBadgeClass(step.type)">
                        {{ step.type }}
                      </span>
                      <span v-if="worst && step.id === worst.id" class="text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                        ⚠ bottleneck
                      </span>
                    </div>
                    <p class="text-xs text-brand-muted mt-1 leading-normal">{{ step.description }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-3 sm:flex items-center gap-4 sm:gap-6 border-t border-brand-border/40 sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0 text-left sm:text-right">
                  <div>
                    <p class="text-sm sm:text-base font-mono font-semibold text-brand-text">{{ step.views.toLocaleString() }}</p>
                    <p class="text-[10px] sm:text-xs text-brand-muted">visitors</p>
                  </div>
                  <div>
                    <p class="text-sm sm:text-base font-mono font-semibold" :class="step.convRate >= 50 ? 'text-emerald-400' : step.convRate >= 25 ? 'text-amber-400' : 'text-red-400'">
                      {{ step.convRate }}%
                    </p>
                    <p class="text-[10px] sm:text-xs text-brand-muted">proceed</p>
                  </div>
                  <div v-if="!step.isLast" class="w-auto sm:w-20">
                    <p class="text-sm sm:text-base font-mono font-semibold text-red-400">-{{ step.droppedAbsolute.toLocaleString() }}</p>
                    <p class="text-[10px] sm:text-xs text-brand-muted">{{ step.dropOffRate }}% lost</p>
                  </div>
                  <div v-else class="w-auto sm:w-20">
                    <p class="text-sm sm:text-base font-mono font-semibold text-emerald-400">{{ step.proceeds.toLocaleString() }}</p>
                    <p class="text-[10px] sm:text-xs text-brand-muted">completed</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!step.isLast" class="flex items-center gap-3 px-6 py-1.5">
              <div class="w-8 flex justify-center">
                <div class="w-px h-4 bg-brand-border" />
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-3 h-3 text-brand-border" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs text-brand-muted font-mono">
                  {{ step.proceeds.toLocaleString() }} continue
                  <span class="text-brand-muted/60 ml-1">({{ step.convRate }}%)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 sm:px-8 pt-4 pb-8 flex-shrink-0">
        <InsightCard :insights="insights" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { enrichSteps, worstStep, overallConversionRate, generateInsights } from '../utils/analytics.js'
import InsightCard from './InsightCard.vue'
import DeviceIcon from './DeviceIcon.vue'

const props = defineProps({
  campaign: { type: Object, default: null }
})

const enriched = computed(() =>
  props.campaign ? enrichSteps(props.campaign.steps) : []
)

const worst = computed(() => worstStep(enriched.value))

const overallRate = computed(() => {
  if (!props.campaign) return 0
  return Math.round(overallConversionRate(props.campaign.steps) * 10) / 10
})

const firstViews = computed(() => enriched.value[0]?.views ?? 0)
const lastProceeds = computed(() => {
  const last = enriched.value[enriched.value.length - 1]
  return last?.proceeds ?? 0
})

const worstDropOff = computed(() => worst.value?.dropOffRate ?? 0)

const kpiColor = computed(() => {
  const r = overallRate.value
  if (r >= 10) return 'text-emerald-400'
  if (r >= 5) return 'text-amber-400'
  return 'text-red-400'
})

const insights = computed(() => generateInsights(enriched.value, worst.value))

function getTypeBadgeClass(type) {
  const map = {
    teaser: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
    email: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    coupon: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    'exit-intent': 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  }
  return map[type] ?? 'bg-brand-border/40 text-brand-muted border-brand-border'
}
</script>
