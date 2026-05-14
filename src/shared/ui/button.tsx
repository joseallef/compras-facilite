import { cn } from "@/shared/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva("cursor-pointer disabled:cursor-not-allowed", {
  variants: {
    variant: {
      custom: "",
      primary:
        "bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      secondary:
        "bg-muted/10 hover:bg-muted/20 text-foreground font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border",
      outline:
        "border border-border bg-transparent hover:bg-muted/10 text-foreground font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      ghost:
        "bg-transparent hover:bg-muted/10 text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border",
      danger:
        "bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
    },
    size: {
      custom: "",
      sm: "px-4 py-2 rounded-xl text-sm",
      md: "px-6 py-3 rounded-xl",
      lg: "px-8 py-3 rounded-2xl",
      icon: "p-2 rounded-xl",
    },
  },
  defaultVariants: {
    variant: "custom",
    size: "custom",
  },
});

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild, className, variant, size, isLoading, ...props },
  ref
) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      {...props}
      ref={ref}
      disabled={props.disabled || isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {isLoading ? "Carregando..." : props.children}
    </Component>
  );
});

