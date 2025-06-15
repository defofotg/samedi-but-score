
export interface GoalEntry {
  playerId: string;
  playerName: string;
  team: string;
  nbGoals: number;
}

export interface MatchScore {
  goalsTeamA: number;
  goalsTeamB: number;
}

export type GoalsByTeam = {
  [teamName: string]: GoalEntry[];
};

export interface Match {
  id?: string;
  date: Date;
  teamA: string;
  teamB: string;
  score: MatchScore;
  goals: GoalsByTeam;
  isCompleted: boolean;
}

export interface Player {
  id: string;
  name: string;
}

export interface MatchCreationCommand {
  date: Date;
  teamA: string;
  teamB: string;
  isCompleted: boolean;
}

export interface AddGoalCommand {
  playerId: string;
  playerName: string;
  team: string;
  nbGoals: number;
}

