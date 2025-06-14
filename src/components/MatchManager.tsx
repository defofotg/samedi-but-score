
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Users, Target } from 'lucide-react';
import { Match, Player, Goal } from '@/types/sports';
import { toast } from 'sonner';

interface MatchManagerProps {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

const MatchManager = ({ matches, setMatches, players, setPlayers }: MatchManagerProps) => {
  const [showNewMatch, setShowNewMatch] = useState(false);
  const [showLineup, setShowLineup] = useState<string | null>(null);
  const [newMatch, setNewMatch] = useState({
    date: '',
    opponent: '',
    homeTeam: true,
  });
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '' });
  const [goalData, setGoalData] = useState({ playerId: '', minute: '' });

  const createMatch = () => {
    if (!newMatch.date || !newMatch.opponent) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const match: Match = {
      id: Date.now().toString(),
      date: new Date(newMatch.date),
      opponent: newMatch.opponent,
      homeTeam: newMatch.homeTeam,
      lineup: [],
      goals: [],
      completed: false,
      createdAt: new Date(),
    };

    setMatches([...matches, match]);
    setNewMatch({ date: '', opponent: '', homeTeam: true });
    setShowNewMatch(false);
    toast.success('Match créé avec succès');
  };

  const addPlayerToLineup = (matchId: string, playerId: string) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId && match.lineup.length < 11) {
        return { ...match, lineup: [...match.lineup, playerId] };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const removePlayerFromLineup = (matchId: string, playerId: string) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, lineup: match.lineup.filter(id => id !== playerId) };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const addGoal = (matchId: string) => {
    if (!goalData.playerId || !goalData.minute) {
      toast.error('Veuillez sélectionner un joueur et indiquer la minute');
      return;
    }

    const player = players.find(p => p.id === goalData.playerId);
    if (!player) return;

    const goal: Goal = {
      id: Date.now().toString(),
      playerId: goalData.playerId,
      playerName: player.name,
      minute: parseInt(goalData.minute),
      matchId,
    };

    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, goals: [...match.goals, goal] };
      }
      return match;
    });

    // Update player stats
    const updatedPlayers = players.map(p => {
      if (p.id === goalData.playerId) {
        return { ...p, totalGoals: p.totalGoals + 1 };
      }
      return p;
    });

    setMatches(updatedMatches);
    setPlayers(updatedPlayers);
    setGoalData({ playerId: '', minute: '' });
    toast.success(`But marqué par ${player.name}!`);
  };

  const completeMatch = (matchId: string) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, completed: true };
      }
      return match;
    });
    setMatches(updatedMatches);
    toast.success('Match terminé');
  };

  const addNewPlayer = () => {
    if (!newPlayer.name || !newPlayer.position) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
      position: newPlayer.position,
      totalGoals: 0,
      matchesPlayed: 0,
      createdAt: new Date(),
    };

    setPlayers([...players, player]);
    setNewPlayer({ name: '', position: '' });
    toast.success('Joueur ajouté avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des matches</h2>
        <Dialog open={showNewMatch} onOpenChange={setShowNewMatch}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau match
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Date du match</Label>
                <Input
                  type="datetime-local"
                  value={newMatch.date}
                  onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                />
              </div>
              <div>
                <Label>Adversaire</Label>
                <Input
                  placeholder="Nom de l'équipe adverse"
                  value={newMatch.opponent}
                  onChange={(e) => setNewMatch({...newMatch, opponent: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="homeTeam"
                  checked={newMatch.homeTeam}
                  onChange={(e) => setNewMatch({...newMatch, homeTeam: e.target.checked})}
                />
                <Label htmlFor="homeTeam">Match à domicile</Label>
              </div>
              <Button onClick={createMatch} className="w-full">
                Créer le match
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add Player Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ajouter un joueur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Nom du joueur</Label>
              <Input
                placeholder="Nom du joueur"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <Label>Poste</Label>
              <Input
                placeholder="Gardien, Défenseur, Milieu, Attaquant"
                value={newPlayer.position}
                onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
              />
            </div>
            <Button onClick={addNewPlayer} className="bg-green-600 hover:bg-green-700">
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Matches List */}
      <div className="grid gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader className={`${match.completed ? 'bg-gray-50' : 'bg-green-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    vs {match.opponent}
                    {match.homeTeam && <Badge variant="secondary">Domicile</Badge>}
                    {match.completed && <Badge className="bg-green-600">Terminé</Badge>}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {new Date(match.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        Composition ({match.lineup.length}/11)
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Composition d'équipe</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Joueurs sélectionnés</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {match.lineup.map((playerId) => {
                                const player = players.find(p => p.id === playerId);
                                return player ? (
                                  <div key={playerId} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                    <span>{player.name} - {player.position}</span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removePlayerFromLineup(match.id, playerId)}
                                    >
                                      Retirer
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Joueurs disponibles</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {players
                                .filter(player => !match.lineup.includes(player.id))
                                .map((player) => (
                                  <div key={player.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span>{player.name} - {player.position}</span>
                                    <Button
                                      size="sm"
                                      disabled={match.lineup.length >= 11}
                                      onClick={() => addPlayerToLineup(match.id, player.id)}
                                    >
                                      Ajouter
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {!match.completed && (
                    <Button
                      onClick={() => completeMatch(match.id)}
                      variant="outline"
                      size="sm"
                    >
                      Terminer
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Goals */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Buts ({match.goals.length})
                </h4>
                <div className="space-y-2">
                  {match.goals.map((goal) => (
                    <div key={goal.id} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                      <Badge variant="outline">{goal.minute}'</Badge>
                      <span>{goal.playerName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Goal */}
              {!match.completed && (
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Buteur</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={goalData.playerId}
                      onChange={(e) => setGoalData({...goalData, playerId: e.target.value})}
                    >
                      <option value="">Sélectionner un joueur</option>
                      {match.lineup.map((playerId) => {
                        const player = players.find(p => p.id === playerId);
                        return player ? (
                          <option key={playerId} value={playerId}>
                            {player.name}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>
                  <div className="w-24">
                    <Label>Minute</Label>
                    <Input
                      type="number"
                      placeholder="90"
                      value={goalData.minute}
                      onChange={(e) => setGoalData({...goalData, minute: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={() => addGoal(match.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Ajouter but
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun match programmé</p>
            <p className="text-sm text-gray-500">Cliquez sur "Nouveau match" pour commencer</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchManager;
