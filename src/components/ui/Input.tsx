import { cn } from "@/utils/cn";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  leftIconClassName?: string;
  rightSlot?: ReactNode;
  rightSlotClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

function joinDescribedBy(values: Array<string | undefined>) {
  return values
    .flatMap((value) => (value ? value.split(" ") : []))
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    labelClassName,
    inputClassName,
    label,
    hint,
    error,
    leftIcon,
    leftIconClassName,
    rightSlot,
    rightSlotClassName,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref
) {
  const errorId = id ? `${id}-error` : undefined;
  const hintId = id ? `${id}-hint` : undefined;

  const resolvedAriaDescribedBy = joinDescribedBy([
    ariaDescribedBy,
    error ? errorId : undefined,
    !error && hint ? hintId : undefined,
  ]);

  const hasLeftIcon = Boolean(leftIcon);
  const hasRightSlot = Boolean(rightSlot);

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label htmlFor={id} className={cn("block text-sm font-medium", labelClassName)}>
          {label}
        </label>
      ) : null}

      <div className={cn("relative", className)}>
        {leftIcon ? (
          <div
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none",
              leftIconClassName
            )}
          >
            {leftIcon}
          </div>
        ) : null}

        <input
          {...props}
          id={id}
          ref={ref}
          className={cn(
            "w-full py-3 bg-background border rounded-xl focus:ring-2 outline-none transition-all",
            hasLeftIcon ? "pl-12" : "pl-4",
            hasRightSlot ? "pr-12" : "pr-4",
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-border focus:ring-emerald-500 focus:border-emerald-500",
            inputClassName
          )}
          aria-invalid={ariaInvalid ?? Boolean(error)}
          aria-describedby={resolvedAriaDescribedBy || undefined}
        />

        {rightSlot ? (
          <div className={cn("absolute right-3 top-1/2 -translate-y-1/2", rightSlotClassName)}>
            {rightSlot}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

