# Nitra Event Registration Wizard

## Senior Frontend Engineering Assessment

## 1. Executive Summary

此作業表面上是一個四步驟的活動報名表單，但實際評估重點並不在表單欄位本身，而是在以下能力：

1. 複雜前端狀態的建模能力
2. 跨步驟商業規則的正確實作
3. Vue Composition API 與 reactive patterns 的熟練度
4. 元件責任與資料流的設計
5. 衍生狀態與原始狀態的區分
6. Figma 與既有 design system 的落實
7. 有限時間內的工程取捨
8. 使用 AI 後的技術判斷與人工審查能力

這不是一個需要大量第三方套件的專案。

最合理的實作方向是使用：

* Vue 3.5 Composition API
* `<script setup>`
* Feature-scoped composable
* `provide` / `inject` 或清楚的 props / emits 資料流
* `computed` 建立衍生狀態
* Pure functions 實作價格、時間衝突與驗證規則
* Quasar 提供基礎互動元件
* UnoCSS 與 semantic tokens 完成視覺樣式

本專案的主要技術風險不是 Vue 或 Quasar，而是商業規則之間的交互關係，以及使用者返回前一步修改資料後，系統是否仍能保持一致。

---

# 2. Requirement Interpretation

## 2.1 Wizard Navigation

Wizard 包含四個步驟：

1. Attendee Info
2. Session Selection
3. Add-ons
4. Review & Submit

使用者必須可以自由往前及往後移動。

所有輸入與選擇都必須保留，不應因元件切換而遺失。

因此：

* Step component 不應持有主要表單狀態
* Step component 可以持有短暫 UI state
* 所有會影響訂單、驗證或其他步驟的資料，都應由 wizard root 統一管理

主要狀態不應依賴 `<KeepAlive>` 保存。

`KeepAlive` 可以保留元件實例，但不能取代清楚的 state architecture。

---

## 2.2 Deferred Validation

規格要求在最終 Submit 時執行 unified validation。

目前建議採取 non-blocking step navigation。除明確的 availability constraints 外，欄位與跨步驟 validation 統一在 Step 4 Submit 時執行。

此決策依據：

* Brief 要求使用者可自由往前與往後移動
* README 明確要求 Step 1 不做 inline validation
* README 明確要求 Session time-conflict validation 延後到 Step 4 Submit
* README 明確要求 Step 4 做 unified validation

因此，前面步驟不應以傳統 checkout flow 的方式，強制使用者完成當前頁面才可以繼續。

例如，建議避免以下 blocking navigation 行為：

* Full Name 空白時禁止進入 Step 2
* 尚未選 Ticket 時禁止進入 Step 2
* Session 發生衝突時禁止進入 Step 3
* Shipping Address 尚未填寫時禁止進入 Review

前面的 Next 按鈕主要負責 navigation，而不是完整表單驗證。若 Figma 或實作互動需要最小限度的防呆，也應清楚區分為 option availability 或 UI affordance，而不是提前執行 submit validation。

但是 disabled 狀態仍然必須按照資料本身處理，例如：

* 已額滿的 Session 不可選
* 與已選 Session 衝突的 Workshop 不可選
* Merchandise quantity 不可超過 maxQuantity

這些不是表單驗證，而是選項本身的 availability constraint。

必須區分：

### Availability Rule

決定某個選項現在能否被操作。

例如：

* Session 已額滿
* Workshop 與 Session 衝突
* Merchandise 已達數量上限

### Submission Validation

決定整份報名資料能否送出。

例如：

* Email 格式錯誤
* 未選 Ticket
* Selected sessions 互相衝突
* Merchandise 已選，但沒有 Shipping Address

將這兩種規則混在一起，是此作業最容易出現的架構錯誤之一。

---

# 3. State Architecture

## 3.1 Recommended State Model

建議將 wizard state 分為四類：

### Navigation State

```js
const currentStep = ref(1)
const hasAttemptedSubmit = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
```

### User-entered State

```js
const registration = reactive({
  attendee: {
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    shippingAddress: '',
  },

  ticketTypeId: null,

  selectedSessionIds: [],

  selectedAddons: {
    workshops: [],
    meals: [],
    merchandise: {},
  },
})
```

### Derived State

以下狀態不應額外儲存，而應由 `computed` 產生：

