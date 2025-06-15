
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Medal, Award } from 'lucide-react';
import { Player, Match } from '@/types/sports';

interface TopScorersProps {
  matches: Match[];
  players: Player[];
}

// Calcule les buts/matchs pour chaque joueur à partir des matches (nouvelle structure!)
const getPlayerStats = (players: Player[], matches: Match[]) => {
  return players.map(player => {
    let totalGoals = 0;
    let matchesPlayed = 0;
    matches.forEach(match => {
      Object.values(match.goals || {}).forEach(goalsArr => {
        goalsArr.forEach(entry => {
          if (entry.playerId === player.id) {
            totalGoals += entry.nbGoals;
          }
        });
      });
      // On compte le match comme joué si joueur a marqué dans le match
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
    };
  });
};

const TopScorers = ({ players, matches }: TopScorersProps) => {
  const playerStats = getPlayerStats(players, matches);
  // Top 5 des buteurs
  const topScorers = playerStats
    .filter(player => player.totalGoals > 0)
    .sort((a, b) => b.totalGoals - a.totalGoals)
    .slice(0, 5);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <Target className="h-8 w-8 text-green-600" />;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-green-400 to-green-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🏆 Top 5 des buteurs
        </h2>
        <p className="text-gray-600">
          Classement des meilleurs marqueurs de l'association
        </p>
      </div>

      <div className="grid gap-6">
        {topScorers.map((player, index) => {
          const position = index + 1;
          return (
            <Card 
              key={player.id} 
              className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                position === 1 ? 'ring-2 ring-yellow-400 shadow-lg' : ''
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${getPositionColor(position)} opacity-5`} />
              
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-bold text-gray-300">
                        #{position}
                      </div>
                      {getPositionIcon(position)}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {player.name}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        {position === 1 && (
                          <Badge className="bg-yellow-500 text-white">
                            👑 Meilleur buteur
                          </Badge>
                        )}
                        {position <= 3 && (
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            Podium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-5xl font-bold text-green-600 mb-2">
                      {player.totalGoals}
                    </div>
                    <div className="text-gray-500 text-lg">
                      {player.totalGoals === 1 ? 'but' : 'buts'}
                    </div>
                    
                    <div className="mt-4 space-y-1">
                      <div className="text-sm text-gray-600">
                        {player.matchesPlayed} matches joués
                      </div>
                      <div className="text-sm text-gray-600">
                        Moyenne: {player.matchesPlayed > 0 ? 
                          (player.totalGoals / player.matchesPlayed).toFixed(2) : 
                          '0.00'
                        } buts/match
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Barre de progression */}
                {topScorers[0] && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getPositionColor(position)}`}
                        style={{ width: `${(player.totalGoals / topScorers[0].totalGoals) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {topScorers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucun but marqué pour le moment</p>
            <p className="text-sm text-gray-500">
              Les statistiques apparaîtront après les premiers matches
            </p>
          </CardContent>
        </Card>
      )}

      {topScorers.length > 0 && topScorers.length < 5 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-8">
            <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              {5 - topScorers.length} places disponibles dans le top 5
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TopScorers;
