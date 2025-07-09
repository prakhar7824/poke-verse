import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BattlePokemon } from '@/types/pokemon';

interface BattleContextType {
  battleRoster: BattlePokemon[];
  addToBattle: (pokemon: BattlePokemon) => void;
  removeFromBattle: (pokemonId: number) => void;
  clearBattle: () => void;
  canEnterBattle: boolean;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error('useBattle must be used within a BattleProvider');
  }
  return context;
};

interface BattleProviderProps {
  children: ReactNode;
}

export const BattleProvider: React.FC<BattleProviderProps> = ({ children }) => {
  const [battleRoster, setBattleRoster] = useState<BattlePokemon[]>([]);

  const addToBattle = (pokemon: BattlePokemon) => {
    setBattleRoster(prev => {
      // Prevent duplicates
      if (prev.find(p => p.id === pokemon.id)) {
        return prev;
      }
      // Limit to 6 Pokemon (classic team size)
      if (prev.length >= 6) {
        return prev;
      }
      return [...prev, pokemon];
    });
  };

  const removeFromBattle = (pokemonId: number) => {
    setBattleRoster(prev => prev.filter(p => p.id !== pokemonId));
  };

  const clearBattle = () => {
    setBattleRoster([]);
  };

  const canEnterBattle = battleRoster.length >= 2;

  const value: BattleContextType = {
    battleRoster,
    addToBattle,
    removeFromBattle,
    clearBattle,
    canEnterBattle,
  };

  return (
    <BattleContext.Provider value={value}>
      {children}
    </BattleContext.Provider>
  );
};