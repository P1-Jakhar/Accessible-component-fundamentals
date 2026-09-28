import React, {
  createContext,
  useContext,
  useId,
  useState,
  useCallback,
} from "react";

interface DisclosureContextValue {
  isOpen: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
}

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

function useDisclosureContext(componentName: string): DisclosureContextValue {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error(
      `${componentName} must be used within a <Disclosure> component.`
    );
  }
  return context;
}

export interface DisclosureProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Disclosure({
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  children,
  className = "",
}: DisclosureProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const toggle = useCallback(() => {
    const nextState = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(nextState);
    }
    controlledOnOpenChange?.(nextState);
  }, [isOpen, isControlled, controlledOnOpenChange]);

  return (
    <DisclosureContext.Provider
      value={{
        isOpen,
        toggle,
        triggerId,
        contentId,
      }}
    >
      <div className={`border border-neutral-700 rounded-lg overflow-hidden ${className}`}>
        {children}
      </div>
    </DisclosureContext.Provider>
  );
}

export interface DisclosureTriggerProps {
  children: React.ReactNode;
  className?: string;
  asHeadingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export function DisclosureTrigger({
  children,
  className = "",
  asHeadingLevel,
}: DisclosureTriggerProps) {
  const { isOpen, toggle, triggerId, contentId } =
    useDisclosureContext("DisclosureTrigger");

  const button = (
    <button
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={toggle}
      className={`flex w-full items-center justify-between px-4 py-3.5 text-left font-medium text-neutral-100 bg-neutral-800/80 hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${className}`}
    >
      <span className="flex-1">{children}</span>
      <svg
        className={`w-4 h-4 ml-2 text-neutral-400 transform transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );

  if (asHeadingLevel) {
    const HeadingTag = asHeadingLevel;
    return <HeadingTag className="m-0 p-0 text-base">{button}</HeadingTag>;
  }

  return button;
}

export interface DisclosureContentProps {
  children: React.ReactNode;
  className?: string;
  roleRegion?: boolean;
}

export function DisclosureContent({
  children,
  className = "",
  roleRegion = true,
}: DisclosureContentProps) {
  const { isOpen, contentId, triggerId } =
    useDisclosureContext("DisclosureContent");

  return (
    <div
      id={contentId}
      aria-labelledby={triggerId}
      role={roleRegion ? "region" : undefined}
      hidden={!isOpen}
      className={`px-4 py-3.5 bg-neutral-900/60 text-sm text-neutral-300 leading-relaxed border-t border-neutral-700/60 ${
        !isOpen ? "hidden" : ""
      } ${className}`}
    >
      {isOpen && children}
    </div>
  );
}
