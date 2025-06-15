
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
  const [year, month, day] = dateStr.split('-');
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
        />
        <div className="text-xs text-muted-foreground mb-2 ml-1">
          <span className="inline-flex items-center gap-1">
            <Calendar className="inline w-3 h-3" />
            {typeof match.date === "string" ? formatDateForDisplay(match.date) : ""}
          </span>
        </div>
        {/* Buteurs */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" /> Buteurs
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
        {/* Ajout but */}
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
  );
};
export default MatchCard;
