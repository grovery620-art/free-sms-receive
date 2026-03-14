import React, { useState, useEffect } from 'react';
import { PhoneNumber, Language, TRANSLATIONS } from '../types';
import { NumberCard } from '../components/NumberCard';
import { AdPlaceholder } from '../components/Monetization';
import { Search, Globe } from 'lucide-react';

interface HomeProps {
  lang: Language;
  onCopy: (num: string) => void;
}

export const Home: React.FC<HomeProps> = ({ lang, onCopy }) => {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    fetch('/api/numbers')
      .then(res => res.json())
      .then(data => {
        setNumbers(data);
        setLoading(false);
      });
  }, []);

  const filteredNumbers = numbers.filter(n => 
    n.country.toLowerCase().includes(filter.toLowerCase()) || 
    n.number.includes(filter)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white mb-4 uppercase">
          {t.title}
        </h1>
        <p className="text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </section>

      <AdPlaceholder type="leaderboard" />

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-2xl p-4 mb-8 text-sm text-orange-800 dark:text-orange-200 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <p>{t.disclaimer}</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="text-neutral-400" />
          {t.activeNumbers}
        </h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder={t.allCountries}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNumbers.map(num => (
            <NumberCard key={num.id} number={num} lang={lang} onCopy={onCopy} />
          ))}
        </div>
      )}

      <div className="mt-16 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center">
        <h3 className="text-xl font-bold mb-2">{t.premium}</h3>
        <p className="text-neutral-500 mb-6">{t.premiumDesc}</p>
        <button className="bg-neutral-200 dark:bg-neutral-800 text-neutral-500 px-8 py-3 rounded-xl font-bold cursor-not-allowed">
          Notify Me
        </button>
      </div>
      
      <p className="mt-8 text-center text-xs text-neutral-400 max-w-lg mx-auto">
        {t.adSupport}
      </p>
    </div>
  );
};
