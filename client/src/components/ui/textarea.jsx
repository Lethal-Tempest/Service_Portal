import React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-black/200 bg-background px-3 py-2 text-sm " +
          "placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:border-black/200 " +
          "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
