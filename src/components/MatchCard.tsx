
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MatchCardTitle from "./MatchCardTitle";
import GoalEntryList from "./GoalEntryList";
import AddGoalForm from "./AddGoalForm";
import { Target, Calendar } from "lucide-react";
import { Match, Player } from "@/types/sports";
import React from "react";

interface MatchCardProps {
  match: Match;
  players: Player[];
  addGoalToMatch: (
    matchId: string,
    playerId: string,
    team: string,
    nbGoals: number
  ) => void;
  removeGoal: ({
    matchId, team, playerId,
  }: { matchId: string; team: string; playerId: string; }) => void;
}

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split(',');
  return `${day}/${month}/${year}`;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  players,
  addGoalToMatch,
  removeGoal,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${match.isCompleted ? 'bg-gray-50' : 'bg-green-50'} pb-0`} />
      <CardContent className="p-6 pt-4">
        <MatchCardTitle
          teamA={match.teamA}
          teamB={match.teamB}
          scoreA={match.score.goalsTeamA}
          scoreB={match.score.goalsTeamB}
          isCompleted={match.isCompleted}
          matchDate={formatDateForDisplay(match.date.toString())}
        />
        {/* Buteurs */}
        { match.score.goalsTeamA + match.score.goalsTeamB > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4"/> Buteurs
              </h4>
              <div className="flex flex-row gap-6">
                <GoalEntryList
                    entries={match.goals[match.teamA] || []}
                    team={match.teamA}
                    matchId={match.id}
                    align="left"
                    disabled={match.isCompleted}
                />
                <GoalEntryList
                    entries={match.goals[match.teamB] || []}
                    team={match.teamB}
                    matchId={match.id}
                    align="right"
                    disabled={match.isCompleted}
                />
              </div>
            </div>
        )}

        {/* Ajout but */}
        {!match.isCompleted && (
            <AddGoalForm
                matchId={match.id}
                matchTeamA={match.teamA}
                matchTeamB={match.teamB}
                players={players}
            />
        )}
      </CardContent>
    </Card>
  );
};
export default MatchCard;
