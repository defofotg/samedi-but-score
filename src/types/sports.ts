
export interface Player {
  id: string;
  name: string;
  totalGoals: number;
  matchesPlayed: number;
  createdAt: Date;
}

export interface Goal {
  id: string;
  playerId: string;
  playerName: string;
  team: string; // Nom de l'équipe pour laquelle le but a été marqué
  matchId: string;
}

export interface Match {
  id: string;
  date: Date;
  teamOneName: string;
  teamTwoName: string;
  lineup: string[];
  goals: Goal[];
  result?: string;
  completed: boolean;
  createdAt: Date;
}
