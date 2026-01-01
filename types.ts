export type CategoryType = 'fixed' | 'variable' | 'discretionary' | 'income' | 'savings';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: CategoryType;
  user: string; // For multi-user tracking
}

export interface BudgetRule {
  needs: number; // 50%
  wants: number; // 30%
  savings: number; // 20%
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface KidJar {
  type: 'spend' | 'save' | 'give';
  amount: number;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}