# PLAN.md

## How I planned and broke down the task

1. Used AI to help draft an initial architecture and development plan, and captured that as advisory engineering notes in `AI_ZH.md`.
2. Confirmed the requirement priority order before coding: `BRIEF.md` is the authoritative spec, `README.md` provides step-level implementation detail, and `AI_ZH.md` is advisory only.
3. Audited the starter repo first: `package.json`, `src/` structure, mock data, UnoCSS semantic tokens, and the Quasar / UnoCSS setup.
4. Checked the UI foundation early (fonts, colors, semantic tokens). Whenever later implementation diverged from the design or spec, I patched those gaps as they appeared.
5. Built the registration flow step by step. Figma Dev Mode did not work successfully for me, so I used Figma screenshots with Codex (in my experience, screenshot-driven UI work has a high success rate), then inspected each component’s CSS.
6. Continuously extracted and expanded shared components, and strengthened cross-step page logic (state, validation, pricing, conflict handling).
7. Recorded decisions, AI usage, issues, and trade-offs in this document and in `PROMPT.md`.

## Key decisions and why I made them

1. **VIP tickets auto-include the lunch package**  
   VIP includes lunch in the product rules, so selecting VIP automatically marks the included meal as selected and non-removable. That keeps entitlements and pricing consistent and prevents users from missing an included perk.

2. **Workshop overlaps with a selected session: unavailable + warning copy**  
   When a Step 3 workshop overlaps a session selected in Step 2, the workshop is marked unavailable and shows a clear warning under the card (time conflict with a selected session), instead of only looking disabled with no explanation.

3. **Component layering: Layout / Common / Atoms**  
   The first AI-generated structure worked, but the layering was unclear. I reorganized into `layout` (nav, process bar, footer), `common` (cards, tabs, summary), and `atoms` (fields, steppers, etc.) so step pages stay thinner and shared UI is easier to maintain.

4. **Selected borders via box-shadow to avoid 1px → 2px layout shift**  
   Increasing border width from 1px to 2px changes the box size. I used `box-shadow` to draw the thicker selected / hover outline so the visual weight changes without pushing layout.

## Why I chose each additional dependency

This section covers only packages I added beyond the starter stack (Vue / Quasar / UnoCSS / Vue Router).

1. **`vue-i18n` (runtime)**  
   - Problem: BRIEF lists i18n as a nice-to-have; I wanted nav, steps, buttons, and shared copy centralized for locale switching.  
   - Alternatives considered: hard-coded strings, or a tiny custom dictionary.  
   - Why: Standard Vue i18n solution with straightforward Composition API / `useI18n` integration at reasonable cost.

2. **`gh-pages` (devDependency)**  
   - Problem: One-command deploy of `dist/spa` to GitHub Pages (`yarn deploy:git`).  
   - Alternatives considered: GitHub Actions, manual upload.  
   - Why: Fast local deploy for sharing a demo. Deployment is outside the grading scope.

I did not add utilities such as `date-fns` or `lodash-es`. Mock timestamps and currency formatting were handled with small project utilities and native APIs.

## How I used AI tools

1. Asked AI to review the assignment specs and propose an implementation architecture, then saved the result as `AI_ZH.md`. I manually checked those notes against `BRIEF.md` and `README.md` because AI notes are not authoritative.
2. Used **Codex (GPT-5.5)** for larger / harder workstreams, and logged prompts and outcomes in `PROMPT.md`.
3. Used **Cursor Auto** for small fixes and scattered edits.
4. Most AI output was usable, but the initial architecture layering was weak. I restructured the code into Layout / Common / Atoms myself.
5. Because Dev Mode failed, UI work relied on Figma screenshots + Codex, followed by manual comparison of type, spacing, state colors, and interactive states.

## Challenges encountered and how I solved them

There were no blockers that stopped delivery, but a few implementation details are worth noting:

1. **Figma Dev Mode did not work successfully**  
   Switched to screenshot-driven AI work plus manual comparison. Slower than pulling tokens/sizes from Dev Mode, but more reliable for UI restoration in my experience.

2. **Thicker selected borders shifted layout**  
   Changing border width altered box size. Solved with `box-shadow` outlines so selected / hover states look thicker without layout jump.

3. **Figma typography values were incomplete**  
   Some type sizes were not fully specified in the design file. I filled reasonable values from the visual design and the project’s typography shortcuts, preferring semantic tokens over hard-coded hex colors.

4. **Workshop time-conflict messaging**  
   Making an option disabled alone was not clear enough. Workshops that conflict with selected sessions now show explicit warning copy under the card.

## What I would improve given more time

1. With a working Figma Dev Mode setup, this assignment would likely fit the suggested 6–8 hour window more closely. Screenshot-driven AI work plus manual comparison took a bit longer.
2. Build a clearer design-token mapping for typography to reduce ambiguity when the Figma file leaves type sizes incomplete.
