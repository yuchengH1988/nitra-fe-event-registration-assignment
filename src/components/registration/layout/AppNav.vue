<script setup>
import emblemUrl from 'src/assets/icons/Emblems.svg'

defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <header class="flex-none border-b border-solid border-[color:var(--divider-default)]">
    <div class="flex items-center gap-3 py-2 tablet:py-4 mx-auto max-w-[1800px] px-12 max-desktop:px-4">
      <div
        class="flex items-center justify-center size-10 max-desktop:size-8 rounded bg-brand-emphasis-rest"
        aria-hidden="true"
      >
        <img class="block h-auto w-7 max-desktop:w-5" :src="emblemUrl" alt="">
      </div>
      <h4 class="text-h4">
        {{ title }}
      </h4>
    </div>
  </header>
</template>
