import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// Utility for combining class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef((props, ref) => {
  const className = props.className || "";
  const rest = { ...props };
  delete rest.className;

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-200 p-1 text-gray-800",
        className
      )}
      {...rest}
    />
  );
});

TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef((props, ref) => {
  const className = props.className || "";
  const rest = { ...props };
  delete rest.className;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-black shadow",
        className
      )}
      {...rest}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef((props, ref) => {
  const className = props.className || "";
  const rest = { ...props };
  delete rest.className;

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...rest}
    />
  );
});

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
