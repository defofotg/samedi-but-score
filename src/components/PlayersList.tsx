
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy } from 'lucide-react';
import { Player, Match } from '@/types/sports';

interface PlayersListProps {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  matches: Match[];
}

const PlayersList = ({ players, matches }: PlayersListProps) => {
  // Calcul des stats pour chaque joueur : buts/matches
  const playersWithStats = players.map(player => {
    let totalGoals = 0;
    let matchesPlayed = 0;

    matches.forEach(match => {
      // Vérifie chaque équipe dans goals
      Object.values(match.goals || {}).forEach(goalsArr => {
        goalsArr.forEach(goal => {
          if (goal.playerId === player.id) {
            totalGoals += goal.nbGoals;
          }
        });
      });
      // Consider match played if player has scored in it or if we had a more precise participant list
      // Pour l’instant, on compte chaque match où il a marqué comme "joué"
      if (
        Object.values(match.goals || {}).some(goalsArr =>
          goalsArr.some(goal => goal.playerId === player.id)
        )
      ) {
        matchesPlayed += 1;
      }
    });

    return {
      ...player,
      totalGoals,
      matchesPlayed,
      avgGoals: matchesPlayed > 0 ? (totalGoals / matchesPlayed).toFixed(2) : '0.00',
    };
  });

  // Tri par buts
  const sortedPlayers = playersWithStats.sort((a, b) => b.totalGoals - a.totalGoals);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Liste des joueurs</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {players.length} joueurs
        </Badge>
      </div>

      <div className="grid gap-4">
        {sortedPlayers.map((player, index) => (
          <Card key={player.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {player.name}
                      {index < 3 && (
                        <Trophy className="inline h-4 w-4 ml-2 text-yellow-500" />
                      )}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {player.totalGoals}
                    </div>
                    <div className="text-xs text-gray-500">Buts</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {player.matchesPlayed}
                    </div>
                    <div className="text-xs text-gray-500">Matches</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {player.avgGoals}
                    </div>
                    <div className="text-xs text-gray-500">Moy/Match</div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Badge 
                      variant={player.totalGoals > 5 ? "default" : "secondary"}
                      className={player.totalGoals > 5 ? "bg-green-600" : ""}
                    >
                      {player.totalGoals > 10 ? "Top Scorer" : 
                       player.totalGoals > 5 ? "Buteur" : 
                       player.totalGoals > 0 ? "Actif" : "Nouveau"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {players.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun joueur enregistré</p>
            <p className="text-sm text-gray-500">
              Ajoutez des joueurs depuis l'onglet "Matches"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayersList;
