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
import MatchCardTitle from './MatchCardTitle';
import GoalEntryList from './GoalEntryList';
import AddPlayerForm from "./AddPlayerForm";
import AddGoalForm from "./AddGoalForm";
import { useSportsStore } from "@/stores/useSportsStore";

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
    date: '',       // format attendu yyyy-MM-dd
    teamA: '',
    teamB: '',
  });
  const [newPlayer, setNewPlayer] = useState({ name: '' });

  // Importation de addMatch depuis le store
  const addMatch = useSportsStore(state => state.addMatch);

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

  const createMatch = async () => {
    if (!newMatch.date || !newMatch.teamA || !newMatch.teamB) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const match: Match = {
      id: Date.now().toString(),
      date: newMatch.date, // format yyyy-MM-dd
      teamA: newMatch.teamA,
      teamB: newMatch.teamB,
      score: { goalsTeamA: 0, goalsTeamB: 0 },
      goals: {},
      isCompleted: false,
    };

    // Utilisation du store pour ajouter le match et déclencher la mise à jour des matchs via fetch
    await addMatch(match);
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

  // Ajout d'un but - nouvelle fonction adaptée pour le composant
  const addGoalToMatch = (
    matchId: string,
    playerId: string,
    team: string,
    nbGoals: number
  ) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    // Ajout dans la structure goals
    const goalEntry = {
      playerId: player.id,
      playerName: player.name,
      team: team,
      nbGoals: Number(nbGoals),
    };

    const updatedGoals = { ...match.goals };
    if (!updatedGoals[team]) updatedGoals[team] = [];
    const existing = updatedGoals[team].find((entry) => entry.playerId === player.id);
    if (existing) {
      existing.nbGoals += goalEntry.nbGoals;
    } else {
      updatedGoals[team] = [...updatedGoals[team], goalEntry];
    }

    // Mise à jour du score
    const isTeamA = match.teamA === team;
    const score = {
      goalsTeamA: isTeamA
        ? match.score.goalsTeamA + goalEntry.nbGoals
        : match.score.goalsTeamA,
      goalsTeamB: !isTeamA
        ? match.score.goalsTeamB + goalEntry.nbGoals
        : match.score.goalsTeamB,
    };

    const updatedMatches = matches.map((m) =>
      m.id === matchId ? { ...m, goals: updatedGoals, score } : m
    );
    setMatches(updatedMatches);
    toast.success(`But ajouté à ${player.name} (${goalEntry.nbGoals})`);
  };

  // Suppression d'un but pour un joueur
  const removeGoal = ({
    matchId,
    team,
    playerId,
  }: {
    matchId: string;
    team: string;
    playerId: string;
  }) => {
    const matchIdx = matches.findIndex((m) => m.id === matchId);
    if (matchIdx === -1) return;

    const match = matches[matchIdx];
    const goalsList = match.goals[team];
    if (!goalsList) return;

    const entryIdx = goalsList.findIndex((e) => e.playerId === playerId);
    if (entryIdx === -1) return;

    const entry = goalsList[entryIdx];
    if (entry.nbGoals <= 0) return; // Rien à retirer, sécurité

    let newGoalsList = [...goalsList];
    // Si le buteur n'a plus qu'un but, on le retire de la liste
    if (entry.nbGoals === 1) {
      newGoalsList.splice(entryIdx, 1);
    } else {
      newGoalsList[entryIdx] = { ...entry, nbGoals: entry.nbGoals - 1 };
    }
    // Met à jour la structure complète
    const updatedGoals = { ...match.goals, [team]: newGoalsList };

    // Mettre à jour le score du match
    let newScore = { ...match.score };
    if (team === match.teamA && match.score.goalsTeamA > 0)
      newScore.goalsTeamA -= 1;
    else if (team === match.teamB && match.score.goalsTeamB > 0)
      newScore.goalsTeamB -= 1;

    const updatedMatch = { ...match, goals: updatedGoals, score: newScore };
    const updatedMatches = [...matches];
    updatedMatches[matchIdx] = updatedMatch;
    setMatches(updatedMatches);

    // Optionnel: toast
    const player = players.find((p) => p.id === playerId);
    if (player) {
      toast.success(`But retiré à ${player.name}`);
    }
  };

  // Pour l'affichage, on affiche la date au format français par exemple :
  // soit "14/06/2025" à partir de "2025-06-14"
  function formatDateForDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

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

      {/* Add Player Section (refactored) */}
      <AddPlayerForm players={players} setPlayers={setPlayers} />

      {/* Matches List */}
      <div className="grid gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardHeader className={`${match.isCompleted ? 'bg-gray-50' : 'bg-green-50'} pb-0`} />
            <CardContent className="p-6 pt-4">
              <MatchCardTitle
                teamA={match.teamA}
                teamB={match.teamB}
                scoreA={match.score.goalsTeamA}
                scoreB={match.score.goalsTeamB}
                isCompleted={match.isCompleted}
              />
              {/* Affichage de la date si besoin */}
              <div className="text-xs text-muted-foreground mb-2 ml-1">
                {typeof match.date === 'string' ? formatDateForDisplay(match.date) : ''}
              </div>
              {/* Buteurs avec suppression */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Buteurs
                </h4>
                <div className="flex flex-row gap-6">
                  <GoalEntryList
                    entries={match.goals[match.teamA] || []}
                    team={match.teamA}
                    matchId={match.id}
                    onRemoveGoal={removeGoal}
                    align="left"
                    disabled={match.isCompleted}
                  />
                  <GoalEntryList
                    entries={match.goals[match.teamB] || []}
                    team={match.teamB}
                    matchId={match.id}
                    onRemoveGoal={removeGoal}
                    align="right"
                    disabled={match.isCompleted}
                  />
                </div>
                <div className="flex flex-row justify-between px-1 mt-1 text-xs text-gray-400">
                  <span>{match.teamA}</span>
                  <span>{match.teamB}</span>
                </div>
              </div>

              {/* Add Goal (refactored) */}
              {!match.isCompleted && (
                <AddGoalForm
                  matchId={match.id}
                  matchTeamA={match.teamA}
                  matchTeamB={match.teamB}
                  players={players}
                  addGoal={addGoalToMatch}
                />
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
