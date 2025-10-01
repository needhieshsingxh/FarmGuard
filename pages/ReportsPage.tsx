import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { DUMMY_BIOSECURITY_REPORTS, DUMMY_CHECKLIST_ITEMS } from '../constants';
import { BiosecurityReport, BiosecurityChecklistItem } from '../types';
import { useLanguage } from '../AppContext';

const BiosecurityPage: React.FC = () => {
  const [reports, setReports] = useState<BiosecurityReport[]>(DUMMY_BIOSECURITY_REPORTS);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to calculate score and add new report would go here
    alert('Biosecurity checklist submitted for review!');
    e.currentTarget.reset();
  };
  
  const checklistCategories = DUMMY_CHECKLIST_ITEMS.reduce((acc, item) => {
    if (!acc[item.categoryKey]) {
      acc[item.categoryKey] = [];
    }
    acc[item.categoryKey].push(item);
    return acc;
  }, {} as Record<string, BiosecurityChecklistItem[]>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('dailyChecklist')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('batchId')}: POULTRY-BATCH-035</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(checklistCategories).map(([categoryKey, items]) => (
                <div key={categoryKey}>
                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 pb-1 mb-2">{t(categoryKey)}</h3>
                    <div className="space-y-2">
                        {items.map(item => (
                             <label key={item.id} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <input type="checkbox" name={item.id} className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-green-600 focus:ring-green-500 bg-gray-100 dark:bg-gray-600" />
                                <span className="ml-2">{t(item.taskKey)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('addNotes')}</label>
              <textarea name="notes" id="notes" rows={2} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">{t('submitChecklist')}</button>
          </form>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('batchReports')}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('batchId')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('date')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('complianceScore')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{report.batchId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-200">{report.complianceScore > 0 ? `${report.complianceScore}%` : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.statusKey === 'complete' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                      }`}>
                        {t(report.statusKey)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BiosecurityPage;