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
