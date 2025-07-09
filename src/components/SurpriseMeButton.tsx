import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';
import { getRandomPokemon } from '@/hooks/usePokemon';
import { PokeballLoader } from './PokeballLoader';

interface SurpriseMeButtonProps {
  pokemonList: Pokemon[];
  onPokemonSelected: (pokemon: Pokemon) => void;
}

export const SurpriseMeButton: React.FC<SurpriseMeButtonProps> = ({
  pokemonList,
  onPokemonSelected
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSurpriseMe = async () => {
    setIsLoading(true);
    
    // Add a small delay for the excitement factor
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const randomPokemon = getRandomPokemon(pokemonList);
    if (randomPokemon) {
      onPokemonSelected(randomPokemon);
    }
    
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleSurpriseMe}
      disabled={isLoading || pokemonList.length === 0}
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      {isLoading ? (
        <>
          <PokeballLoader size="sm" className="mr-2" />
          Finding...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Surprise Me!
        </>
      )}
    </Button>
  );
};