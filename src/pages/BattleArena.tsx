import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Zap, Crown, RotateCcw } from 'lucide-react';
import { useBattle } from '@/contexts/BattleContext';
import { getTypeColor } from '@/hooks/usePokemon';
import { BattlePokemon } from '@/types/pokemon';
import { cn } from '@/lib/utils';

export const BattleArena: React.FC = () => {
  const navigate = useNavigate();
  const { battleRoster, clearBattle } = useBattle();
  const [battleResult, setBattleResult] = useState<{
    winner: BattlePokemon;
    loser: BattlePokemon;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (battleRoster.length < 2) {
      navigate('/');
    }
  }, [battleRoster.length, navigate]);

  const simulateBattle = () => {
    if (battleRoster.length < 2) return;

    setIsSimulating(true);
    
    // Simulate battle with some delay for drama
    setTimeout(() => {
      // Calculate power for all Pokemon with some randomness
      const pokemonWithPower = battleRoster.map(pokemon => ({
        pokemon,
        battlePower: pokemon.totalPower + Math.random() * 100
      }));
      
      // Sort by battle power to determine winner and loser
      pokemonWithPower.sort((a, b) => b.battlePower - a.battlePower);
      
      const winner = pokemonWithPower[0].pokemon;
      const loser = pokemonWithPower[pokemonWithPower.length - 1].pokemon;
      
      setBattleResult({ winner, loser });
      setIsSimulating(false);
    }, 2000);
  };

  const resetBattle = () => {
    setBattleResult(null);
  };

  const backToHome = () => {
    clearBattle();
    navigate('/');
  };

  if (battleRoster.length < 2) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-battle">
      {/* Header */}
      <div className="p-6 text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={backToHome}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pokemon List
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-8 h-8" />
              Pokemon Battlefield
            </h1>
          </div>
          
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Battle Area */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
            <h2 className="text-xl font-bold text-white">BATTLE ARENA ⚔️</h2>
          </div>
        </div>

        {/* Pokemon Battle Cards */}
        <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: `repeat(${Math.min(battleRoster.length, 3)}, 1fr)` }}>
          {battleRoster.map((pokemon, index) => (
            <Card key={pokemon.id} className={cn(
              "p-4 transition-all duration-500",
              battleResult?.winner.id === pokemon.id && "ring-4 ring-yellow-400 shadow-2xl",
              battleResult?.loser?.id === pokemon.id && "opacity-75 grayscale"
            )}>
              <div className="text-center">
                <Badge className={cn(
                  "mb-3",
                  index === 0 ? "bg-battle-red text-white" : "bg-battle-blue text-white"
                )}>
                  Player {index + 1}
                </Badge>
                
                <div className="relative mb-3">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain mx-auto"
                  />
                  {battleResult?.winner.id === pokemon.id && (
                    <Crown className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-400" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold capitalize mb-2">{pokemon.name}</h3>
                
                <div className="flex gap-1 justify-center mb-3 flex-wrap">
                  {pokemon.types.map(type => (
                    <Badge
                      key={type}
                      className={cn(getTypeColor(type), "text-white border-0 capitalize text-xs")}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-bold">{pokemon.stats.hp}</div>
                      <div className="text-muted-foreground">HP</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{pokemon.stats.attack}</div>
                      <div className="text-muted-foreground">ATK</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{pokemon.stats.defense}</div>
                      <div className="text-muted-foreground">DEF</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{pokemon.stats.speed}</div>
                      <div className="text-muted-foreground">SPD</div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className={cn(
                      "font-bold text-sm",
                      index === 0 ? "text-battle-red" : "text-battle-blue"
                    )}>
                      Power: {pokemon.totalPower}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* VS and Battle Controls */}
        <div className="text-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-white">VS</span>
          </div>

          {!battleResult && !isSimulating && (
            <Button
              onClick={simulateBattle}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-bold"
            >
              <Zap className="w-6 h-6 mr-2" />
              Start Battle!
            </Button>
          )}

          {isSimulating && (
            <div className="text-white">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl">Battle in progress...</p>
            </div>
          )}

          {battleResult && (
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-white">
                <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">
                  {battleResult.winner.name.toUpperCase()} WINS!
                </h2>
                <p className="text-lg opacity-90">
                  Defeated {battleResult.loser.name} in an epic battle!
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetBattle}
                  variant="outline"
                  className="bg-white/20 border-white text-white hover:bg-white hover:text-primary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Battle Again
                </Button>
                <Button
                  onClick={backToHome}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Choose New Pokemon
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};