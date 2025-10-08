import React from "react";
import clsx from "clsx";

const variants = {
  solid: "bg-primary text-primary-foreground",
  outline: "border border-border bg-background text-foreground",
  subtle: "bg-muted text-foreground",
  success: "bg-green-100 text-green-800 border border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  error: "bg-red-100 text-red-800 border border-red-200",
};

export const Badge = ({ variant = "solid", className, children, ...props }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant] || variants.solid,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
