import React from 'react';
import { motion } from 'motion/react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryListProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-stone-400 dark:text-stone-600">
        <Clock className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">No scan history yet</p>
      </div>
    );
  }

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(ts);
  };

  const getRankColor = (rank: string) => {
    if (rank === 'Healthy') return 'bg-emerald-500';
    if (rank === 'Moderate') return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative"
        >
          <button
            onClick={() => onSelect(item)}
            className="w-full p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-xl ${getRankColor(item.rank)} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-current/20`}>
              {item.healthScore}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate dark:text-stone-100">
                {item.productName || "Product Scan"}
              </h4>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 font-medium uppercase tracking-wider">
                {formatDate(item.timestamp)} • {item.rank}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300 dark:text-stone-700" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="absolute -right-2 -top-2 p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};