* selectedTicket
* selectedSessions
* selectedWorkshops
* selectedMeals
* selectedMerchandise
* selectedAddonItems
* groupedSessions
* sessionConflicts
* workshopConflicts
* hasMerchandise
* requiresShippingAddress
* ticketSubtotal
* workshopSubtotal
* mealSubtotal
* merchandiseSubtotal
* vipDiscount
* grandTotal
* firstInvalidStep
* completedSteps
* invalidSteps

### Async/UI State

```js
const isSubmitting = ref(false)
const submitError = ref(null)
```

目前 mock data 是靜態 import，沒有清楚的資料載入流程，因此不應預先建立沒有用途的 `isLoading`。

`isSubmitting` 用於防止重複提交與呈現 submit button 狀態。

即使本作業沒有真正後端 API，也應讓 submit button 具有合理的 disabled 狀態，避免重複提交。

這屬於 UX Polish 評分範圍。

---

## 3.2 Avoid Duplicated State

以下是錯誤模式：

```js
const selectedSessionIds = ref([])
const selectedSessions = ref([])
```

這兩個資料實際上代表同一件事情。

一旦 sessions mock data 或 selected IDs 改變，就必須手動同步兩份資料。

正確模式：

```js
const selectedSessionIds = ref([])

const selectedSessions = computed(() => {
  return sessions.filter((session) =>
    selectedSessionIds.value.includes(session.id),
  )
})
```

另一個錯誤例子：

```js
const total = ref(0)

watch(selectedAddons, () => {
  total.value = calculateTotal()
})
```

正確做法：

```js
const total = computed(() => calculateTotal(orderItems.value))
```

本作業的 Vue Patterns 評分明確偏好 computed derived state，因此應該刻意維持：

> 原始狀態最少化，衍生狀態 computed 化。

---

# 4. Composable Strategy

## 4.1 Recommended Composables

建議至少拆成以下幾個 composable 或 utility modules：

```text
src/
├─ composables/
│  ├─ useRegistrationWizard.js
│  ├─ useRegistrationPricing.js
│  └─ useRegistrationValidation.js
│
├─ utils/
│  ├─ schedule.js
│  ├─ currency.js
│  └─ registration-data.js
```

### `useRegistrationWizard`

負責：

* registration state
* current step
* next / previous / edit navigation
* selected entity computed values
* submit lifecycle
* 對外提供 wizard context

### `useRegistrationPricing`

負責：

* order line items
* ticket price
* add-on prices
* quantities
* VIP workshop discount
* subtotal
* discount
* grand total

### `useRegistrationValidation`

負責：

* attendee validation
* ticket validation
* session conflict validation
* workshop conflict validation
* shipping address conditional validation
* 依照 step 回傳 errors
* first invalid step

### `schedule.js`

負責 pure functions：

* parse event time
* compare sessions
* detect overlap
* find conflict pairs
* format conflict messages

Pure function 應避免直接依賴 Vue ref。

例如：

```js
export function doTimeRangesOverlap(first, second) {
  const firstStart = new Date(first.startTime).getTime()
  const firstEnd = new Date(first.endTime).getTime()
  const secondStart = new Date(second.startTime).getTime()
  const secondEnd = new Date(second.endTime).getTime()

  return firstStart < secondEnd && secondStart < firstEnd
}
```

這讓核心商業邏輯：

* 容易閱讀
* 容易人工驗證
* 容易未來補 unit test
* 不會與 Vue component lifecycle 耦合

---

## 4.2 Composable Instance Scope

需要特別注意 composable instance 的建立位置。

以下做法可能產生不同狀態實例：

```js
// AttendeeInfoStep.vue
const wizard = useRegistrationWizard()

// SessionSelectionStep.vue
const wizard = useRegistrationWizard()
```

每個元件呼叫一次，就可能建立一份新的 registration state。

正確原則是在 wizard root 建立一次，再以明確資料流傳給子元件：

```js
const wizard = useRegistrationWizard()
```

若元件層級較深，或 `OrderSummary` / step components 分布在不同 branch，可以使用 `provide` / `inject`：

```js
const wizard = useRegistrationWizard()

provide(REGISTRATION_WIZARD_KEY, wizard)
```

子元件透過 injection 取得同一個 instance：

```js
const wizard = inject(REGISTRATION_WIZARD_KEY)

if (!wizard) {
  throw new Error(
    'Registration wizard context is unavailable.',
  )
}
```

若元件層級只有一到兩層，root 使用 props、emits 與 `v-model` 明確傳遞也完全合理。

