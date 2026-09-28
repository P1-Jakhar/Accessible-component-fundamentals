# Accessible Component Fundamentals (React + TypeScript)

> Built from scratch against **W3C ARIA Authoring Practices Guide (APG)** patterns and audited against **shadcn/ui** (Base UI primitives).

This project demonstrates the core engineering requirements behind building accessible interactive components by hand in React and TypeScript, providing an in-depth comparative audit against production design system primitives.

---

## 🛠️ Deliverables

1. **`playground/`**:
   - **Handcrafted Accessible Components** (`playground/src/components/accessible/`):
     - **Modal Dialog** (`Modal.tsx`): Focus trap (`Tab` / `Shift+Tab`), `Escape` dismissal, focus restoration to trigger element on unmount, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, body scroll lock.
     - **Tabs** (`Tabs.tsx`): Roving `tabIndex`, arrow navigation (`ArrowRight`/`ArrowLeft` horizontal, `ArrowDown`/`ArrowUp` vertical), `Home`/`End` keys, automatic vs manual activation modes, disabled tabs, `role="tablist"`, `role="tab"`, `role="tabpanel"`.
     - **Disclosure** (`Disclosure.tsx`): Native `<button>` trigger, `Enter`/`Space` activation, `aria-expanded`, `aria-controls`, `role="region"`, `hidden` DOM exclusion when collapsed, heading semantics.
   - **shadcn/ui Components** (`playground/src/components/ui/`):
     - Official `dialog.tsx` and `tabs.tsx` generated via `npx shadcn@latest add dialog tabs`.
   - **Interactive Playground Application** (`playground/src/App.tsx`):
     - Interactive showcase for all three handcrafted components.
     - Live focus restoration indicator.
     - Side-by-side shadcn comparison.
     - Interactive keyboard verification matrix.
2. **`NOTES.md`**:
   - Comprehensive comparative architectural audit.
   - Deep-dive into **6 concrete gaps** between handcrafted implementations and shadcn / Base UI headless primitives (Layer stacks, layout shift scrollbar compensation, RTL arrow mapping, CSS exit animation lifecycles, polymorphic `asChild`/`render` composition, and `inert`/`aria-hidden` background tree isolation).
   - TypeScript typing verification (zero `any` escapes).
   - Step-by-step keyboard testing guide.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm or yarn

### Installation & Running

From the repository root:
```bash
# Install dependencies in the playground
cd playground
npm install

# Start development server
npm run dev
```

Or from the root directory:
```bash
npm run dev
```

### Type Checking & Production Build
```bash
npm run build
```
This runs `tsc -b && vite build` with zero TypeScript errors and zero `any` escapes in component props.

### Linting
```bash
npm run lint
```

---

## ⌨️ Keyboard Interaction Summary

| Component | Keystrokes | Expected Behavior |
| :--- | :--- | :--- |
| **Modal Dialog** | `Tab` / `Shift+Tab` | Traps focus inside dialog; wraps around from first to last and vice versa. |
| | `Escape` | Closes dialog; automatically restores focus to the triggering element. |
| **Tabs** | `ArrowRight` / `ArrowLeft` | Moves focus between horizontal tabs (with circular wrap-around). |
| | `ArrowDown` / `ArrowUp` | Moves focus between vertical tabs (when in vertical orientation). |
| | `Home` / `End` | Jumps to first / last enabled tab. |
| | `Space` / `Enter` | Selects active tab in manual activation mode. |
| | `Tab` | Moves focus from active tab into active `tabpanel`. |
| **Disclosure** | `Enter` / `Space` | Expands or collapses content section; updates `aria-expanded`. |
| | `Tab` | Navigates to trigger; bypasses content when collapsed (`hidden`). |
