import React from 'react';
import { Badge } from '@/components/ui/badge';
import { POKEMON_TYPES, PokemonType, TYPE_EMOJIS } from '@/types/pokemon';
import { getTypeColor } from '@/hooks/usePokemon';
import { cn } from '@/lib/utils';

interface TypeFilterProps {
  selectedTypes: PokemonType[];
  onTypeToggle: (type: PokemonType) => void;
}

export const TypeFilter: React.FC<TypeFilterProps> = ({ selectedTypes, onTypeToggle }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Filter by Type:</h3>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map(type => {
          const isSelected = selectedTypes.includes(type);
          return (
            <Badge
              key={type}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all capitalize",
                isSelected && [getTypeColor(type), "text-white border-0"],
                !isSelected && "hover:bg-muted"
              )}
              onClick={() => onTypeToggle(type)}
            >
              <span className="mr-1">{TYPE_EMOJIS[type]}</span>
              <span className="capitalize">{type}</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};