在此專案規模下，應先評估 props/emits 是否足夠清楚，再決定是否使用 `provide` / `inject`。兩者都符合評分標準；重點是 wizard state 只建立一次，不要讓每個 step 各自呼叫 composable 產生獨立 state。

若需要跨多層共享 context，`provide` / `inject` 比 Pinia 更合適，原因是：

* State 只屬於單一 feature
* 不需要跨 route 或跨 app 使用
* 不需要 devtools-level global store
* 可避免不必要 dependency
* 更符合評分規格提到的 composable / provide-inject pattern

---

# 5. Component Architecture

## 5.1 Suggested Structure

```text
src/
├─ components/
│  └─ registration/
│     ├─ RegistrationWizard.vue
│     ├─ RegistrationStepper.vue
│     ├─ WizardNavigation.vue
│     ├─ OrderSummary.vue
│     │
│     ├─ attendee/
│     │  ├─ AttendeeInfoStep.vue
│     │  └─ TicketOptionCard.vue
│     │
│     ├─ sessions/
│     │  ├─ SessionSelectionStep.vue
│     │  ├─ SessionDayGroup.vue
│     │  └─ SessionOptionCard.vue
│     │
│     ├─ addons/
│     │  ├─ AddonsStep.vue
│     │  ├─ WorkshopOptionCard.vue
│     │  ├─ MealOptionCard.vue
│     │  ├─ MerchandiseOptionCard.vue
│     │  └─ QuantitySelector.vue
│     │
│     └─ review/
│        ├─ ReviewStep.vue
│        ├─ ReviewSection.vue
│        └─ RegistrationConfirmation.vue
```

不需要將每一段文字或 icon 都拆成 component。

元件拆分應根據以下條件：

* 是否具有獨立責任
* 是否重複出現
* 是否具有自己的互動邏輯
* 是否具有清楚的 input/output contract
* 是否能降低父元件認知負擔

不建議為了看起來架構完整，建立大量只有幾行 template 的元件。

過度拆分會造成：

* 檔案數量增加
* props 傳遞複雜
* Debug navigation 困難
* 實際可讀性反而下降

---

## 5.2 Recommended Responsibility Boundaries

### `RegistrationWizard.vue`

負責：

* 建立 wizard context
* Layout
* Stepper
* Active step rendering
* Global order summary
* Confirmation state

不應負責：

* 具體時間衝突演算法
* 每種 add-on 的 UI 細節
* 重複的價格計算
* 每個 input 的 markup

### Step Components

負責：

* 組合該步驟的 section
* 將 wizard state 傳給 child components
* 顯示該步驟錯誤
* 顯示 step-specific banner

不應：

* 複製全域 state
* 自己計算 total
* 自己維護 selected IDs 的備份
* 自己決定 submit 是否成功

### Option Cards

負責：

* 顯示單一選項
* selected / disabled / error UI
* emit selection change
* accessibility state

不應：

* 自己讀取全部 registration state
* 直接修改其他 step 的資料
* 自己計算全域衝突

---

# 6. `v-model` and `defineModel`

題目特別提到 proper `v-model` / `defineModel` usage，因此應該有意識地展示 Vue 3.5 API，但不應為了增加使用量而讓資料流變複雜。

優先適合使用 `defineModel` 的元件：

* Ticket option selection
* Quantity selector
* Merchandise size selector
* 單一 reusable toggle / selector control

Session 多選 card 不一定適合直接使用 `defineModel<boolean>`。通常父層持有 `selectedSessionIds` array，子層用 `:selected` 與 `@toggle` 會更清楚：

```vue
<SessionOptionCard
  :selected="selectedSessionIds.includes(session.id)"
  :session="session"
  @toggle="toggleSession(session.id)"
/>
```

例如：

```vue
<script setup>
const selected = defineModel({
  type: Boolean,
  default: false,
})

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
})

const handleSelect = () => {
  if (props.disabled) return

  selected.value = !selected.value
}
</script>
```

但要避免濫用。

如果元件需要同時改變：

* selected state
* quantity
* size
* validation state

那麼將所有資料塞進一個巨大 `v-model` object 反而會降低可讀性。

建議：

* 單一明確值使用 `defineModel`
* 複雜事件使用 explicit emits
* 商業邏輯留在父層或 composable

---

# 7. Session Conflict Logic

## 7.1 Correct Interval Rule

兩個活動衝突的條件：

