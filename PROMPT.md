## 2026-07-24 Step 1 UI

User prompt summary:

```text
製作第一頁。
Use the project’s existing CSS setup plus scoped custom CSS where needed.
Use logo icon from src/assets/icons/Emblems.svg.
Use checked bullet icon from src/assets/icons/circle-check.svg.
Pay attention to the selected style of the three ticket cards.
The scrollable area should be the middle form content.
Check whether Quasar provides the special padding / max-width seen in Figma for
the areas outside nav and for top/middle/bottom layout sections.
```

Implementation notes:

1. Quasar `q-page padding` only provides generic page padding; it does not reproduce the Figma-like separate max-width/padding for header, stepper, content, and footer.
2. Added custom centered layout containers in `IndexPage.vue`.
3. Kept the header, stepper, and footer fixed in the page layout while making only the middle form content scrollable.
4. Used existing semantic tokens and CSS variables where possible, with scoped CSS for exact layout and card states.
5. Used `Emblems.svg` for the logo mark and `circle-check.svg` for ticket perks.
6. Used mock `event.ticketTypes` as the source for ticket cards. The screenshot shows “WebDev Summit 2025”, but the authoritative spec and mock data use “WebDev Summit 2028”, so the implementation renders the mock/spec value.

## 2026-07-24 Step 1 Layout Fix

User prompt summary:

```text
The bottom Next: Session Selection bar is not fixed at the bottom.
The Next button/footer should stay fixed at the bottom.
The middle form content should take the remaining flex: 1 space after removing
the nav, process bar, and bottom bar. If the content is taller than that area,
only the middle area should scroll.
Componentize Nav, ProcessBar, FormStepOne, and ticket/form cards.
Add the shipping address conditional required/error state shown in the Figma
screenshot.
```

Implementation notes:

1. Refactored `IndexPage.vue` into a viewport-height flex column.
2. Header nav, process bar, and footer are fixed-height flex children.
3. The middle form area uses `flex: 1`, `min-height: 0`, and `overflow-y: auto`.
4. Added registration components:
   - `AppNav.vue`
   - `ProcessBar.vue`
   - `FormStepOne.vue`
   - `TicketOptionCard.vue`
   - `FormField.vue`
   - `WizardFooter.vue`
5. Added conditional shipping address behavior in `FormStepOne.vue`: when merchandise is selected, the field label becomes required and can show the error text `Shipping address is required for merchandise orders`.

## 2026-07-25 Wizard Foundation

User prompt summary:

```text
The correct UnoCSS parameters have been adjusted.
Previously built parts should use the correct typography settings.
Refer to the text-* typography usage in src/unocss/index.js.
Check the documented form filling logic.
If the previous work did not sync with the requirement, add composables.
Create the base foundation for the four-step form and re-check the requirements.
```

Implementation notes:

1. Re-scanned `BRIEF.md` and `README.md`; confirmed the form is a four-step wizard with preserved cross-step state and unified Step 4 validation.
2. Added `useRegistrationWizard.js` as the feature-scoped source of truth for current step, attendee data, ticket selection, selected sessions, add-ons, selected entities, validation state, and navigation.
3. Added `useRegistrationValidation.js` for the first unified validation foundation.
4. Added `utils/schedule.js` for date/endDate overlap detection and conflict pair generation.
5. Updated Step 1 to consume wizard state from the composable instead of owning raw state in the page.
6. Updated the footer primary action and label to follow the current step.
7. Replaced remaining hand-written typography utility values in registration components with project typography shortcuts.

## 2026-07-25 Step 2 Sessions UI

User prompt summary:

```text
根據截圖製作第二階段表單。
注意 components 有效拆分，不要全部寫在一起。
```

Implementation notes:

1. Added Step 2 session selection UI and wired it into the existing wizard state.
2. Split the Step 2 UI into focused components:
   - `FormStepTwo.vue`
   - `SessionDateTabs.vue`
   - `SessionCard.vue`
3. Added `utils/registration-data.js` for session grouping, capacity helpers, and UTC-based date/time labels.
4. Implemented date tabs for Nov 15 / Nov 16 using mock session data.
5. Implemented selectable session cards with track badge, speaker/title, time range, capacity progress, remaining seats, and selected checkbox state.
6. Full sessions follow the README requirement and are disabled when `registered >= capacity`; the screenshot shows a sold-out selected state, but the authoritative README says full sessions should be disabled.
7. Updated the process bar so completed previous steps show a check icon and completed connector color.
8. Updated the footer to show Back on Step 2 and to change the primary label to `Next: Add-ons`.

## 2026-07-26 Session Card Capacity Rules

