Nitra Event Registration Wizard
Objective
This project involves building an Event Registration Wizard for “WebDev Summit 2028”
that allows attendees to register, select sessions, choose add-ons, and review their
order before submitting.
Where to look: This document is the authoritative spec for what we expect and
how we evaluate. The repo README.md contains the full step-by-step
implementation details (fields, ticket prices, validation rules, design tokens).
Read both before you start — if anything conflicts, this document wins.
Requirements
●
Please read the repo README.md for the full step-level spec before you start.
●
Ensure core functionality is working, including:
o Build a multi-step registration form with 4 steps (Attendee Info → Session
Selection → Add-ons → Review & Submit)
o Users can freely navigate forward and backward between steps, with all
form data preserved
o Parse the provided mock data (src/mocks/) and render each step
accordingly
o Implement time-conflict detection for sessions and workshops
o Display a live-updating order summary with correct pricing and VIP
discounts
o Unified validation on submit, with step-level error indicators and navigation
to the relevant step
●
Code is written with good readability and maintainability
●
Styling matches the provided design as closely as possible
●
Expected effort: approximately 6–8 hours of focused work.
●
Deadline: please submit within 5 days of HR sending you this document. Let us
know in advance if you need an extension.
●
AI tools: We encourage you to use AI tools (Cursor, ChatGPT, Claude, Copilot,
etc.) throughout this assignment. Document your usage as part of your PLAN.md
— see Submission below for the full development-journal requirements. (Also
see the bonus criterion below.)
●
If you have any questions, please reach out to Chris at chris@nitra.com.
Nice to have
●
i18n (internationalization) support.
●
Responsive design for mobile devices.
UI Design
●
Figma link:
https://www.figma.com/design/6Jl8Jyv7bETcHg2carNi6d/Nitra-FE-Assessment—
v2
●
The link is publicly viewable — a free Figma account is enough, no edit access
required.
●
Recommended: open the design in Figma Desktop and enable the Figma MCP
server (Dev Mode → Preferences → Enable local MCP server). Pairing it with an
AI coding tool (Cursor, Claude Code, etc.) lets you pull design context, tokens,
and component structure directly from the file, which can significantly speed up
the assignment.
Tech Stack
●
Use Vue 3.5.17 with Quasar Framework v2.18.5 (the starter repo is
preconfigured for you).
●
Use Node 22.17.0 (other 22.x versions should work but are not officially
supported).
●
Please base your work on the starter repo:
https://github.com/Nitra-Finance/nitra-fe-event-registration-assignment
Submission
●
Push your work to your own public GitHub repository and reply to HR with the
link, or zip the project (excluding node
_
modules) and email it to HR.
●
Please keep a complete commit history that reflects your development process
— atomic, well-described commits are part of how we evaluate code quality.
●
Make sure the project builds and runs locally with yarn && yarn dev after a clean
checkout.
●
Include a PLAN.md at the repo root that documents your development journey:
o How you planned and broke down the task
o Key decisions and why you made them
o Why you chose each additional dependency (what problem it solves,
alternatives you considered)
o How you used AI tools (prompts, conversations, what worked / what
didn’t)
o Any challenges encountered and how you solved them
o What you would improve given more time
Evaluation Criteria
1. Vue Patterns (25%)
●
Composable extraction
●
Proper v-model / defineModel usage
●
Cross-step state management (via composable or provide/inject)
●
Preference for computed derived state over manual watch updates
2. Design Fidelity (20%)
●
Correct usage of semantic CSS variables / UnoCSS shortcuts (vs hardcoded
hex)
●
Pixel-perfect reproduction of the Figma design
●
All interactive states handled (hover, disabled, error, active)
3. Code Quality & Architecture (20%)
●
Clear variable and function naming
●
JSDoc annotations on key functions (parameters, return values)
●
Logical component decomposition
●
Clean file and folder structure
●
Proper error and edge-case handling
4. JavaScript Logic (20%)
●
Correctness of business logic (calculations, comparisons, rule evaluation)
●
Data transformation and shaping (parsing, grouping, sorting, filtering)
●
Handling of edge cases and boundary conditions
5. UX Polish (15%)
●
Stepper navigation feel
●
Validation error experience
●
Loading and disabled states
●
Transitions and animations
Bonus — AI Collaboration (up to +5%)
●
Quality of PLAN.md: prompts that worked, where AI fell short, how you
reviewed/corrected AI output
●
Demonstrates thoughtful collaboration with AI tools rather than blind acceptance
of generated code
Not Evaluated
●
●
Backend / API implementation
CI/CD or deployment
●
Test coverage percentage