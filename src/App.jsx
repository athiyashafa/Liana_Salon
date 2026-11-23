import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Layout from '@/components/Layout';
import PeranRoute from '@/components/PeranRoute';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Splash from '@/pages/Splash';
import Dashboard from '@/pages/Dashboard';
import ProfilSalon from '@/pages/ProfilSalon';
import Kasir from '@/pages/Kasir';
import CatatLayanan from '@/pages/CatatLayanan';
import Transaksi from '@/pages/Transaksi';
import TransaksiDetail from '@/pages/TransaksiDetail';
import Laporan from '@/pages/Laporan';
import Pelanggan from '@/pages/Pelanggan';
import Layanan from '@/pages/Layanan';
import Pengguna from '@/pages/Pengguna';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/" element={<Splash />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<ProfilSalon />} />
          <Route path="/kasir" element={<Kasir />} />
          <Route path="/catat-layanan" element={<CatatLayanan />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/transaksi/:id" element={<TransaksiDetail />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/pelanggan" element={<Pelanggan />} />
          <Route path="/layanan" element={<Layanan />} />
          <Route
            path="/pengguna"
            element={
              <PeranRoute hak="kelolaPengguna">
                <Pengguna />
              </PeranRoute>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App