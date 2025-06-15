
export interface GoalEntry {
  playerId: string;
  playerName: string;
  team: string; // Nom de l'équipe pour laquelle le but a été marqué
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
  id: string;
  date: [number, number, number]; // [yyyy, m, d]
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
