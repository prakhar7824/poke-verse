import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Heart, Share, BarChart3, Sword } from 'lucide-react';
import { usePokemonDetails, getTypeColor, formatPokemonId, calculateTotalPower } from '@/hooks/usePokemon';
import { useBattle } from '@/contexts/BattleContext';
import { BattlePokemon } from '@/types/pokemon';
import { cn } from '@/lib/utils';

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pokemon, species, loading, error } = usePokemonDetails(id!);
  const { addToBattle, battleRoster, removeFromBattle } = useBattle();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Pokemon data...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load Pokemon data</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const isInBattle = battleRoster.some(p => p.id === pokemon.id);
  const maxStat = Math.max(...pokemon.stats.map(s => s.base_stat));

  const handleBattleToggle = () => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-pokemon text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pokemon
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Share className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <BarChart3 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="w-64 h-64 mx-auto mb-6 relative">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            
            <div className="text-sm opacity-90 mb-2">
              {formatPokemonId(pokemon.id)}
            </div>
            
            <h1 className="text-4xl font-bold capitalize mb-4">
              {pokemon.name}
            </h1>
            
            <div className="flex gap-2 justify-center mb-6">
              {pokemon.types.map(type => (
                <Badge
                  key={type.type.name}
                  className={cn(
                    getTypeColor(type.type.name),
                    "text-white border-0 capitalize px-4 py-1"
                  )}
                >
                  {type.type.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {(pokemon.height / 10).toFixed(1)}m
            </div>
            <div className="text-sm text-muted-foreground">Height</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {(pokemon.weight / 10).toFixed(1)}kg
            </div>
            <div className="text-sm text-muted-foreground">Weight</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {pokemon.abilities.length}
            </div>
            <div className="text-sm text-muted-foreground">Abilities</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {calculateTotalPower(pokemon.stats)}
            </div>
            <div className="text-sm text-muted-foreground">Total Stats</div>
          </Card>
        </div>

        {/* Battle Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleBattleToggle}
            variant={isInBattle ? "destructive" : "default"}
            size="lg"
            className="px-8"
          >
            <Sword className="w-5 h-5 mr-2" />
            {isInBattle ? 'Remove from Battle' : 'Add to Battle'}
          </Button>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="stats" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="abilities">Abilities</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Base Stats</h3>
              <div className="space-y-4">
                {pokemon.stats.map(stat => (
                  <div key={stat.stat.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize font-medium">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="font-bold">{stat.base_stat}</span>
                    </div>
                    <Progress 
                      value={(stat.base_stat / maxStat) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="abilities">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Abilities</h3>
              <div className="grid gap-3">
                {pokemon.abilities.map((ability, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <span className="capitalize font-medium">
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="moves">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Moves</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {pokemon.moves.slice(0, 20).map((move, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm capitalize">
                    {move.move.name.replace('-', ' ')}
                  </div>
                ))}
              </div>
              {pokemon.moves.length > 20 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Showing 20 of {pokemon.moves.length} moves
                </p>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="info">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Generation:</span>
                  <span className="ml-2 capitalize">
                    {species?.generation.name.replace('-', ' ') || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Types:</span>
                  <div className="flex gap-2 mt-1">
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
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};