import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Match, Player } from '@/types/sports';
import { toast } from 'sonner';
import AddPlayerForm from "./AddPlayerForm";
import { useSportsStore } from "@/stores/useSportsStore";
import NewMatchDialog from "./NewMatchDialog";
import MatchCard from "./MatchCard";

interface MatchManagerProps {
  matches: Match[];
  setMatches: (matches: Match[]) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}

const MatchManager = ({ matches, setMatches, players, setPlayers }: MatchManagerProps) => {
  const [showNewMatch, setShowNewMatch] = useState(false);
  const [newMatch, setNewMatch] = useState({
    date: new Date(),
    teamA: '',
    teamB: '',
  });
  const [newPlayer, setNewPlayer] = useState({ name: '' });

  // Importation de addMatch depuis le store
  const addMatch = useSportsStore(state => state.addMatch);

  // Pour l'ajout de buteur
  const [goalData, setGoalData] = useState({ matchId: '', team: '', playerId: '', nbGoals: 1 });

  const createMatch = async () => {
    if (!newMatch.date || !newMatch.teamA || !newMatch.teamB) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const match: Match = {
      date: newMatch.date, // format yyyy-MM-dd
      teamA: newMatch.teamA,
      teamB: newMatch.teamB,
      score: { goalsTeamA: 0, goalsTeamB: 0 },
      goals: {},
      isCompleted: false,
    };

    // Utilisation du store pour ajouter le match et déclencher la mise à jour des matchs via fetch
    await addMatch(match);
    setNewMatch({ date: new Date(), teamA: '', teamB: '' });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des matches</h2>
        <NewMatchDialog />
      </div>

      <AddPlayerForm players={players} setPlayers={setPlayers} />

      {/* Matches List */}
      <div className="grid gap-6">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            players={players}
            addGoalToMatch={addGoalToMatch}
            removeGoal={removeGoal}
          />
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
