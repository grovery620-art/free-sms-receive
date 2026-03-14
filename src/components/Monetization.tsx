import React, { useEffect } from 'react';

interface AdPlaceholderProps {
  type: 'leaderboard' | 'rectangle' | 'interstitial';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ type, className }) => {
  const dimensions = {
    leaderboard: 'w-full h-[90px] max-w-[728px]',
    rectangle: 'w-[300px] h-[250px]',
    interstitial: 'hidden'
  };

  return (
    <div className={`bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest overflow-hidden mx-auto my-4 ${dimensions[type]} ${className}`}>
      <div className="text-center">
        <p>Advertisement</p>
        <p className="text-[10px] opacity-50">
          {type === 'leaderboard' ? '728x90' : '300x250'}
        </p>
      </div>
      {/* 
        Replace with actual ad code:
        <ins class="adsbygoogle" ...></ins>
        or script tags for Adsterra/PropellerAds
      */}
    </div>
  );
};

export const usePopunder = () => {
  const triggerPopunder = () => {
    console.log('Popunder Triggered (Placeholder for PropellerAds/Adsterra)');
    // Example implementation:
    // window.open('https://example-ad-link.com', '_blank');
  };

  return { triggerPopunder };
};

export const usePushNotifications = () => {
  useEffect(() => {
    // Placeholder for OneSignal / RichAds Push
    console.log('Push Notifications Initialized');
  }, []);
};
