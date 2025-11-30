export enum IncomeType {
  TYPE_9A = '9A', // 執行業務所得
  TYPE_9B = '9B', // 稿費
  TYPE_50 = '50', // 兼職所得
  TYPE_92 = '92', // 其他所得
}

export enum ResidencyStatus {
  RESIDENT = 'RESIDENT', // In Taiwan >= 183 days
  NON_RESIDENT = 'NON_RESIDENT', // In Taiwan < 183 days
}

export interface CalculationResult {
  incomeAmount: number;
  taxRate: number;
  taxAmount: number;
  healthInsuranceRate: number;
  healthInsuranceAmount: number;
  netPay: number;
  messages: string[];
}