export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
    };
  }>;
  species: {
    url: string;
  };
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface BattlePokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    'special-attack': number;
    'special-defense': number;
    speed: number;
  };
  totalPower: number;
}

export interface PokemonSpecies {
  generation: {
    name: string;
  };
}

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export const TYPE_EMOJIS: Record<PokemonType, string> = {
  normal: '🐾',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  grass: '🌿',
  ice: '❄️',
  fighting: '👊',
  poison: '☠️',
  ground: '🌍',
  flying: '🦅',
  psychic: '🔮',
  bug: '🐛',
  rock: '🪨',
  ghost: '👻',
  dragon: '🐉',
  dark: '🌙',
  steel: '⚔️',
  fairy: '🧚',
};

export type PokemonType = typeof POKEMON_TYPES[number];

export const GENERATIONS = [
  { name: 'All Generations', value: 'all' },
  { name: 'Generation I', value: 'generation-i' },
  { name: 'Generation II', value: 'generation-ii' },
  { name: 'Generation III', value: 'generation-iii' },
  { name: 'Generation IV', value: 'generation-iv' },
  { name: 'Generation V', value: 'generation-v' },
  { name: 'Generation VI', value: 'generation-vi' },
  { name: 'Generation VII', value: 'generation-vii' },
  { name: 'Generation VIII', value: 'generation-viii' },
] as const;