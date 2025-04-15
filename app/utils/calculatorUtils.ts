export const calculateImprovedAdSpend = (adSpend: number): number => {
  return adSpend * 0.83;
};

export const calculateImprovedRevenue = (revenue: number): number => {
  return revenue * 1.2925;
};

export const calculateImprovedRoas = (currentRoas: number): number => {
  if (currentRoas === 0) return 0;
  return Math.round(currentRoas * 1.17 * 100) / 100;
};

export const calculateAdSpendSavings = (
  adSpend: number,
  improvedAdSpend: number
): number => {
  return adSpend - improvedAdSpend;
};

export const calculateRevenueGain = (
  revenue: number,
  improvedRevenue: number
): number => {
  return improvedRevenue - revenue;
};

export const calculateTotalSavings = (
  adSpendSavings: number,
  revenueGain: number
): number => {
  return adSpendSavings + revenueGain * 0.64;
};
