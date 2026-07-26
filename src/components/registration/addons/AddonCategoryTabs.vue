<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
</script>

<template>
  <div class="inline-flex rounded bg-surface-l2 p-1" role="tablist" aria-label="Add-on categories">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="min-w-[128px] rounded-m px-4 py-2 text-sm-b transition-colors"
      :class="tab.id === activeTab
        ? 'bg-brand-emphasis-rest text-inverse'
        : 'text-neutral-muted hover:bg-neutral-muted-hover'"
      :aria-selected="tab.id === activeTab"
      role="tab"
      @click="$emit('select', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
