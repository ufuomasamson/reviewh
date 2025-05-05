import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, initAuth } from './store/authStore';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Authentication Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';

// Dashboard Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CampaignsPage } from './pages/dashboard/CampaignsPage';
import { CampaignDetailPage } from './pages/dashboard/CampaignDetailPage';
import { CreateCampaignPage } from './pages/dashboard/CreateCampaignPage';
import { ReviewsPage } from './pages/dashboard/ReviewsPage';
import { WalletPage } from './pages/dashboard/WalletPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { VerifyBusinessPage } from './pages/dashboard/VerifyBusinessPage';

// Admin Pages
import { UsersPage } from './pages/admin/UsersPage';
import { VerificationsPage } from './pages/admin/VerificationsPage';
import { AdminCampaignsPage } from './pages/admin/AdminCampaignsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string | string[] }> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (user && !roles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return <>{children}</>;
};

function App() {
  const isAuthHydrated = useAuthStore(state => state.isAuthHydrated);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    console.log('Auth hydrated:', isAuthHydrated, 'User:', user, 'isAuthenticated:', isAuthenticated);
  }, [isAuthHydrated, user, isAuthenticated]);

  if (!isAuthHydrated) {
    return <div className="flex items-center justify-center min-h-screen text-lg">Loading authentication...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Campaigns */}
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="campaigns/create" element={<CreateCampaignPage />} />
          <Route path="campaigns/:id" element={<CampaignDetailPage />} />
          
          {/* Reviews */}
          <Route path="reviews" element={<ReviewsPage />} />
          
          {/* Wallet */}
          <Route path="wallet" element={<WalletPage />} />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Verify Business */}
          <Route path="verify" element={
            <ProtectedRoute requiredRole="business">
              <VerifyBusinessPage />
            </ProtectedRoute>
          } />
          
          {/* Admin-only routes */}
          <Route path="users" element={
            <ProtectedRoute requiredRole="admin">
              <UsersPage />
            </ProtectedRoute>
          } />
          
          <Route path="verifications" element={
            <ProtectedRoute requiredRole="admin">
              <VerificationsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/campaigns" element={
            <ProtectedRoute requiredRole="admin">
              <AdminCampaignsPage />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;