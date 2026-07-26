# Registration Components

This folder is feature-scoped to the event registration wizard.

## `layout/`

Large wizard-level layout components that frame the flow.

- `AppNav.vue`
- `ProcessBar.vue`
- `WizardFooter.vue`

## `steps/`

Step-level containers. These compose common and atom components, receive wizard
state, and own step-specific UI arrangement.

- `FormStepOne.vue`
- `FormStepTwo.vue`
- `FormStepThree.vue`

## `common/`

Reusable feature components with meaningful domain UI. These are larger than
atoms and may contain presentation logic for one card/list/summary pattern.

- `TicketOptionCard.vue`
- `SessionCard.vue`
- `WorkshopOptionCard.vue`
- `MealOptionCard.vue`
- `MerchandiseOptionCard.vue`
- `OrderSummary.vue`

## `atoms/`

Small reusable controls or shells with no registration-specific business logic.

- `SelectableCardFrame.vue`
- `FormField.vue`
- `QuantityStepper.vue`
