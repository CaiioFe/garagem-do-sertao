import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full bg-transparent border-b border-border px-1 py-2 text-base font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
