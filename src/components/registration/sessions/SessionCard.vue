<script setup>
import { computed } from 'vue'
import checkIconUrl from 'src/assets/icons/check.svg'
import { orange } from 'src/unocss/colors.js'
import {
  formatSessionTimeRange,
  getRemainingCapacity,
  isAtCapacity,
} from 'src/utils/registration-data.js'

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  unavailable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle'])

const adjustedRegistered = computed(() =>
  Number(props.session.registered) + (props.selected ? 1 : 0),
)

const remaining = computed(() =>
  Math.max(getRemainingCapacity(props.session) - (props.selected ? 1 : 0), 0),
)

const full = computed(() => isAtCapacity(props.session))
const disabled = computed(() => !props.selected && (full.value || props.unavailable))
const usedRatio = computed(() =>
  Math.min(adjustedRegistered.value / Number(props.session.capacity), 1),
)

const cardStyle = computed(() => {
  if (full.value) {
    return {
      '--session-progress': orange[600],
      '--session-availability': 'var(--text-neutral-default)',
    }
  }

  if (props.unavailable) {
    return {
      '--session-progress': 'var(--text-warning-default)',
      '--session-availability': 'var(--text-warning-default)',
    }
  }

  if (usedRatio.value > 0.5) {
    return {
      '--session-progress': orange[600],
      '--session-availability': orange[700],
    }
  }

  return {
    '--session-progress': 'var(--bg-brand-emphasis-rest)',
    '--session-availability': 'var(--text-brand-emphasis)',
  }
})

const trackClass = computed(() => ({
  main: 'session-card--main',
  frontend: 'session-card--frontend',
  'frontend-design': 'session-card--frontend-design',
  backend: 'session-card--backend',
  devops: 'session-card--devops',
})[props.session.track] ?? 'session-card--main')

const trackLabel = computed(() =>
  props.session.track === 'frontend-design' ? 'frontend' : props.session.track,
)
</script>

<template>
  <button
    type="button"
    class="session-card rounded bg-surface-l0 p-3 tablet:p-4 text-left transition-colors space-y-2"
    :class="[
      trackClass,
      selected ? 'session-card--selected bg-brand-subtle-rest' : '',
      disabled ? 'session-card--disabled' : '',
      full ? 'session-card--full' : '',
    ]"
    :style="cardStyle"
    :disabled="disabled"
    :aria-pressed="selected"
    @click="$emit('toggle')"
  >
    <span class="flex items-center justify-between">
      <span class="track-badge text-xs-b">
        {{ trackLabel }}
      </span>
      <span
        class="session-check inline-flex size-4 flex-none items-center justify-center rounded-[4px]"
        :class="[selected
          ? 'session-check--checked bg-brand-emphasis-rest'
          : 'bg-surface-l0',
          disabled && 'hidden']"
        aria-hidden="true"
      >
        <img
          v-if="selected"
          class="block w-2.5 h-[7px]"
          :src="checkIconUrl"
          alt=""
        >
      </span>
    </span>

    <span class="session-title block text-subtitle1">
      {{ session.title }}
    </span>

    <span class="session-speaker block text-sm">
      {{ session.speaker }}, {{ session.speakerTitle }}
    </span>

    <span class="session-time block text-xs">
      {{ formatSessionTimeRange(session) }}
    </span>

    <span class="capacity-bar block h-1.5 rounded-full">
      <span
        class="capacity-bar__fill block h-full rounded-full"
        :style="{ width: `${usedRatio * 100}%` }"
      />
    </span>

    <span
      class="block text-xs-b availability-text"
      :class="{ 'availability-text--sold-out': full }"
    >
      {{ full ? 'Sold Out' : `${remaining} spots left` }}
    </span>
  </button>
</template>

<style scoped>
.session-card {
  --session-accent: var(--bg-brand-emphasis-rest);
  --session-availability: var(--text-brand-emphasis);
  --session-badge-bg: var(--bg-brand-subtle-rest);
  --session-badge-text: var(--text-brand-emphasis);
  --session-card-bg: var(--bg-surface-l0);
  --session-check-border: var(--border-neutral-muted);
  --session-progress: var(--bg-brand-emphasis-rest);
  --session-progress-track: var(--bg-surface-l2);
  --session-speaker-text: var(--text-neutral-muted);
  --session-time-text: var(--text-neutral-quiet);
  --session-title-text: var(--text-neutral);

  background: var(--session-card-bg);
  border: 2px solid transparent;
  box-shadow:
    0 1px 3px 0 #0000000a,
    0 4px 16px 0 #00000014,
    0 0 0 1px var(--border-neutral-muted);
}

.session-card:hover:not(:disabled),
.session-card:focus-visible:not(:disabled) {
  border-color: var(--border-brand-muted);
  outline: none;
}

.session-card--selected,
.session-card--selected:hover:not(:disabled),
.session-card--selected:focus-visible:not(:disabled) {
  border-color: var(--border-brand-emphasis);
  background: var(--bg-brand-muted-rest);
  box-shadow:
    0 1px 3px 0 #0000000a,
    0 4px 16px 0 #00000014;
}

.session-card--disabled {
  --session-card-bg: var(--bg-disable);
  --session-check-border: transparent;
  --session-progress: var(--text-warning-default);
  --session-progress-track: var(--bg-surface-l3);
  --session-speaker-text: var(--text-neutral-disabled);
  --session-time-text: var(--text-neutral-disabled);
  --session-title-text: var(--text-neutral-disabled);

  /* Quasar sets [disabled] { opacity: .6 !important } — undo wash-out */
  cursor: not-allowed;
  opacity: 1 !important;
}

/* Must come after --disabled so Sold Out keeps danger colors */
.session-card--full,
.session-card--full.session-card--disabled {
  --session-progress: var(--bg-danger-emphasis-rest);
  --session-availability: var(--text-neutral-default);
}

.track-badge {
  background: var(--session-badge-bg);
  border-radius: 999px;
  color: var(--session-badge-text);
  display: inline-flex;
  padding: 4px 12px;
  text-transform: uppercase;
}

.session-check {
  box-shadow: inset 0 0 0 1px var(--session-check-border);
}

.session-check--checked {
  box-shadow: none;
}

.capacity-bar__fill {
  background: var(--session-progress);
}

.capacity-bar {
  background: var(--session-progress-track);
}

.availability-text {
  color: var(--session-availability);
}

.availability-text--sold-out {
  color: var(--text-neutral-default);
}

.session-title {
  color: var(--session-title-text);
}

.session-speaker {
  color: var(--session-speaker-text);
}

.session-time {
  color: var(--session-time-text);
}

.session-card--main {
  --session-badge-bg: var(--bg-neutral-muted-rest);
  --session-badge-text: var(--text-neutral-muted);
}

.session-card--frontend {
  --session-badge-bg: var(--bg-accent-subtle-rest);
  --session-badge-text: var(--text-accent-emphasis);
}

.session-card--frontend-design {
  --session-badge-bg: #FFF6B3; /* yellow-200 */
  --session-badge-text: #6A5F06; /* yellow-900 */
}

.session-card--backend {
  --session-badge-bg: var(--bg-info-subtle-rest);
  --session-badge-text: var(--text-info-emphasis);
}

.session-card--devops {
  --session-badge-bg: var(--bg-accent-subtle-rest);
  --session-badge-text: var(--text-accent-emphasis);
}

.session-card--disabled .track-badge {
  background: transparent;
  color: #5C6970; /* gray-700 */
}
</style>
