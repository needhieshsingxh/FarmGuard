import React from 'react';
import Card from '../components/ui/Card';
import { DUMMY_FARMS_COMPLIANCE } from '../constants';
import { useLanguage } from '../AppContext';

const ConsumerComplianceListPage: React.FC = () => {
    const { t } = useLanguage();

    const getComplianceColor = (score: number) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <Card>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('farmComplianceList')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('farmComplianceListDesc')}</p>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('farmName')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('region')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('lastInspection')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('complianceScore')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {DUMMY_FARMS_COMPLIANCE.map((farm) => (
                            <tr key={farm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{farm.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{farm.region}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{farm.lastInspection}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getComplianceColor(farm.complianceScore)}`}>
                                    {farm.complianceScore}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ConsumerComplianceListPage;