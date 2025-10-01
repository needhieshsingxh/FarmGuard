import React, { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import { DUMMY_FARMS_COMPLIANCE } from '../constants';
import { useLanguage, useNotifications } from '../AppContext';
import { Alert, FarmCompliance } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  </Card>
);

const NotificationComposer: React.FC = () => {
    const { t } = useLanguage();
    const { addNotification } = useNotifications();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isHighPriority, setIsHighPriority] = useState(false);
    const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sent'>('idle');

    const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        
        const newAlert: Alert = {
            id: `A${Date.now()}`,
            titleKey: subject,
            descriptionKey: message,
            severity: isHighPriority ? 'Critical' : 'Medium',
            date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
            typeKey: 'system'
        };
        addNotification(newAlert);

        setSubject('');
        setMessage('');
        setIsHighPriority(false);
        setNotificationStatus('sent');
        setTimeout(() => {
            setNotificationStatus('idle');
        }, 3000);
    };
    const regions = [...new Set(DUMMY_FARMS_COMPLIANCE.map(f => f.region))];


    return (
        <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('composeNotification')}</h3>
            <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Audience</label>
                  <select id="target" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>All Farmers</option>
                    {regions.map(r => <option key={r}>Farmers in {r}</option>)}
                  </select>
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subject')}</label>
                    <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={t('subjectPlaceholder')} />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('message')}</label>
                    <textarea id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={t('messagePlaceholder')} />
                </div>
                 <div className="flex items-center">
                    <input id="push" type="checkbox" checked={isHighPriority} onChange={e => setIsHighPriority(e.target.checked)} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:bg-gray-600 dark:border-gray-500" />
                    <label htmlFor="push" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Send as high-priority push notification</label>
                </div>
                <div className="flex justify-end items-center gap-4">
                    <div className={`transition-opacity duration-300 ${notificationStatus === 'sent' ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-sm text-green-600 dark:text-green-400">{t('notificationSent')}</p>
                    </div>
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">{t('sendNotification')}</button>
                </div>
            </form>
        </Card>
    );
}

const FarmList: React.FC = () => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [complianceFilter, setComplianceFilter] = useState('all');

    const regions = ['all', ...new Set(DUMMY_FARMS_COMPLIANCE.map(f => f.region))];

    const filteredFarms = useMemo(() => {
        return DUMMY_FARMS_COMPLIANCE.filter(farm => {
            const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRegion = selectedRegion === 'all' || farm.region === selectedRegion;
            const matchesCompliance = complianceFilter === 'all' ||
                (complianceFilter === 'high' && farm.complianceScore >= 90) ||
                (complianceFilter === 'medium' && farm.complianceScore >= 80 && farm.complianceScore < 90) ||
                (complianceFilter === 'low' && farm.complianceScore < 80);
            return matchesSearch && matchesRegion && matchesCompliance;
        });
    }, [searchQuery, selectedRegion, complianceFilter]);
    
    const getComplianceColor = (score: number) => {
        if (score >= 90) return 'text-green-600 dark:text-green-400';
        if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <Card>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Farm Compliance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by farm name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {regions.map(r => <option key={r} value={r}>{r === 'all' ? 'All Regions' : r}</option>)}
                </select>
                <select value={complianceFilter} onChange={(e) => setComplianceFilter(e.target.value)} className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="all">All Compliance</option>
                    <option value="high">High (&gt;= 90%)</option>
                    <option value="medium">Medium (80-89%)</option>
                    <option value="low">&lt; 80%)</option>
                </select>
            </div>
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
                        {filteredFarms.map((farm) => (
                            <tr key={farm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{farm.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{farm.region}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{farm.lastInspection}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getComplianceColor(farm.complianceScore)}`}>
                                    {farm.complianceScore}%
                                </td>
                            </tr>
                        ))}
                         {filteredFarms.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No farms match the current filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


const GovernmentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const totalFarms = DUMMY_FARMS_COMPLIANCE.length;
  const compliantFarms = DUMMY_FARMS_COMPLIANCE.filter(f => f.complianceScore >= 85).length;
  const complianceRate = Math.round((compliantFarms / totalFarms) * 100);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('govtDashboard')}</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t('totalFarms')} value={totalFarms} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
        <StatCard title={t('compliantFarms')} value={compliantFarms} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard title={t('complianceRate')} value={`${complianceRate}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5" /></svg>} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <NotificationComposer />
        <Card>
           <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('regionalCompliance')}</h3>
           <div className="space-y-3">
               <div className="flex justify-between items-center">
                   <span className="text-gray-600 dark:text-gray-300">Punjab</span>
                   <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                       <div className="bg-green-600 h-2.5 rounded-full" style={{width: '96%'}}></div>
                   </div>
                   <span className="font-semibold text-gray-800 dark:text-gray-100">96%</span>
               </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-600 dark:text-gray-300">Haryana</span>
                   <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                       <div className="bg-green-600 h-2.5 rounded-full" style={{width: '88%'}}></div>
                   </div>
                   <span className="font-semibold text-gray-800 dark:text-gray-100">88%</span>
               </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-600 dark:text-gray-300">Rajasthan</span>
                   <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                       <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '77%'}}></div>
                   </div>
                   <span className="font-semibold text-gray-800 dark:text-gray-100">77%</span>
               </div>
                <div className="flex justify-between items-center">
                   <span className="text-gray-600 dark:text-gray-300">Telangana</span>
                   <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                       <div className="bg-green-600 h-2.5 rounded-full" style={{width: '88%'}}></div>
                   </div>
                   <span className="font-semibold text-gray-800 dark:text-gray-100">88%</span>
               </div>
               <div className="flex justify-between items-center">
                   <span className="text-gray-600 dark:text-gray-300">West Bengal</span>
                   <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                       <div className="bg-red-500 h-2.5 rounded-full" style={{width: '79%'}}></div>
                   </div>
                   <span className="font-semibold text-gray-800 dark:text-gray-100">79%</span>
               </div>
           </div>
        </Card>
      </div>

      <FarmList />

    </div>
  );
};

export default GovernmentDashboard;