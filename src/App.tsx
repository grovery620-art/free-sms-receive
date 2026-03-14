import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { NumberDetail } from './pages/NumberDetail';
import { Language } from './types';
import { usePopunder, usePushNotifications } from './components/Monetization';
import { Phone, Moon, Sun, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const { triggerPopunder } = usePopunder();
  usePushNotifications();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setToast('Number copied to clipboard!');
    triggerPopunder();
    setTimeout(() => setToast(null), 3000);
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'es' : 'en');

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-neutral-900 dark:bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Phone size={20} className="text-white dark:text-neutral-900" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase">SMSReceive</span>
            </Link>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLang}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <Languages size={18} />
                <span className="hidden sm:inline">{lang === 'en' ? 'ES' : 'EN'}</span>
              </button>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home lang={lang} onCopy={handleCopy} />} />
            <Route path="/number/:id" element={<NumberDetail lang={lang} onCopy={handleCopy} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 bg-white dark:bg-neutral-950">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-neutral-900 dark:bg-white p-1 rounded-md">
                  <Phone size={16} className="text-white dark:text-neutral-900" />
                </div>
                <span className="font-black tracking-tighter uppercase">SMSReceive</span>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs">
                Free temporary phone numbers for online verification. Privacy first, no registration required.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-bold mb-3 uppercase text-xs tracking-widest text-neutral-400">Service</h4>
                <Link to="/" className="block text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Home</Link>
                <Link to="/" className="block text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Countries</Link>
                <Link to="/" className="block text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Premium</Link>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold mb-3 uppercase text-xs tracking-widest text-neutral-400">Legal</h4>
                <Link to="/" className="block text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Privacy</Link>
                <Link to="/" className="block text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Terms</Link>
                <Link to="/" className="block text-neutral-500 hover:text-neutral-900 dark:hover:text-white">Disclaimer</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-neutral-400">Disclaimer</h4>
              <p className="text-[10px] leading-relaxed text-neutral-400 uppercase">
                THIS IS A PUBLIC SERVICE. DO NOT USE FOR SENSITIVE ACCOUNTS. WE ARE NOT RESPONSIBLE FOR ANY DATA LOSS OR UNAUTHORIZED ACCESS TO YOUR ACCOUNTS.
              </p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900 text-center text-[10px] text-neutral-500 uppercase tracking-widest">
            &copy; 2026 SMSReceive. All rights reserved. Built for high performance.
          </div>
        </footer>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}
