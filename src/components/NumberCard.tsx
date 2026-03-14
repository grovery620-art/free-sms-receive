import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneNumber, Language, TRANSLATIONS } from '../types';
import { Copy, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface NumberCardProps {
  number: PhoneNumber;
  lang: Language;
  onCopy: (num: string) => void;
}

export const NumberCard: React.FC<NumberCardProps> = ({ number, lang, onCopy }) => {
  const t = TRANSLATIONS[lang];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={number.country}>
            {getFlagEmoji(number.countryCode)}
          </span>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">{number.country}</h3>
            <p className="text-sm text-neutral-500 font-mono">{number.number}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 text-xs text-neutral-500">
        <div className="flex items-center gap-1">
          <MessageSquare size={14} />
          <span>{number.smsCount} {t.messages}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{Math.round((number.expiresAt - Date.now()) / 60000)}m left</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link 
          to={`/number/${number.id}`}
          className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-center py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Open
        </Link>
        <button 
          onClick={() => onCopy(number.number)}
          className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          title={t.copy}
        >
          <Copy size={18} className="text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>
    </motion.div>
  );
};

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
