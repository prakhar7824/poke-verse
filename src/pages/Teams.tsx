import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Users, Trash2, Edit2, Zap, Star, Trophy, Swords } from 'lucide-react';
import { useTeam, Team } from '@/contexts/TeamContext';
import { useBattle } from '@/contexts/BattleContext';
import { getTypeColor } from '@/hooks/usePokemon';
import { cn } from '@/lib/utils';
import { usePokemonList, toBattlePokemon } from '@/hooks/usePokemon';

export const Teams: React.FC = () => {
  const navigate = useNavigate();
  const { teams, createTeam, deleteTeam, renameTeam, getTeamStrengths, battleTeams } = useTeam();
  const { addPokemonToTeam } = useTeam();
  const { clearBattle, battleRoster, addToBattle } = useBattle();
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState<{ id: string; name: string } | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);
  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');
  const [isBattleDialogOpen, setIsBattleDialogOpen] = useState(false);
  const { pokemon: allPokemon, loading: pokemonLoading, error: pokemonError } = usePokemonList();
  const [addDialogOpen, setAddDialogOpen] = useState<string | null>(null); // teamId for which dialog is open
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      createTeam(newTeamName.trim());
      setNewTeamName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleRenameTeam = () => {
    if (editingTeam && editingTeam.name.trim()) {
      renameTeam(editingTeam.id, editingTeam.name.trim());
      setEditingTeam(null);
    }
  };

  const addTeamToBattle = (team: Team) => {
    clearBattle();
    team.pokemon.forEach(pokemon => {
      addToBattle(pokemon);
    });
    navigate('/battle');
  };

  const handleTeamBattle = () => {
    if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
      const result = battleTeams(selectedTeam1, selectedTeam2);
      setBattleResult(result);
    }
  };

  const eligibleTeamsForBattle = teams.filter(team => team.pokemon.length >= 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pokédex
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Users className="w-12 h-12" />
              Team Builder
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Create and manage your Pokémon teams. Build the perfect squad for battle!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Team and Team Battle Buttons */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-black text-white hover:bg-gray-900">
                <Plus className="w-5 h-5 mr-2" />
                Create New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter team name..."
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateTeam()}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam} disabled={!newTeamName.trim()}>
                    Create Team
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {eligibleTeamsForBattle.length >= 2 && (
            <Dialog open={isBattleDialogOpen} onOpenChange={setIsBattleDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-battle hover:opacity-90">
                  <Swords className="w-5 h-5 mr-2" />
                  Team vs Team Battle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Team Battle Arena</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Team 1</label>
                      <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose first team" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleTeamsForBattle.map(team => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name} ({team.pokemon.length} Pokémon)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Team 2</label>
                      <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose second team" />
                        </SelectTrigger>
                        <SelectContent>
                          {eligibleTeamsForBattle.map(team => (
                            <SelectItem key={team.id} value={team.id} disabled={team.id === selectedTeam1}>
                              {team.name} ({team.pokemon.length} Pokémon)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {battleResult && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-6 border">
                      <div className="text-center">
                        <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">🎉 {battleResult.winner.name} Wins! 🎉</h3>
                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="font-bold text-green-600">Winner: {battleResult.winner.name}</div>
                              <div>Power: {battleResult.winnerPower}</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-red-600">Defeated: {battleResult.loser.name}</div>
                              <div>Power: {battleResult.loserPower}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setIsBattleDialogOpen(false);
                      setBattleResult(null);
                      setSelectedTeam1('');
                      setSelectedTeam2('');
                    }}>
                      Close
                    </Button>
                    <Button 
                      onClick={handleTeamBattle}
                      disabled={!selectedTeam1 || !selectedTeam2 || selectedTeam1 === selectedTeam2}
                      className="bg-gradient-battle"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Start Battle!
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No teams yet</h2>
            <p className="text-muted-foreground mb-6">Create your first team to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map(team => {
              const strengths = getTeamStrengths(team);
              return (
                <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    {editingTeam?.id === team.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editingTeam.name}
                          onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleRenameTeam()}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleRenameTeam}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingTeam({ id: team.id, name: team.name })}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTeam(team.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Team Count and Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {team.pokemon.length}/6 Pokémon
                      </span>
                      <Badge variant={team.pokemon.length >= 3 ? 'default' : 'secondary'}>
                        {team.pokemon.length >= 3 ? 'Battle Ready' : `Need ${3 - team.pokemon.length} more`}
                      </Badge>
                    </div>

                    {/* Pokemon List */}
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const pokemon = team.pokemon[index];
                        if (pokemon) {
                          return (
                            <div
                              key={index}
                              className={cn(
                                "aspect-square rounded border-2 border-dashed border-muted flex items-center justify-center",
                                pokemon && "border-solid border-primary bg-primary/10"
                              )}
                            >
                              <img
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                          );
                        } else {
                          return (
                            <Dialog key={index} open={addDialogOpen === team.id + '-' + index} onOpenChange={open => setAddDialogOpen(open ? team.id + '-' + index : null)}>
                              <DialogTrigger asChild>
                                <div
                                  className={cn(
                                    "aspect-square rounded border-2 border-dashed border-muted flex items-center justify-center cursor-pointer hover:bg-muted/30"
                                  )}
                                >
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Add Pokémon to Team</DialogTitle>
                                </DialogHeader>
                                {pokemonLoading ? (
                                  <div className="text-center py-4">Loading Pokémon...</div>
                                ) : pokemonError ? (
                                  <div className="text-center text-red-500 py-4">Failed to load Pokémon.</div>
                                ) : (
                                  <>
                                    <Input
                                      placeholder="Search Pokémon..."
                                      value={searchTerm}
                                      onChange={e => setSearchTerm(e.target.value)}
                                      className="mb-4"
                                    />
                                    <div className="max-h-64 overflow-y-auto grid grid-cols-3 gap-2">
                                      {allPokemon.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 30).map(p => (
                                        <Button
                                          key={p.id}
                                          variant="ghost"
                                          className="flex flex-col items-center gap-1"
                                          onClick={() => {
                                            addPokemonToTeam(team.id, toBattlePokemon(p));
                                            setAddDialogOpen(null);
                                            setSearchTerm('');
                                          }}
                                        >
                                          <img src={p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default} alt={p.name} className="w-8 h-8" />
                                          <span className="text-xs">{p.name}</span>
                                        </Button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </DialogContent>
                            </Dialog>
                          );
                        }
                      })}
                    </div>

                    {/* Team Stats */}
                    {team.pokemon.length > 0 && (
                      <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Power</span>
                          <Badge className="bg-primary">
                            <Star className="w-3 h-3 mr-1" />
                            {strengths.totalPower}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>HP: {strengths.averageStats.hp}</div>
                          <div>ATK: {strengths.averageStats.attack}</div>
                          <div>DEF: {strengths.averageStats.defense}</div>
                          <div>SPD: {strengths.averageStats.speed}</div>
                        </div>

                        {/* Type Distribution */}
                        <div className="flex gap-1 flex-wrap">
                          {Object.entries(strengths.typeDistribution).map(([type, count]) => (
                            <Badge
                              key={type}
                              className={cn(getTypeColor(type), "text-white text-xs")}
                            >
                              {type} {count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/team/${team.id}`)}
                        className="flex-1"
                        disabled
                      >
                        Manage
                      </Button>
                      {team.pokemon.length >= 3 && (
                        <Button
                          onClick={() => addTeamToBattle(team)}
                          className="flex-1 bg-gradient-battle"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Battle
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};