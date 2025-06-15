
export interface Player {
  id: string;
  name: string;
  position: string;
  totalGoals: number;
  matchesPlayed: number;
  createdAt: Date;
}

export interface Goal {
  id: string;
  playerId: string;
  playerName: string;
  minute: number;
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
