import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  description?: ReactNode;
}

export function Card({
  title,
  description,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseClasses =
    "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";
  const classes = `${baseClasses} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {(title || description) && (
        <header className="mb-4 space-y-1">
          {title ? (
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          ) : null}
          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}
        </header>
      )}
      {children}
    </div>
  );
}
