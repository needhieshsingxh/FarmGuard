import React from 'react';
import Card from '../components/ui/Card';
import { DUMMY_ALERTS } from '../constants';
import AlertItem from '../components/ui/AlertItem';
import { useLanguage } from '../AppContext';

const AlertsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <Card>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('alerts')}</h1>
      <div className="space-y-4">
        {DUMMY_ALERTS.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </Card>
  );
};

export default AlertsPage;