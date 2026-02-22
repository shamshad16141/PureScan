import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldQuestion, 
  Share2, 
  Heart, 
  Leaf, 
  Flame, 
  Activity,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { HealthMeter } from './HealthMeter';
import { IngredientCard } from './IngredientCard';

interface ResultViewProps {
  result: AnalysisResult;
  onBack: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onBack }) => {
  const rankColors = {
    Healthy: 'text-emerald-600',
    Moderate: 'text-amber-600',
    Unhealthy: 'text-red-600',
  };

  const safetyIcons = {
    Yes: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    Limit: <ShieldQuestion className="w-6 h-6 text-amber-500" />,
    Avoid: <ShieldAlert className="w-6 h-6 text-red-500" />,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen pb-12"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 px-6 py-4 glass flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
          <ArrowLeft className="w-6 h-6 dark:text-stone-100" />
        </button>
        <h2 className="font-display font-bold text-lg truncate max-w-[200px] dark:text-stone-100">
          {result.productName || "Analysis Result"}
        </h2>
        <button className="p-2 -mr-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
          <Share2 className="w-5 h-5 dark:text-stone-100" />
        </button>
      </div>

      <div className="px-6 pt-6 space-y-8">
        {/* Score Section */}
        <section className="flex flex-col items-center text-center space-y-4">
          <HealthMeter score={result.healthScore} size={200} />
          <div>
            <h3 className={`text-2xl font-bold font-display ${rankColors[result.rank]}`}>
              {result.rank} Product
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">{result.summary}</p>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm flex items-center gap-3">
            {safetyIcons[result.safetyStatus]}
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500">Safe to eat?</p>
              <p className="font-bold text-sm dark:text-stone-200">{result.safetyStatus}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm flex items-center gap-3">
            <Activity className="w-6 h-6 text-indigo-500" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 dark:text-stone-500">Compatibility</p>
              <p className="font-bold text-sm dark:text-stone-200">
                {result.dietCompatibility.vegan ? 'Vegan' : 'Non-Vegan'}
              </p>
            </div>
          </div>
        </div>

        {/* Diet Tags */}
        <div className="flex flex-wrap gap-2">
          {result.dietCompatibility.vegan && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Vegan
            </span>
          )}
          {result.dietCompatibility.keto && (
            <span className="px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3" /> Keto
            </span>
          )}
          {result.dietCompatibility.heartSafe && (
            <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3 h-3" /> Heart Safe
            </span>
          )}
        </div>

        {/* Warnings */}
        {(result.warnings.general.length > 0 || result.warnings.ageSpecific) && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold font-display">Health Warnings</h3>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 space-y-3">
              {result.warnings.ageSpecific && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Age Specific</p>
                  <p className="text-sm text-red-800 dark:text-red-300">{result.warnings.ageSpecific}</p>
                </div>
              )}
              {result.warnings.general.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">General Risks</p>
                  <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-300 space-y-1">
                    {result.warnings.general.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ingredients */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-display text-lg dark:text-stone-100">Ingredients Breakdown</h3>
            <span className="text-xs text-stone-400 font-medium">{result.ingredients.length} items</span>
          </div>
          <div className="space-y-1">
            {result.ingredients.map((ing, i) => (
              <IngredientCard key={i} ingredient={ing} />
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="p-6 rounded-3xl bg-indigo-600 dark:bg-indigo-900 text-white space-y-4 shadow-xl shadow-indigo-200 dark:shadow-none">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6" />
            <h3 className="font-bold font-display text-lg">Daily Intake Advice</h3>
          </div>
          <p className="text-indigo-100 dark:text-indigo-200 text-sm leading-relaxed">
            {result.recommendations}
          </p>
          {result.alternatives.length > 0 && (
            <div className="pt-4 border-t border-indigo-500/50 dark:border-indigo-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 dark:text-indigo-400 mb-3">Healthier Alternatives</p>
              <div className="flex flex-wrap gap-2">
                {result.alternatives.map((alt, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-black/20 text-xs font-medium border border-white/10 dark:border-white/5">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <p className="text-[10px] text-stone-400 text-center px-4 leading-relaxed">
          ⚠️ Disclaimer: This analysis is for educational purposes and not medical advice. Always consult with a healthcare professional before making dietary changes.
        </p>
      </div>
    </motion.div>
  );
};
