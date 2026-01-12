## 2024-05-23 - Accessibility Patterns: Icon-Only Buttons
**Learning:** Found a consistent pattern of icon-only buttons (like "Close" in Modals or "Clear" in Search inputs) missing `aria-label` attributes. This leaves screen reader users with no context for these interactive elements.
**Action:** Always check interactive icon elements for `aria-label`. If visual text is missing, `aria-label` is mandatory. Added labels to `SearchableSelect` and `Modal` components.
