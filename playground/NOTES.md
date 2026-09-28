# NOTES.md: Accessible Component Fundamentals & shadcn/ui Comparison

## 1. Executive Summary

This repository implements three fundamental accessible UI components from scratch in **React 19 + TypeScript** without relying on any external component libraries:
1. **Modal Dialog** (`role="dialog"`, `aria-modal="true"`)
2. **Tabs** (`role="tablist"`, `role="tab"`, `role="tabpanel"`)
3. **Disclosure** (Show / Hide accordion pattern with `aria-expanded`)

Each component was built strictly against its **W3C ARIA Authoring Practices Guide (APG)** pattern specifications, ensuring complete keyboard navigability (Tab, Shift+Tab, Escape, Arrow keys, Home, End, Space, Enter), robust focus management (initial focus, focus trapping, and focus restoration to the invocation trigger), and 100% strict TypeScript types with **zero `any` escapes**.

Following implementation, **shadcn/ui** was installed and configured (generating components backed by modern headless primitives like Base UI / Radix). An architectural code audit was conducted comparing our handcrafted components against shadcn's generated source code to identify what production headless component libraries handle beyond foundational APG patterns.

---

## 2. Handcrafted Components & W3C ARIA APG Pattern Conformance

### 2.1 Modal Dialog Pattern (`src/components/accessible/Modal.tsx`)

