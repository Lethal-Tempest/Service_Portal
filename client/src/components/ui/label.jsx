import React from "react";
import { Root as Label } from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const CustomLabel = React.forwardRef(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn(labelVariants(), className)} {...props} />
));

CustomLabel.displayName = "Label";

export { CustomLabel as Label };