```js
firstStart < secondEnd &&
secondStart < firstEnd
```

這個條件能正確處理邊界：

```text
Session A: 09:00–10:00
Session B: 10:00–11:00
```

以上不算衝突。

若使用：

```js
firstStart <= secondEnd
```

就會錯誤地將相鄰場次視為衝突。

---

## 7.2 Return Conflict Details, Not Only Boolean

不建議：

```js
const hasConflict = computed(() => {
  return findTimeConflicts(selectedSessions.value)
})
```

如果 `findTimeConflicts` 只回傳 boolean，UI 無法清楚告訴使用者哪些場次衝突。

建議回傳：

```js
[
  {
    first: sessionA,
    second: sessionB,
  },
]
```

或者更適合 UI 的 shape：

```js
[
  {
    id: 'session-a__session-b',
    firstSessionId: 'session-a',
    secondSessionId: 'session-b',
    message:
      '"Vue at Scale" conflicts with "Frontend Architecture".',
  },
]
```

這份資料可用於：

* Step 2 error banner
* Stepper error indicator
* Review submit errors
* 對衝突 cards 加 error outline
* 將畫面 scroll 到相關選項

---

## 7.3 Session Conflict UX

規格要求 Session 可以先自由選擇，即使有時間衝突。

因此：

* 不要在 selection 時阻止
* 不要在選取後自動取消另一場
* 不要一發生衝突就顯示 submit-level error

建議流程：

### Submit 前

Session card 正常保留 selected 狀態。

### 第一次 Submit 後

* Step 2 顯示 error indicator
* 跳到 Step 2
* 顯示衝突摘要
* 衝突相關 cards 顯示 error state
* 使用者取消任一衝突場次後，錯誤即時消失

這需要：

```js
const shouldDisplayValidation = computed(() => {
  return hasAttemptedSubmit.value
})
```

以及動態 computed errors，而不是將 submit 當下的錯誤 permanently copy 到 state。

---

# 8. Workshop Conflict Logic

Workshop 規則與 Session 規則不同。

當 Workshop 與目前已選 Session 衝突時：

* Workshop 顯示 unavailable
* Workshop 不可被新選取
* 應顯示原因，而不只是 disabled

例如：

```text
Unavailable because it overlaps with “Vue at Scale”.
```

只將按鈕灰掉而不說明原因，UX 不完整。

---

## 8.1 Critical Edge Case

### Proposed Edge-case Decision

官方規格只說 Workshop 與已選 Session 重疊時要標記 unavailable，沒有定義「先選 Workshop，回到 Step 2 後再選衝突 Session」時，既有 Workshop selection 要自動取消、保留，還是阻止 Session selection。

以下流程必須處理：

1. 使用者先選 Workshop A
2. 返回 Session Selection
3. 選擇與 Workshop A 衝突的 Session B

這時 Workshop A 已經存在於 selected state。

若 UI 只是根據目前 Session 把 Workshop A disabled，會形成：

* disabled
* selected
* invalid

三個狀態同時存在。

建議採取以下 proposed behavior：不要自動移除 Workshop。

自動移除有以下問題：

* 使用者資料無提示消失
* 破壞「資料保留」的預期
* 跨步驟 watch 產生隱性副作用
* 使用者無法判斷是哪個操作造成變化

較合理行為：

* 保留 Workshop selection
* Workshop card 顯示 selected + conflict/error state
* Submit validation 將 Step 3 標記為 invalid
* 使用者可取消 Workshop，或返回 Step 2 取消 Session

這項 edge case 很適合寫入正式 PLAN.md，但應明確標示為工程決策，而不是官方硬性規格。

---

# 9. Pricing Architecture

## 9.1 Single Pricing Source of Truth

價格不能分別在：

* Add-ons step
* Order summary
* Review step
* Confirmation screen

各自計算。

應建立統一的 `orderLineItems`。

例如：

```js
const orderLineItems = computed(() => {
  return [
    ticketLineItem.value,
    ...workshopLineItems.value,
    ...mealLineItems.value,
    ...merchandiseLineItems.value,
  ].filter(Boolean)
})
```

每筆 line item 應包含：

```js
{
  id: 'workshop-1',
  category: 'workshop',
  label: 'Advanced Vue Workshop',
  quantity: 1,
  unitPrice: 149,
  subtotal: 149,
  discount: 14.9,
  total: 134.1,
}
```

