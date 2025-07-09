import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BattlePokemon } from '@/types/pokemon';

export interface Team {
  id: string;
  name: string;
  pokemon: BattlePokemon[];
  createdAt: Date;
}

interface TeamContextType {
  teams: Team[];
  createTeam: (name: string) => string;
  addPokemonToTeam: (teamId: string, pokemon: BattlePokemon) => void;
  removePokemonFromTeam: (teamId: string, pokemonId: number) => void;
  deleteTeam: (teamId: string) => void;
  renameTeam: (teamId: string, newName: string) => void;
  battleTeams: (team1Id: string, team2Id: string) => {
    winner: Team;
    loser: Team;
    winnerPower: number;
    loserPower: number;
  } | null;
  getTeamStrengths: (team: Team) => {
    totalPower: number;
    averageStats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
    typeDistribution: Record<string, number>;
  };
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const createTeam = (name: string): string => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      pokemon: [],
      createdAt: new Date(),
    };
    setTeams(prev => [...prev, newTeam]);
    return newTeam.id;
  };

  const addPokemonToTeam = (teamId: string, pokemon: BattlePokemon) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        // Check if Pokemon already exists
        if (team.pokemon.find(p => p.id === pokemon.id)) {
          return team;
        }
        // Limit to 6 Pokemon
        if (team.pokemon.length >= 6) {
          return team;
        }
        return { ...team, pokemon: [...team.pokemon, pokemon] };
      }
      return team;
    }));
  };

  const removePokemonFromTeam = (teamId: string, pokemonId: number) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return { ...team, pokemon: team.pokemon.filter(p => p.id !== pokemonId) };
      }
      return team;
    }));
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const renameTeam = (teamId: string, newName: string) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return { ...team, name: newName };
      }
      return team;
    }));
  };

  const battleTeams = (team1Id: string, team2Id: string) => {
    const team1 = teams.find(t => t.id === team1Id);
    const team2 = teams.find(t => t.id === team2Id);
    
    if (!team1 || !team2 || team1.pokemon.length < 3 || team2.pokemon.length < 3) {
      return null;
    }

    const team1Power = team1.pokemon.reduce((sum, p) => sum + p.totalPower, 0) + Math.random() * 200;
    const team2Power = team2.pokemon.reduce((sum, p) => sum + p.totalPower, 0) + Math.random() * 200;

    if (team1Power > team2Power) {
      return {
        winner: team1,
        loser: team2,
        winnerPower: Math.round(team1Power),
        loserPower: Math.round(team2Power)
      };
    } else {
      return {
        winner: team2,
        loser: team1,
        winnerPower: Math.round(team2Power),
        loserPower: Math.round(team1Power)
      };
    }
  };

  const getTeamStrengths = (team: Team) => {
    if (team.pokemon.length === 0) {
      return {
        totalPower: 0,
        averageStats: { hp: 0, attack: 0, defense: 0, speed: 0 },
        typeDistribution: {},
      };
    }

    const totalPower = team.pokemon.reduce((sum, p) => sum + p.totalPower, 0);
    const pokemonCount = team.pokemon.length;

    const averageStats = {
      hp: Math.round(team.pokemon.reduce((sum, p) => sum + p.stats.hp, 0) / pokemonCount),
      attack: Math.round(team.pokemon.reduce((sum, p) => sum + p.stats.attack, 0) / pokemonCount),
      defense: Math.round(team.pokemon.reduce((sum, p) => sum + p.stats.defense, 0) / pokemonCount),
      speed: Math.round(team.pokemon.reduce((sum, p) => sum + p.stats.speed, 0) / pokemonCount),
    };

    const typeDistribution: Record<string, number> = {};
    team.pokemon.forEach(pokemon => {
      pokemon.types.forEach(type => {
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
      });
    });

    return { totalPower, averageStats, typeDistribution };
  };

  const value: TeamContextType = {
    teams,
    createTeam,
    addPokemonToTeam,
    removePokemonFromTeam,
    deleteTeam,
    renameTeam,
    battleTeams,
    getTeamStrengths,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};