import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  price: number;
  odds: number;
  confidence: number;
  bettingSites: string;
  expiresAt: string;
  maxPurchases?: number;
  currentPurchases: number;
  isUrgent: boolean;
  content?: string;
  category: 'football' | 'basketball' | 'tennis' | 'other';
  status: 'active' | 'expired' | 'completed';
  result?: 'hit' | 'miss' | 'pending';
}

interface Purchase {
  id: string;
  userId: string;
  recommendationId: string;
  title: string;
  price: number;
  odds: number;
  purchaseDate: string;
  result?: 'hit' | 'miss' | 'pending';
  content: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface AppState {
  // User state
  user: User | null;
  
  // Recommendations state
  recommendations: Recommendation[];
  
  // Purchases state
  purchases: Purchase[];
  
  // Transactions state
  transactions: Transaction[];
  
  // UI state
  isAuthModalOpen: boolean;
  isAdminPanelOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  updateBalance: (amount: number) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  addRecommendation: (recommendation: Recommendation) => void;
  updateRecommendation: (id: string, updates: Partial<Recommendation>) => void;
  deleteRecommendation: (id: string) => void;
  purchaseRecommendation: (recommendationId: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  setAuthModalOpen: (open: boolean) => void;
  setAdminPanelOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  depositFunds: (amount: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      recommendations: [],
      purchases: [],
      transactions: [],
      isAuthModalOpen: false,
      isAdminPanelOpen: false,

      // Actions
      setUser: (user) => set({ user }),
      
      updateBalance: (amount) => set((state) => ({
        user: state.user ? { ...state.user, balance: state.user.balance + amount } : null
      })),
      
      setRecommendations: (recommendations) => set({ recommendations }),
      
      addRecommendation: (recommendation) => set((state) => ({
        recommendations: [...state.recommendations, recommendation]
      })),
      
      updateRecommendation: (id, updates) => set((state) => ({
        recommendations: state.recommendations.map(rec => 
          rec.id === id ? { ...rec, ...updates } : rec
        )
      })),
      
      deleteRecommendation: (id) => set((state) => ({
        recommendations: state.recommendations.filter(rec => rec.id !== id)
      })),
      
      purchaseRecommendation: (recommendationId) => {
        const state = get();
        const recommendation = state.recommendations.find(r => r.id === recommendationId);
        const user = state.user;
        
        if (!recommendation || !user || user.balance < recommendation.price) {
          return;
        }
        
        const purchase: Purchase = {
          id: Date.now().toString(),
          userId: user.id,
          recommendationId,
          title: recommendation.title,
          price: recommendation.price,
          odds: recommendation.odds,
          purchaseDate: new Date().toISOString(),
          result: 'pending',
          content: recommendation.content || 'Premium tip content will be revealed here.'
        };
        
        const transaction: Transaction = {
          id: Date.now().toString(),
          userId: user.id,
          type: 'purchase',
          amount: recommendation.price,
          description: `Purchased: ${recommendation.title}`,
          date: new Date().toISOString(),
          status: 'completed'
        };
        
        set((state) => ({
          user: state.user ? { ...state.user, balance: state.user.balance - recommendation.price } : null,
          purchases: [...state.purchases, purchase],
          transactions: [...state.transactions, transaction],
          recommendations: state.recommendations.map(rec => 
            rec.id === recommendationId 
              ? { ...rec, currentPurchases: rec.currentPurchases + 1 }
              : rec
          )
        }));
      },
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, { ...transaction, id: Date.now().toString() }]
      })),
      
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
      setAdminPanelOpen: (open) => set({ isAdminPanelOpen: open }),
      
      login: async (email, password) => {
        // Simulate login - replace with actual authentication
        if (email && password) {
          const user: User = {
            id: Date.now().toString(),
            email,
            username: email.split('@')[0],
            balance: 50.00,
            isAuthenticated: true,
            isAdmin: email === 'admin@sportxbet.com'
          };
          set({ user, isAuthModalOpen: false });
          return true;
        }
        return false;
      },
      
      register: async (email, password, username) => {
        // Simulate registration - replace with actual authentication
        if (email && password && username) {
          const user: User = {
            id: Date.now().toString(),
            email,
            username,
            balance: 25.00, // Welcome bonus
            isAuthenticated: true,
            isAdmin: false
          };
          set({ user, isAuthModalOpen: false });
          return true;
        }
        return false;
      },
      
      logout: () => set({ user: null }),
      
      depositFunds: (amount) => {
        const state = get();
        if (state.user && amount > 0) {
          const transaction: Transaction = {
            id: Date.now().toString(),
            userId: state.user.id,
            type: 'deposit',
            amount,
            description: 'Wallet deposit',
            date: new Date().toISOString(),
            status: 'completed'
          };
          
          set((state) => ({
            user: state.user ? { ...state.user, balance: state.user.balance + amount } : null,
            transactions: [...state.transactions, transaction]
          }));
        }
      }
    }),
    {
      name: 'sportxbet-storage',
      partialize: (state) => ({
        user: state.user,
        purchases: state.purchases,
        transactions: state.transactions
      })
    }
  )
);