Review 和 summary 只負責 render，不重新理解價格規則。

---

## 9.2 VIP Discount

VIP 折扣只能套用於 Workshop。

不能套用於：

* Ticket
* Meal
* Merchandise

推薦在 line item 層級計算：

```js
function getLineItemDiscount(item, ticketTypeId) {
  const isVipWorkshop =
    ticketTypeId === 'vip' &&
    item.category === 'workshop'

  if (!isVipWorkshop) return 0

  return item.subtotal * 0.1
}
```

不要在 grand total 最後直接乘以 0.9：

```js
const total = subtotal * 0.9
```

這會錯誤折扣全部商品。

---

## 9.3 Floating-point Handling

JavaScript 浮點數可能產生：

```js
149 * 0.1
// 14.900000000000002
```

顯示層可以透過 `Intl.NumberFormat` 處理。

但若希望商業邏輯更穩定，可統一轉成 cents：

```js
function toCents(amount) {
  return Math.round(amount * 100)
}

function fromCents(amount) {
  return amount / 100
}
```

以這份作業規模來看，使用 cents 是加分但非必要。

至少應確保：

* UI 顯示兩位小數
* Total 不透過字串相加
* quantity 是 number
* 空值不產生 `NaN`

---

# 10. Validation Architecture

## 10.1 Error Data Shape

不要只存字串陣列：

```js
{
  1: ['Email is invalid'],
}
```

建議使用結構化錯誤：

```js
{
  1: [
    {
      code: 'INVALID_EMAIL',
      field: 'email',
      message: 'Enter a valid email address.',
    },
  ],

  2: [
    {
      code: 'SESSION_TIME_CONFLICT',
      field: 'sessions',
      message: 'Some selected sessions overlap.',
      relatedIds: ['session-a', 'session-b'],
    },
  ],
}
```

優點：

* Input 可以依 field 顯示錯誤
* Cards 可以依 related IDs 顯示 error state
* Stepper 可以依 step 顯示 indicator
* 未來可支援 i18n
* 不依賴解析文字訊息判斷錯誤類型

---

## 10.2 Error State Should Prefer Derivation

可以將 `hasAttemptedSubmit` 存為 state。

但實際 errors 建議由 computed 動態產生：

```js
const validationErrors = computed(() => {
  if (!hasAttemptedSubmit.value) {
    return emptyValidationResult()
  }

  return validateRegistration({
    registration,
    selectedSessions: selectedSessions.value,
    selectedWorkshops: selectedWorkshops.value,
  })
})
```

這樣使用者修改資料後，錯誤會自然消失。

若 submit 時把 errors copy 到 reactive state：

```js
Object.assign(stepErrors, validateRegistration())
```

後續還需要大量 watch 或 manual clear。

這會增加同步風險。

更好的模式是：

```js
const validationResult = computed(() => {
  return validateRegistration(...)
})

const visibleValidationResult = computed(() => {
  return hasAttemptedSubmit.value
    ? validationResult.value
    : emptyValidationResult()
})
```

---

## 10.3 First Invalid Step

```js
const invalidStepNumbers = computed(() => {
  return Object.entries(
    visibleValidationResult.value.byStep,
  )
    .filter(([, errors]) => errors.length > 0)
    .map(([step]) => Number(step))
})

const firstInvalidStep = computed(() => {
  return invalidStepNumbers.value[0] ?? null
})
```

Submit 時：

```js
async function submitRegistration() {
  hasAttemptedSubmit.value = true

  await nextTick()

  if (firstInvalidStep.value) {
    goToStep(firstInvalidStep.value)
    return
  }

  await completeSubmission()
}
```

`nextTick()` 可確保 error UI 已 render，再執行 focus 或 scroll。

---

# 11. Focus and Error Navigation

只切換 step 不一定足夠。

良好的 validation UX 應包含：

1. Submit 後切換到第一個 invalid step
2. 顯示 step-level error summary
3. Focus 第一個錯誤欄位
4. 若錯誤是 card selection，scroll 到相關 card
5. Stepper 顯示所有 invalid steps，而非只顯示第一個

例如：

```js
async function navigateToFirstError() {
  const error = firstValidationError.value

  if (!error) return

  currentStep.value = error.step

  await nextTick()

  document
    .querySelector(`[data-error-field="${error.field}"]`)
    ?.focus()
}
```

實作時應避免在 composable 裡直接大量操作 DOM。

