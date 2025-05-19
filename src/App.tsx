
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Jobs from "./pages/Jobs";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";

// Create App component to properly handle React hooks
const App = () => {
  // Move QueryClient initialization inside the component
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <Layout><Upload /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Layout><Profile /></Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin-Only Routes */}
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Layout><Jobs /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Layout><Admin /></Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Not Found Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
