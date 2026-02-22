import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Ingredient } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IngredientCardProps {
  ingredient: Ingredient;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const impactColors = {
    good: 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400',
    neutral: 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400',
    harmful: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400',
  };

  const impactIcons = {
    good: <CheckCircle2 className="w-4 h-4" />,
    neutral: <Info className="w-4 h-4" />,
    harmful: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div 
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden mb-3",
        impactColors[ingredient.impact]
      )}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-white/50 dark:bg-black/20">
            {impactIcons[ingredient.impact]}
          </div>
          <div>
            <h4 className="font-semibold text-sm capitalize">{ingredient.name}</h4>
            <p className="text-[10px] opacity-70 uppercase tracking-wider font-medium">
              Label: {ingredient.originalName}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 opacity-50" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 pt-0 space-y-3">
              <div className="h-px bg-current opacity-10" />
              
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60 dark:opacity-40 mb-1">Description</p>
                <p className="text-sm leading-relaxed dark:text-stone-300">{ingredient.description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60 dark:opacity-40 mb-1">Purpose</p>
                <p className="text-sm leading-relaxed dark:text-stone-300">{ingredient.purpose}</p>
              </div>

              {ingredient.risks.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60 dark:opacity-40 mb-1">Known Risks</p>
                  <ul className="list-disc list-inside text-sm space-y-1 dark:text-stone-300">
                    {ingredient.risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
