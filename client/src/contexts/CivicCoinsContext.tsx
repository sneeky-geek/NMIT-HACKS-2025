import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { API_CONFIG, getApiUrl } from '@/config';

// Define the context type
interface CivicCoinsContextType {
  civicCoins: number;
  setCivicCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
  isLoading: boolean;
}

// Create the context with default values
const CivicCoinsContext = createContext<CivicCoinsContextType>({
  civicCoins: 0,
  setCivicCoins: () => {},
  addCoins: () => {},
  spendCoins: () => {},
  isLoading: true,
});

// Create a custom hook to use the context
export const useCivicCoins = () => useContext(CivicCoinsContext);

// Create the provider component
interface CivicCoinsProviderProps {
  children: ReactNode;
}

export const CivicCoinsProvider: React.FC<CivicCoinsProviderProps> = ({ children }) => {
  const [civicCoins, setCivicCoins] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  // Use tokens from user object or fetch from backend if needed
  useEffect(() => {
    // Only process when user is authenticated
    if (isAuthenticated && user) {
      setIsLoading(true);
      
      // If user object has tokens field, use it directly
      if (user.tokens !== undefined) {
        setCivicCoins(user.tokens);
        setIsLoading(false);
      } else {
        // Fallback: fetch tokens from the API if not in user object
        const fetchTokens = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              setIsLoading(false);
              return;
            }
            
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.TOKENS.BALANCE), {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setCivicCoins(data.tokens);
            } else {
              console.error('Failed to fetch tokens:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching tokens:', error);
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchTokens();
      }
    } else {
      // Reset coins when not authenticated
      setCivicCoins(0);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, user?.tokens]); // Add user.tokens as dependency to update when it changes

  // Add coins function with backend sync
  const addCoins = async (amount: number) => {
    if (amount <= 0) return;
    
    // Optimistically update UI
    setCivicCoins(prevCoins => prevCoins + amount);
    
    // No need to sync with backend here, as that's handled in the component that calls addCoins
    // The backend API call is made in the SmartDustbin component when recycling
  };

  // Spend coins function with backend sync
  const spendCoins = async (amount: number) => {
    if (amount <= 0) return;
    
    // Only allow spending if we have enough coins
    if (civicCoins < amount) return;
    
    // Optimistically update UI
    setCivicCoins(prevCoins => prevCoins - amount);
    
    // Try to sync with backend
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.TOKENS.REDEEM), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          rewardId: 'manual-redemption'  // Generic ID for manual redemptions
        })
      });
      
      if (!response.ok) {
        // Revert the optimistic update if there was an error
        setCivicCoins(prevCoins => prevCoins + amount);
        console.error('Failed to redeem tokens:', response.statusText);
      }
    } catch (error) {
      // Revert the optimistic update if there was an error
      setCivicCoins(prevCoins => prevCoins + amount);
      console.error('Error redeeming tokens:', error);
    }
  };

  // The value that will be provided to consumers of this context
  const value = {
    civicCoins,
    setCivicCoins,
    addCoins,
    spendCoins,
    isLoading,
  };

  return (
    <CivicCoinsContext.Provider value={value}>
      {children}
    </CivicCoinsContext.Provider>
  );
};
