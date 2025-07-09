import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sword, X, Zap } from 'lucide-react';
import { useBattle } from '@/contexts/BattleContext';
import { getTypeColor } from '@/hooks/usePokemon';
import { cn } from '@/lib/utils';

export const BattleRoster: React.FC = () => {
  const { battleRoster, removeFromBattle, canEnterBattle, clearBattle } = useBattle();
  const navigate = useNavigate();

  if (battleRoster.length === 0) {
    return null;
  }

  const handleEnterBattle = () => {
    navigate('/battle');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sword className="w-5 h-5 text-accent" />
            <span className="font-semibold">Battle Roster ({battleRoster.length}/6)</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearBattle}
            >
              Clear All
            </Button>
            <Button
              onClick={handleEnterBattle}
              disabled={!canEnterBattle}
              className="bg-gradient-battle"
            >
              <Zap className="w-4 h-4 mr-2" />
              Enter Battlefield
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {battleRoster.map((pokemon, index) => (
            <Card key={pokemon.id} className="flex-shrink-0 w-20">
              <div className="p-2 relative">
                <Badge className={cn(
                  "absolute -top-1 -right-1 w-6 h-6 p-0 flex items-center justify-center text-xs",
                  index === 0 ? "bg-battle-red" : "bg-battle-blue"
                )}>
                  {index + 1}
                </Badge>
                
                <button
                  onClick={() => removeFromBattle(pokemon.id)}
                  className="absolute -top-1 -left-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs hover:bg-destructive/80 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-12 h-12 object-contain mx-auto mb-1"
                />
                
                <div className="text-xs text-center capitalize font-medium truncate">
                  {pokemon.name}
                </div>
                
                <div className="flex gap-1 justify-center mt-1">
                  {pokemon.types.slice(0, 2).map(type => (
                    <div
                      key={type}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getTypeColor(type).replace('bg-', 'bg-')
                      )}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};