import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Grid, List, Sparkles, Users } from 'lucide-react';
import { PokemonCard } from '@/components/PokemonCard';
import { TypeFilter } from '@/components/TypeFilter';
import { BattleRoster } from '@/components/BattleRoster';
import { SurpriseMeButton } from '@/components/SurpriseMeButton';
import { PokeballLoadingText } from '@/components/PokeballLoader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useInfiniteScrollPokemon } from '@/hooks/useInfiniteScroll';
import { PokemonType, GENERATIONS, Pokemon } from '@/types/pokemon';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const { pokemon, loading, loadingMore, error, hasMore, loadMore } = useInfiniteScrollPokemon();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPokemon = useMemo(() => {
    return pokemon.filter(p => {
      // Search filter
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.id.toString().includes(searchTerm);
      
      // Type filter
      const matchesType = selectedTypes.length === 0 ||
                         selectedTypes.some(type => p.types.some(t => t.type.name === type));
      
      // Generation filter (simplified - just using ID ranges)
      let matchesGeneration = true;
      if (selectedGeneration !== 'all') {
        const genRanges: Record<string, [number, number]> = {
          'generation-i': [1, 151],
          'generation-ii': [152, 251],
          'generation-iii': [252, 386],
          'generation-iv': [387, 493],
          'generation-v': [494, 649],
          'generation-vi': [650, 721],
          'generation-vii': [722, 809],
          'generation-viii': [810, 905],
        };
        const range = genRanges[selectedGeneration];
        if (range) {
          matchesGeneration = p.id >= range[0] && p.id <= range[1];
        }
      }
      
      return matchesSearch && matchesType && matchesGeneration;
    });
  }, [pokemon, searchTerm, selectedTypes, selectedGeneration]);

  const handleTypeToggle = (type: PokemonType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSurpriseMe = (randomPokemon: Pokemon) => {
    navigate(`/pokemon/${randomPokemon.id}`);
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <PokeballLoadingText text="Loading Pokémon data..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <p className="text-xl mb-4">⚠️ Failed to load Pokémon data</p>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-hero text-white py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-white animate-float delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-white animate-float delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/teams')}
              className="text-white hover:bg-white/20"
            >
              <Users className="w-4 h-4 mr-2" />
              Team Builder
            </Button>
            <ThemeToggle />
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-glow">
            ⚡ Pokémon Explorer ⚡
          </h1>
          <p className="text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Discover, compare, and explore the amazing world of Pokémon! Build teams, battle, and catch 'em all! 🔥
          </p>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6 z-10" />
              <Input
                placeholder="Search by name or number (e.g. Pikachu or 25)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-16 text-lg bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-2xl focus:ring-4 focus:ring-white/30"
              />
            </div>
            
            <div className="flex justify-center">
              <SurpriseMeButton pokemonList={pokemon} onPokemonSelected={handleSurpriseMe} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Filters */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center gap-4 p-6 bg-card rounded-2xl border shadow-lg">
            <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
              <SelectTrigger className="w-52 h-12 rounded-xl">
                <SelectValue placeholder="🌟 All Generations" />
              </SelectTrigger>
              <SelectContent>
                {GENERATIONS.map(gen => (
                  <SelectItem key={gen.value} value={gen.value}>
                    {gen.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-3 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-12 w-12 rounded-xl"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-12 w-12 rounded-xl"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <TypeFilter selectedTypes={selectedTypes} onTypeToggle={handleTypeToggle} />
        </div>

        {/* Results Count & Stats */}
        <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              🔍 Showing {filteredPokemon.length} Pokémon
            </p>
            {selectedTypes.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Filtered by {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Pokemon Grid */}
        <div className={cn(
          "grid gap-8 mb-8",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {filteredPokemon.map(p => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>

        {/* Loading More */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <PokeballLoadingText text="Loading more Pokémon..." />
          </div>
        )}

        {/* Load More Button */}
        {!loadingMore && hasMore && filteredPokemon.length > 0 && (
          <div className="flex justify-center py-8">
            <Button onClick={loadMore} size="lg" className="px-8 py-4 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Load More Pokémon
            </Button>
          </div>
        )}

        {filteredPokemon.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-2xl text-muted-foreground mb-6">No Pokémon found</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedTypes([]);
              setSelectedGeneration('all');
            }} size="lg" className="px-8">
              🔄 Clear All Filters
            </Button>
          </div>
        )}
      </div>

      <BattleRoster />
    </div>
  );
};

export default Index;
