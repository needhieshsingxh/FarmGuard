import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Card from '../components/ui/Card';
import { FARM_DATA_TRENDS } from '../constants';
import { useTheme } from '../AppContext';
import { useLanguage } from '../AppContext';

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded-md shadow-md">
        <p className="label text-gray-800 dark:text-gray-100">{t(label)}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }} className="text-sm">
            {`${pld.name} : ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const FarmDataPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const tickColor = theme === 'dark' ? '#9ca3af' : '#6b7280'; // gray-400 or gray-500
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb';
  const translatedData = FARM_DATA_TRENDS.map(item => ({...item, name: t(item.nameKey)}));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('farmData')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('mortalityTitle')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={FARM_DATA_TRENDS} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="nameKey" stroke={tickColor} tickFormatter={(tick) => t(tick)} />
              <YAxis stroke={tickColor} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: tickColor }} />
              <Line type="monotone" dataKey="mortality" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 8 }} name={t('mortalityLegend')} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('tempTitle')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={FARM_DATA_TRENDS} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="nameKey" stroke={tickColor} tickFormatter={(tick) => t(tick)} />
              <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} stroke={tickColor} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: tickColor }} />
              <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} name={t('tempLegend')} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('feedTitle')}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={FARM_DATA_TRENDS} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="nameKey" stroke={tickColor} tickFormatter={(tick) => t(tick)} />
            <YAxis stroke={tickColor} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: tickColor }} />
            <Bar dataKey="feed" fill="#22c55e" name={t('feedLegend')} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default FarmDataPage;