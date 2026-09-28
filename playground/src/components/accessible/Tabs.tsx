import React, {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  useCallback,
} from "react";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";

interface TabsContextValue {
  value: string;
  onValueChange: (val: string) => void;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  baseId: string;
  registerTab: (tabValue: string, element: HTMLButtonElement | null) => void;
  tabElementsRef: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a <Tabs> component.`);
  }
  return context;
}

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (val: string) => void;
  orientation?: TabsOrientation;
  activationMode?: TabsActivationMode;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  orientation = "horizontal",
  activationMode = "automatic",
  children,
  className = "",
}: TabsProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? "");
  const baseId = useId();
  const tabElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      controlledOnValueChange?.(newValue);
    },
    [isControlled, controlledOnValueChange]
  );

  const registerTab = useCallback(
    (tabValue: string, element: HTMLButtonElement | null) => {
      if (element) {
        tabElementsRef.current.set(tabValue, element);
      } else {
        tabElementsRef.current.delete(tabValue);
      }
    },
    []
  );

  return (
    <TabsContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleValueChange,
        orientation,
        activationMode,
        baseId,
        registerTab,
        tabElementsRef,
      }}
    >
      <div
        data-orientation={orientation}
        className={`flex ${orientation === "vertical" ? "flex-row gap-6" : "flex-col gap-3"} ${className}`}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsList({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className = "",
}: TabsListProps) {
  const { orientation, activationMode, onValueChange, tabElementsRef } =
    useTabsContext("TabsList");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(tabElementsRef.current.entries())
      .filter(([, el]) => el && !el.disabled)
      .map(([val, el]) => ({ value: val, element: el }));

    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex(
      (item) => item.element === document.activeElement
    );
    if (currentIndex === -1) return;

    let targetIndex = -1;
    const isHorizontal = orientation === "horizontal";

    if (
      (isHorizontal && e.key === "ArrowRight") ||
      (!isHorizontal && e.key === "ArrowDown")
    ) {
      e.preventDefault();
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (
      (isHorizontal && e.key === "ArrowLeft") ||
      (!isHorizontal && e.key === "ArrowUp")
    ) {
      e.preventDefault();
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = tabs.length - 1;
    }

    if (targetIndex !== -1) {
      const targetTab = tabs[targetIndex];
      targetTab.element.focus();
      if (activationMode === "automatic") {
        onValueChange(targetTab.value);
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center rounded-lg bg-neutral-800 p-1 border border-neutral-700/60 ${
        orientation === "vertical" ? "flex-col items-stretch w-48" : "w-fit"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({
  value,
  disabled = false,
  children,
  className = "",
}: TabsTriggerProps) {
  const {
    value: activeValue,
    onValueChange,
    activationMode,
    baseId,
    registerTab,
  } = useTabsContext("TabsTrigger");

  const isSelected = activeValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const setRef = useCallback(
    (el: HTMLButtonElement | null) => {
      registerTab(value, el);
    },
    [registerTab, value]
  );

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (activationMode === "manual" && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      onValueChange(value);
    }
  };

  return (
    <button
      ref={setRef}
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      aria-disabled={disabled || undefined}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      className={`relative inline-flex items-center justify-center rounded-md px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${
        isSelected
          ? "bg-neutral-900 text-white shadow-xs"
          : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className = "",
}: TabsContentProps) {
  const { value: activeValue, baseId } = useTabsContext("TabsContent");
  const isSelected = activeValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isSelected}
      className={`rounded-lg border border-neutral-700/60 bg-neutral-900/50 p-4 text-neutral-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        !isSelected ? "hidden" : ""
      } ${className}`}
    >
      {isSelected && children}
    </div>
  );
}