可以由 component 監聽 active errors，再負責 focus。

---

# 12. Data Parsing and Transformation

Mock data 不應在 template 中直接進行複雜處理。

不建議：

```vue
<div
  v-for="session in sessions
    .filter(...)
    .sort(...)
    .map(...)"
>
```

應先轉換：

```js
const groupedSessions = computed(() => {
  return groupSessionsByDate(sessions)
})
```

資料轉換函式應處理：

* 日期排序
* 時間排序
* category grouping
* capacity status
* remaining seats
* display labels
* stable keys

例如：

```js
function getRemainingCapacity(session) {
  return Math.max(
    Number(session.capacity) -
      Number(session.registered),
    0,
  )
}
```

要避免負數 remaining seats。

```js
function isSessionFull(session) {
  return getRemainingCapacity(session) === 0
}
```

---

# 13. Design System and Styling

## 13.1 Semantic Tokens

評分明確要求 semantic CSS variables / UnoCSS shortcuts，而不是 hardcoded colors。

因此應優先使用：

```html
class="bg-surface-l1 text-neutral border-neutral-muted"
```

而不是：

```html
class="bg-[#ffffff] text-[#171717] border-[#d8d8d8]"
```

原因不只是符合規格，也能確保：

* 視覺一致
* Theme 容易調整
* Hover / error / disabled 使用相同語意
* 不會在 component 中散落 Figma raw values

---

## 13.2 Interactive States

每個可互動元件至少需要檢查：

* default
* hover
* focus-visible
* active
* selected
* disabled
* error
* selected + error
* disabled + selected
* loading

尤其 Workshop edge case 會出現 selected + invalid。

Session card 可能出現：

* selected
* conflict after submit
* nearly full
* full

不能只設計正常狀態。

---

## 13.3 Quasar vs UnoCSS

推薦職責：

### Quasar

使用於：

* Inputs
* Buttons
* Icons
* Dialog-like interactions
* Spinner
* Accessibility primitives

### UnoCSS

使用於：

* Layout
* Spacing
* Width
* Grid
* Responsive behavior
* Typography composition
* Semantic colors
* Custom card appearance

不要完全依賴 Quasar 的預設 theme，因為預設 visual language 未必符合 Figma。

也不要為了還原 Figma 而完全不用 Quasar。

題目指定 Quasar，評審可能希望看到對 framework component API 的合理使用。

---

# 14. Responsive Design

Responsive 是 nice-to-have，但仍可能影響 UX Polish。

最少應支援：

### Desktop

* Main content 與 summary 雙欄
* Summary 可 sticky
* Stepper 完整顯示 label
* Session / add-on cards 有合理資訊密度

### Tablet

* 適度縮小 column gap
* Summary 可移到內容下方
* Card 不產生水平 overflow

### Mobile

* 單欄排列
* Stepper label 可簡化
* Navigation buttons 保持可點擊尺寸
* Order summary 不應固定遮住畫面
* Quantity selector 不應超出 card
* Long session title 可換行
* Error message 不截斷

不必追求所有 breakpoint pixel-perfect，但不能只在開發者螢幕正常。

---

# 15. Accessibility

雖然沒有獨立評分項目，但 accessibility 會反映在 code quality 和 UX polish。

至少應處理：

* Input 使用正確 label
* Error message 與 input 建立 `aria-describedby`
* Invalid input 使用 `aria-invalid`
* Selectable card 可以鍵盤操作
* Disabled card 使用真實 disabled 或合理 aria state
* Stepper 可辨識目前 step
* 不只用顏色表示 selected / error
* Icon-only button 提供 accessible label
* Focus-visible 狀態清楚

若 card 本質是單選，可考慮：

* radio semantics
* `role="radio"`
* `aria-checked`

若 card 是多選，可考慮：

* checkbox semantics
* 真實 `<input type="checkbox">`
* 或 Quasar checkbox component

不要只用 `<div @click>`。

---

# 16. Submission Flow

即使沒有後端，Submit button 仍應防止重複提交，並在必要時呈現 disabled / loading 狀態。但不應為了展示 loading 人為加入 timeout 或虛構 API failure。

```js
function completeSubmission() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = null

  isSubmitted.value = true
  isSubmitting.value = false
}
```

Submit button 應：

* submitting 時 disabled
* 避免重複點擊
* 若實作真的包含非同步流程，再顯示 progress
* 成功後不再 render editable wizard
* 若未來接入 API，失敗時保留使用者資料

