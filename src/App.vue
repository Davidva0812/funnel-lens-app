<template>
  <div class="min-h-screen flex flex-col bg-brand-dark font-display">
    <header class="flex-shrink-0 h-14 border-b border-brand-border flex items-center px-6 gap-4 bg-brand-panel justify-between sm:justify-start">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M3 9h13M3 14h8M3 19h5" />
          </svg>
        </div>
        <span class="text-sm font-semibold text-brand-text tracking-tight">FunnelLens</span>
      </div>
      <div class="hidden sm:block w-px h-5 bg-brand-border" />
      <span class="hidden sm:inline text-xs text-brand-muted">Campaign Funnel Analytics</span>

      <div class="ml-auto flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span class="text-xs text-brand-muted font-mono">{{ campaigns.length }} campaigns</span>
      </div>
    </header>

    <div class="flex-1 flex flex-col md:flex-row min-h-0 overflow-x-hidden">
      <div class="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-brand-border bg-brand-panel">
        <CampaignList
          :campaigns="campaigns"
          :selected-id="selectedId"
          @select="selectedId = $event"
        />
      </div>

      <main class="flex-1 overflow-y-auto bg-brand-dark">
        <FunnelDetail :campaign="selectedCampaign" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import campaignData from './data/campaigns.json'
import CampaignList from './components/CampaignList.vue'
import FunnelDetail from './components/FunnelDetail.vue'

const campaigns = campaignData.campaigns
const selectedId = ref(campaigns[0]?.id ?? null)

const selectedCampaign = computed(() =>
  campaigns.find(c => c.id === selectedId.value) ?? null
)
</script>