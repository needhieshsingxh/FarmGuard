import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import FarmGuardLogo from '../icons/FarmGuardLogo';
import { useTheme, useLanguage, Language, LANGUAGES, useUser, useNotifications } from '../../AppContext';
import { Role } from '../../types';


const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BiosecurityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const AlertsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
const CommunityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0m0 0a5 5 0 00-9 0m9 0a5.002 5.002 0 01-9 0M12 8a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const VerifyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;

interface DashboardLayoutProps {
  userRole: Role | null;
  onLogout: () => void;
}

const getNavLinks = (role: Role | null, t: (key: string) => string) => {
    switch (role) {
        case Role.Farmer:
            return [
                { to: '/farmer/dashboard', text: t('dashboard'), icon: <DashboardIcon /> },
                { to: '/farmer/biosecurity', text: t('biosecurity'), icon: <BiosecurityIcon /> },
                { to: '/farmer/alerts', text: t('alerts'), icon: <AlertsIcon /> },
                { to: '/farmer/farm-data', text: t('farmData'), icon: <DataIcon /> },
                { to: '/farmer/community', text: t('community'), icon: <CommunityIcon /> },
                { to: '/farmer/settings', text: t('settings'), icon: <SettingsIcon /> },
            ];
        case Role.Admin:
            return [
                { to: '/government/dashboard', text: t('dashboard'), icon: <DashboardIcon /> },
                { to: '/government/settings', text: t('settings'), icon: <SettingsIcon /> },
            ];
        case Role.Consumer:
            return [
                { to: '/consumer/verify', text: t('verifyProduct'), icon: <VerifyIcon /> },
                { to: '/consumer/compliance-list', text: t('farmComplianceList'), icon: <ListIcon /> },
                { to: '/consumer/settings', text: t('settings'), icon: <SettingsIcon /> },
            ];
        default:
            return [];
    }
};

const Sidebar: React.FC<DashboardLayoutProps> = ({ userRole, onLogout }) => {
  const { t } = useLanguage();
  const navLinks = getNavLinks(userRole, t);

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 flex flex-col h-screen shadow-lg">
      <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
        <FarmGuardLogo className="h-10 w-10 text-green-600" />
        <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-100">{t('farmGuard')}</span>
      </div>
      <nav className="flex-1 px-4 py-6">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="ml-4 font-medium">{link.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-6 border-t dark:border-gray-700">
         <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
          >
            <LogoutIcon />
            <span className="ml-4 font-medium">{t('logout')}</span>
          </button>
      </div>
    </aside>
  );
};

const getHeaderText = (role: Role | null, t: (key: string) => string) => {
    switch (role) {
        case Role.Farmer:
            return t('welcomeFarmer');
        case Role.Admin:
            return t('govtDashboard');
        case Role.Consumer:
            return t('consumerPortal');
        default:
            return t('farmGuard');
    }
}

const DashboardHeader: React.FC<{userRole: Role | null}> = ({userRole}) => {
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [showNotifications, setShowNotifications] = useState(false);
    const { userProfile } = useUser();
    const { notifications } = useNotifications();
    const notificationRef = useRef<HTMLDivElement>(null);
    const alertsPath = (userRole === Role.Farmer) ? '/farmer/alerts' : null;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
          setShowNotifications(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [notificationRef]);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 dark:border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{getHeaderText(userRole, t)}</h1>
                <div className="flex items-center space-x-4">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>

                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>

                    <div className="relative" ref={notificationRef}>
                        <button onClick={() => setShowNotifications(prev => !prev)} className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            <AlertsIcon />
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-50">
                                <div className="p-3 font-bold border-b dark:border-gray-700 text-gray-800 dark:text-gray-100">Notifications</div>
                                <div className="divide-y dark:divide-gray-700 max-h-80 overflow-y-auto">
                                    {notifications.slice(0, 4).map(alert => (
                                        <div key={alert.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t(alert.titleKey)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{alert.date}</p>
                                        </div>
                                    ))}
                                </div>
                                {alertsPath && (
                                    <Link to={alertsPath} onClick={() => setShowNotifications(false)} className="block text-center p-2 bg-gray-50 dark:bg-gray-900/50 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        View All Alerts
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="w-10 h-10 bg-gray-300 rounded-full">
                        <img src={userProfile.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userRole, onLogout }) => {
  return (
    <div className="flex">
      <Sidebar userRole={userRole} onLogout={onLogout} />
      <main className="flex-1 h-screen overflow-y-auto">
        <DashboardHeader userRole={userRole} />
        <div className="p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;