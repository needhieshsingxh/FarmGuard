import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Role } from '../types';
import { ROLES } from '../constants';
import FarmGuardLogo from '../components/icons/FarmGuardLogo';
import { useLanguage } from '../AppContext';

interface AuthPageProps {
  onLogin: (role: Role) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const location = useLocation();
  
  const getInitialIsLogin = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('action') !== 'signup';
  };

  const [isLogin, setIsLogin] = useState(getInitialIsLogin);
  const [role, setRole] = useState<Role>(Role.Farmer);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    setIsLogin(getInitialIsLogin());
  }, [location.search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
    // Navigation will be handled by the App component based on the new auth state
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" aria-label="Back to Home">
          <FarmGuardLogo className="mx-auto h-16 w-auto text-green-600" />
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {t('welcomeToFarmGuard')}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {t('secureLivestockSystem')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsLogin(true)}
                className={`w-1/2 py-3 text-sm font-medium text-center transition-colors ${isLogin ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                {t('signIn')}
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`w-1/2 py-3 text-sm font-medium text-center transition-colors ${!isLogin ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                {t('createAccount')}
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('fullName')}
                    </label>
                    <div className="mt-1">
                        <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder={t('placeholderName')}
                        />
                    </div>
                </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('emailAddress')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={t('placeholderEmail')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={t('placeholderPassword')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('role')}
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{t(r.toLowerCase())}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              {isLogin && (
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => alert('Password reset functionality is a placeholder in this demo.')}
                    className="font-medium text-green-600 hover:text-green-500 text-sm bg-transparent border-none cursor-pointer p-0"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLogin ? t('signIn') : t('createAccount')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;