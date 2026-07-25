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
  <header class="app-nav">
    <div class="app-nav__inner">
      <div class="brand-mark bg-brand-emphasis-rest" aria-hidden="true">
        <img :src="emblemUrl" alt="">
      </div>
      <h4 class="text-h4">
        {{ title }}
      </h4>
    </div>
  </header>
</template>

<style scoped>
.app-nav {
  border-bottom: 1px solid var(--divider-default);
  flex: 0 0 auto;
}

.app-nav__inner {
  align-items: center;
  display: flex;
  gap: 12px;
  height: 72px;
  margin: 0 auto;
  max-width: 1800px;
  padding: 0 48px;
}

.brand-mark {
  align-items: center;
  border-radius: 8px;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 40px;
}

.brand-mark img {
  display: block;
  height: auto;
  width: 28px;
}

@media (max-width: 1023px) {
  .app-nav__inner {
    padding: 0 16px;
  }

  .brand-mark {
    height: 32px;
    width: 32px;
  }
  .brand-mark img {
    width: 20px;
  }
}
</style>
