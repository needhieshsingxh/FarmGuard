import React, { useState, useRef } from 'react';
import Card from '../components/ui/Card';
import { useLanguage, useUser } from '../AppContext';
import { UserProfile } from '../types';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, updateUserProfile } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar);
  const [emailNotifs, setEmailNotifs] = useState(userProfile.notifications.email);
  const [pushNotifs, setPushNotifs] = useState(userProfile.notifications.push);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSaveChanges = () => {
    const updatedProfile: Partial<UserProfile> = {
        name, email, avatar: avatarPreview, notifications: { email: emailNotifs, push: pushNotifs }
    };
    updateUserProfile(updatedProfile);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('settings')}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{t('settingsDescription')}</p>
    
      <div className="mt-8 border-t dark:border-gray-700 pt-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t('userProfileTitle')}</h2>
        
        <div className="mt-4 flex items-center gap-6">
          <img src={avatarPreview} alt="User Avatar" className="h-24 w-24 rounded-full object-cover" />
          <div>
            <button onClick={triggerFileSelect} className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
              Change Photo
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('fullName')}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-green-500 focus:border-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('emailAddress')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-green-500 focus:border-green-500" />
          </div>
        </div>
      </div>

       <div className="mt-8 border-t dark:border-gray-700 pt-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{t('notificationsTitle')}</h2>
        <div className="mt-4 space-y-4">
            <div className="flex items-start">
                <div className="flex items-center h-5"><input type="checkbox" checked={emailNotifs} onChange={e => setEmailNotifs(e.target.checked)} className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500" /></div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700 dark:text-gray-200">{t('emailNotificationsLabel')}</label>
                  <p className="text-gray-500 dark:text-gray-400">{t('emailNotificationsDesc')}</p>
                </div>
            </div>
             <div className="flex items-start">
                <div className="flex items-center h-5"><input type="checkbox" checked={pushNotifs} onChange={e => setPushNotifs(e.target.checked)} className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500" /></div>
                <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700 dark:text-gray-200">{t('pushNotificationsLabel')}</label>
                    <p className="text-gray-500 dark:text-gray-400">{t('pushNotificationsDesc')}</p>
                  </div>
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end items-center gap-4">
        {saveStatus === 'saved' && (
            <p className="text-sm text-green-600 dark:text-green-400">Changes saved successfully!</p>
        )}
        <button onClick={handleSaveChanges} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">{t('saveChanges')}</button>
      </div>

    </Card>
  );
};

export default SettingsPage;