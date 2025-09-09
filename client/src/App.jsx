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
import ProfilePage from "./pages/ProfilePage";
import Profile from './pages/Profile'
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileScreen from "./pages/ProfileScreen";
import WorkerProfilePage from "./pages/WorkerProfilePage";

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
              <Route path="/worker/:workerId" element={<WorkerProfilePage />} />

              {/* Profile for logged-in user */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />

              {/* Profile page for workers by id */}
              <Route path="/profile/:userId" element={<ProfilePage />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