User prompt summary:

```text
SessionCard CSS typography has been adjusted manually.
Enhance capacity-bar__fill and availability-text:
- >50% fill uses orange/600; availability text uses orange/700.
- <50% fill uses bg/brand/emphasis/rest; availability text uses text/brand/emphasis.
- Sold out uses text/danger/emphasis.
- Unselectable cards caused by time overlap use text/warning/default for text/bar.
When a session is selected, overlapping sessions cannot be selected.
Selecting a session should reduce the displayed remaining spots by one.
```

Implementation notes:

1. Preserved the manually adjusted `SessionCard.vue` typography and icon structure.
2. Added dynamic capacity colors in `SessionCard.vue`.
3. Added selected-count capacity adjustment so `13 spots left` becomes `12 spots left` after selecting that session.
4. Added time-overlap unavailable logic in `FormStepTwo.vue`; overlapping, unselected cards are disabled, while selected cards remain clickable so the user can unselect them.
5. Kept sold-out sessions disabled and styled with danger emphasis.

## 2026-07-26 Disabled Session Card Visual Correction

User prompt summary:

```text
不可選的樣式主要是顏色校正。
Badge should remove background/border-like treatment.
The checkbox frame should be removed.
Do not add an overlay layer on top of the card; change the actual colors.
```

Implementation notes:

1. Updated `SessionCard.vue` disabled styling to use CSS variable color overrides instead of opacity or overlay behavior.
2. Disabled session cards now keep the card shadow and surface but switch the internal text colors to disabled semantic text.
3. Disabled badge background is transparent and uses muted text.
4. Disabled checkbox border is transparent, so the empty box frame is visually removed.
5. Disabled capacity bar and availability text use warning semantic color.

## 2026-07-26 Step 3 Add-ons UI

User prompt summary:

```text
完成第三階段表單。
希望三階段的卡片外框樣式抽成共用組件，因為 hover/select 樣式相同。
注意第一階段是單選且預設灰底，第二階段是多選且預設白底。
```

Implementation notes:

1. Added `SelectableCardFrame.vue` as the shared card shell for border, shadow, hover, selected, disabled behavior.
2. Refactored ticket and session cards to use the shared card frame while preserving different default surfaces:
   - Step 1 ticket cards default to `bg-surface-l1`.
   - Step 2 session cards default to `bg-surface-l0`.
3. Added Step 3 add-ons UI with focused components:
   - `FormStepThree.vue`
   - `AddonCategoryTabs.vue`
   - `WorkshopOptionCard.vue`
   - `MealOptionCard.vue`
   - `MerchandiseOptionCard.vue`
   - `QuantityStepper.vue`
   - `OrderSummary.vue`
4. Added derived order pricing in `useRegistrationWizard.js`, including ticket, workshops, meals, merchandise, VIP workshop discount, and total.
5. Merchandise cards use the shared frame in non-interactive mode because they contain nested controls such as selects and quantity buttons.

## 2026-07-26 Component Architecture Cleanup

User prompt summary:

```text
請優化 components 資料夾內的架構。
Suggested grouping: Layout for large components such as nav/process/footer/steps,
Common for medium components, Atom for small components such as card frame and
form field.
```

Implementation notes:

1. Reorganized registration components into feature-scoped layers:
   - `layout/` for wizard shell components.
   - `steps/` for Step 1-4 container components.
   - `common/` for domain-level reusable cards, tabs, and summary.
   - `atoms/` for small reusable controls/shells.
2. Updated all imports in pages, layouts, and components.
3. Added `src/components/registration/README.md` to document the structure and placement rules.
4. Verified the move with a production build.

## 2026-07-26 Step 4 Review and Submit

User prompt summary:

```text
最後第四步驟。
依據 README / AI_ZH / screenshots 的文件要求完成 Review & Submit。
```

Implementation notes:

1. Added `FormStepFour.vue` for Review & Submit.
2. Added `ReviewSection.vue` for reusable review blocks with edit links and error border states.
3. Added `RegistrationConfirmation.vue` for the success state after valid submission.
4. Connected Step 4 to existing wizard state: attendee data, selected sessions, selected add-ons, line items, grand total, and visible validation result.
5. Submit now sets `hasAttemptedSubmit` and stays on Review when validation fails, so the review page can show unified errors and edit navigation.
6. Process bar now accepts `invalidSteps` and shows step-level error indicators after submit validation fails.
7. Successful submit hides the process bar/footer and shows the confirmation screen with a confirmation number and attendee email.

## 2026-07-26 VIP Included Meal

User prompt summary:

