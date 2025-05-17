import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface CivicCoinsContextType {
  civicCoins: number;
  setCivicCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
}

// Create the context with default values
const CivicCoinsContext = createContext<CivicCoinsContextType>({
  civicCoins: 1240, // Initial value as requested
  setCivicCoins: () => {},
  addCoins: () => {},
  spendCoins: () => {},
});

// Create a custom hook to use the context
export const useCivicCoins = () => useContext(CivicCoinsContext);

// Create the provider component
interface CivicCoinsProviderProps {
  children: ReactNode;
}

export const CivicCoinsProvider: React.FC<CivicCoinsProviderProps> = ({ children }) => {
  const [civicCoins, setCivicCoins] = useState<number>(1240); // Initialize with 1240 coins

  // Add coins function
  const addCoins = (amount: number) => {
    setCivicCoins(prevCoins => prevCoins + amount);
  };

  // Spend coins function
  const spendCoins = (amount: number) => {
    setCivicCoins(prevCoins => Math.max(0, prevCoins - amount));
  };

  // The value that will be provided to consumers of this context
  const value = {
    civicCoins,
    setCivicCoins,
    addCoins,
    spendCoins,
  };

  return (
    <CivicCoinsContext.Provider value={value}>
      {children}
    </CivicCoinsContext.Provider>
  );
};
