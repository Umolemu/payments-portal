import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import clsx from "clsx";

const SelectContext = createContext(null);

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  required,
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue || "");
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const currentValue = value !== undefined ? value : internal;

  const setValue = (val) => {
    if (onValueChange) onValueChange(val);
    if (value === undefined) setInternal(val);
    setOpen(false);
  };

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!contentRef.current || !triggerRef.current) return;
      if (
        !contentRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        contentRef,
        value: currentValue,
        setValue,
        required,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, id }) {
  const { open, setOpen, triggerRef, value } = useContext(SelectContext);
  return (
    <button
      id={id}
      ref={triggerRef}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={clsx(
        "w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors",
        className
      )}
    >
      <span className={clsx(!value && "text-muted-foreground")}>
        {children}
      </span>
      <svg
        className={clsx(
          "h-4 w-4 opacity-60 transition-transform",
          open && "rotate-180"
        )}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return value ? (
    <span>{value}</span>
  ) : (
    <span className="text-muted-foreground">{placeholder}</span>
  );
}

export function SelectContent({ children, className }) {
  const { open, contentRef } = useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      ref={contentRef}
      role="listbox"
      className={clsx(
        "absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-md animate-in fade-in slide-in-from-top-2",
        className
      )}
    >
      <ul className="max-h-60 overflow-auto p-1">{children}</ul>
    </div>
  );
}

export function SelectItem({ value, children, className }) {
  const { setValue, value: current } = useContext(SelectContext);
  const selected = current === value;
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={() => setValue(value)}
        className={clsx(
          "w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          selected && "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
      >
        {children || value}
      </button>
    </li>
  );
}

export default {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
