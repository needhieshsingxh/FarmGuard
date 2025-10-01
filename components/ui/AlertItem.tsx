import React from 'react';
import { Alert } from '../../types';
import { useLanguage } from '../../AppContext';

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => {
  const { t } = useLanguage();
  const severityClasses = {
    Critical: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-500 dark:border-red-400',
      text: 'text-red-800 dark:text-red-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    },
    High: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-500 dark:border-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Medium: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-500 dark:border-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    Low: {
      bg: 'bg-gray-50 dark:bg-gray-800/30',
      border: 'border-gray-400 dark:border-gray-500',
      text: 'text-gray-800 dark:text-gray-300',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    }
  };
  
  const typeClasses = {
    'aiCamera': 'bg-purple-200 text-purple-800 dark:bg-purple-800/50 dark:text-purple-100',
    'prediction': 'bg-indigo-200 text-indigo-800 dark:bg-indigo-800/50 dark:text-indigo-100',
    'outbreak': 'bg-red-200 text-red-800 dark:bg-red-800/50 dark:text-red-100',
    'system': 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100',
  }

  const classes = severityClasses[alert.severity];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${classes.bg} ${classes.border}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {classes.icon}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <h3 className={`text-sm font-medium ${classes.text}`}>{t(alert.titleKey)}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${typeClasses[alert.typeKey]}`}>{t(alert.typeKey)}</span>
          </div>
          <div className={`mt-2 text-sm ${classes.text}`}>
            <p>{t(alert.descriptionKey)}</p>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{alert.date}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
