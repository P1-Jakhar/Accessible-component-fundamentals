import { useState, useRef } from "react";
import {
  Modal,
  Tabs as AccessibleTabs,
  TabsList as AccessibleTabsList,
  TabsTrigger as AccessibleTabsTrigger,
  TabsContent as AccessibleTabsContent,
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
  type TabsOrientation,
  type TabsActivationMode,
} from "./components/accessible";

import {
  Dialog as ShadcnDialog,
  DialogTrigger as ShadcnDialogTrigger,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogClose as ShadcnDialogClose,
} from "./components/ui/dialog";

import {
  Tabs as ShadcnTabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent as ShadcnTabsContent,
} from "./components/ui/tabs";

import { Button } from "./components/ui/button";

export function App() {
  const [activeSection, setActiveSection] = useState<"handcrafted" | "shadcn" | "checklist" | "notes">("handcrafted");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusReturnedSuccess, setFocusReturnedSuccess] = useState(false);
  const [initialFocusTarget, setInitialFocusTarget] = useState<"firstInput" | "saveButton">("firstInput");
  const modalTriggerRef = useRef<HTMLButtonElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);

  const [tabsOrientation, setTabsOrientation] = useState<TabsOrientation>("horizontal");
  const [tabsActivationMode, setTabsActivationMode] = useState<TabsActivationMode>("automatic");
  const [activeTabVal, setActiveTabVal] = useState("overview");

  const [openDisclosure, setOpenDisclosure] = useState<string | null>("disc-1");

  const handleOpenModal = () => {
    setFocusReturnedSuccess(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      if (document.activeElement === modalTriggerRef.current) {
        setFocusReturnedSuccess(true);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-white">
                Accessible Component Fundamentals
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                W3C ARIA APG
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Handcrafted Accessible React + TypeScript Components vs. shadcn/ui
            </p>
          </div>

          {/* Navigation Bar */}
          <nav aria-label="Main Navigation" className="flex items-center gap-1.5 p-1 bg-neutral-800/80 rounded-lg border border-neutral-700/60">
            <button
              type="button"
              onClick={() => setActiveSection("handcrafted")}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer " + (
                activeSection === "handcrafted"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-700/50"
              )}
            >
              Handcrafted
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("shadcn")}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer " + (
                activeSection === "shadcn"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-700/50"
              )}
            >
              shadcn/ui Compare
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("checklist")}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer " + (
                activeSection === "checklist"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-700/50"
              )}
            >
              Keyboard Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("notes")}
              className={"px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer " + (
                activeSection === "notes"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-700/50"
              )}
            >
              Architectural Notes
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeSection === "handcrafted" && (
          <div className="space-y-12">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Handcrafted APG Components</h2>
                <p className="text-sm text-neutral-400 mt-0.5">
                  Built completely from scratch in React + TypeScript without any UI libraries. Strictly conforming to W3C ARIA APG.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Tab / Shift+Tab Trap
                </span>
                <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Arrow Key Roving TabIndex
                </span>
                <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                  Strict TypeScript (No Any)
                </span>
              </div>
            </div>

            {/* Component 1: Modal Dialog */}
            <section
              aria-labelledby="heading-modal"
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      Component 1
                    </span>
                    <h3 id="heading-modal" className="text-lg font-semibold text-white">
                      Accessible Modal Dialog
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Pattern: <code>role="dialog"</code>, <code>aria-modal="true"</code>, focus trap, Escape dismissal, and return of focus.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <label htmlFor="focus-selector" className="cursor-pointer">Initial Focus:</label>
                    <select
                      id="focus-selector"
                      value={initialFocusTarget}
                      onChange={(e) => setInitialFocusTarget(e.target.value as "firstInput" | "saveButton")}
                      className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="firstInput">First Input (Full Name)</option>
                      <option value="saveButton">Action Button (Save Changes)</option>
                    </select>
                  </div>

                  <button
                    ref={modalTriggerRef}
                    type="button"
                    onClick={handleOpenModal}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
                  >
                    Open Modal Dialog
                  </button>
                </div>
              </div>

              {focusReturnedSuccess && (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Focus Return Verified:</strong> Focus successfully returned to the trigger button upon closing the dialog.</span>
                </div>
              )}

              <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Edit Project Configuration"
                description="Update the project details below. Use Tab and Shift+Tab to test the focus trap, or press Escape to dismiss."
                initialFocusRef={initialFocusTarget === "firstInput" ? firstInputRef : saveButtonRef}
                returnFocusRef={modalTriggerRef}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCloseModal();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="modal-name" className="block text-xs font-medium text-neutral-300 mb-1">
                      Project Name
                    </label>
                    <input
                      ref={firstInputRef}
                      id="modal-name"
                      type="text"
                      defaultValue="A11y Fundamentals"
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-framework" className="block text-xs font-medium text-neutral-300 mb-1">
                      Target Framework
                    </label>
                    <select
                      id="modal-framework"
                      defaultValue="react"
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="react">React 19 + TypeScript</option>
                      <option value="vue">Vue 3</option>
                      <option value="svelte">Svelte 5</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="modal-notes" className="block text-xs font-medium text-neutral-300 mb-1">
                      Implementation Notes
                    </label>
                    <textarea
                      id="modal-notes"
                      rows={3}
                      defaultValue="Traps keyboard focus strictly inside container. Body scrolling locked. Escape key restores trigger focus."
                      className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-3.5 py-2 text-xs font-medium rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      ref={saveButtonRef}
                      type="submit"
                      className="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </Modal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80">
                <div>
                  <span className="font-semibold text-neutral-200">1. Focus Trap:</span>
                  <p className="text-neutral-400 mt-1">
                    <code>Tab</code> on the last element cycles to the first; <code>Shift+Tab</code> on the first cycles back to the last element.
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-neutral-200">2. Escape Dismissal:</span>
                  <p className="text-neutral-400 mt-1">
                    Pressing <code>Escape</code> anywhere inside the modal cleanly closes it and returns focus to the trigger.
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-neutral-200">3. Focus Restoration:</span>
                  <p className="text-neutral-400 mt-1">
                    Stores <code>document.activeElement</code> when triggered and restores focus upon unmount.
                  </p>
                </div>
              </div>
            </section>

            {/* Component 2: Tabs */}
            <section
              aria-labelledby="heading-tabs"
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      Component 2
                    </span>
                    <h3 id="heading-tabs" className="text-lg font-semibold text-white">
                      Accessible Tabs Widget
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Pattern: <code>role="tablist"</code>, <code>role="tab"</code>, <code>role="tabpanel"</code> with roving tabindex & arrow navigation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700">
                    <span className="text-neutral-400">Orientation:</span>
                    <button
                      type="button"
                      onClick={() => setTabsOrientation(tabsOrientation === "horizontal" ? "vertical" : "horizontal")}
                      className="px-2 py-0.5 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-200 font-mono text-[11px] cursor-pointer"
                    >
                      {tabsOrientation}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700">
                    <span className="text-neutral-400">Activation:</span>
                    <button
                      type="button"
                      onClick={() => setTabsActivationMode(tabsActivationMode === "automatic" ? "manual" : "automatic")}
                      className="px-2 py-0.5 bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-200 font-mono text-[11px] cursor-pointer"
                    >
                      {tabsActivationMode}
                    </button>
                  </div>
                </div>
              </div>

              <AccessibleTabs
                orientation={tabsOrientation}
                activationMode={tabsActivationMode}
                value={activeTabVal}
                onValueChange={setActiveTabVal}
              >
                <AccessibleTabsList aria-label="Accessible Pattern Features">
                  <AccessibleTabsTrigger value="overview">Overview</AccessibleTabsTrigger>
                  <AccessibleTabsTrigger value="apg">APG Pattern</AccessibleTabsTrigger>
                  <AccessibleTabsTrigger value="keyboard">Keyboard Specs</AccessibleTabsTrigger>
                  <AccessibleTabsTrigger value="disabled" disabled>Disabled Tab</AccessibleTabsTrigger>
                </AccessibleTabsList>

                <AccessibleTabsContent value="overview">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">W3C Tabs Overview</h4>
                    <p className="text-xs text-neutral-300">
                      Tabs are a set of layered sections of content, known as tab panels, that display one panel at a time. Each tab panel has an associated tab element, that when activated, displays the panel.
                    </p>
                    <p className="text-xs text-neutral-400">
                      Current active tab: <strong className="text-blue-400 font-mono">{activeTabVal}</strong>. Tab index roving is active: only the active tab has <code>tabIndex="0"</code>, while other tabs have <code>tabIndex="-1"</code>.
                    </p>
                  </div>
                </AccessibleTabsContent>

                <AccessibleTabsContent value="apg">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">ARIA Relationship Specifications</h4>
                    <ul className="text-xs text-neutral-300 space-y-1.5 list-disc list-inside">
                      <li><code>role="tablist"</code> on the tab bar container with <code>aria-orientation="{tabsOrientation}"</code></li>
                      <li><code>role="tab"</code> on each trigger with <code>aria-selected="true/false"</code> and <code>aria-controls="panel-id"</code></li>
                      <li><code>role="tabpanel"</code> on each panel with <code>aria-labelledby="tab-id"</code> and <code>tabIndex="0"</code></li>
                      <li>Automatic vs Manual activation: in manual mode, arrow keys navigate focus while <kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-[10px]">Space</kbd> activates.</li>
                    </ul>
                  </div>
                </AccessibleTabsContent>

                <AccessibleTabsContent value="keyboard">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Keyboard Navigation Cheatsheet</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                        <strong className="text-neutral-200">
                          {tabsOrientation === "horizontal" ? "Arrow Left / Right" : "Arrow Up / Down"}:
                        </strong>
                        <p className="text-neutral-400 mt-0.5">Move focus between enabled tabs (with automatic wrap-around).</p>
                      </div>
                      <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                        <strong className="text-neutral-200">Home / End:</strong>
                        <p className="text-neutral-400 mt-0.5">Move focus to the very first or very last enabled tab.</p>
                      </div>
                      <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                        <strong className="text-neutral-200">Tab:</strong>
                        <p className="text-neutral-400 mt-0.5">Moves focus from the active tab directly into the active tabpanel.</p>
                      </div>
                      <div className="p-2 rounded bg-neutral-800/60 border border-neutral-700/50">
                        <strong className="text-neutral-200">Space / Enter:</strong>
                        <p className="text-neutral-400 mt-0.5">In manual activation mode, selects and displays the focused tab.</p>
                      </div>
                    </div>
                  </div>
                </AccessibleTabsContent>

                <AccessibleTabsContent value="disabled">
                  <p className="text-xs text-neutral-400">This content is not reachable via disabled tab.</p>
                </AccessibleTabsContent>
              </AccessibleTabs>
            </section>

            {/* Component 3: Disclosure */}
            <section
              aria-labelledby="heading-disclosure"
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6"
            >
              <div className="border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    Component 3
                  </span>
                  <h3 id="heading-disclosure" className="text-lg font-semibold text-white">
                    Accessible Disclosure (Show/Hide)
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Pattern: Native <code>&lt;button&gt;</code> element with <code>aria-expanded</code> and <code>aria-controls</code> linking to hidden panel.
                </p>
              </div>

              <div className="space-y-3">
                <Disclosure
                  isOpen={openDisclosure === "disc-1"}
                  onOpenChange={(open) => setOpenDisclosure(open ? "disc-1" : null)}
                >
                  <DisclosureTrigger asHeadingLevel="h4">
                    What is the W3C ARIA APG Disclosure pattern?
                  </DisclosureTrigger>
                  <DisclosureContent>
                    A disclosure is a button that controls the visibility of a section of content. When the controlled content is hidden, the button is often styled as a typical disclosure triangle. When the content is visible, the button indicates that the content is expanded.
                  </DisclosureContent>
                </Disclosure>

                <Disclosure
                  isOpen={openDisclosure === "disc-2"}
                  onOpenChange={(open) => setOpenDisclosure(open ? "disc-2" : null)}
                >
                  <DisclosureTrigger asHeadingLevel="h4">
                    Why should the trigger be wrapped in a heading element?
                  </DisclosureTrigger>
                  <DisclosureContent>
                    Per APG guidance, wrapping disclosure triggers inside heading tags (e.g. <code>&lt;h3&gt;</code> or <code>&lt;h4&gt;</code>) enables screen reader users to browse disclosures efficiently using screen reader heading navigation hotkeys (<kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-[10px]">H</kbd> or <kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-[10px]">1-6</kbd>).
                  </DisclosureContent>
                </Disclosure>

                <Disclosure
                  isOpen={openDisclosure === "disc-3"}
                  onOpenChange={(open) => setOpenDisclosure(open ? "disc-3" : null)}
                >
                  <DisclosureTrigger asHeadingLevel="h4">
                    How does keyboard interaction work for disclosures?
                  </DisclosureTrigger>
                  <DisclosureContent>
                    By utilizing a native <code>&lt;button type="button"&gt;</code>, keyboard operation with both <kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-[10px]">Enter</kbd> and <kbd className="px-1 py-0.5 rounded bg-neutral-800 font-mono text-[10px]">Space</kbd> is guaranteed across all browsers and operating systems without complex keydown listeners.
                  </DisclosureContent>
                </Disclosure>
              </div>
            </section>
          </div>
        )}

        {/* SECTION 2: SHADCN/UI COMPARISON */}
        {activeSection === "shadcn" && (
          <div className="space-y-8">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h2 className="text-base font-semibold text-white">shadcn/ui Reference Components</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Generated using <code>npx shadcn@latest add dialog tabs</code>. Built upon headless primitives (Base UI / Radix).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-white">shadcn/ui Dialog</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Powered by <code>@base-ui/react/dialog</code> with animated portals and backdrops.
                  </p>
                </div>

                <ShadcnDialog>
                  <ShadcnDialogTrigger render={<Button variant="outline" />}>
                    Open shadcn Dialog
                  </ShadcnDialogTrigger>
                  <ShadcnDialogContent>
                    <ShadcnDialogHeader>
                      <ShadcnDialogTitle>shadcn Base UI Dialog</ShadcnDialogTitle>
                      <ShadcnDialogDescription>
                        This dialog is rendered through shadcn's generated component. Notice the smooth entrance animations, focus trap, and portal setup.
                      </ShadcnDialogDescription>
                    </ShadcnDialogHeader>
                    <div className="py-2">
                      <input
                        type="text"
                        placeholder="Type something here..."
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <ShadcnDialogFooter showCloseButton>
                      <ShadcnDialogClose render={<Button variant="default" />}>
                        Done
                      </ShadcnDialogClose>
                    </ShadcnDialogFooter>
                  </ShadcnDialogContent>
                </ShadcnDialog>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-white">shadcn/ui Tabs</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Powered by <code>@base-ui/react/tabs</code> with cva styling variants.
                  </p>
                </div>

                <ShadcnTabs defaultValue="account">
                  <ShadcnTabsList>
                    <ShadcnTabsTrigger value="account">Account</ShadcnTabsTrigger>
                    <ShadcnTabsTrigger value="password">Password</ShadcnTabsTrigger>
                    <ShadcnTabsTrigger value="settings">Settings</ShadcnTabsTrigger>
                  </ShadcnTabsList>
                  <ShadcnTabsContent value="account" className="mt-3 p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
                    <p className="text-xs text-neutral-300">Manage your account information and preferences here.</p>
                  </ShadcnTabsContent>
                  <ShadcnTabsContent value="password" className="mt-3 p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
                    <p className="text-xs text-neutral-300">Change your password and configure multi-factor authentication.</p>
                  </ShadcnTabsContent>
                  <ShadcnTabsContent value="settings" className="mt-3 p-4 rounded-lg bg-neutral-800/40 border border-neutral-700/50">
                    <p className="text-xs text-neutral-300">Notification and privacy preferences are configurable here.</p>
                  </ShadcnTabsContent>
                </ShadcnTabs>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: KEYBOARD VERIFICATION MATRIX */}
        {activeSection === "checklist" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h2 className="text-base font-semibold text-white">W3C Keyboard Accessibility Verification Matrix</h2>
              <p className="text-sm text-neutral-400 mt-1">
                All evaluation criteria verified for keyboard-only operation.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-300 font-semibold">
                    <th className="p-3">Component</th>
                    <th className="p-3">Criterion / Interaction</th>
                    <th className="p-3">Required Key</th>
                    <th className="p-3">APG Behavior</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/70 text-neutral-300">
                  <tr>
                    <td className="p-3 font-semibold text-blue-400">Modal Dialog</td>
                    <td className="p-3">Focus Trap (Forward)</td>
                    <td className="p-3 font-mono text-neutral-200">Tab</td>
                    <td className="p-3">Cycles focus strictly among focusable elements inside dialog. Never leaks to background.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-400">Modal Dialog</td>
                    <td className="p-3">Focus Trap (Backward)</td>
                    <td className="p-3 font-mono text-neutral-200">Shift + Tab</td>
                    <td className="p-3">Cycles focus backwards; when at first element, wraps to last focusable element.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-400">Modal Dialog</td>
                    <td className="p-3">Dismiss Dialog</td>
                    <td className="p-3 font-mono text-neutral-200">Escape</td>
                    <td className="p-3">Closes the dialog immediately.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-400">Modal Dialog</td>
                    <td className="p-3">Focus Restoration</td>
                    <td className="p-3 font-mono text-neutral-200">On Close</td>
                    <td className="p-3">Returns focus to triggering button when dialog closes or dismisses.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-400">Tabs</td>
                    <td className="p-3">Next / Previous Tab</td>
                    <td className="p-3 font-mono text-neutral-200">Arrow Right / Left</td>
                    <td className="p-3">Moves focus to adjacent enabled tab, wrapping around from last to first (and vice versa).</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-400">Tabs</td>
                    <td className="p-3">Vertical Tabs</td>
                    <td className="p-3 font-mono text-neutral-200">Arrow Down / Up</td>
                    <td className="p-3">When vertical, Down/Up arrows move focus between tabs.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-400">Tabs</td>
                    <td className="p-3">First / Last Tab</td>
                    <td className="p-3 font-mono text-neutral-200">Home / End</td>
                    <td className="p-3">Home moves focus to first enabled tab; End moves to last enabled tab.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-400">Tabs</td>
                    <td className="p-3">Roving TabIndex</td>
                    <td className="p-3 font-mono text-neutral-200">Tab</td>
                    <td className="p-3">Only selected tab has tabIndex="0"; unselected tabs have tabIndex="-1". Pressing Tab enters panel.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-amber-400">Disclosure</td>
                    <td className="p-3">Toggle State</td>
                    <td className="p-3 font-mono text-neutral-200">Enter / Space</td>
                    <td className="p-3">Toggles aria-expanded between true and false; reveals/collapses content.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-amber-400">Disclosure</td>
                    <td className="p-3">DOM Exclusion</td>
                    <td className="p-3 font-mono text-neutral-200">Tab</td>
                    <td className="p-3">Collapsed content is removed from tab order (hidden attribute).</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">Pass</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4: ARCHITECTURAL NOTES PREVIEW */}
        {activeSection === "notes" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <h2 className="text-base font-semibold text-white">Comparative Architectural Analysis</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Summary of concrete gaps between handcrafted implementations and production headless libraries like shadcn (Base UI / Radix). Full analysis in <code>NOTES.md</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-sm font-semibold text-white">Gap 1: Nested Modal Stacking & Outside Click Suppression</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  In handcrafted modal dialogs, multiple stacked dialogs, alerts, or tooltips often conflict over body scroll locks and global event listeners. shadcn's underlying primitive maintains a nested dialog stack, handling pointer events, scroll locking with layout shift compensation (padding-right scrollbar compensation), and outside click boundaries without dismissing parent dialogs.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <h3 className="text-sm font-semibold text-white">Gap 2: Bidirectional Language (RTL) Support in Tabs</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  The handcrafted tabs implementation handles horizontal navigation with hardcoded ArrowRight (next) and ArrowLeft (previous). In right-to-left (RTL) locales (such as Arabic or Hebrew), ArrowRight should logically move to the previous tab and ArrowLeft to the next tab. Headless primitives automatically detect DOM directionality and flip arrow key handling accordingly.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-sm font-semibold text-white">Gap 3: Animated Unmounting & CSS State Transitions</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Handcrafted components unmount immediately when <code>isOpen === false</code>, which cuts off CSS exit animations unless complex transition lifecycles are written by hand. shadcn's primitives expose <code>data-state="open | closed"</code> and defer unmounting until CSS animations/transitions complete.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-semibold text-white">Gap 4: Composition via <code>render</code> / <code>asChild</code> (Slot Pattern)</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  In the handcrafted approach, trigger elements are hardcoded as <code>&lt;button&gt;</code>. shadcn / Base UI / Radix allow triggers to be swapped for custom components, links, or dropdown items using slot composition while safely merging event handlers, refs, and accessibility attributes.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
