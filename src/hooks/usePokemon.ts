import { useState, useEffect } from 'react';
import { Pokemon, PokemonListResponse, PokemonSpecies } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const usePokemonList = (limit: number = 493) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
        const data: PokemonListResponse = await response.json();
        
        // Fetch detailed data for each Pokemon
        const detailedPokemon = await Promise.all(
          data.results.map(async (p) => {
            const pokemonResponse = await fetch(p.url);
            return await pokemonResponse.json();
          })
        );
        
        setPokemon(detailedPokemon);
      } catch (err) {
        setError('Failed to fetch Pokemon data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [limit]);

  return { pokemon, loading, error };
};

export const usePokemonDetails = (id: string | number) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch Pokemon details
        const pokemonResponse = await fetch(`${BASE_URL}/pokemon/${id}`);
        const pokemonData: Pokemon = await pokemonResponse.json();
        setPokemon(pokemonData);
        
        // Fetch species data for generation info
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData: PokemonSpecies = await speciesResponse.json();
        setSpecies(speciesData);
        
      } catch (err) {
        setError('Failed to fetch Pokemon details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPokemonDetails();
    }
  }, [id]);

  return { pokemon, species, loading, error };
};

export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: 'bg-types-normal',
    fire: 'bg-types-fire',
    water: 'bg-types-water',
    electric: 'bg-types-electric',
    grass: 'bg-types-grass',
    ice: 'bg-types-ice',
    fighting: 'bg-types-fighting',
    poison: 'bg-types-poison',
    ground: 'bg-types-ground',
    flying: 'bg-types-flying',
    psychic: 'bg-types-psychic',
    bug: 'bg-types-bug',
    rock: 'bg-types-rock',
    ghost: 'bg-types-ghost',
    dragon: 'bg-types-dragon',
    dark: 'bg-types-dark',
    steel: 'bg-types-steel',
    fairy: 'bg-types-fairy',
  };
  
  return typeColors[type] || 'bg-gray-500';
};

export const getTypeGradient = (types: string[]): string => {
  if (types.length === 1) {
    const type = types[0];
    const gradients: Record<string, string> = {
      normal: 'from-types-normal/20 to-types-normal/5',
      fire: 'from-types-fire/20 to-types-fire/5',
      water: 'from-types-water/20 to-types-water/5',
      electric: 'from-types-electric/20 to-types-electric/5',
      grass: 'from-types-grass/20 to-types-grass/5',
      ice: 'from-types-ice/20 to-types-ice/5',
      fighting: 'from-types-fighting/20 to-types-fighting/5',
      poison: 'from-types-poison/20 to-types-poison/5',
      ground: 'from-types-ground/20 to-types-ground/5',
      flying: 'from-types-flying/20 to-types-flying/5',
      psychic: 'from-types-psychic/20 to-types-psychic/5',
      bug: 'from-types-bug/20 to-types-bug/5',
      rock: 'from-types-rock/20 to-types-rock/5',
      ghost: 'from-types-ghost/20 to-types-ghost/5',
      dragon: 'from-types-dragon/20 to-types-dragon/5',
      dark: 'from-types-dark/20 to-types-dark/5',
      steel: 'from-types-steel/20 to-types-steel/5',
      fairy: 'from-types-fairy/20 to-types-fairy/5',
    };
    return gradients[type] || 'from-gray-500/20 to-gray-500/5';
  } else {
    // Dual type gradient
    const [type1, type2] = types;
    return `from-types-${type1}/20 via-types-${type2}/10 to-types-${type1}/5`;
  }
};

export const getRandomPokemon = (pokemonList: Pokemon[]): Pokemon | null => {
  if (pokemonList.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * pokemonList.length);
  return pokemonList[randomIndex];
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const calculateTotalPower = (stats: Pokemon['stats']): number => {
  return stats.reduce((total, stat) => total + stat.base_stat, 0);
};

export const toBattlePokemon = (pokemon: Pokemon): import('@/types/pokemon').BattlePokemon => {
  return {
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
};