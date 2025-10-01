import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { useLanguage } from '../AppContext';
import { DUMMY_PRODUCTS, DUMMY_FARMS_COMPLIANCE } from '../constants';
import { ProductVerification } from '../types';

const VerificationResult: React.FC<{ result: ProductVerification | null }> = ({ result }) => {
    const { t } = useLanguage();
    if (!result) return null;

    const farm = DUMMY_FARMS_COMPLIANCE.find(f => f.id === result.farmId);
    const statusClasses = {
        safe: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-200', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-200', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
        danger: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-200', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    };

    return (
        <div className={`mt-6 p-4 rounded-lg flex items-start space-x-4 ${statusClasses[result.status].bg} ${statusClasses[result.status].text}`}>
            <div className="flex-shrink-0">{statusClasses[result.status].icon}</div>
            <div>
                <h4 className="font-bold">{t(`productStatus_${result.status}`)}</h4>
                <p className="text-sm">{t(`productStatusDesc_${result.status}`)}</p>
                <div className="mt-2 text-xs border-t border-current/30 pt-2 space-y-1">
                    <p><strong>{t('productName')}:</strong> {result.productName}</p>
                    <p><strong>{t('farmOfOrigin')}:</strong> {farm?.name || 'N/A'}</p>
                    <p><strong>{t('farmComplianceScore')}:</strong> {farm?.complianceScore}%</p>
                    <p><strong>{t('batchDate')}:</strong> {result.batchDate}</p>
                </div>
            </div>
        </div>
    );
};

const ConsumerVerifyPage: React.FC = () => {
  const { t } = useLanguage();
  const [productId, setProductId] = useState('');
  const [result, setResult] = useState<ProductVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    setError(null);
    setResult(null);
    const foundProduct = DUMMY_PRODUCTS.find(p => p.id.toLowerCase() === productId.toLowerCase());
    if (foundProduct) {
        setResult(foundProduct);
    } else {
        setError(t('productNotFound'));
    }
  };

  const handleSampleClick = (id: string) => {
    setProductId(id);
    setError(null);
    const foundProduct = DUMMY_PRODUCTS.find(p => p.id.toLowerCase() === id.toLowerCase());
    setResult(foundProduct || null);
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{t('verifyProduct')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('verifyProductDesc')}</p>
      
      <div className="flex items-center space-x-2">
        <input 
            type="text" 
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleVerify(); }}
            className="flex-grow appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={t('enterProductId')}
        />
        <button 
            onClick={handleVerify}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
        >
            {t('verify')}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span>{t('trySampleIds')}: </span>
        {DUMMY_PRODUCTS.map((p, index) => (
            <React.Fragment key={p.id}>
                <button 
                    onClick={() => handleSampleClick(p.id)} 
                    className="font-mono text-green-600 dark:text-green-400 hover:underline"
                >
                    {p.id}
                </button>
                {index < DUMMY_PRODUCTS.length - 1 && ', '}
            </React.Fragment>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <VerificationResult result={result} />

    </Card>
  );
};

export default ConsumerVerifyPage;
