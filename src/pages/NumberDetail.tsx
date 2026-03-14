import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PhoneNumber, SMS, Language, TRANSLATIONS } from '../types';
import { useSocket } from '../hooks/useSocket';
import { AdPlaceholder } from '../components/Monetization';
import { Copy, RefreshCw, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface NumberDetailProps {
  lang: Language;
  onCopy: (num: string) => void;
}

export const NumberDetail: React.FC<NumberDetailProps> = ({ lang, onCopy }) => {
  const { id } = useParams<{ id: string }>();
  const [number, setNumber] = useState<PhoneNumber | null>(null);
  const [messages, setMessages] = useState<SMS[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket(id);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    fetch(`/api/numbers/${id}`)
      .then(res => res.json())
      .then(data => {
        setNumber(data);
        setMessages(data.messages || []);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-sms', (sms: SMS) => {
      setMessages(prev => [sms, ...prev]);
      // Trigger a browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('New SMS Received', { body: `From: ${sms.from}` });
      }
    });

    return () => {
      socket.off('new-sms');
    };
  }, [socket]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded mb-8" />
      <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-8" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
        ))}
      </div>
    </div>
  );

  if (!number) return <div className="text-center py-20">Number not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} />
        Back to list
      </Link>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-10 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="text-3xl">{getFlagEmoji(number.countryCode)}</span>
              <h1 className="text-2xl font-bold">{number.country}</h1>
            </div>
            <p className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-neutral-900 dark:text-white">
              {number.number}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{t.expiresIn}: {Math.round((number.expiresAt - Date.now()) / 60000)}m</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw size={14} className="animate-spin-slow" />
                <span>Auto-refreshing...</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => onCopy(number.number)}
              className="flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95"
            >
              <Copy size={20} />
              {t.copy}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 border border-neutral-200 dark:border-neutral-800 px-8 py-4 rounded-2xl font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              <RefreshCw size={20} />
              {t.refresh}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-4 mb-8 text-sm text-red-800 dark:text-red-200 flex items-start gap-3">
        <ShieldAlert className="shrink-0" size={20} />
        <p>{t.disclaimer}</p>
      </div>

      <AdPlaceholder type="leaderboard" />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {t.messages}
          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs px-2 py-1 rounded-full">
            {messages.length}
          </span>
        </h2>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="text-center py-20 text-neutral-400 italic">
                {t.noMessages}
              </div>
            ) : (
              messages.map((sms) => (
                <motion.div
                  key={sms.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg text-sm">
                      {sms.from}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDistanceToNow(sms.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium break-words">
                    {sms.text}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AdPlaceholder type="rectangle" />
    </div>
  );
};

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
