export type HealthRank = 'Healthy' | 'Moderate' | 'Unhealthy';
export type SafetyStatus = 'Yes' | 'Limit' | 'Avoid';
export type Impact = 'good' | 'neutral' | 'harmful';

export interface Ingredient {
  name: string;
  originalName: string;
  description: string;
  purpose: string;
  impact: Impact;
  risks: string[];
}

export interface AnalysisResult {
  productName?: string;
  healthScore: number;
  rank: HealthRank;
  safetyStatus: SafetyStatus;
  summary: string;
  ingredients: Ingredient[];
  warnings: {
    ageSpecific: string;
    general: string[];
  };
  dietCompatibility: {
    vegan: boolean;
    keto: boolean;
    diabetic: boolean;
    heartSafe: boolean;
  };
  recommendations: string;
  alternatives: string[];
  timestamp: number;
  id: string;
}

export interface HistoryItem extends AnalysisResult {}
