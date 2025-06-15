
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Users, Target } from 'lucide-react';
import { Match, Player, GoalEntry } from '@/types/sports';
import { toast } from 'sonner';

interface MatchManagerProps {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

function getTodayDateArray(): [number, number, number] {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
}

const MatchManager = ({ matches, setMatches, players, setPlayers }: MatchManagerProps) => {
  const [showNewMatch, setShowNewMatch] = useState(false);
  const [newMatch, setNewMatch] = useState({
    date: '',
    teamA: '',
    teamB: '',
  });
  const [newPlayer, setNewPlayer] = useState({ name: '' });

  // Pour l'ajout de buteur
  const [goalData, setGoalData] = useState({ matchId: '', team: '', playerId: '', nbGoals: 1 });

  function parseDateStringToArray(str: string): [number, number, number] {
    // "2025-06-19" => [2025,6,19]
    const [year, month, day] = str.split('-').map(Number);
    return [year, month, day];
  }
  function dateArrayToString(arr: [number, number, number]): string {
    const [y, m, d] = arr;
    return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
  }

  const createMatch = () => {
    if (!newMatch.date || !newMatch.teamA || !newMatch.teamB) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const match: Match = {
      id: Date.now().toString(),
      date: parseDateStringToArray(newMatch.date),
      teamA: newMatch.teamA,
      teamB: newMatch.teamB,
      score: { goalsTeamA: 0, goalsTeamB: 0 },
      goals: {},
      isCompleted: false,
    };

    setMatches([...matches, match]);
    setNewMatch({ date: '', teamA: '', teamB: '' });
    setShowNewMatch(false);
    toast.success('Match créé avec succès');
  };

  const completeMatch = (matchId: string) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) return { ...match, isCompleted: true };
      return match;
    });
    setMatches(updatedMatches);
    toast.success('Match terminé');
  };

  const addNewPlayer = () => {
    if (!newPlayer.name) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
    };
    setPlayers([...players, player]);
    setNewPlayer({ name: '' });
    toast.success('Joueur ajouté avec succès');
  };

  // Ajout d'un but
  const addGoal = (matchId: string) => {
    if (!goalData.playerId || !goalData.team) {
      toast.error('Veuillez sélectionner un joueur et une équipe');
      return;
    }
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    const player = players.find(p => p.id === goalData.playerId);
    if (!player) return;

    // Ajout dans la structure goals
    const goalEntry: GoalEntry = {
      playerId: player.id,
      playerName: player.name,
      team: goalData.team,
      nbGoals: Number(goalData.nbGoals),
    };

    // Ajouter le but dans l'équipe correspondante
    const updatedGoals = { ...match.goals };
    if (!updatedGoals[goalData.team]) updatedGoals[goalData.team] = [];
    // Cherche s'il existe déjà une entrée pour ce joueur
    const existing = updatedGoals[goalData.team].find(entry => entry.playerId === player.id);
    if (existing) {
      existing.nbGoals += goalEntry.nbGoals;
    } else {
      updatedGoals[goalData.team] = [...updatedGoals[goalData.team], goalEntry];
    }

    // Met à jour le score
    const isTeamA = match.teamA === goalData.team;
    const score = {
      goalsTeamA: isTeamA
        ? match.score.goalsTeamA + goalEntry.nbGoals
        : match.score.goalsTeamA,
      goalsTeamB: !isTeamA
        ? match.score.goalsTeamB + goalEntry.nbGoals
        : match.score.goalsTeamB,
    };

    const updatedMatches = matches.map(m =>
      m.id === matchId ? { ...m, goals: updatedGoals, score } : m
    );
    setMatches(updatedMatches);
    setGoalData({ matchId: '', team: '', playerId: '', nbGoals: 1 });
    toast.success(`But ajouté à ${player.name} (${goalEntry.nbGoals})`);
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
                  type="date"
                  value={newMatch.date}
                  onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Nom de l’équipe A</Label>
                <Input
                  placeholder="Nom de l'équipe A"
                  value={newMatch.teamA}
                  onChange={e =>
                    setNewMatch({ ...newMatch, teamA: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Nom de l’équipe B</Label>
                <Input
                  placeholder="Nom de l'équipe B"
                  value={newMatch.teamB}
                  onChange={e =>
                    setNewMatch({ ...newMatch, teamB: e.target.value })
                  }
                />
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
                onChange={e => setNewPlayer({ name: e.target.value })}
              />
            </div>
            <Button
              onClick={addNewPlayer}
              className="bg-green-600 hover:bg-green-700"
            >
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Matches List */}
      <div className="grid gap-6">
        {matches.map(match => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader className={`${match.isCompleted ? 'bg-gray-50' : 'bg-green-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {match.teamA} <span className="mx-1 text-gray-500">vs</span> {match.teamB}
                    {match.isCompleted && <Badge className="bg-green-600">Terminé</Badge>}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {dateArrayToString(match.date)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* Suppression du bouton de composition */}
                  {!match.isCompleted && (
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
              {/* Scores */}
              <div className="mb-2 flex gap-2 items-center font-semibold text-lg">
                {match.teamA}: <span className="text-green-600">{match.score.goalsTeamA}</span>
                <span className="px-3">-</span>
                {match.teamB}: <span className="text-green-600">{match.score.goalsTeamB}</span>
              </div>

              {/* Goals */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Buteurs
                </h4>
                <div className="space-y-2">
                  {Object.entries(match.goals || {}).map(([team, goalsArr]) =>
                    goalsArr.map((entry, idx) => (
                      <div key={team + idx + entry.playerId} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <Badge variant="outline">{team}</Badge>
                        <span>{entry.playerName}</span>
                        <span>({entry.nbGoals} but{entry.nbGoals > 1 ? 's' : ''})</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Goal */}
              {!match.isCompleted && (
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Buteur</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={goalData.playerId}
                      onChange={e => setGoalData({ ...goalData, playerId: e.target.value })}
                    >
                      <option value="">Sélectionner un joueur</option>
                      {players.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <Label>Équipe</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={goalData.team}
                      onChange={e => setGoalData({ ...goalData, team: e.target.value })}
                    >
                      <option value="">Sélectionner une équipe</option>
                      <option value={match.teamA}>{match.teamA}</option>
                      <option value={match.teamB}>{match.teamB}</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Label>Nb buts</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={goalData.nbGoals}
                      onChange={e =>
                        setGoalData({ ...goalData, nbGoals: Number(e.target.value) })
                      }
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
