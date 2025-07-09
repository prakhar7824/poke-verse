import { useState, useEffect, useCallback } from 'react';
import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_PER_PAGE = 30;

export const useInfiniteScrollPokemon = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchPokemonBatch = useCallback(async (currentOffset: number) => {
    try {
      if (currentOffset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `${BASE_URL}/pokemon?limit=${POKEMON_PER_PAGE}&offset=${currentOffset}`
      );
      const data: PokemonListResponse = await response.json();
      
      // Fetch detailed data for each Pokemon in batch
      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const pokemonResponse = await fetch(p.url);
          return await pokemonResponse.json();
        })
      );

      if (currentOffset === 0) {
        setPokemon(detailedPokemon);
      } else {
        setPokemon(prev => [...prev, ...detailedPokemon]);
      }
      
      setHasMore(data.next !== null);
      setError(null);
    } catch (err) {
      setError('Failed to fetch Pokemon data');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextOffset = offset + POKEMON_PER_PAGE;
      setOffset(nextOffset);
      fetchPokemonBatch(nextOffset);
    }
  }, [offset, loadingMore, hasMore, fetchPokemonBatch]);

  useEffect(() => {
    fetchPokemonBatch(0);
  }, [fetchPokemonBatch]);

  return {
    pokemon,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
  };
};