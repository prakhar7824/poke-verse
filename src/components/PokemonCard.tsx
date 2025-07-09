import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, X } from 'lucide-react';
import { Pokemon, BattlePokemon } from '@/types/pokemon';
import { useBattle } from '@/contexts/BattleContext';
import { getTypeColor, getTypeGradient, formatPokemonId, calculateTotalPower } from '@/hooks/usePokemon';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToBattle, battleRoster, removeFromBattle } = useBattle();

  const isInBattle = battleRoster.some(p => p.id === pokemon.id);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return; // Don't navigate if button was clicked
    }
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleAddToBattle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInBattle) {
      removeFromBattle(pokemon.id);
      return;
    }

    const battlePokemon: BattlePokemon = {
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
      types: pokemon.types.map(t => t.type.name),
      stats: {
        hp: pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
        attack: pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
        defense: pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
        'special-attack': pokemon.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
        'special-defense': pokemon.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
        speed: pokemon.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
      },
      totalPower: calculateTotalPower(pokemon.stats),
    };

    addToBattle(battlePokemon);
  };

  const maxStat = Math.max(...pokemon.stats.map(s => s.base_stat));
  const pokemonTypes = pokemon.types.map(t => t.type.name);
  const typeGradient = getTypeGradient(pokemonTypes);

  return (
    <div className="relative">
      <Card 
        className={cn(
          "group cursor-pointer transition-all duration-500 hover:shadow-hover hover:-translate-y-3 overflow-hidden relative",
          "bg-gradient-to-br", typeGradient,
          "border-2 hover:border-primary/20",
          isInBattle && "ring-2 ring-accent shadow-pokemon scale-105"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        <div className="p-4 relative z-10">
          <div className="text-sm text-muted-foreground mb-2 font-mono">
            {formatPokemonId(pokemon.id)}
          </div>
          
          <div className="relative h-32 mb-4">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-all duration-500 filter group-hover:brightness-110 group-hover:drop-shadow-lg"
            />
          </div>
          
          <h3 className="text-lg font-semibold capitalize mb-2 text-center">
            {pokemon.name}
          </h3>
          
          <div className="flex gap-1 justify-center mb-3">
            {pokemon.types.map(type => (
              <Badge 
                key={type.type.name}
                className={cn(
                  getTypeColor(type.type.name),
                  "text-white border-0 capitalize"
                )}
              >
                {type.type.name}
              </Badge>
            ))}
          </div>

          {/* Enhanced Hover Stats Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-800/90 dark:to-gray-900/95 backdrop-blur-md p-4 flex flex-col justify-center border border-primary/20 rounded-lg">
              <div className="space-y-3 mb-4">
                <div className="text-sm font-semibold text-center mb-3 text-primary">⚡ Base Stats</div>
                {pokemon.stats.slice(0, 3).map(stat => (
                  <div key={stat.stat.name} className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize flex items-center gap-1">
                        {stat.stat.name === 'hp' && '❤️'}
                        {stat.stat.name === 'attack' && '⚔️'}
                        {stat.stat.name === 'defense' && '🛡️'}
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="font-bold text-primary">{stat.base_stat}</span>
                    </div>
                    <Progress 
                      value={(stat.base_stat / maxStat) * 100} 
                      className="h-2 bg-muted/30"
                    />
                  </div>
                ))}
              </div>
              
              <Button
                onClick={handleAddToBattle}
                variant={isInBattle ? "destructive" : "default"}
                className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isInBattle ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Remove from Battle
                  </>
                ) : (
                  <>
                    <Sword className="w-4 h-4 mr-2" />
                    Add to Battle
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};