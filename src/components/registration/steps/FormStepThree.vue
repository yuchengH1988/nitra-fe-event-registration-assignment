<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import infoIconUrl from 'src/assets/icons/circle-info.svg'
import AddonCategoryTabs from '../common/AddonCategoryTabs.vue'
import MealOptionCard from '../common/MealOptionCard.vue'
import MerchandiseOptionCard from '../common/MerchandiseOptionCard.vue'
import WorkshopOptionCard from '../common/WorkshopOptionCard.vue'
import OrderSummary from '../common/OrderSummary.vue'
import { doTimeRangesOverlap } from 'src/utils/schedule.js'

const selectedAddons = defineModel('selectedAddons', {
  type: Object,
  required: true,
})

const props = defineProps({
  workshops: {
    type: Array,
    required: true,
  },
  meals: {
    type: Array,
    required: true,
  },
  merchandise: {
    type: Array,
    required: true,
  },
  selectedSessions: {
    type: Array,
    required: true,
  },
  includedMealIds: {
    type: Array,
    default: () => [],
  },
  orderLineItems: {
    type: Array,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
})

const { t } = useI18n()

const tabs = computed(() => [
  { id: 'workshop', label: t('addons.categories.workshop') },
  { id: 'meal', label: t('addons.categories.meal') },
  { id: 'merchandise', label: t('addons.categories.merchandise') },
])

const activeTab = ref('workshop')

const hasMerchandiseSelected = computed(() =>
  Object.values(selectedAddons.value.merchandise).some((entry) => Number(entry.quantity ?? 0) > 0),
)

function toggleWorkshop(workshop) {
  if (isWorkshopUnavailable(workshop)) return

  const ids = selectedAddons.value.workshops

  selectedAddons.value.workshops = ids.includes(workshop.id)
    ? ids.filter((id) => id !== workshop.id)
    : [...ids, workshop.id]
}

function toggleMeal(mealId) {
  if (props.includedMealIds.includes(mealId)) return

  const ids = selectedAddons.value.meals

  selectedAddons.value.meals = ids.includes(mealId)
    ? ids.filter((id) => id !== mealId)
    : [...ids, mealId]
}

function updateMerchandise(itemId, value) {
  selectedAddons.value.merchandise = {
    ...selectedAddons.value.merchandise,
    [itemId]: value,
  }
}

function isWorkshopUnavailable(workshop) {
  const selected = selectedAddons.value.workshops.includes(workshop.id)

  if (selected) return false

  return Boolean(getWorkshopUnavailableReason(workshop))
}

function getWorkshopUnavailableReason(workshop) {
  const isFull = Number(workshop.registered) >= Number(workshop.capacity)

  if (isFull) return t('common.soldOut')

  const conflictsWithSession = props.selectedSessions.some((session) =>
    doTimeRangesOverlap(workshop, session),
  )

  return conflictsWithSession
    ? t('addons.workshopTimeConflict')
    : ''
}
</script>

<template>
  <section aria-labelledby="addons-heading" class="grid grid-cols-[minmax(0,1fr)_320px] gap-8 max-desktop:grid-cols-1">
    <div class="space-y-4 tablet:space-y-6">
      <h3 id="addons-heading" class="text-h3 text-neutral">
        {{ t('headings.selectAddons') }}
      </h3>

      <AddonCategoryTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @select="activeTab = $event"
      />

      <div v-if="activeTab === 'workshop'" class="space-y-4 tablet:space-y-6">
        <WorkshopOptionCard
          v-for="workshop in workshops"
          :key="workshop.id"
          :workshop="workshop"
          :selected="selectedAddons.workshops.includes(workshop.id)"
          :unavailable="isWorkshopUnavailable(workshop)"
          :unavailable-reason="getWorkshopUnavailableReason(workshop)"
          @toggle="toggleWorkshop(workshop)"
        />
      </div>

      <div v-else-if="activeTab === 'meal'" class="space-y-4 tablet:space-y-6">
        <MealOptionCard
          v-for="meal in meals"
          :key="meal.id"
          :meal="meal"
          :selected="selectedAddons.meals.includes(meal.id) || includedMealIds.includes(meal.id)"
          :included="includedMealIds.includes(meal.id)"
          @toggle="toggleMeal(meal.id)"
        />
      </div>

      <div v-else class="space-y-4 tablet:space-y-6">
        <div
          v-if="hasMerchandiseSelected"
          class="inline-flex gap-3 rounded border border-info-opacity bg-info-subtle-rest p-4"
        >
          <img
            class="size-5"
            :src="infoIconUrl"
            alt=""
            aria-hidden="true"
          >
          <div>
            <span class="text-subtitle2">{{ t('headings.shippingInformation') }}</span>
            <p class="mt-1 text-subtitle2 font-regular">
              {{ t('addons.shippingInfo') }}
            </p>
          </div>
        </div>

        <MerchandiseOptionCard
          v-for="item in merchandise"
          :key="item.id"
          :item="item"
          :model-value="selectedAddons.merchandise[item.id]"
          @update:model-value="updateMerchandise(item.id, $event)"
        />
      </div>
    </div>

    <OrderSummary
      class="self-start"
      :line-items="orderLineItems"
      :total="orderTotal"
    />
  </section>
</template>
