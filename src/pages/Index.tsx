import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Users, Calendar, Target } from 'lucide-react';
import MatchManager from '@/components/MatchManager';
import PlayersList from '@/components/PlayersList';
import TopScorers from '@/components/TopScorers';
import { Match, Player } from '@/types/sports';
import { useSportsStore } from "@/stores/useSportsStore";

const Index = () => {
  const {
    players,
    matches,
    fetchPlayers,
    fetchMatches,
    setPlayers,
    setMatches,
  } = useSportsStore();

  useEffect(() => {
    fetchPlayers();
    fetchMatches();
  }, []);

  // Nouveau calcul
  const totalMatches = matches.length;
  const totalGoals = matches.reduce((acc, m) => {
    if (!m.goals) return acc;
    return (
      acc +
      Object.values(m.goals)
        .flat()
        .reduce((sum, entry) => sum + (entry?.nbGoals || 0), 0)
    );
  }, 0);
  const totalPlayers = players.length;
  const nextMatch = matches.find(match => !match.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">StatSport</h1>
              <p className="text-gray-600">Gestion des statistiques de l'association</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Matches joués
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalMatches}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Buts marqués
              </CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalGoals}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Joueurs actifs
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalPlayers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Prochain match
              </CardTitle>
              <Trophy className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {nextMatch ? 'Programmé' : 'À planifier'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger 
              value="matches" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Matches
            </TabsTrigger>
            <TabsTrigger 
              value="players" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Joueurs
            </TabsTrigger>
            <TabsTrigger 
              value="rankings" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Classements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <MatchManager 
              matches={matches} 
              setMatches={setMatches}
              players={players}
              setPlayers={setPlayers}
            />
          </TabsContent>

          <TabsContent value="players">
            <PlayersList 
              players={players}
              setPlayers={setPlayers}
              matches={matches}
            />
          </TabsContent>

          <TabsContent value="rankings">
            <TopScorers matches={matches} players={players} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
