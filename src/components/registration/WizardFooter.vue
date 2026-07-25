<template>
  <footer class="wizard-footer flex-none h-[86px] bg-surface-l0">
    <div class="wizard-footer__inner flex items-center justify-end h-full mx-auto max-w-[1580px]">
      <q-btn
        unelevated
        no-caps
        class="next-button h-[53px] px-[26px] rounded-xl text-lg font-bold text-inverse bg-accent-emphasis-rest"
        label="Next: Session Selection"
      />
    </div>
  </footer>
</template>

<style scoped>
.next-button:hover {
  background: var(--bg-accent-emphasis-hover);
}

@media (max-width: 1700px) {
  .wizard-footer__inner {
    margin-left: 10vw;
    margin-right: 10vw;
  }
}

@media (max-width: 1023px) {
  .wizard-footer__inner {
    margin-left: 24px;
    margin-right: 24px;
  }
}

@media (max-width: 640px) {
  .wizard-footer__inner {
    justify-content: stretch;
    margin-left: 16px;
    margin-right: 16px;
  }

  .next-button {
    width: 100%;
  }
}
</style>
