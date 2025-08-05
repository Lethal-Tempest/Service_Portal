import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// ✅ Main Usage of cn()
// 🔧 cn() is a utility to combine multiple Tailwind CSS class names safely and cleanly, especially when:
// 1. ✅ You want to add class names conditionally
// jsx
// Copy code
// <div className={cn("p-4", isActive && "bg-green-500")} />
// Only adds "bg-green-500" if isActive === true.

// Without cn(), you'd have to manually write:

// jsx
// Copy code
// <div className={`p-4 ${isActive ? "bg-green-500" : ""}`} />
// 2. ✅ You want to avoid Tailwind class conflicts
// jsx
// Copy code
// cn("px-2", "px-4")  // Output: "px-4"
// Tailwind normally keeps both, but cn() removes the earlier px-2 and keeps px-4 (latest).

// This makes your layout cleaner and predictable.

// 3. ✅ You want to clean up dynamic class logic in components
// Instead of messy conditionals like:

// jsx
// Copy code
// <div className={`text-sm ${darkMode ? 'text-white' : 'text-black'} ${disabled ? 'opacity-50' : ''}`} />
// You write:

// jsx
// Copy code
// <div className={cn("text-sm", darkMode ? "text-white" : "text-black", disabled && "opacity-50")} />
// This makes your JSX more readable, reusable, and less error-prone.