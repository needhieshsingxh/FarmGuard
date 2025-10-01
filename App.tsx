import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/layout/DashboardLayout';
import FarmerDashboard from './pages/FarmerDashboard';
import ReportsPage from './pages/ReportsPage';
import AlertsPage from './pages/AlertsPage';
import FarmDataPage from './pages/FarmDataPage';
import SettingsPage from './pages/SettingsPage';
import CommunityPage from './pages/CommunityPage';
import ConsumerVerifyPage from './pages/ConsumerVerifyPage';
import ConsumerComplianceListPage from './pages/ConsumerComplianceListPage';
import GovernmentDashboard from './pages/GovernmentDashboard';
import AIChatbot from './components/chatbot/AIChatbot';
import { AppProvider, useUser } from './AppContext';
import { Role } from './types';

const getHomeRoute = (role: Role | null) => {
  switch (role) {
    case Role.Farmer:
    case Role.Vet:
      return '/farmer/dashboard';
    case Role.Admin:
      return '/government/dashboard';
    case Role.Consumer:
      return '/consumer/verify';
    default:
      return '/';
  }
};

const AppContent: React.FC = () => {
  const { authState, login, logout } = useUser();
  const user = authState;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans">
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={!user.isAuthenticated ? <AuthPage onLogin={login} /> : <Navigate to={getHomeRoute(user.role)} />} />
          
          {user.isAuthenticated ? (
            <Route path="/" element={<DashboardLayout userRole={user.role} onLogout={logout} />}>
              {/* Farmer Routes */}
              {(user.role === Role.Farmer || user.role === Role.Vet) && (
                <>
                  <Route path="farmer/dashboard" element={<FarmerDashboard />} />
                  <Route path="farmer/biosecurity" element={<ReportsPage />} />
                  <Route path="farmer/alerts" element={<AlertsPage />} />
                  <Route path="farmer/farm-data" element={<FarmDataPage />} />
                  <Route path="farmer/community" element={<CommunityPage />} />
                  <Route path="farmer/settings" element={<SettingsPage />} />
                </>
              )}

              {/* Government/Admin Routes */}
              {user.role === Role.Admin && (
                <>
                  <Route path="government/dashboard" element={<GovernmentDashboard />} />
                  <Route path="government/settings" element={<SettingsPage />} />
                </>
              )}

              {/* Consumer Routes */}
              {user.role === Role.Consumer && (
                <>
                  <Route path="consumer/verify" element={<ConsumerVerifyPage />} />
                  <Route path="consumer/compliance-list" element={<ConsumerComplianceListPage />} />
                  <Route path="consumer/settings" element={<SettingsPage />} />
                </>
              )}
              
              <Route index element={<Navigate to={getHomeRoute(user.role)} />} />
            </Route>
          ) : (
            <Route path="/*" element={<Navigate to="/auth" />} />
          )}
        </Routes>
        {user.isAuthenticated && (user.role === Role.Farmer || user.role === Role.Vet) && <AIChatbot />}
      </HashRouter>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;