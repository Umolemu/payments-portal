import React from "react";
import clsx from "clsx";

/* Button variants (simple implemention). You can extend with size, variant props etc. */
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-px";

const variants = {
  solid: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border hover:bg-muted/60",
  subtle: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted/60",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export const Button = React.forwardRef(function Button(
  { className, variant = "solid", size = "md", asChild, ...props },
  ref
) {
  const Comp = asChild ? "span" : "button"; // allow slotting into other elements if needed
  return (
    <Comp
      ref={ref}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

export default Button;
