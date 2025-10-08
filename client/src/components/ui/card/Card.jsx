import React from "react";
import clsx from "clsx";

// Base Card container
export const Card = React.forwardRef(function Card(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx(
        "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border border-zinc-200 rounded-xl shadow-sm text-left",
        className
      )}
      {...props}
    />
  );
});

export const CardHeader = ({ className, ...props }) => (
  <div className={clsx("p-6 pb-4", className)} {...props} />
);

export const CardTitle = ({ className, as: Comp = "h2", ...props }) => {
  const Component = Comp;
  return (
    <Component
      className={clsx(
        "text-2xl font-semibold leading-tight tracking-tight text-zinc-900",
        className
      )}
      {...props}
    />
  );
};

export const CardDescription = ({ className, as: Comp = "p", ...props }) => {
  const Component = Comp;
  return (
    <Component
      className={clsx("text-sm text-zinc-500 leading-relaxed", className)}
      {...props}
    />
  );
};

export const CardContent = ({ className, ...props }) => (
  <div className={clsx("p-6 pt-0", className)} {...props} />
);

// Re-export grouped for convenience (optional)
export default { Card, CardHeader, CardTitle, CardDescription, CardContent };
