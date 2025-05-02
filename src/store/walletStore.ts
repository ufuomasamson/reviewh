import { create } from 'zustand';
import { Transaction } from '../lib/types';
import { mockTransactions } from '../lib/mockData';
import { generateId } from '../lib/utils';

interface WalletState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  getUserTransactions: (userId: string) => Promise<Transaction[]>;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction>;
  getWalletBalance: (userId: string) => Promise<number>;
  getTotalEarnings: (userId: string) => Promise<number>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  transactions: [...mockTransactions],
  isLoading: false,
  error: null,
  
  getUserTransactions: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return get().transactions.filter(tx => tx.userId === userId);
    } catch (error) {
      set({ error: 'Failed to fetch transactions' });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
  
  createTransaction: async (transactionData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTransaction: Transaction = {
        ...transactionData,
        id: generateId('txn-'),
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({ 
        transactions: [...state.transactions, newTransaction]
      }));
      
      return newTransaction;
    } catch (error) {
      set({ error: 'Failed to create transaction' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  getWalletBalance: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userTransactions = get().transactions.filter(tx => tx.userId === userId);
      
      // Calculate balance based on completed transactions
      const balance = userTransactions
        .filter(tx => tx.status === 'completed')
        .reduce((total, tx) => {
          if (tx.type === 'deposit' || tx.type === 'earning') {
            return total + tx.amount;
          } else if (tx.type === 'withdrawal' || tx.type === 'payment') {
            return total - tx.amount;
          }
          return total;
        }, 0);
      
      return balance;
    } catch (error) {
      set({ error: 'Failed to calculate wallet balance' });
      return 0;
    } finally {
      set({ isLoading: false });
    }
  },
  
  getTotalEarnings: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userTransactions = get().transactions.filter(tx => 
        tx.userId === userId && tx.type === 'earning' && tx.status === 'completed'
      );
      
      // Calculate total earnings
      const earnings = userTransactions.reduce((total, tx) => total + tx.amount, 0);
      
      return earnings;
    } catch (error) {
      set({ error: 'Failed to calculate total earnings' });
      return 0;
    } finally {
      set({ isLoading: false });
    }
  },
}));