```text
When VIP is selected and the user opens Meal Packages, the Lunch option should
be directly included and impossible to remove because it is included in the VIP
ticket price. Asked whether the price should say "VIP included" or another
wording.
```

Implementation notes:

1. Chose the wording `Included with VIP ticket` because it explains both the included price and why the option cannot be removed.
2. Modeled the included lunch as derived state via `includedMealIds`, not as a manual `selectedAddons.meals` mutation. This avoids leaving hidden auto-added data if the ticket type changes later.
3. Meal Packages now marks Standard Lunch as selected and disabled for VIP.
4. Pricing treats the included lunch as a $0 meal line item labeled `Standard Lunch (Both Days) (Included with VIP ticket)`.
5. This request specifically targets VIP behavior. README also lists lunch as included for General, but that broader interpretation is left as a separate product decision unless requested.

## 2026-07-26 Review Shipping Address Required Row

User prompt summary:

```text
In the Review step, if merchandise is selected, Attendee Information should show
Shipping Address even when it is empty because it becomes a required field.
```

Implementation notes:

1. Updated `FormStepFour.vue` so Shipping Address is always included in attendee review rows when merchandise is selected.
2. Passed `hasMerchandiseSelected` from `IndexPage.vue` to Step 4.
3. Existing validation still supplies the required error message after submit.

## 2026-07-26 Review Error Text and Contact Format Validation

User prompt summary:

```text
Adjust Review error text styles.
The top error summary is correct.
In Attendee Information, normal required fields should display "— (required)".
Shipping address required by merchandise should display
"— (required for merchandise)".
Also add email format validation and phone format validation. Phone should
accept international or US phone input.
```

Implementation notes:

1. Updated Review field-level display so missing required values use compact labels instead of full validation sentences.
2. Shipping Address now displays `— (required for merchandise)` when merchandise makes it required.
3. Existing top-level validation summary keeps the full human-readable messages.
4. Email validation now uses a stricter email pattern.
5. Phone validation accepts E.164 international numbers such as `+886912345678` and common US formats such as `(415) 555-1234`, `415-555-1234`, `415 555 1234`, and `+1 415 555 1234`.

## 2026-07-26 Workshop Disabled Card Styling

User prompt summary:

```text
In Select Add-ons > Workshops, apply the disabled card style that was already
done for session cards.
```

Implementation notes:

1. Updated `WorkshopOptionCard.vue` to use disabled-state color variables for title, description, time, price, and availability text.
2. Kept the shared `SelectableCardFrame` border/shadow/disabled shell behavior.
3. Disabled workshop cards now change internal colors directly rather than using opacity, matching the session-card approach.

## 2026-07-26 Workshop Time Conflict Hint

User prompt summary:

```text
If a workshop such as Hands-on Vue.js Testing cannot be selected, show a hint below it:
"Unavailable due to a time conflict with a selected session".
```

Implementation notes:

1. Added a workshop unavailable reason helper in `FormStepThree.vue`.
2. Workshop cards still show `Sold Out` for full workshops.
3. Workshops that cannot be selected because their time overlaps selected sessions now show `Unavailable due to a time conflict with a selected session` under the availability text, using warning text color.

## 2026-07-26 i18n Setup

User prompt summary:

```text
完成 i18n，只需要中英文設定。
英文既有資料可以保留，中文要補齊每一個地方。
網站的 WebDev Summit 2025 不用更換。
中英文資料用好管理的方式做，不用硬抓 mock 內的資訊；
英文部分可以在 i18n 內從 mock 引入。
```

Implementation notes:

1. Added `vue-i18n` and registered it through a Quasar boot file.
2. Added `src/i18n/messages.js`; English entity copy is generated from `event`, `addons`, and `sessions` mocks, while Traditional Chinese copy is maintained by id in the i18n message table.
3. Added `useRegistrationCopy.js` so ticket, perk, add-on, and session display text resolve through i18n without mutating mock data.
4. Added an EN / 中文 language switcher in the nav. The event title remains data-driven and is not translated.
5. Replaced fixed UI copy across the wizard: steps, footer buttons, form labels/placeholders, card status text, add-on tabs, shipping hints, review sections, validation text, order summary labels, and confirmation page copy.

## 2026-07-27 Locale URLs

User prompt summary:

```text
需要語系網址：
英文（預設）http://localhost:9003/
中文 http://localhost:9003/zh
```

Implementation notes:

1. Added two route entries for the same registration page: `/` with English locale and `/zh` with Traditional Chinese locale.
2. Router guards now set i18n locale from route metadata so `/` stays English even if the browser or previous localStorage value is Chinese.
3. The nav language switcher now updates the route instead of only changing in-memory locale.
