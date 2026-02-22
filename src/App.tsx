import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera as CameraIcon, 
  History as HistoryIcon, 
  Search, 
  Settings,
  Sparkles,
  Loader2,
  AlertCircle,
  Upload,
  User,
  Moon,
  Sun
} from 'lucide-react';
import { Scanner } from './components/Scanner';
import { ResultView } from './components/ResultView';
import { HistoryList } from './components/HistoryList';
import { analyzeIngredients } from './services/geminiService';
import { AnalysisResult, HistoryItem } from './types';

type View = 'dashboard' | 'scanning' | 'analyzing' | 'result';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | undefined>(() => {
    const saved = localStorage.getItem('purescan_user_age');
    return saved ? parseInt(saved) : undefined;
  });
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('purescan_dark_mode');
    return saved === 'true';
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('purescan_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('purescan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history
  const saveToHistory = (result: AnalysisResult) => {
    const newHistory = [result, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('purescan_history', JSON.stringify(newHistory));
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('purescan_history', JSON.stringify(newHistory));
  };

  const handleCapture = async (base64: string) => {
    setView('analyzing');
    setError(null);
    try {
      const result = await analyzeIngredients(base64, userAge);
      setCurrentResult(result);
      saveToHistory(result);
      setView('result');
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze ingredients. Please try again with a clearer photo.");
      setView('dashboard');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentResult(item);
    setView('result');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        handleCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-transparent relative overflow-x-hidden transition-colors duration-500">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 space-y-8"
          >
            {/* Header */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl tracking-tight dark:text-stone-100">PureScan</h1>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500 font-bold uppercase tracking-widest">AI Health Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAgeModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  {userAge ? `${userAge}y` : 'Set Age'}
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 rounded-full bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <Settings className="w-5 h-5 text-stone-400" />
                </button>
              </div>
            </header>

            {/* Hero / CTA */}
            <section className="relative p-8 rounded-[2.5rem] bg-indigo-600 text-white overflow-hidden shadow-2xl shadow-indigo-200">
              <div className="relative z-10 space-y-4">
                <h2 className="text-3xl font-display font-bold leading-tight">
                  Know what's <br /> inside your food.
                </h2>
                <p className="text-indigo-100 text-sm opacity-80 leading-relaxed">
                  Scan any ingredient list to get an instant health analysis and safety score.
                </p>
                <button 
                  onClick={() => setView('scanning')}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
                >
                  <CameraIcon className="w-6 h-6" />
                  Start Scanning
                </button>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  <button 
                    className="w-full py-3 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform border border-indigo-400/30"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </button>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl" />
            </section>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* History Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-5 h-5 text-stone-400" />
                  <h3 className="font-bold font-display text-lg dark:text-stone-100">Recent Scans</h3>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="text-xs font-bold text-stone-400 uppercase tracking-wider hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <HistoryList 
                items={history} 
                onSelect={handleSelectHistory} 
                onDelete={deleteFromHistory}
              />
            </section>

            {/* Quick Tips */}
            <section className="p-6 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800/50 space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-2 dark:text-stone-200">
                <Search className="w-4 h-4 text-stone-400" />
                Quick Tip
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                For best results, ensure the ingredient list is well-lit and flat. Avoid glares on glossy packaging.
              </p>
            </section>

          </motion.div>
        )}

        {view === 'scanning' && (
          <Scanner 
            key="scanner"
            onCapture={handleCapture} 
            onClose={() => setView('dashboard')} 
          />
        )}

        {view === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-stone-950 flex flex-col items-center justify-center p-12 text-center transition-colors duration-500"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-indigo-400 rounded-3xl blur-xl -z-10"
              />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3 dark:text-stone-100">Analyzing Ingredients</h2>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Our AI is identifying additives, cross-referencing health risks, and calculating your safety score...
            </p>
            
            <div className="mt-12 w-full max-w-[200px] h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-indigo-600"
              />
            </div>
          </motion.div>
        )}

        {view === 'result' && currentResult && (
          <ResultView 
            key="result"
            result={currentResult} 
            onBack={() => setView('dashboard')} 
          />
        )}
      </AnimatePresence>

      {/* Age Modal */}
      <AnimatePresence>
        {isAgeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setIsAgeModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xs bg-white dark:bg-stone-900 rounded-[2rem] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold dark:text-stone-100">Your Age</h3>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">Help us provide better safety warnings for your age group.</p>
                </div>
                <input
                  type="number"
                  placeholder="Enter age"
                  value={userAge || ''}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : undefined;
                    setUserAge(val);
                    if (val) localStorage.setItem('purescan_user_age', val.toString());
                    else localStorage.removeItem('purescan_user_age');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 border-none text-center text-xl font-bold focus:ring-2 focus:ring-indigo-500 dark:text-stone-100"
                />
                <button
                  onClick={() => setIsAgeModalOpen(false)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200"
                >
                  Save & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-display font-bold dark:text-stone-100">Settings</h3>
                  <button onClick={() => setIsSettingsOpen(false)} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800">
                    <AlertCircle className="w-5 h-5 rotate-45 dark:text-stone-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 space-y-1">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">App Info</p>
                    <p className="text-sm font-medium dark:text-stone-200">PureScan v1.0.0</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Powered by Gemini AI</p>
                  </div>

                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                      <span className="font-semibold text-sm dark:text-stone-200">Dark Mode</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${isDarkMode ? 'bg-indigo-600' : 'bg-stone-200 dark:bg-stone-700'}`}>
                      <motion.div 
                        animate={{ x: isDarkMode ? 18 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setIsAgeModalOpen(true);
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-indigo-500" />
                      <span className="font-semibold text-sm dark:text-stone-200">Update Age Profile</span>
                    </div>
                    <span className="text-xs font-bold text-stone-400">{userAge ? `${userAge} years` : 'Not set'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setShowClearConfirm(true);
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HistoryIcon className="w-5 h-5" />
                    <span className="font-semibold text-sm">Clear Scan History</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Medical Disclaimer</p>
                  <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    PureScan is for educational purposes only. AI analysis may contain errors. Always verify with official labels and consult medical professionals for dietary advice.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-white dark:bg-stone-900 rounded-[2rem] p-8 text-center space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto text-red-500 dark:text-red-400">
                <HistoryIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold dark:text-stone-100">Clear History?</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm">This action cannot be undone. All your previous scans will be deleted.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('purescan_history');
                    setShowClearConfirm(false);
                  }}
                  className="w-full py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="w-full py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
