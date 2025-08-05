import React from "react"
import { useToast } from "./hooks/use-toast"
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/layout/Navigation";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Search } from "./pages/Search";
import { About } from "./pages/About";
import { Bookings } from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import Profile from "./pages/ProfilePage"; // Make sure this matches actual file structure

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;























// function App() {
//   const { toast, toasts } = useToast()

//   const handleClick = () => {
//     toast({
//       title: "Hello!",
//       description: "This is a toast notification.",
//     })
//   }

//   return (
//     <div className="p-4">
//       <button
//         onClick={handleClick}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Show Toast
//       </button>

//       {/* Toast display section */}
//       <div className="fixed top-4 right-4 space-y-2 z-50">
//         {toasts.map((t) => (
//           <div
//             key={t.id}
//             className="bg-gray-900 text-white px-4 py-3 rounded shadow-md w-64 animate-fade-in"
//           >
//             <strong className="block">{t.title}</strong>
//             <span className="block text-sm">{t.description}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default App

