* **W3C APG Spec**: [W3C ARIA APG: Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
* **ARIA Roles & Attributes**:
  * `role="dialog"`: Explicitly declares the container as an interactive dialog.
  * `aria-modal="true"`: Instructs assistive technologies that content outside this container is inert and not part of the active interaction layer.
  * `aria-labelledby={titleId}`: Automatically links the dialog window to its `<h2>` heading element using React 19's `useId()`.
  * `aria-describedby={descriptionId}`: Links optional descriptive text to provide immediate auditory context to screen readers upon focus.
  * `tabIndex={-1}`: Allows programmatic focus to the dialog container itself if no interactive children are present.
* **Keyboard Interaction & Focus Management**:
  * **Trigger Element Tracking & Focus Return**: Upon opening, the component captures `document.activeElement` (or an optional explicit `returnFocusRef`). When the modal closes or unmounts, focus is automatically and reliably returned to that triggering element.
  * **Initial Focus Placement**: An optional `initialFocusRef` allows directing focus to a primary input or action button. If omitted, focus automatically lands on the first focusable element inside the modal via `requestAnimationFrame`.
  * **Focus Trap (`Tab` and `Shift + Tab`)**: The dialog queries all focusable elements (`a[href]`, `button`, `textarea`, `input`, `select`, `[tabindex]:not([tabindex="-1"])`). When focus reaches the last focusable element and the user presses `Tab`, focus cycles to the first focusable element. When focus is at the first element and the user presses `Shift + Tab`, focus cycles to the last focusable element.
  * **Dismissal (`Escape`)**: Pressing `Escape` triggers `onClose()`, halts event propagation, and closes the modal cleanly.
  * **Body Scroll Lock**: `document.body.style.overflow = "hidden"` prevents unwanted background scrolling while the modal is visible, reverting seamlessly on cleanup.
  * **Portal Rendering**: Uses `createPortal(..., document.body)` to avoid z-index stacking context collisions with parent DOM hierarchies.

---

### 2.2 Tabs Pattern (`src/components/accessible/Tabs.tsx`)

* **W3C APG Spec**: [W3C ARIA APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
* **ARIA Roles & Attributes**:
  * `role="tablist"`: Declares the container for the group of tabs. Configured with `aria-orientation="horizontal" | "vertical"` and `aria-label` or `aria-labelledby`.
  * `role="tab"`: Applied to each tab trigger. Includes `aria-selected="true" | "false"` and `aria-controls={panelId}`.
  * `role="tabpanel"`: Applied to each content area. Includes `aria-labelledby={tabId}` to identify which tab labels the panel.
  * `tabIndex={0}`: Placed on each tabpanel per APG recommendations so keyboard users can navigate into panel content.
* **Keyboard Interaction**:
  * **Roving `tabIndex`**: Only the currently active tab has `tabIndex={0}`. All inactive tabs have `tabIndex={-1}`. This ensures that pressing `Tab` moves out of the tablist directly into the active tabpanel (or next focusable element), rather than forcing the user to tab through every inactive tab header.
  * **Arrow Key Navigation**:
    * **Horizontal Orientation**: `ArrowRight` moves focus to the next enabled tab; `ArrowLeft` moves focus to the previous enabled tab. Both wrap around at the boundaries.
    * **Vertical Orientation**: `ArrowDown` moves focus to the next tab; `ArrowUp` moves focus to the previous tab (with circular wrap-around).
  * **Boundary Navigation**: `Home` moves focus immediately to the first enabled tab; `End` moves focus to the last enabled tab.
  * **Activation Modes**:
    * **Automatic Activation (default)**: Navigating with arrow keys or Home/End immediately selects and activates the target tab.
    * **Manual Activation**: Arrow keys move focus across tabs without changing the selected content panel until the user explicitly presses `Enter` or `Space`.
  * **Disabled Tab Handling**: Disabled tabs are excluded from keyboard navigation and marked with `disabled` and `aria-disabled="true"`.

---

### 2.3 Disclosure Pattern (`src/components/accessible/Disclosure.tsx`)

* **W3C APG Spec**: [W3C ARIA APG: Disclosure (Show/Hide) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
* **ARIA Roles & Attributes**:
  * Trigger utilizes native `<button type="button">`: Ensures native focusability and built-in keyboard activation via both `Enter` and `Space` across all user agents.
  * `aria-expanded="true" | "false"`: Indicates whether the controlled content section is expanded or collapsed.
  * `aria-controls={contentId}`: References the `id` of the expandable content panel.
  * `role="region"` & `aria-labelledby={triggerId}`: Added to the disclosure panel when it represents a distinct document section.
* **Focus & Keyboard Interaction**:
  * **DOM Exclusion**: When collapsed, the content panel is removed from layout and tab order using the HTML5 `hidden` attribute and CSS `hidden`. Screen readers and keyboard users cannot accidentally enter hidden interactive elements.
  * **Heading Semantics**: An optional `asHeadingLevel` prop allows wrapping the disclosure trigger inside `<h2>`-`<h6>` tags so screen reader users can navigate through disclosures using heading shortcuts.

---

## 3. Concrete Gaps: What Did shadcn/ui Handle That Handcrafted Implementations Missed?

When inspecting the generated code in `src/components/ui/dialog.tsx` and `src/components/ui/tabs.tsx` (built on modern headless primitives such as Base UI and Radix UI), several sophisticated browser edge cases and architectural subtleties become apparent. While our handcrafted components strictly fulfill the W3C APG specifications for single-instance scenarios, production design systems must solve complex real-world edge cases.

Below are **6 concrete architectural gaps** identified between the handcrafted implementation and shadcn's headless primitives:

---

### Gap 1: Nested Modal Stacking, Layering, and Dismissal Boundaries

* **What our handcrafted version does**:
  Our `Modal` component attaches a global keydown listener (`document.addEventListener("keydown")`) and locks `document.body.style.overflow`.
* **The Failure Mode / Limitation**:
  If a modal dialog opens a nested child dialog (e.g. an "Are you sure you want to discard changes?" confirmation modal, a nested date picker, or a select menu), pressing `Escape` in the child dialog triggers the keydown listeners of **both** modals simultaneously, closing both. Furthermore, when the child modal unmounts, its cleanup restores `document.body.style.overflow = "auto"` even though the parent modal is still open, re-enabling background scrolling prematurely.
* **How shadcn / Base UI handles it**:
  shadcn’s underlying primitive (`@base-ui/react/dialog` / Radix) maintains an internal **stack manager (Layer Stack)**:
  1. Each mounted dialog registers into a global hierarchy.
  2. Escape key events and outside click events are intercepted by a centralized event dispatcher that routes dismissal only to the topmost dialog in the stack.
  3. Pointer events on parent dialogs are suppressed while child dialogs are active.
  4. Body scroll locking is reference-counted: scrolling is only restored when the count of active locking layers reaches zero.

---

### Gap 2: Scrollbar Gutter & Cumulative Layout Shift (CLS) on Body Lock

* **What our handcrafted version does**:
  When the modal opens, it applies `document.body.style.overflow = "hidden"`.
* **The Failure Mode / Limitation**:
  On desktop operating systems where scrollbars take physical layout width (Windows browsers, or macOS when a mouse is connected), removing the scrollbar instantly expands the viewport width by 15px to 17px. This causes all page content, fixed navigation bars, and buttons to visibly jump to the right (Cumulative Layout Shift). When the modal closes, the scrollbar returns, causing the page to jump back to the left.
* **How shadcn / Base UI handles it**:
  shadcn’s primitives compute the exact width of the scrollbar before locking:
  ```javascript
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  ```
  When locking the body, the library automatically applies `padding-right: ${scrollbarWidth}px` to `document.body` (as well as any elements marked with fixed positioning data attributes). This ensures zero layout shift when opening or closing dialogs.

---

### Gap 3: Bidirectional Language (RTL) Support in Tabs

* **What our handcrafted version does**:
  In our handcrafted `Tabs`, horizontal arrow key handling is hardcoded:
  * `ArrowRight` increments the active tab index.
  * `ArrowLeft` decrements the active tab index.
* **The Failure Mode / Limitation**:
  In Right-to-Left (RTL) writing systems (such as Arabic, Hebrew, or Urdu), the visual layout of horizontal tabs is reversed: the first tab is on the far right, and subsequent tabs proceed towards the left. In this layout, pressing `ArrowRight` moves the eye to the *left* (towards the previous tab), but the code navigates to the next tab, completely violating APG spatial navigation expectations.
* **How shadcn / Base UI handles it**:
  shadcn’s tab primitives integrate directionality detection:
  1. They check for an ancestor `DirectionProvider` context or query `getComputedStyle(element).direction`.
  2. If `dir === "rtl"`, the keydown handler dynamically flips the navigation logic:
     * `ArrowRight` triggers decrement (moves to previous tab).
     * `ArrowLeft` triggers increment (moves to next tab).

---

### Gap 4: Animated Unmounting & CSS State Transitions

* **What our handcrafted version does**:
  Our handcrafted components use conditional React mounting:
  ```tsx
  if (!isOpen) return null;
  ```
* **The Failure Mode / Limitation**:
  While opening animations can be triggered with initial CSS classes, closing/exit animations (e.g. fade-out, zoom-out, slide-up) cannot run. The moment state becomes `isOpen = false`, React immediately removes the DOM nodes from the tree, cutting off any closing transitions mid-frame.
* **How shadcn / Base UI handles it**:
  shadcn primitives decouple logical state from DOM presence:
  1. The primitive exposes HTML data attributes: `data-state="open | closed"` and `data-open` / `data-closed`.
  2. When `isOpen` transitions to `false`, the component keeps the DOM elements rendered and applies the `data-closed` attribute.
  3. Tailwind animations (e.g. `data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95`) execute.
  4. The primitive listens for `animationend` and `transitionend` events before finally removing the node from the DOM.

---

### Gap 5: Polymorphism and Composition via the Slot / `render` Pattern

* **What our handcrafted version does**:
  In our handcrafted components, the trigger elements are hardcoded as native HTML tags:
  ```tsx
  <button type="button" onClick={toggle} ...>
  ```
  If a consumer wants the trigger to be a custom link (`<Link>`), a specialized styled component, or a dropdown menu item, they cannot do so without modifying the component internals.
* **How shadcn / Base UI handles it**:
  shadcn primitives utilize either the Radix `asChild` pattern or the Base UI `render` prop:
  ```tsx
  <DialogTrigger render={<Button variant="outline" />}>
    Open Dialog
  </DialogTrigger>
  ```
  Under the hood, the primitive clones the child element, intelligently merges custom `onClick`, `onKeyDown`, and `ref` callbacks with the accessibility handlers, combines CSS class names, and forwards ARIA attributes (`aria-haspopup`, `aria-expanded`, `aria-controls`) onto the consumer's custom element without injecting redundant DOM wrapper nodes.

---

### Gap 6: Virtual Cursor & Assistive Technology Inertness (`inert` / `aria-hidden`)

* **What our handcrafted version does**:
  Our handcrafted focus trap intercepts keyboard `Tab` and `Shift+Tab` events.
* **The Failure Mode / Limitation**:
  Screen readers like NVDA, JAWS, and iOS VoiceOver have a "Virtual Cursor" mode (swipe navigation or Up/Down arrow reading). Even when keyboard Tab focus is trapped inside a container, a screen reader user utilizing virtual cursor commands can navigate out of the modal into background page content, hearing elements that should be hidden.
* **How shadcn / Base UI handles it**:
  shadcn / Radix primitives integrate an accessibility tree mutator (like `aria-hidden` or the modern HTML5 `inert` attribute):
  1. Upon opening a modal, all sibling elements of the modal root are queried.
  2. `aria-hidden="true"` or `element.inert = true` is applied to all background nodes.
  3. Assistive technology virtual cursors are strictly prevented from reading background elements.
  4. Upon closing, the previous `aria-hidden` states are restored cleanly.

---

## 4. TypeScript Strict Typing Verification (Zero `any` Escapes)

All components in `playground/src/components/accessible/` are authored with 100% strict TypeScript types. Component props strictly define all allowed options, event handlers, and refs:

1. **`ModalProps`**:
   ```typescript
   export interface ModalProps {
     isOpen: boolean;
     onClose: () => void;
     title: string;
     description?: string;
     children: React.ReactNode;
     initialFocusRef?: React.RefObject<HTMLElement | null>;
     returnFocusRef?: React.RefObject<HTMLElement | null>;
     closeOnOverlayClick?: boolean;
     closeOnEsc?: boolean;
     className?: string;
     overlayClassName?: string;
   }
   ```

2. **`TabsProps` & Subcomponents**:
   ```typescript
   export type TabsOrientation = "horizontal" | "vertical";
   export type TabsActivationMode = "automatic" | "manual";

   export interface TabsProps {
     defaultValue?: string;
     value?: string;
     onValueChange?: (val: string) => void;
     orientation?: TabsOrientation;
     activationMode?: TabsActivationMode;
     children: React.ReactNode;
     className?: string;
   }

   export interface TabsListProps {
     "aria-label"?: string;
     "aria-labelledby"?: string;
     children: React.ReactNode;
     className?: string;
   }

   export interface TabsTriggerProps {
     value: string;
     disabled?: boolean;
     children: React.ReactNode;
     className?: string;
   }

   export interface TabsContentProps {
     value: string;
     children: React.ReactNode;
     className?: string;
   }
   ```

3. **`DisclosureProps` & Subcomponents**:
   ```typescript
   export interface DisclosureProps {
     defaultOpen?: boolean;
     isOpen?: boolean;
     onOpenChange?: (open: boolean) => void;
     children: React.ReactNode;
     className?: string;
   }

   export interface DisclosureTriggerProps {
     children: React.ReactNode;
     className?: string;
     asHeadingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
   }

   export interface DisclosureContentProps {
     children: React.ReactNode;
     className?: string;
     roleRegion?: boolean;
   }
   ```

Verification via compiler:
```bash
npm run build
# Outputs: tsc -b && vite build -> 0 errors
```

---

## 5. Keyboard Navigation Testing Guide

The interactive playground allows comprehensive manual verification using only a keyboard.

### Test 1: Modal Dialog
1. Use `Tab` to navigate to the **"Open Modal Dialog"** button. Press `Enter` or `Space` to activate.
2. Observe that focus is immediately transferred into the modal dialog (to the First Input or Action Button as selected).
3. Press `Tab` repeatedly to cycle through the form inputs, cancel button, and save button. Notice that when you press `Tab` on the last button ("Save Changes"), focus cycles directly back to the close button / first input.
4. Press `Shift + Tab` to cycle backwards. Focus wraps from the first element to the last element.
5. Press `Escape`. The dialog closes immediately.
6. Observe the green confirmation banner: focus is immediately and automatically restored to the **"Open Modal Dialog"** trigger button.

### Test 2: Tabs (Horizontal & Vertical)
1. Use `Tab` to focus on the active tab in the Tabs widget.
2. In **Horizontal Mode**:
   * Press `ArrowRight` to move to the next tab. Notice the active panel switches immediately (automatic activation).
   * Press `ArrowLeft` to move to the previous tab.
   * Notice that the "Disabled Tab" is skipped by arrow navigation.
   * Press `End` to jump directly to the last enabled tab.
   * Press `Home` to jump directly to the first tab.
3. Switch orientation to **Vertical Mode**:
   * Press `ArrowDown` and `ArrowUp` to navigate up and down the tab list.
4. Switch activation mode to **Manual Mode**:
   * Press arrow keys: focus moves between tab triggers without switching the displayed tabpanel.
   * Press `Enter` or `Space` on the focused tab: the tabpanel now activates.
5. While focused on an active tab, press `Tab`: focus moves into the active `tabpanel` container (which has `tabIndex="0"`).

### Test 3: Disclosure (Accordion)
1. Press `Tab` to navigate onto a disclosure heading trigger button.
2. Press `Enter` or `Space` to toggle the disclosure open and closed.
3. Observe that `aria-expanded` toggles between `"true"` and `"false"`.
4. When collapsed, press `Tab` to verify that the collapsed content cannot be focused or selected. When expanded, any interactive content inside is reachable via `Tab`.

---

## 6. Summary Comparison Table

| Accessibility Feature | Handcrafted APG Implementation | shadcn/ui (Base UI Primitives) |
| :--- | :--- | :--- |
| **W3C APG Roles & Relationships** | Complete (`dialog`, `tablist`, `tab`, `tabpanel`, `region`) | Complete |
| **Keyboard Interaction** | Tab, Shift+Tab, Escape, Arrows, Home, End, Enter, Space | Tab, Shift+Tab, Escape, Arrows, Home, End, Enter, Space |
| **Focus Trapping** | Custom DOM query & Tab/Shift+Tab cycle | Layer-aware FocusScope primitive |
| **Focus Return on Close** | Automatic via captured activeElement ref | Automatic via Base UI Portal/Overlay stack |
| **Nested Modal Dismissal** | Single global listener (can conflict if stacked) | Centralized Layer Stack (topmost dismissed first) |
| **Scroll Lock Layout Shift** | `overflow: hidden` (shifts layout on desktop) | Measures scrollbar width, applies `padding-right` |
| **RTL Bidirectional Tabs** | Fixed Arrow Left/Right mapping | Automatically flips arrow direction for RTL |
| **Animation Lifecycles** | Instant unmount on false state | `data-state` & `data-open/closed` waits for exit animations |
| **Polymorphic Triggers** | Hardcoded `<button>` | `render` prop / `asChild` slot pattern |
| **Assistive Tech Inertness** | Intercepts `Tab` | Full DOM tree isolation (`inert` / `aria-hidden`) |
| **TypeScript Type Safety** | 100% strict, zero `any` escapes | 100% strict, fully typed props and events |
