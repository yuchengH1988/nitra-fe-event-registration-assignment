<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SessionCard from '../common/SessionCard.vue'
import SessionDateTabs from '../common/SessionDateTabs.vue'
import { doTimeRangesOverlap } from 'src/utils/schedule.js'

const selectedSessionIds = defineModel('selectedSessionIds', {
  type: Array,
  required: true,
})

const props = defineProps({
  groupedSessions: {
    type: Array,
    required: true,
  },
})

const { t } = useI18n()
const activeDate = ref(props.groupedSessions[0]?.date ?? '')

const activeGroup = computed(() =>
  props.groupedSessions.find((group) => group.date === activeDate.value) ??
  props.groupedSessions[0],
)

const allSessions = computed(() =>
  props.groupedSessions.flatMap((group) => group.sessions),
)

const selectedSessions = computed(() =>
  allSessions.value.filter((session) => selectedSessionIds.value.includes(session.id)),
)

watch(
  () => props.groupedSessions,
  (groups) => {
    if (!groups.some((group) => group.date === activeDate.value)) {
      activeDate.value = groups[0]?.date ?? ''
    }
  },
)

function toggleSession(sessionId) {
  if (selectedSessionIds.value.includes(sessionId)) {
    selectedSessionIds.value = selectedSessionIds.value.filter((id) => id !== sessionId)
    return
  }

  selectedSessionIds.value = [...selectedSessionIds.value, sessionId]
}

function isUnavailableByTimeConflict(session) {
  if (selectedSessionIds.value.includes(session.id)) return false

  return selectedSessions.value.some((selectedSession) =>
    doTimeRangesOverlap(selectedSession, session),
  )
}
</script>

<template>
  <section aria-labelledby="sessions-heading" class="space-y-4 tablet:space-y-6">
    <h3 id="sessions-heading" class="text-h3 text-neutral">
      {{ t('headings.selectSessions') }}
    </h3>

    <SessionDateTabs
      :groups="groupedSessions"
      :active-date="activeDate"
      @select="activeDate = $event"
    />

    <p class="text-sm-b text-brand-emphasis">
      {{ t('common.sessionsSelected', { count: selectedSessionIds.length }) }}
    </p>

    <div class="grid grid-cols-2 gap-2 tablet:gap-4 max-desktop:grid-cols-1">
      <SessionCard
        v-for="session in activeGroup?.sessions"
        :key="session.id"
        :session="session"
        :selected="selectedSessionIds.includes(session.id)"
        :unavailable="isUnavailableByTimeConflict(session)"
        @toggle="toggleSession(session.id)"
      />
    </div>
  </section>
</template>
