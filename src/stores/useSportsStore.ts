import { create } from "zustand";
import {AddGoalCommand, Match, MatchCreationCommand, Player, RemoveGoalCommand} from "@/types/sports";
import { getPlayers, addPlayer } from "@/services/playersService";
import {
  getMatches as getMatchesApi,
  addMatch as addMatchApi,
  updateMatch as updateMatchApi,
  addGoalMatch as addGoalApi,
  removeGoalMatch as removeGoalApi,
} from "@/services/matchesService";

interface SportsState {
  players: Player[];
  matches: Match[];
  fetchPlayers: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  addPlayer: (player: Player) => Promise<void>;
  addMatch: (match: MatchCreationCommand) => Promise<void>;
  addGoalMatch: (match: string, goalCommand: AddGoalCommand) => Promise<void>;
  removeGoalMatch: (match: string, goalCommand: RemoveGoalCommand) => Promise<void>;
  setPlayers: (players: Player[]) => void;
  setMatches: (matches: Match[]) => void;
}

export const useSportsStore = create<SportsState>((set, get) => ({
  players: [],
  matches: [],
  fetchPlayers: async () => {
    const players = await getPlayers();
    set({ players });
  },
  fetchMatches: async () => {
    const matches = await getMatchesApi();
    set({ matches });
  },
  addPlayer: async (player: Player) => {
    await addPlayer(player);
    const players = await getPlayers();
    set({ players });
  },
  addMatch: async (match: MatchCreationCommand) => {
    await addMatchApi(match);
    const matches = await getMatchesApi();
    set({ matches });
  },
  addGoalMatch: async (match, goalCommand: AddGoalCommand) => {
    await addGoalApi(match, goalCommand);
    const matches = await getMatchesApi();
    set({ matches });
  },
  removeGoalMatch: async (match, goalCommand: RemoveGoalCommand) => {
    await removeGoalApi(match, goalCommand);
    const matches = await getMatchesApi();
    set({ matches });
  },
  setPlayers: (players: Player[]) => set({ players }),
  setMatches: (matches: Match[]) => set({ matches }),
}));