目前同步驗證後切換 success screen 即可。保留 `isSubmitting` 是合理防呆，但不要建立沒有真實用途的虛構非同步流程。

---

# 17. Dependency Assessment

## Recommended Decision

預設不新增 runtime dependency。

理由：

* Vue 已能處理 state 與 computed
* Quasar 已提供 UI controls
* Native Date 足以完成有限的時間比較
* `Intl.NumberFormat` 足以格式化美元
* Validation 規則範圍有限
* 額外 dependency 會增加文件與維護成本

README 允許新增 dependency，但要求在 PLAN.md 說明。若檢查 mock data 或實作複雜度後發現某個 dependency 有明確收益，可以加入並記錄：

* 解決什麼問題
* 替代方案是什麼
* 為什麼值得增加維護成本

---

## Pinia

不建議加入。

本專案的 state：

* 只屬於單一 page feature
* 不需要跨 route
* 不需要 global app access
* 不需要 persistence plugin

使用 Pinia 並非錯誤，但可能顯得過度設計。

---

## vee-validate / Yup

可使用，但不是最佳時間投資。

此題的主要驗證包含：

* 跨步驟
* Conditional fields
* Array conflicts
* Session / Workshop relations
* Step-level aggregation

即使使用 schema library，時間衝突仍然需要 custom logic。

若使用 vee-validate，很可能增加：

* Form context complexity
* Step unmount/remount 問題
* Validation timing調整
* Deferred validation設定成本

因此 pure validation function 會更透明。

---

## date-fns

只有在 mock data 日期格式非常複雜、涉及 timezone ambiguity 時才值得加入。

如果資料是標準 ISO timestamp，原生 Date 已足夠。

---

# 18. Scope and Time Management

官方預期約 6–8 小時，因此正式 PLAN.md 應記錄實際投入時間、完成範圍與取捨，而不是預先放入更長的理想估算。

建議取捨順序：

1. 先保證商業邏輯
2. 再確保架構與可讀性
3. 優先完成桌面設計
4. Mobile 做到穩定可用
5. i18n 不應優先
6. Animation 只做低成本 polish

正式提交文件可用這種寫法：

```text
The assignment suggested approximately 6-8 hours. I prioritized core
business correctness, Vue architecture, and desktop design fidelity before
optional i18n and advanced animation.
```

---

# 19. Priority Matrix

## Must Have

* 四步驟 wizard
* 前後自由切換
* State preservation
* Mock data 正確 render
* Session capacity
* Session conflict detection
* Workshop conflict availability
* Live order summary
* VIP workshop discount
* Conditional shipping address
* Unified submit validation
* Invalid step indicators
* Edit navigation
* Confirmation screen
* Clean build
* PLAN.md
* Atomic commit history

## Should Have

* Responsive layout
* Loading state
* Error focus / scroll
* Selected + error visual state
* Accessible controls
* Sticky desktop summary
* Transition polish

## Could Have

* i18n
* Unit tests
* Draft persistence
* Advanced animation
* Route-based step state
* End-to-end tests

在時間有限時，不應為了 bonus i18n 犧牲核心驗證或 Figma fidelity。

---

# 20. Testing Checklist

## Navigation

* 前進後退後，欄位內容仍保留
* 使用者能自由往前與往後移動
* Stepper 是否可點擊依 Figma 互動設計決定；若 Figma 沒有明確限制，可實作為可點擊以改善 UX
* Review 的 Edit button 返回正確步驟
* 修改後回到 Review，資料立即更新

## Attendee

* 空欄位不阻止前往下一步
* Submit 後顯示必填錯誤
* Email 格式正確驗證
* Phone 規則符合 README
* Ticket selection 正確保存
* Ticket price 即時更新

## Sessions

* 依日期正確 grouping
* 日期順序正確
* 同日 session 依時間排序
* Capacity 顯示正確
* Full session 不可選
* Remaining seats 不為負數
* 衝突 Session 可以同時選
* Submit 後衝突被正確標記
* 相鄰但不重疊的 session 不算衝突

## Workshops

* 與 selected session 衝突時 unavailable
* Unavailable 狀態有原因
* 不可新選取 unavailable workshop
* 先選 Workshop，再選衝突 Session 時能正確顯示 invalid
* 取消 Session 後 Workshop 恢復有效
* 取消 Workshop 後 Step 3 error 消失

## Add-ons

