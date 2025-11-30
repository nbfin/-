import { IncomeType } from './types';

// Page 9 & 10: Resident Rules
export const RESIDENT_HEALTH_RATE = 0.0211;
export const RESIDENT_TAX_RATE_9A_9B = 0.10;
export const RESIDENT_TAX_RATE_50 = 0.05;

// Thresholds (Residents)
export const THRESHOLD_HEALTH_9A_9B = 20000;
export const THRESHOLD_HEALTH_50 = 28590; // Page 9 specifically mentions 28,590
export const THRESHOLD_TAX_RESIDENT_9A_9B = 20000;
export const THRESHOLD_TAX_RESIDENT_50 = 88501;

// Page 11: Non-Resident Rules
export const NON_RESIDENT_TAX_RATE_HIGH = 0.20; // 20%
export const NON_RESIDENT_TAX_RATE_LOW_50 = 0.06; // 6%
export const NON_RESIDENT_TAX_RATE_HIGH_50 = 0.18; // 18%

// Thresholds (Non-Residents)
export const THRESHOLD_TAX_NON_RESIDENT_9A_9B = 5000;
export const THRESHOLD_TAX_NON_RESIDENT_50 = 42885;

export const INCOME_TYPE_LABELS: Record<IncomeType, string> = {
  [IncomeType.TYPE_9A]: '執行業務所得 (9A)',
  [IncomeType.TYPE_9B]: '稿費 (9B)',
  [IncomeType.TYPE_50]: '兼職所得 (50)',
  [IncomeType.TYPE_92]: '其他所得 (92)',
};

export const INCOME_TYPE_DESCRIPTIONS: Record<IncomeType, string> = {
  [IncomeType.TYPE_9A]: '律師、會計師、建築師、技師、醫師、藥師、表演人、經紀人等「師」字輩或技藝自力營生者。',
  [IncomeType.TYPE_9B]: '作曲、編劇、漫畫、美術設計、專題演講費等具「創作性質」之業務收入。',
  [IncomeType.TYPE_50]: '兼職人員薪資收入，也就是大部分的「打工仔」。',
  [IncomeType.TYPE_92]: '無法歸在上述類別的所得，機會較少。',
};