import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import CivicScroll from "./pages/CivicScroll";
import SmartDustbin from "./pages/SmartDustbin";
import CivicWallet from "./pages/CivicWallet";
import Missions from "./pages/Missions";
import FactCheck from "./pages/FactCheck";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import OtpVerification from "./pages/OtpVerification";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import MyWork from "./pages/MyWork";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Component to handle conditional redirects based on auth state
const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Index />;
  }
  
  // Redirect based on user type
  if (user?.userType === 'ngo') {
    return <Navigate to="/ngo-dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<OtpVerification />} />
            
            {/* User dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute userTypes={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            {/* NGO dashboard */}
            <Route path="/ngo-dashboard" element={
              <ProtectedRoute userTypes={['ngo']}>
                <NgoDashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="/civic-scroll" element={
              <ProtectedRoute>
                <CivicScroll />
              </ProtectedRoute>
            } />
            <Route path="/smart-dustbin" element={
              <ProtectedRoute>
                <SmartDustbin />
              </ProtectedRoute>
            } />
            <Route path="/civic-wallet" element={
              <ProtectedRoute>
                <CivicWallet />
              </ProtectedRoute>
            } />
            <Route path="/my-work" element={
              <ProtectedRoute userTypes={['user']}>
                <MyWork />
              </ProtectedRoute>
            } />
            <Route path="/missions" element={
              <ProtectedRoute>
                <Missions />
              </ProtectedRoute>
            } />
            <Route path="/fact-check" element={
              <ProtectedRoute>
                <FactCheck />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