* Meal 可以正確選取
* Merchandise quantity 不超過 max
* Quantity 不低於 0
* Size 正確保存
* Quantity 為 0 時不計入價格
* Quantity 大於 0 時要求 Shipping Address
* Quantity 回到 0 時 Shipping Address 再次 optional

## Pricing

* General ticket 價格正確
* VIP ticket 價格正確
* Student ticket 價格正確
* VIP 只折 Workshop
* 非 VIP 沒有 Workshop 折扣
* Meal 不被折扣
* Merchandise 不被折扣
* Quantity 正確乘上單價
* 所有金額格式為兩位小數
* Summary、Review、Confirmation 金額一致

## Validation

* Submit 一次後顯示所有 invalid steps
* 自動導航到第一個 invalid step
* Stepper 顯示其他 invalid steps
* 修改資料後錯誤即時更新
* 所有錯誤修正後可成功 Submit
* Submit submitting 狀態不可重複送出

## UI

* Hover state
* Focus-visible state
* Selected state
* Disabled state
* Error state
* Selected + error state
* Desktop layout
* Mobile layout
* Long text wrapping
* No horizontal overflow

## Build

```bash
yarn
yarn dev
yarn build
```

應在 clean checkout 後正常執行。

---

# 21. Commit Strategy

推薦 commit history：

```text
chore: review assignment requirements and document implementation plan

feat: add registration wizard state and navigation

feat: parse and group registration mock data

feat: implement attendee information and ticket selection

feat: add session selection and capacity states

feat: implement session and workshop conflict rules

feat: add configurable event add-ons

feat: implement centralized pricing and VIP discounts

feat: add review step and unified validation

feat: add registration confirmation flow

style: align wizard with semantic design tokens

style: add responsive registration layouts

fix: preserve invalid workshop selections across step changes

docs: complete development journal and AI usage notes
```

每筆 commit 應能獨立描述一個合理變更。

不要刻意將每個小 typo 都做成 commit，也不要最後只有一筆巨型 commit。

---

# 22. AI Collaboration Assessment

AI 最適合協助：

* 分析 mock data shape
* 列出 edge cases
* Review interval overlap function
* Review pricing function
* 提供 Figma MCP token mapping
* 檢查 components 是否責任過重
* 檢查 semantic token 是否被 hardcode 顏色取代
* Review PLAN.md 是否反映真實過程

AI 不應直接決定：

* 整體 state ownership
* 衝突規則的產品行為
* 是否自動刪除使用者選擇
* Validation timing
* Dependency choice
* 元件拆分粒度

AI 容易產生的錯誤包括：

* 遇到 Session 衝突時立即阻止選擇
* 自動刪除衝突 Workshop
* 使用 watch 同步 totals
* 將所有邏輯放在單一 component
* 過度新增 dependency
* Hardcode Figma colors
* 忽略 selected + invalid state
* 只驗證目前 step
* 將 Step navigation 與 validation 綁死

PLAN.md 應記錄：

* AI 提供了什麼
* 哪些建議有效
* 哪些不符合規格
* 如何人工修正
* 如何驗證生成內容

這比附上一長串 prompts 更有價值。

---

# 23. Final Technical Recommendation

本作業的最佳解法不是建立最複雜的架構，而是建立最清楚、最容易驗證的架構。

推薦的核心原則：

1. Wizard state 只建立一次
2. 原始狀態保持最少
3. 衍生狀態全部使用 computed
4. 時間、價格與驗證使用 pure functions
5. Step components 不擁有全域商業邏輯
6. 不使用 watch 建立 state synchronization
7. 不自動刪除使用者跨步驟選擇
8. Validation errors 使用結構化資料
9. Summary、Review 與 Confirmation 共用相同 line items
10. Semantic tokens 優先於 hardcoded styles
11. 先完成 correctness，再進行 visual polish
12. PLAN.md 應真實反映工程決策與 AI 審查過程

從資深前端工程師角度，此作業最能展現能力的地方，不是完成四個 step，而是證明：

* 每一份 state 都有明確 ownership
* 每一條商業規則都有單一 source of truth
* 每一個 derived value 都不需要手動同步
* 每一個 edge case 都能在資料模型中被合理表達
* 每一個 UI state 都能由目前資料一致地推導出來

只要這些原則處理正確，即使沒有額外加入 i18n 或大量動畫，仍然會是一份架構成熟、可維護且符合評分方向的提交。
