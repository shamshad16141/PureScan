import React from 'react';
import { motion } from 'motion/react';

interface HealthMeterProps {
  score: number;
  size?: number;
}

export const HealthMeter: React.FC<HealthMeterProps> = ({ score, size = 160 }) => {
  const radius = size * 0.4;
  const stroke = size * 0.08;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return '#10b981'; // emerald-500
    if (s >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const color = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="text-stone-200 dark:text-stone-800"
        />
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-bold font-display"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Score</span>
      </div>
    </div>
  );
};
